import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { createServer } from 'node:http';
import { mkdir, open, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const runtime = join(root, '.preview-local');
const statePath = join(runtime, 'state.json');
const logPath = join(runtime, 'server.log');
const port = 4175;
const url = `http://127.0.0.1:${port}`;
const healthPath = '/__percival_preview_status';
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function state() {
  try { return JSON.parse(await readFile(statePath, 'utf8')); }
  catch { return undefined; }
}
async function health() {
  try {
    const response = await fetch(url + healthPath, { signal: AbortSignal.timeout(750) });
    if (!response.ok) return undefined;
    const value = await response.json();
    return value.service === 'percival-local-preview' ? value : undefined;
  } catch { return undefined; }
}
async function owned() {
  const [saved, live] = await Promise.all([state(), health()]);
  return saved && live && saved.instance === live.instance && saved.pid === live.pid ? live : undefined;
}
function print(live) {
  console.log(`本机预览运行中 · PID ${live.pid}\n${url}/#/corridor\nhttp://localhost:${port}/#/corridor\n日志：${logPath}`);
}

async function serve() {
  const instance = randomUUID();
  const info = { service: 'percival-local-preview', instance, pid: process.pid, startedAt: new Date().toISOString() };
  const { preview } = await import('vite');
  const vite = await preview({
    root, base: '/', clearScreen: false,
    plugins: [{ name: 'local-preview-status', configurePreviewServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.url !== healthPath) return next();
        response.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
        response.end(JSON.stringify(info));
      });
    } }],
    preview: { host: '127.0.0.1', port, strictPort: true, open: false, headers: { 'Cache-Control': 'no-store' } },
  });
  // Serve both loopback families so localhost and 127.0.0.1 use the same build.
  const ipv6 = createServer(vite.middlewares);
  try {
    await new Promise((resolve, reject) => {
      ipv6.once('error', reject);
      ipv6.listen({ host: '::1', port, ipv6Only: true }, resolve);
    });
  } catch (error) {
    if (!['EAFNOSUPPORT', 'EADDRNOTAVAIL'].includes(error.code)) { await vite.close(); throw error; }
  }
  await writeFile(statePath, JSON.stringify(info, null, 2));
  console.log(`Preview started ${info.startedAt}; PID ${process.pid}; loopback port ${port}`);
  let closing = false;
  const close = async () => {
    if (closing) return;
    closing = true;
    ipv6.close();
    ipv6.closeAllConnections();
    await vite.close();
    if ((await state())?.instance === instance) await rm(statePath, { force: true });
    process.exit(0);
  };
  process.on('SIGTERM', () => { void close(); });
  process.on('SIGINT', () => { void close(); });
}

async function main() {
  const command = process.argv[2] ?? 'status';
  if (command === 'serve') return serve();
  if (command === 'status') {
    const live = await owned();
    if (live) print(live);
    else { console.error(`本机预览未运行。使用 npm run preview:start 启动。\n日志：${logPath}`); process.exitCode = 1; }
    return;
  }
  if (command === 'stop') {
    const live = await owned();
    if (!live) { console.log('没有属于此项目的运行中预览。'); return; }
    try { process.kill(live.pid, 'SIGTERM'); }
    catch (error) {
      if (error.code === 'EPERM') throw new Error('当前执行环境不允许终止独立后台进程。预览仍在运行；请在本机普通终端执行 npm run preview:stop。');
      throw error;
    }
    for (let i = 0; i < 40; i++) { if (!await health()) { console.log('本机预览已停止。'); return; } await delay(100); }
    throw new Error('预览仍在退出，请查看日志。');
  }
  if (command !== 'start') throw new Error('用法：node scripts/preview-local.mjs start|status|stop');
  const existing = await owned();
  if (existing) { print(existing); return; }
  await readFile(join(root, 'dist', 'index.html'));
  await mkdir(runtime, { recursive: true });
  const log = await open(logPath, 'a');
  const child = spawn(process.execPath, [fileURLToPath(import.meta.url), 'serve'], {
    cwd: root, detached: true, stdio: ['ignore', log.fd, log.fd],
  });
  child.unref();
  await log.close();
  for (let i = 0; i < 50; i++) {
    const live = await owned();
    if (live) { print(live); return; }
    await delay(100);
  }
  throw new Error(`启动失败或端口被其他程序占用，请查看 ${logPath}`);
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });

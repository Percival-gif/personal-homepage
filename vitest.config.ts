import {defineConfig} from 'vitest/config';
export default defineConfig({test:{include:['src/**/*.test.ts','src/**/*.test.tsx'],pool:'threads',maxWorkers:1,minWorkers:1}});

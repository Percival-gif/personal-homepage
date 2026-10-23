import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const routes = ['/', '/corridor', '/about', '/work', '/now', '/diary'];
for (const width of [390, 768, 1440]) {
  test.describe(`${width}px`, () => {
    test.use({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    for (const route of routes) {
      test(`${route} direct, reload, layout and accessibility`, async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('console', message => { if(message.type()==='error') errors.push(message.text()); });
        await page.goto(`/#${route}`);
        await expect(page.locator('h1')).toHaveCount(1);
        await page.reload();
        await expect(page.locator('h1')).toBeVisible();
        await page.evaluate(() => document.fonts.ready);
        if(route==='/diary'){
          await page.getByRole('button',{name:'我明白了，开始写',exact:true}).click();
          await page.getByRole('button',{name:'开始写',exact:true}).click();
          await expect(page.getByTestId('diary-body')).toBeVisible();
        }
        const layout=await page.evaluate(()=>({viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,outliers:Array.from(document.querySelectorAll('body *')).map(el=>({tag:el.tagName,id:el.id,class:typeof el.className==='string'?el.className:'',right:el.getBoundingClientRect().right,left:el.getBoundingClientRect().left})).filter(el=>el.right>innerWidth+1).slice(0,12)}));
        expect(layout.scrollWidth,JSON.stringify(layout)).toBeLessThanOrEqual(layout.viewport);
        const a11y = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
        expect(a11y.violations).toEqual([]);
        expect(errors).toEqual([]);
        await page.screenshot({ path: `qa/screens/${width}-${route === '/' ? 'landing' : route.slice(1)}.png`, fullPage: true });
      });
    }
  });
}
test('keyboard door entry, Escape and browser history', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/#/corridor');
  const door = page.getByRole('button', { name: '01 我是谁？', exact: true });
  for(let i=0;i<20 && !await door.evaluate(el=>el===document.activeElement);i++)await page.keyboard.press('Tab');
  await expect(door).toBeFocused();
  await door.press('Enter');
  await expect(page).toHaveURL(/#\/corridor$/);
  await door.press('Enter');
  await expect(page).toHaveURL(/#\/about$/);
  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(/#\/corridor$/);
  await page.goBack();
  await expect(page).toHaveURL(/#\/about$/);
  await page.goForward();
  await expect(page).toHaveURL(/#\/corridor$/);
});

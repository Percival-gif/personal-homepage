import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { profile, getBirthLabel, getLocationLabel } from '../../src/data/profile';
const routes = ['/', '/corridor', '/about', '/work', '/now', '/diary'];
const visibleFacts:Record<string,string[]>={
  '/about':[profile.name,profile.gender,profile.country,getBirthLabel(),getLocationLabel(),...profile.languages.flatMap(x=>[x.name,x.label]),...profile.education.flatMap(x=>[x.period,x.school,x.field,x.degree]),profile.research.intro,...profile.research.topics],
  '/work':[profile.academic.summary,profile.academic.project.name,profile.academic.project.organization,profile.academic.project.summary,...profile.academic.project.steps.map(x=>x.body),profile.industry.company,profile.industry.department,profile.industry.period,...profile.industry.responsibilities,...profile.industry.awards.flatMap(x=>[x.date,x.title,...(x.detail?[x.detail]:[])])],
  '/now':[...profile.currentWork.flatMap(x=>[x.company,x.department,x.role,x.period,...x.responsibilities]),...profile.skills.flatMap(x=>[x.title,x.body])],
};
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
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        const renderedText=(await page.locator('main').innerText()).replace(/\s/g,'');
        for(const fact of visibleFacts[route]??[])expect(renderedText,`Missing visible source content: ${fact}`).toContain(fact.replace(/\s/g,''));
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

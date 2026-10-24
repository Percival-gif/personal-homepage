import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { profile, getBirthLabel, getLocationLabel } from '../../src/data/profile';
const routes = ['/', '/corridor', '/about', '/work', '/now', '/diary'];
const visibleFacts:Record<string,string[]>={
  '/about':[profile.name,profile.gender,profile.country,getBirthLabel(),getLocationLabel(),profile.introduction.title,...profile.introduction.paragraphs,...profile.languages.flatMap(x=>[x.name,x.label]),...profile.education.flatMap(x=>[x.period,x.school,x.field,x.degree]),profile.research.intro,...profile.research.topics,...profile.research.overview,...profile.research.areas.flatMap(x=>[x.title,x.body])],
  '/work':[profile.academic.summary,profile.academic.perspective,profile.academic.conference.title,...profile.academic.conference.paragraphs,profile.academic.project.name,profile.academic.project.organization,profile.academic.project.summary,profile.academic.project.perspective,...profile.academic.project.steps.flatMap(x=>[x.title,x.body]),profile.industry.company,profile.industry.department,profile.industry.period,...profile.industry.responsibilities,...[...profile.industry.awards,...profile.academic.project.awards].flatMap(x=>[...(x.date?[x.date]:[]),x.title,x.status,x.detail])],
  '/now':[profile.currentFocus.title,...profile.currentFocus.introduction,...profile.currentFocus.areas.flatMap(x=>[x.title,x.body]),...profile.currentFocus.approach.flatMap(x=>[x.title,x.body]),profile.currentFocus.closing,...profile.currentWork.flatMap(x=>[x.company,x.department,x.role,x.period,...x.responsibilities,...x.details]),...profile.skills.flatMap(x=>[x.title,x.body])],
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
        if(route==='/about')expect(renderedText).not.toContain(profile.birthDate);
        if(route==='/work'){
          const nominations=page.locator('[data-award-status="提名"]');
          await expect(nominations).toHaveCount(2);
          for(const award of profile.academic.project.awards){
            const card=nominations.filter({has:page.getByRole('heading',{name:award.title,exact:true})});
            await expect(card).toContainText('提名');
            await expect(card).not.toContainText('获奖');
          }
          await expect(page.locator('[data-award-status="获奖"]').filter({has:page.getByRole('heading',{name:'国家技术发明奖',exact:true})})).toHaveCount(1);
          expect(renderedText).not.toContain('国家一级科研奖');
        }
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

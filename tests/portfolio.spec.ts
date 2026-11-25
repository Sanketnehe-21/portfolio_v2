import { test, expect } from '@playwright/test'

test.describe('The Observable Self — End-to-End Flow', () => {
  test('renders identity intro without runtime errors and supports skip & replay', async ({
    page,
  }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })

    await page.goto('/')

    await expect(page.getByText('SN / THE OBSERVABLE SELF')).toBeVisible()
    await expect(page.getByRole('button', { name: /BEGIN THE JOURNEY/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /SKIP INTRO/i })).toBeVisible()

    // Skip directly to inner portfolio route (/portfolio)
    await page.getByRole('button', { name: /SKIP INTRO/i }).click()
    await expect(page).toHaveURL(/\/portfolio$/)
    await expect(
      page.getByRole('heading', { name: /Software engineer & independent builder/i })
    ).toBeVisible()

    // Reloading /portfolio must keep the user on the inner portfolio page
    await page.reload()
    await expect(
      page.getByRole('heading', { name: /Software engineer & independent builder/i })
    ).toBeVisible()

    // Verify theme toggle works
    const themeToggle = page.locator('#theme-toggle')
    await themeToggle.click()
    await expect(page.locator('html')).toHaveClass(/light/)
    await themeToggle.click()
    await expect(page.locator('html')).toHaveClass(/dark/)

    // Verify workflow timeline switches active badge
    await page.locator('#step-automate').click()
    await expect(page.locator('#diagram-badge')).toContainText('Automate')

    // Verify project filter pills filter cards
    await page.locator('#project-filters').getByRole('button', { name: 'Open Source' }).click()
    await expect(page.locator('#projects-grid .project-card')).toHaveCount(2)
    await page.locator('#project-filters').getByRole('button', { name: '3D / Shaders' }).click()
    await expect(page.locator('#projects-grid .project-card')).toHaveCount(1)
    await page.locator('#project-filters').getByRole('button', { name: 'All' }).click()
    await expect(page.locator('#projects-grid .project-card')).toHaveCount(9)

    // Verify replay intro navigates back to / and stays on / across reload
    await page.getByRole('button', { name: /Replay intro/i }).first().click()
    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByRole('button', { name: /BEGIN THE JOURNEY/i })).toBeVisible()
    await page.reload()
    await expect(page.getByRole('button', { name: /BEGIN THE JOURNEY/i })).toBeVisible()

    expect(errors).toEqual([])
  })

  test('guards repeated CTA clicks and completes journey transition to portfolio', async ({
    page,
  }) => {
    await page.goto('/?intro=1')

    const cta = page.getByRole('button', { name: /BEGIN THE JOURNEY/i })
    await expect(cta).toBeEnabled({ timeout: 5000 })

    // Rapid double click should not crash or restart
    await cta.click()
    await cta.click({ force: true })

    await expect(
      page.getByRole('heading', { name: /Software engineer & independent builder/i })
    ).toBeVisible({ timeout: 12000 })
  })

  test('bypasses starfield travel in reduced-motion mode and supports direct hash links', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/?intro=1')

    const cta = page.getByRole('button', { name: /BEGIN THE JOURNEY/i })
    await expect(cta).toBeEnabled({ timeout: 4000 })
    await cta.click()

    await expect(
      page.getByRole('heading', { name: /Software engineer & independent builder/i })
    ).toBeVisible({ timeout: 2500 })

    // Direct section link skips intro immediately
    await page.goto('/#projects')
    await expect(page.locator('#projects')).toBeVisible()
    await expect(page.getByRole('button', { name: /SKIP INTRO/i })).toHaveCount(0)
  })
})

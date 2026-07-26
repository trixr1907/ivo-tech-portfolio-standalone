import { expect, test } from '@playwright/experimental-ct-react'
import App from '../App'

test.describe('focused portfolio structure', () => {
  test.beforeEach(async ({ mount, page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await mount(<App />)
    await expect(page.locator('.loader')).toBeHidden({ timeout: 15_000 })
  })

  test('renders personal identity and a correctly proportioned portrait', async ({ page }) => {
    await expect(page.locator('.hero-eyebrow')).toContainText('Ivo')
    await expect(page.locator('#about')).toContainText('Ich bin Ivo.')
    const portrait = page.locator('#about img[alt="Portrait von Ivo"]')
    await expect(portrait).toBeVisible()
    await expect.poll(async () => portrait.evaluate((image) => {
      const element = image as HTMLImageElement
      const rect = element.getBoundingClientRect()
      return element.complete && element.naturalWidth > 0 && Math.abs(rect.width - rect.height) < 1
    })).toBe(true)
    await expect(page.getByRole('link', { name: 'Über mich' }).first()).toHaveAttribute('href', '#about')
  })

  test('renders three evidence-based cases and opens a case study', async ({ page }) => {
    const cards = page.locator('.relaunch-project-card')
    await expect(cards).toHaveCount(3)
    // Editorial stretches push cards below the fold — sweep the page so lazy images load
    await page.evaluate(async () => {
      const step = window.innerHeight
      for (let y = 0; y <= document.body.scrollHeight; y += step) {
        window.scrollTo({ top: y, behavior: 'instant' })
        await new Promise((resolve) => setTimeout(resolve, 50))
      }
      window.scrollTo({ top: 0, behavior: 'instant' })
    })
    await expect.poll(async () => cards.locator('img').evaluateAll((images) => images.every((image) => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true)
    await expect(cards.nth(0)).toContainText('GOALS Optimizer')
    await expect(cards.nth(0)).toHaveClass(/relaunch-project-card--primary/)
    await expect(cards.nth(0).locator('.project-card__status')).toHaveText('Primärer Case')
    await expect(cards.nth(1)).toContainText('Event Management Hub')
    await expect(cards.nth(2)).toContainText('DLD 3D-Konfigurator')

    await cards.first().locator('button').first().click()
    const dialog = page.getByRole('dialog', { name: /GOALS Optimizer/ })
    await expect(dialog).toBeVisible()
    await expect(dialog).toContainText('371 Tests')
    await dialog.getByRole('button', { name: 'Schliessen' }).click()
    await expect(dialog).toBeHidden()
  })

  test('keeps the public story focused', async ({ page }) => {
    await expect(page.locator('#craft')).toBeVisible()
    await expect(page.locator('#craft .principle-proof')).toHaveCount(3)
    await expect(page.locator('#craft a[href="#project-goals-optimizer"]')).toContainText('371 Tests')
    await expect(page.locator('#craft a[href="#project-event-hub"]')).toContainText('RLS auf jeder Tabelle')
    await expect(page.locator('#craft a[href="#project-dld-3d-configurator"]')).toContainText('3 Admin-Seiten')
    await expect(page.locator('#lab .lab-relaunch-card')).toHaveCount(4)
    await expect(page.locator('#kontakt')).toContainText('eine konkrete Frage')
    await expect(page.getByText('Realtime Data')).toHaveCount(0)
    await expect(page.getByText('Helium Mining')).toHaveCount(0)
  })
})

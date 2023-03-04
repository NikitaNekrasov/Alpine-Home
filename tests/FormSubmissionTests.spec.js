// @ts-check
const { test, expect } = require('@playwright/test');

test('Can submit form with all fields populated', async ({ page }) => {
  await page.goto(`http://localhost:${process.env.TEST_PORT || 3001}/`)

  await page.locator('data-test-id=dateInput').fill('2023-03-04T05:15')
  await page.locator('data-test-id=vendorNameInput').fill('Test Vendor')
  await page.locator('data-test-id=fileInput').setInputFiles({
    name: 'test.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from('Model Number,Unit Price,Quantity\nC123,5.49,7\nA347,6.00,12')
  })
  await page.locator('data-test-id=submitFormButton').click()
});

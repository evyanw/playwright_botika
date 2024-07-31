const { test, expect } = require('@playwright/test');

test('Valid login with shadow DOM', async function ({ page }) {
  // Navigasi ke halaman login
  await page.goto('https://voice.botika.online/#/login');

  // Locator untuk shadow root
  const shadowRoot = await page.evaluateHandle(() => {
    const root = document.querySelector('flt-glass-pane');
    return root.shadowRoot || root.attachShadow({ mode: 'open' });
  });

  // Locator untuk input email di dalam shadow root
  const emailInput = await shadowRoot.$('input.flt-text-editing.transparentTextEditing[style*="width: 741px;"]');

  // Locator untuk input sandi di dalam shadow root
  const passwordInput = await shadowRoot.$('input.flt-text-editing.transparentTextEditing[type="password"][style*="width: 719px;"]');

  // Locator untuk tombol masuk di dalam shadow root
  const loginButton = await shadowRoot.$('button[type="submit"]'); // Adjust selector as needed

  // Mengisi input email dan sandi
  await emailInput.type('evianatest@gmail.com');
  await passwordInput.type('evianatest@123');

  // Mengklik tombol masuk
  await loginButton.click();

  // Tunggu beberapa saat untuk memastikan bahwa halaman sudah dimuat sepenuhnya
  await page.waitForTimeout(5000);

  // Verifikasi bahwa login berhasil dengan memeriksa URL atau elemen lain di halaman setelah login
  await expect(page).toHaveURL('https://voice.botika.online/#/main-menu');

  // Verifikasi bahwa elemen dashboard ada di dalam shadow root
  const dashboardElement = await shadowRoot.$('selector-untuk-dashboard'); // Ganti dengan selector elemen yang relevan
  await expect(dashboardElement).toBeVisible();
});
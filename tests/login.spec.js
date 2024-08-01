const { test, expect } = require('@playwright/test');

test('Valid login with shadow DOM', async function ({ page }) {
  try {
    console.log('Navigasi ke halaman login');
    await page.goto('https://voice.botika.online/#/login');

    console.log('Menunggu elemen flt-glass-pane tersedia di halaman');
    const fltGlassPane = await page.waitForSelector('flt-glass-pane', { timeout: 30000 });

    if (!fltGlassPane) {
      // Jika elemen tidak ditemukan, cetak konten halaman untuk debugging
      const pageContent = await page.content();
      console.error('Konten halaman:', pageContent);
      throw new Error('Elemen flt-glass-pane tidak ditemukan');
    }

    console.log('Mengakses shadow root dari flt-glass-pane');
    const shadowRootHandle = await fltGlassPane.evaluateHandle(el => el.shadowRoot);

    if (!shadowRootHandle) {
      throw new Error('Shadow root tidak ditemukan');
    }

    console.log('Menunggu input email tersedia');
    const emailInputHandle = await page.evaluateHandle(({ shadowRoot }) => {
      return shadowRoot.querySelector('input[autocomplete="off"][class="flt-text-editing transparentTextEditing"][type="text"]');
    }, { shadowRoot: shadowRootHandle });

    if (!emailInputHandle) {
      throw new Error('Elemen input email tidak ditemukan');
    }

    console.log('Mengisi input email');
    await emailInputHandle.evaluate((input, email) => {
      if (input) {
        input.value = email;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, 'evianatest@gmail.com');

    console.log('Menunggu input password tersedia');
    const passwordInputHandle = await page.evaluateHandle(({ shadowRoot }) => {
      return shadowRoot.querySelector('input[autocomplete="off"][class="flt-text-editing transparentTextEditing"][type="password"]');
    }, { shadowRoot: shadowRootHandle });

    if (!passwordInputHandle) {
      throw new Error('Elemen input password tidak ditemukan');
    }

    console.log('Mengisi input password');
    await passwordInputHandle.evaluate((input, password) => {
      if (input) {
        input.value = password;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, 'evianatest@123');

    console.log('Menunggu tombol login tersedia');
    const loginButtonHandle = await page.evaluateHandle(({ shadowRoot }) => {
      return shadowRoot.querySelector('button[type="submit"]');
    }, { shadowRoot: shadowRootHandle });

    if (!loginButtonHandle) {
      throw new Error('Tombol login tidak ditemukan');
    }

    console.log('Klik tombol login');
    await loginButtonHandle.evaluate(button => {
      if (button) {
        button.click();
      }
    });

    console.log('Menunggu elemen flt-glass-pane muncul setelah login');
    try {
      await page.waitForSelector('flt-glass-pane', { timeout: 100000 });
    } catch (error) {
      console.error('Elemen setelah login tidak ditemukan:', error);

      if (!page.isClosed()) {
        try {
          console.log('Mengambil screenshot login-debug.png');
          await page.screenshot({ path: 'login-debug.png' });
        } catch (screenshotError) {
          console.error('Gagal mengambil screenshot:', screenshotError);
        }
      }

      throw error;
    }

    console.log('Ambil screenshot untuk memverifikasi visualisasi setelah login');
    if (!page.isClosed()) {
      await page.screenshot({ path: 'post-login.png' });
    }

  } catch (error) {
    console.error('Test gagal:', error);
    throw error;
  }
});
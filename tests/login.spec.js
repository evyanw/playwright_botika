const { test, expect } = require('@playwright/test');

test('Valid login with shadow DOM', async function ({ page }) {
  try {
    console.log('Navigasi ke halaman login');
    await page.goto('https://voice.botika.online/#/login', { timeout: 60000 });

    // Ambil screenshot sebelum menunggu elemen
    console.log('Ambil screenshot sebelum menunggu elemen');
    await page.waitForTimeout(5000); // Tunggu sebentar untuk memastikan halaman dimuat sepenuhnya
    await page.screenshot({ path: 'before-wait.png' });

    // Menunggu elemen flt-glass-pane tersedia di halaman
    console.log('Menunggu elemen flt-glass-pane tersedia di halaman');
    const fltGlassPane = await page.waitForSelector('flt-glass-pane', { timeout: 60000 });

    if (!fltGlassPane) {
      console.error('Elemen flt-glass-pane tidak ditemukan.');
      const pageContent = await page.content();
      console.error('Konten halaman:', pageContent);
      throw new Error('Elemen flt-glass-pane tidak ditemukan');
    }

    // Mengakses shadow root dari flt-glass-pane
    console.log('Mengakses shadow root dari flt-glass-pane');
    const shadowRootHandle = await fltGlassPane.evaluateHandle(el => el.shadowRoot);

    if (!shadowRootHandle) {
      throw new Error('Shadow root tidak ditemukan');
    }

    // Menunggu input email tersedia di shadow DOM
    console.log('Menunggu input email tersedia');
    const emailInputHandle = await page.evaluateHandle(({ shadowRoot }) => {
      return shadowRoot.querySelector('input[autocomplete="off"][type="text"]');
    }, { shadowRoot: shadowRootHandle });

    if (!emailInputHandle) {
      throw new Error('Elemen input email tidak ditemukan');
    }

    console.log('Klik input email');
    await emailInputHandle.evaluate(input => {
      if (input) {
        input.click();
      }
    });

    console.log('Mengisi input email');
    await emailInputHandle.evaluate((input, email) => {
      if (input) {
        input.value = email;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, 'evianatest@gmail.com');

    // Menunggu input password tersedia di shadow DOM
    console.log('Menunggu input password tersedia');
    const passwordInputHandle = await page.evaluateHandle(({ shadowRoot }) => {
      return shadowRoot.querySelector('input[autocomplete="off"][type="password"]');
    }, { shadowRoot: shadowRootHandle });

    if (!passwordInputHandle) {
      throw new Error('Elemen input password tidak ditemukan');
    }

    console.log('Klik input password');
    await passwordInputHandle.evaluate(input => {
      if (input) {
        input.click();
      }
    });

    console.log('Mengisi input password');
    await passwordInputHandle.evaluate((input, password) => {
      if (input) {
        input.value = password;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, 'evianatest@123');

    // Menunggu tombol login tersedia di shadow DOM
    console.log('Menunggu tombol login di shadow DOM');
    await page.waitForFunction(
      (shadowRootHandle) => {
        return new Promise((resolve) => {
          // Mengevaluasi dalam konteks browser
          shadowRootHandle.evaluate(shadowRoot => {
            const button = shadowRoot.querySelector('button[type="submit"]');
            resolve(button && button.offsetParent !== null); // Pastikan tombol terlihat
          });
        });
      },
      { timeout: 60000 },
      shadowRootHandle
    );

    // Mengakses tombol login dan klik
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

    // Ambil screenshot setelah klik tombol login
    console.log('Ambil screenshot setelah klik tombol login');
    await page.waitForTimeout(5000); // Tunggu sebentar setelah klik untuk memastikan tampilan stabil
    await page.screenshot({ path: 'after-login-click.png' });

    // Menunggu navigasi ke halaman utama
    console.log('Menunggu navigasi ke halaman utama');
    await page.waitForNavigation({ timeout: 60000 });

    // Navigasi ke halaman menu utama
    console.log('Navigasi ke halaman menu utama');
    await page.goto('https://voice.botika.online/#/main-menu', { timeout: 60000 });

    // Ambil screenshot untuk verifikasi halaman utama
    console.log('Ambil screenshot setelah masuk ke halaman utama');
    await page.waitForTimeout(5000); // Tunggu sebentar untuk memastikan halaman utama sepenuhnya dimuat
    await page.screenshot({ path: 'post-main-menu.png' });

  } catch (error) {
    console.error('Test gagal:', error);

    if (!page.isClosed()) {
      console.log('Mengambil screenshot untuk debug');
      await page.screenshot({ path: 'error-debug.png' });

      const pageContent = await page.content();
      console.error('Konten halaman setelah error:', pageContent);
    }
    throw error;
  }
});
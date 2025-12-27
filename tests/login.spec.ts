import { test, expect } from "@playwright/test";

// Real Mock Data
const mockUser = {
  id: "95d9852d-389b-4e31-af47-876dfb57e16c",
  userId: "ce086b56-bc5a-4adc-83c2-edd4f4f423c4",
  email: "gardeken931@gmail.com",
  fullName: "Pedro Centeno",
  role: {
    id: "a7502c75-cdba-42a4-b392-90678aee5698",
    name: "propietario",
    description: "Propietario",
  },
};

test("Debe poder iniciar sesión con credenciales reales", async ({ page }) => {
  // 1. Ir a la página de login
  await page.goto("http://localhost:5173/login");

  // 2. Llenar credenciales
  await page.getByLabel(/email|correo/i).fill("gardeken931@gmail.com");
  await page.getByLabel(/password|contraseña/i).fill("Gardkali#0512");

  // 3. Mockear respuestas de login

  // MOCK de Login exitoso (Paso 1: Valida credenciales pero pide 2FA)
  await page.route("**/api/auth/login", async (route) => {
    await route.fulfill({
      json: {
        success: true,
        // No access_token here because 2FA is required
        message: "2FA required",
      },
    });
  });

  // MOCK de Verificación 2FA (Paso 2: Devuelve el token)
  await page.route("**/api/auth/verify-2fa-login", async (route) => {
    await route.fulfill({
      json: {
        success: true,
        access_token: "mock-real-user-token",
        message: "Login exitoso",
      },
    });
  });

  // MOCK de /auth/me
  await page.route("**/api/auth/me", async (route) => {
    await route.fulfill({ json: mockUser });
  });

  // Mocks de soporte
  await page.route("**/health", async (route) =>
    route.fulfill({ status: 200 })
  );
  await page.route("**/api/edificios", async (route) =>
    route.fulfill({ json: { data: [] } })
  );
  await page.route("**/api/dashboard/stats", async (route) =>
    route.fulfill({ json: { data: {} } })
  );

  // 4. Click en botón Login
  await page
    .getByRole("button", { name: /entrar|iniciar sesión|login/i })
    .click();

  // 5. Manejar 2FA
  // Esperar a que aparezca el modal/input de 2FA
  const codeInput = page.locator('input[id="2fa-code"]');
  await expect(codeInput).toBeVisible();
  await codeInput.fill("123456");

  // Click en Verificar
  await page.getByRole("button", { name: /verificar código/i }).click();

  // 6. Verificar redirección
  // Esperar a que la URL cambie (dashboard o similar)
  // Ajusta según la URL real de destino, por ejemplo '/dashboard' o la home '/'
  await expect(page).not.toHaveURL(/.*login.*/);
});

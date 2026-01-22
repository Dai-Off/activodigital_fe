import { test, expect, type Route, type ConsoleMessage } from "@playwright/test";

// Mock Data matching login.spec.ts and digital-book.spec.ts
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

const mockBuilding = {
  id: "building-123",
  name: "Edificio de Prueba",
  address: "Calle Falsa 123",
  typology: "commercial",
  constructionYear: 1990,
  images: [{ id: "1", url: "https://via.placeholder.com/400x140", isMain: true }],
  status: "with_book",
};

test.describe("BuildingGeneralView Responsiveness", () => {
  const BASE_URL = "http://localhost:5173";
  const BUILDING_ID = "building-123";

  test.beforeEach(async ({ page }) => {
    // 0. Enable Debug Logs
    page.on("console", (msg: ConsoleMessage) => {
        const text = msg.text();
        if (text.includes("socket.io") || text.includes("WebSocket")) return;
        console.log(`PAGE [${msg.type()}]: ${text}`);
    });

    console.log("\n--- STEP: Starting Test Setup (Mocks) ---");

    // Helper to mock a path on BOTH Localhost:3000 and Fly.io
    const mockBoth = async (
      pathPattern: string,
      handler: (route: Route) => Promise<void>
    ) => {
      await page.route(`http://localhost:3000${pathPattern}`, handler);
      await page.route(
        `https://activodigital-be.fly.dev${pathPattern}`,
        handler
      );
    };

    // 1. CATCH-ALL
    await mockBoth("/**", async (route: Route) => {
      await route.fulfill({ status: 200, json: { data: [] } });
    });

    // 2. SPECIFIC MOCKS
    await mockBoth("/health*", async (route: Route) =>
      route.fulfill({ status: 200 })
    );

    // Auth Mocks
    await mockBoth("/auth/me", async (route: Route) =>
      route.fulfill({ json: mockUser })
    );
    await mockBoth("/auth/login", async (route: Route) => {
      await route.fulfill({ json: { success: true, message: "2FA required" } });
    });
    await mockBoth("/auth/verify-2fa-login", async (route: Route) => {
      await route.fulfill({
        json: {
          success: true,
          access_token: "mock-real-user-token",
          message: "Login exitoso",
        },
      });
    });

    // Data Mocks
    await mockBoth(`/edificios/${BUILDING_ID}`, async (route: Route) =>
      route.fulfill({ json: { data: mockBuilding } })
    );
    
    // Explicit mocks since catch-all might return empty array 'data: []' which could break partial object matches
    await mockBoth(`/libros-digitales/building/${BUILDING_ID}*`, async (route: Route) => 
      route.fulfill({ json: { data: { completedPercentage: 75, progress: 10 } } })
    );
    await mockBoth("/dashboard/stats", async (route) => 
      route.fulfill({ json: { data: {} } })
    );

    // 3. Perform Login
    test.slow(); // Increase timeout 3x
    console.log("--- STEP: Navigating to Login Page ---");
    await page.goto(`${BASE_URL}/login`);

    console.log("--- STEP: Filling Credentials ---");
    await page.getByLabel(/email|correo/i).fill("gardeken931@gmail.com");
    await page.getByLabel(/password|contraseña/i).fill("Gardkali#0512");
    await page
      .getByRole("button", { name: /entrar|iniciar sesión|login/i })
      .click();

    // Handle 2FA
    console.log("--- STEP: Handling 2FA Input ---");
    const codeInput = page.locator('input[id="2fa-code"]');
    await expect(codeInput).toBeVisible({ timeout: 15000 });
    await codeInput.fill("123456");
    await page.getByRole("button", { name: /verificar código/i }).click();

    // Wait to leave login page
    console.log("--- STEP: Waiting for Login Redirect ---");
    await expect(page).not.toHaveURL(/.*login.*/, { timeout: 20000 });
  });

  test("Desktop View: Should show two-column layout", async ({ page }) => {
    console.log("--- STEP: Navigating to Building General View (Desktop) ---");
    await page.goto(`${BASE_URL}/building/${BUILDING_ID}/general-view`);
    
    await page.setViewportSize({ width: 1280, height: 720 });
    
    await expect(page.getByText("Edificio de Prueba")).toBeVisible({ timeout: 10000 });

    const mainGrid = page.locator('.grid.lg\\:grid-cols-2').first();
    await expect(mainGrid).toBeVisible();
    
    // Use expect.poll to retry fetching computed styles until they match
    await expect.poll(async () => {
      const gridStyles = await mainGrid.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return styles.gridTemplateColumns;
      });
      // Should have 2 columns (e.g., "592px 592px" or similar)
      return gridStyles.split(' ').length;
    }, { timeout: 10000 }).toBe(2);
  });

  test("Mobile View: Should stack columns in one-column layout", async ({ page }) => {
    console.log("--- STEP: Navigating to Building General View (Mobile) ---");
    await page.goto(`${BASE_URL}/building/${BUILDING_ID}/general-view`);

    await page.setViewportSize({ width: 375, height: 667 });
    
    await expect(page.getByText("Edificio de Prueba")).toBeVisible({ timeout: 10000 });

    const mainGrid = page.locator('.grid.lg\\:grid-cols-2').first();
    
    await expect.poll(async () => {
        const gridStyles = await mainGrid.evaluate((el) => {
            const styles = window.getComputedStyle(el);
            return styles.gridTemplateColumns;
        });
        console.log(`[Mobile] Computed Columns: "${gridStyles}"`);
        return gridStyles.split(' ').length;
    }, { timeout: 10000 }).toBe(1);
  });

  test("Tablet View: Should show appropriate layout", async ({ page }) => {
    console.log("--- STEP: Navigating to Building General View (Tablet) ---");
    await page.goto(`${BASE_URL}/building/${BUILDING_ID}/general-view`);

    await page.setViewportSize({ width: 768, height: 1024 });

    await expect(page.getByText("Edificio de Prueba")).toBeVisible({ timeout: 10000 });
    
    const mainGrid = page.locator('.grid.lg\\:grid-cols-2').first();
    
    await expect.poll(async () => {
        const gridStyles = await mainGrid.evaluate((el) => { 
            return window.getComputedStyle(el).gridTemplateColumns; 
        });
        console.log(`[Tablet] Computed Columns: "${gridStyles}"`);
        return gridStyles.split(' ').length;
    }, { timeout: 10000 }).toBe(1);
  });
});

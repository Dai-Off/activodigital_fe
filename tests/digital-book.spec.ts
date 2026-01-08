import {
  test,
  expect,
  type Route,
  type ConsoleMessage,
  type Request,
} from "@playwright/test";

test.describe("Digital Book & Compliance", () => {
  const BASE_URL = "http://localhost:5173";
  const BUILDING_ID = "building-1";
  const SECTION_ID = "installations"; // UI ID for "Instalaciones y consumos"
  const API_SECTION_TYPE = "facilities_and_consumption"; // API ID mapping

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

  const mockBook = {
    id: "book-123",
    buildingId: BUILDING_ID,
    source: "manual",
    status: "in_progress",
    progress: 1,
    sections: [
      {
        id: "sec-1",
        type: API_SECTION_TYPE,
        complete: false,
        content: {
          electrical_system: "Sistema antiguo",
          water_system: "Red municipal",
          hvac_system: "Aire acondicionado central",
        },
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  test.beforeEach(async ({ page }) => {
    // 0. Enable Debug Logs (Filtering Socket Errors)
    page.on("console", (msg: ConsoleMessage) => {
      const text = msg.text();
      if (
        text.includes("socket.io") ||
        text.includes("WebSocket") ||
        text.includes("CONNECTION_REFUSED")
      )
        return;
      // Print all logs including our new STEP logs
      console.log(`PAGE [${msg.type()}]: ${text}`);
    });
    page.on("pageerror", (err: Error) => {
      if (
        err.message.includes("socket.io") ||
        err.message.includes("WebSocket")
      )
        return;
      console.log("PAGE ERROR:", err.message);
    });
    page.on("requestfailed", (req: Request) => {
      if (req.url().includes("socket.io")) return;
      // console.log('REQ FAILED:', req.url(), req.failure()?.errorText);
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
    await mockBoth("/notifications*", async (route: Route) =>
      route.fulfill({ json: { data: [] } })
    );
    await mockBoth("/edificios", async (route: Route) =>
      route.fulfill({ json: { data: [] } })
    );
    await mockBoth("/dashboard/stats", async (route: Route) =>
      route.fulfill({ json: { data: [] } })
    );

    // Book Endpoint
    await mockBoth(
      "/libros-digitales/building/building-1*",
      async (route: Route) => {
        await route.fulfill({ json: { data: mockBook } });
      }
    );

    // 2. Perform Login
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
    await expect(page).not.toHaveURL(/.*login.*/);
  });

  /* CASE 10 */
  test("Case 10: Navigation through the Building Book", async ({ page }) => {
    console.log(
      "--- STEP: Case 10 Started - Navigating to Digital Book Hub ---"
    );
    // Force Navigate
    await page.goto(`${BASE_URL}/digital-book/hub/${BUILDING_ID}`);

    // Verify Hub loaded
    console.log("--- STEP: Verifying Hub Loaded ---");
    await expect(page.getByText("Progreso del Libro del Edificio")).toBeVisible(
      { timeout: 15000 }
    );
    await expect(page.getByText("Instalaciones y consumos")).toBeVisible();

    // Select Section
    console.log('--- STEP: Clicking "Instalaciones y consumos" Section ---');
    await page
      .getByRole("button", { name: /Instalaciones y consumos/i })
      .click();
    await expect(page).toHaveURL(
      new RegExp(`/digital-book/section/${BUILDING_ID}/${SECTION_ID}`)
    );

    // Validation
    console.log("--- STEP: Verifying Section Content ---");
    const electricalInput = page
      .locator("div")
      .filter({ hasText: /^Sistema eléctrico/ })
      .last()
      .locator("textarea, input")
      .first();
    await expect(electricalInput).toBeVisible({ timeout: 5000 });
    await expect(electricalInput).toHaveValue("Sistema antiguo");

    console.log("--- STEP: Navigating Back to Hub ---");
    await page.goBack();
    await expect(page).toHaveURL(
      new RegExp(`/digital-book/hub/${BUILDING_ID}`)
    );
    console.log("--- STEP: Case 10 Success ---");
  });

  /* CASE 11 */
  test("Case 11: Edit Book Section", async ({ page }) => {
    const UPDATED_VALUE = "Sistema eléctrico renovado 2024";

    console.log(
      "--- STEP: Case 11 Started - Direct Navigation to Section Editor ---"
    );
    await page.goto(
      `${BASE_URL}/digital-book/section/${BUILDING_ID}/${SECTION_ID}`
    );
    // Explicitly wait for valid URL to catch redirects
    await expect(page).toHaveURL(
      new RegExp(`/digital-book/section/${BUILDING_ID}/${SECTION_ID}`)
    );

    console.log("--- STEP: Verifying Initial State ---");
    const electricalInput = page
      .locator("div")
      .filter({ hasText: /^Sistema eléctrico/ })
      .last()
      .locator("textarea, input")
      .first();
    await expect(electricalInput).toBeVisible({ timeout: 10000 });
    await expect(electricalInput).toHaveValue("Sistema antiguo");

    console.log("--- STEP: Filling New Value ---");
    await electricalInput.fill(UPDATED_VALUE);

    // Explicit Mocks for PUT
    const putPattern = `/libros-digitales/${mockBook.id}/sections/${API_SECTION_TYPE}`;

    const handler = async (route: Route) => {
      console.log("--- STEP: Intercepting PUT Request ---");
      const body = JSON.parse(route.request().postData() || "{}");
      expect(body.content.electrical_system).toBe(UPDATED_VALUE);

      const updatedBook = {
        ...mockBook,
        sections: mockBook.sections.map((s) =>
          s.type === API_SECTION_TYPE
            ? {
                ...s,
                content: { ...s.content, electrical_system: UPDATED_VALUE },
                complete: true,
              }
            : s
        ),
      };
      await route.fulfill({ json: { data: updatedBook } });
    };

    await page.route(`http://localhost:3000${putPattern}`, handler);
    await page.route(`https://activodigital-be.fly.dev${putPattern}`, handler);

    console.log("--- STEP: Clicking Save Button ---");
    await page.getByRole("button", { name: "Guardar Sección" }).click();
    await expect(page.getByText("Sección guardada")).toBeVisible();

    // Mock GET refresh
    const getHandler = async (route: Route) => {
      const updatedBook = {
        ...mockBook,
        sections: mockBook.sections.map((s) =>
          s.type === API_SECTION_TYPE
            ? {
                ...s,
                content: { ...s.content, electrical_system: UPDATED_VALUE },
                complete: true,
              }
            : s
        ),
      };
      await route.fulfill({ json: { data: updatedBook } });
    };
    await page.route(
      "http://localhost:3000/libros-digitales/building/building-1*",
      getHandler
    );
    await page.route(
      "https://activodigital-be.fly.dev/libros-digitales/building/building-1*",
      getHandler
    );

    console.log("--- STEP: Reloading to Verify Persistence ---");
    await page.reload();
    await expect(electricalInput).toHaveValue(UPDATED_VALUE);
    console.log("--- STEP: Case 11 Success ---");
  });
});

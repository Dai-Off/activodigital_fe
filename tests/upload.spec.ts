import { test, expect } from "@playwright/test";

// Real Data from User DB Dump
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
  id: "0007a31b-98fa-4dba-a05e-b62fad1d2e87",
  name: "PRUEBA",
  address:
    "Calle Alberto Sánchez, Casco Histórico de Vicálvaro, Vicálvaro, Madrid, Community of Madrid, 28052, Spain",
  cadastralReference: null,
  constructionYear: 2020,
  typology: "residential",
  numFloors: 23,
  numUnits: 23,
  lat: 40.39348348,
  lng: -3.59453802,
  images: [
    {
      id: "0007a31b-98fa-4dba-a05e-b62fad1d2e87_1762776729742_18rncqleyxl",
      url: "https://eqyevtkljwvhfsohawrk.supabase.co/storage/v1/object/sign/building-images/0007a31b-98fa-4dba-a05e-b62fad1d2e87/1762776729742_18rncqleyxl.webp?token=mock-token",
      title: "fachada-de-edificio-con-ventanas-grandes.webp",
      isMain: true,
      filename: "fachada-de-edificio-con-ventanas-grandes.webp",
      uploadedAt: "2025-11-10T12:12:11.199Z",
    },
  ],
  status: "draft",
  price: 23333.0,
  technicianEmail: "martiingadeea1996@gmail.com",
  cfoEmail: "tradebotg@gmail.com",
  // Ensure owner matches the logging in user to avoid permission issues
  ownerId: mockUser.userId,
  rehabilitationCost: 133.0,
  potentialValue: 133.0,
  squareMeters: 123.0,
  createdAt: "2025-11-10T12:12:03.945061+00:00",
  updatedAt: "2025-11-27T13:06:23.767186+00:00",
};

const mockCertificatesResponse = {
  certificates: [],
  sessions: [],
};

test.describe("Building Certificates - File Upload", () => {
  test.beforeEach(async ({ page }) => {
    // Inject auth token
    await page.addInitScript(() => {
      window.localStorage.setItem("access_token", "mock-token");
    });

    // 1. Mock API calls to backend

    // Mock health check for backend detection
    await page.route("**/health", async (route) => {
      route.fulfill({ status: 200 });
    });

    // Mock Notifications to prevent 401
    await page.route("**/notifications/**", async (route) => {
      route.fulfill({ json: { data: [] } });
    });

    // Mock Auth
    await page.route("**/auth/me", async (route) => {
      await route.fulfill({ json: mockUser });
    });

    // Catch-all for other API calls
    await page.route("**/users/technicians", async (route) =>
      route.fulfill({ json: { data: [] } })
    );
    await page.route("**/dashboard/stats", async (route) =>
      route.fulfill({ json: { data: {} } })
    );
    await page.route("**/edificios", async (route) =>
      route.fulfill({ json: { data: [] } })
    );

    await page.route(`**/edificios/${mockBuilding.id}`, async (route) => {
      await route.fulfill({ json: { data: mockBuilding } });
    });

    await page.route(
      `**/certificados-energeticos/building/${mockBuilding.id}`,
      async (route) => {
        await route.fulfill({ json: { data: mockCertificatesResponse } });
      }
    );

    await page.route(
      "**/certificados-energeticos/sessions/simple",
      async (route) => {
        await route.fulfill({ json: { data: { id: "session-123" } } });
      }
    );

    await page.route(
      "**/certificados-energeticos/process-ai-data",
      async (route) => {
        await route.fulfill({
          json: {
            data: {
              rating_letter: "B",
              energy_consumption_kwh_m2y: 50,
              co2_emissions_kg_m2y: 10,
            },
          },
        });
      }
    );

    // 2. Mock Supabase Storage calls
    // Mock upload
    await page.route(
      "**/storage/v1/object/energy-certificates/**",
      async (route) => {
        if (route.request().method() === "POST") {
          await route.fulfill({
            status: 200,
            json: {
              Key: `energy-certificates/${mockBuilding.id}/test-file.pdf`,
            },
          });
        } else {
          await route.continue();
        }
      }
    );

    // Mock createSignedUrl (often used after upload to show preview)
    await page.route(
      "**/storage/v1/object/sign/energy-certificates/**",
      async (route) => {
        await route.fulfill({
          json: { signedUrl: "http://localhost/fake-image-url.jpg" },
        });
      }
    );

    // 3. Navigate to the page
    await page.goto(
      `http://localhost:5173/building/${mockBuilding.id}/general-view/certificates`
    );
  });

  test("should open upload modal and allow selecting a file", async ({
    page,
  }) => {
    // Click "Cargar Certificado" button
    await page
      .getByRole("button", { name: /Cargar Certificado/i })
      .first()
      .click();

    // Check modal is open
    await expect(page.getByText("Subir Certificado Energético")).toBeVisible();

    // Prepare a mock file
    const fileContent = "dummy content";
    const buffer = Buffer.from(fileContent);
    const file = {
      name: "certificado.pdf",
      mimeType: "application/pdf",
      buffer: buffer,
    };

    // Trigger file chooser and select file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(file);

    // Verify that we can verify the state changed.
    expect(
      await fileInput.evaluate((el: HTMLInputElement) => el.files?.length)
    ).toBe(1);
  });

  test("should show error for files larger than 10MB", async ({ page }) => {
    await page
      .getByRole("button", { name: /Cargar Certificado/i })
      .first()
      .click();

    // Use a smaller effective buffer for speed but mock size if possible,
    // but Playwright checks real size. We use 11MB which triggers default 10MB limit of FileUpload component.
    const largeBuffer = Buffer.alloc(11 * 1024 * 1024); // 11MB
    const file = {
      name: "large_file.pdf",
      mimeType: "application/pdf",
      buffer: largeBuffer,
    };

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(file);

    // Expect error message
    await expect(page.getByText(/Archivo demasiado grande/i)).toBeVisible();
  });

  test("should show error for invalid file types", async ({ page }) => {
    await page
      .getByRole("button", { name: /Cargar Certificado/i })
      .first()
      .click();

    const file = {
      name: "script.exe",
      mimeType: "application/x-msdownload",
      buffer: Buffer.from("fake exe"),
    };

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(file);

    // Expect error message
    await expect(page.getByText(/Tipo de archivo no válido/i)).toBeVisible();
  });
});

import { test, expect } from "@playwright/test";

test("Debe permitir al usuario rellenar manualmente la sección Datos Generales", async ({ page }) => {
    // 1. MOCKS de datos
    const mockUser = { id: "u1", email: "test@test.com", fullName: "Test User", role: { name: "admin" } };
    const mockBuilding = { id: "building-1", name: "Torre Central" };
    const mockBook = { 
        id: "b1", buildingId: "building-1", 
        sections: [
            { id: "s1", type: "general_data", title: "Datos generales del edificio", complete: false, content: {} }
        ] 
    };

    // MOCKS EXPLÍCITOS (Más seguro que interceptar todo)
    await page.route("**/api/auth/login", route => route.fulfill({ json: { success: true, message: "2FA" } }));
    await page.route("**/api/auth/verify-2fa-login", route => route.fulfill({ json: { success: true, access_token: "mt" } }));
    await page.route("**/api/auth/me", route => route.fulfill({ json: mockUser }));
    await page.route("**/api/edificios/**", route => route.fulfill({ json: mockBuilding }));
    await page.route("**/api/edificios", route => route.fulfill({ json: { data: [mockBuilding] } }));
    // Mocks para digital book y sus secciones
    await page.route("**/libros-digitales/building/**", route => route.fulfill({ json: { data: mockBook } }));
    await page.route("**/libros-digitales/**/sections/**", route => route.fulfill({ json: { data: mockBook } }));
    
    // Mocks auxiliares
    await page.route("**/notifications/**", route => route.fulfill({ json: { data: [] } }));
    await page.route("**/health", route => route.fulfill({ status: 200 }));

    // 2. FLUJO
    console.log("-> Iniciando Test...");
    await page.goto("http://localhost:5173/login");
    
    // Usamos getByLabel que es más robusto y accesible
    await page.getByLabel(/email|correo/i).fill("gardeken931@gmail.com");
    await page.getByLabel(/password|contraseña/i).fill("Gardkali#0512");
    await page.getByRole("button", { name: /entrar|iniciar/i }).click();
    
    await page.locator('input[id="2fa-code"]').fill("123456");
    await page.getByRole("button", { name: /verificar/i }).click();
    
    await expect(page).toHaveURL(/.*dashboard.*/);
    console.log("-> Login OK");

    await page.goto("http://localhost:5173/digital-book/hub/building-1");
    // Esperar a que el título aparezca
    await expect(page.locator('h1')).toContainText("Libro del Edificio", { timeout: 15000 });
    console.log("-> Hub OK");

    // Navegar a la sección
    await page.click('text="Datos generales del edificio"');
    await expect(page).toHaveURL(/.*general_data.*/);
    console.log("-> SectionEditor OK");

    // RELLENAR TODOS LOS CAMPOS REQUERIDOS
    await page.fill('textarea[name="identification"]', "Identificación de prueba");
    await page.fill('input[name="ownership"]', "Propiedad de prueba");
    // Select con label exacto del mock/código
    await page.selectOption('select[name="building_typology"]', { label: "Residencial" });
    await page.fill('input[name="primary_use"]', "Vivienda");
    console.log("-> Formulario rellenado");

    // Click en Guardar SECCIÓN
    await page.click('button:has-text("Guardar Sección")');

    // Verificación final
    // Buscamos cualquier de los mensajes de éxito posibles
    await expect(page.getByText(/Sección guardada|Guardado con éxito|Completa/i).first()).toBeVisible({ timeout: 15000 });
    console.log("-> TEST FINALIZADO CON ÉXITO!");
});

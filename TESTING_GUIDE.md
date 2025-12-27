# Guía de Implementación de Testing (Activodigital)

Esta guía documenta cómo hemos implementado el testing automatizado con **Playwright** en nuestro proyecto y cómo podéis crear nuevos tests, ya sea manualmente o potenciándonos con IA.

## 1. Configuración del Entorno

Si te acabas de unir al proyecto o no tienes Playwright configurado:

1.  **Instalar dependencias**:

    ```bash
    npm install
    npx playwright install
    ```

    _Esto descarga los navegadores necesarios para las pruebas._

2.  **Verificar instalación**:
    Ejecuta los tests existentes para asegurarte de que todo funciona:
    ```bash
    npx playwright test
    ```

## 2. Ejecución de Tests

Tenemos varios comandos útiles configurados en `package.json` o disponibles vía CLI:

- **Ejecutar todos los tests (Headless - sin ventana):**
  ```bash
  npx playwright test
  ```
- **Ejecutar con Interfaz Gráfica (Recomendado para debug):**
  ```bash
  npx playwright test --ui
  ```
  _Te abre una ventana donde puedes ver paso a paso qué hace el test, el DOM, la consola, y la red._
- **Ejecutar un archivo específico:**
  ```bash
  npx playwright test tests/upload.spec.ts
  ```

## 3. Estrategia de Testing (Mocks vs E2E Real)

En este proyecto usamos una estrategia híbrida, pero priorizamos los **Mocks** para estabilidad y velocidad en desarrollo local.

- **Mocks (`page.route`)**: Interceptamos las peticiones al backend APIs (`/auth`, `/edificios`) para simular respuestas. Esto nos permite probar casos extremos (errores, servidores caídos) sin depender de la base de datos real.
- **Auth Bypass**: Inyectamos el token en `localStorage` o simulamos la cookie para no tener que loguearnos en cada test de UI.

## 4. Cómo crear un Test Manualmente

La estructura básica de un archivo de test en `tests/` es:

```typescript
import { test, expect } from "@playwright/test";

test("nombre descriptivo del test", async ({ page }) => {
  // 1. Configuración (Mocking)
  await page.route("**/api/endpoint", async (route) => {
    await route.fulfill({ json: { data: "mocked" } });
  });

  // 2. Navegación
  await page.goto("http://localhost:5173/ruta");

  // 3. Interacción (Actions)
  // Usar siempre localizadores accesibles (Role, Label, Text)
  await page.getByRole("button", { name: "Guardar" }).click();
  await page.getByLabel("Correo").fill("usuario@test.com");

  // 4. Aserciones (Assertions)
  await expect(page.getByText("Guardado con éxito")).toBeVisible();
});
```

## 5. Cómo crear Tests usando IA (La forma rápida)

Tenemos dos formas principales de usar IA para acelerar el testing:

### A. Playwright Codegen (Generación Automática)

Playwright tiene una "IA" básica (grabadora) integrada.

1.  Ejecuta: `npx playwright codegen localhost:5173`
2.  Navega y haz clic en la ventana que se abre.
3.  Playwright generará el código por ti en la otra ventana.
4.  Copia ese código y refínalo (añade mocks y aserciones mejores).

### B. Asistentes de Código (Cursor/Windsurf/ChatGPT/Claude/Modelos Local)

Esta es la forma más potente si ya tienes el código del componente.

**Prompt Efectivo para Testing:**

> "Actúa como un experto en QA Automation con Playwright.
>
> 1. Analiza el componente `Authentication.tsx` que te adjunto.
> 2. Crea un test E2E (`auth.spec.ts`) que cubra:
>    - Login exitoso.
>    - Error de credenciales inválidas.
> 3. **Importante**: Genera los MOCKS necesarios para la API. Asume que el backend responde en `/api/auth/login`. No quiero depender del backend real.
> 4. Usa selectores robustos como `getByRole` y `getByLabel`."

**Ventajas de usar IA:**

- **Generación de Mocks**: La IA es excelente generando objetos JSON complejos para mockear respuestas de API basándose en tus interfaces de TypeScript.
- **Casos Borde**: Puedes pedirle "Genérame un test donde el archivo subido sea un PDF corrupto de 0 bytes" y escribirá el escenario.

## 6. Buenas Prácticas del Equipo

1.  **Selectores**: Evita XPaths o selectores CSS complejos (`div > div > span`). Usa `getByRole('button', { name: '...' })`.
2.  **Idempotencia**: Los tests deben poder correr mil veces sin fallar. No dependas de datos que otro test haya creado en la DB; usa Mocks.
3.  **Timeouts**: No uses `page.waitForTimeout(5000)`. Usa `expect().toBeVisible()` que espera dinámicamente.

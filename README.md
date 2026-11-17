# SaberData Colombia — Frontend

Interfaz web del proyecto de aula de *Desarrollo Web Avanzado*. Consume la API del backend
(`../saberdata`) para explorar los resultados Saber 11 (ICFES 2022-4) y conversar con el asistente.

**Stack:** React 19 · TypeScript · Vite · Material UI 9 · React Router 8 · TanStack Query 5 · MUI X Charts.

## Cómo arrancar

Requisitos: Node.js 20.19 o superior y el backend corriendo en `http://localhost:8090`.

```bash
npm install
npm run dev        # http://localhost:5173
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Revisa los tipos con `tsc` y genera `dist/` |
| `npm run preview` | Sirve el resultado de `build` |
| `npm run lint` | Análisis estático con oxlint |

**Configuración:** `VITE_API_URL` (por defecto `http://localhost:8090`). Cópiala de `.env.example` a
`.env.local` si necesitas cambiarla.

> El puerto `5173` es fijo (`strictPort`): el backend solo permite CORS desde ese origen
> (`CORS_ALLOWED_ORIGINS`). Si está ocupado, Vite falla en vez de cambiar de puerto.

## Arquitectura

Organización **por funcionalidad** (*feature-based*): cada carpeta de `features/` contiene todo lo suyo
—pantallas, componentes, hooks y acceso a la API—, de modo que una funcionalidad se entiende, se prueba y se
cambia sin tocar las demás. Es el mismo criterio por capas que usa el backend (controlador → servicio →
repositorio), aplicado al cliente.

```
src/
├── api/                  # Contrato y transporte con el backend
│   ├── tipos.ts          #   DTOs (espejo de com.saberdata.dto)
│   └── client.ts         #   fetch + JWT + errores → ApiError
├── app/                  # Composición de la aplicación
│   ├── Providers.tsx     #   tema → caché → rutas → sesión
│   ├── App.tsx           #   mapa de rutas y guardias
│   └── theme.ts          #   tokens de diseño (colores, tipografía, forma)
├── components/           # Piezas compartidas (AppShell, páginas genéricas)
└── features/
    ├── auth/             # login, registro, sesión, guardias de ruta
    ├── estadisticas/     # panel y gráficos
    ├── resultados/       # tabla paginada con filtros
    ├── chat/             # asistente
    └── admin/            # usuarios (solo ADMIN)
```

### Patrones aplicados

| Patrón | Dónde | Para qué |
|---|---|---|
| **Feature modules** | `features/*` | Cohesión: cada funcionalidad es autónoma |
| **Capa de servicios (Gateway/Repository)** | `*Api.ts` | Solo habla HTTP; la UI nunca llama a `fetch` |
| **Custom Hooks** | `use*.ts` | Lógica de la pantalla reutilizable y separada de la vista |
| **Server state con TanStack Query** | hooks de datos | Caché, estados de carga y error, reintentos |
| **Provider / Context** | `AuthProvider` | Estado global mínimo: la sesión |
| **Route Guards** | `guards.tsx` | `RequiereSesion`, `RequiereAdmin`, `SoloInvitados` |
| **Composición + Theming** | `theme.ts`, MUI | Apariencia coherente desde un único lugar |
| **Contenedor / Presentacional** | `*Page` vs componentes | La página orquesta datos; los componentes solo dibujan |

Flujo de una pantalla de datos: `Page` → hook (`useXxx`, TanStack Query) → `xxxApi` → `api/client` → backend.

### Seguridad

* El JWT se guarda en `localStorage` (con respaldo en memoria) y se envía en `Authorization: Bearer`.
* Si la API responde `401` a una petición con token, la sesión se cierra sola; también al vencer el token.
* Que el frontend oculte una pantalla de ADMIN es solo comodidad: **el backend valida el rol en cada petición**.
* `localStorage` es legible por cualquier script de la página (XSS). Para un proyecto de aula es aceptable;
  en producción se usaría una cookie `HttpOnly`.

## Estado

| Pantalla | Estado |
|---|---|
| Login y registro | Hecha (validación igual a la del backend) |
| Marco con menú, rutas protegidas, rol ADMIN | Hecho |
| Panel de estadísticas con gráficos | Hecho (KPIs, dona general, barras por 5 agrupaciones) |
| Resultados (tabla con filtros y paginación) | Hecho |
| Chat con respuesta en tiempo real (SSE) | Hecho |
| Usuarios (ADMIN) | Hecho (lista de solo lectura) |

# Karmaverde — Documentación técnica (ARCHITECTURE.md)

Referencia técnica completa del sistema: stack, vistas, componentes, estado,
endpoints PHP, esquema MySQL y estructura de archivos.

---

## 1. Visión general del proyecto

**Karmaverde** es una aplicación web mobile-first para escuelas, orientada al
reciclaje y la recuperación de materiales. Los **alumnos** escanean materiales
con la cámara del teléfono, acumulan puntos, los canjean por premios, consultan
el ranking, ubican puntos verdes en un mapa y aprenden con guías y el "viaje del
reciclaje". Los **creadores** (docentes/administradores) gestionan premios,
guías educativas y las etapas del circuito, y consultan métricas.

### Stack

| Capa           | Tecnología                                                                                |
| -------------- | ----------------------------------------------------------------------------------------- |
| Frontend       | React 19 + TypeScript, TanStack Start v1 (TanStack Router, file-based routing), Vite 7    |
| Estilos        | Tailwind CSS v4 (`src/styles.css`, tokens `oklch`), design system "papercraft", shadcn/ui |
| Mapa           | Leaflet + OpenStreetMap (`react-leaflet`)                                                 |
| Cámara         | Web API `navigator.mediaDevices.getUserMedia` (cámara trasera)                            |
| Backend        | PHP ≥ 8 (Apache vía XAMPP/WAMP/Laragon/MAMP), API REST en `php-api/`                      |
| Base de datos  | MySQL / MariaDB (`karmaverde`, utf8mb4), administrada con phpMyAdmin                      |
| Sesión         | Sesiones nativas PHP (`PHPSESSID`) + `fetch(credentials: "include")`                      |
| Modo prototipo | `localStorage` cuando `VITE_API_BASE_URL` no está definida                                |

> El preview de Lovable corre en Cloudflare Workers y **no ejecuta PHP**: el
> backend vive en tu servidor local. Sin `VITE_API_BASE_URL`, la app funciona
> íntegra en modo simulación con las mismas reglas de negocio.

---

## 2. Interfaz y frontend

### 2.1 Vistas / páginas

| Ruta                 | Archivo                      | Propósito                                                                                                                               |
| -------------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                  | `src/routes/index.tsx`       | Landing + login/registro unificado. Toggle de rol (alumno/creador); el registro de creador exige el código especial `KARMA-VERDE-2026`. |
| `/` (layout)         | `src/routes/_app.tsx`        | Layout autenticado: guarda de sesión y de rol, bottom-nav, `<Outlet />`.                                                                |
| `/alumno`            | `_app.alumno.index.tsx`      | Home del alumno: saludo, puntos, escuela, accesos rápidos.                                                                              |
| `/alumno/mapa`       | `_app.alumno.mapa.tsx`       | Mapa Leaflet con puntos verdes y popups papercraft.                                                                                     |
| `/alumno/escaner`    | `_app.alumno.escaner.tsx`    | Escáner con cámara real del teléfono; suma puntos según material.                                                                       |
| `/alumno/ranking`    | `_app.alumno.ranking.tsx`    | Ranking de alumnos por puntos y canjes.                                                                                                 |
| `/alumno/premios`    | `_app.alumno.premios.tsx`    | Catálogo de premios y canje.                                                                                                            |
| `/alumno/viaje`      | `_app.alumno.viaje.tsx`      | Timeline del viaje del reciclaje (etapas del circuito).                                                                                 |
| `/alumno/aprende`    | `_app.alumno.aprende.tsx`    | Guías educativas en acordeón.                                                                                                           |
| `/creador`           | `_app.creador.index.tsx`     | Dashboard con métricas (premios, guías, etapas, canjes).                                                                                |
| `/creador/premios`   | `_app.creador.premios.tsx`   | CRUD de premios.                                                                                                                        |
| `/creador/educacion` | `_app.creador.educacion.tsx` | CRUD de guías educativas.                                                                                                               |
| `/creador/circuito`  | `_app.creador.circuito.tsx`  | CRUD de etapas del circuito.                                                                                                            |
| `/creador/ranking`   | `_app.creador.ranking.tsx`   | Ranking en solo lectura.                                                                                                                |

Routing por archivos de TanStack Router: los puntos equivalen a barras
(`_app.alumno.mapa.tsx` → `/alumno/mapa`). `src/routeTree.gen.ts` es generado
automáticamente y no se edita.

### 2.2 Componentes clave

| Componente                              | Archivo                                | Rol                                                                                                                            |
| --------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `PaperCard`, `PaperButton`, `PaperTape` | `src/components/paper/Paper.tsx`       | Primitivas del design system papercraft (bordes recortados, sombras multicapa, cinta adhesiva).                                |
| `AppShell`                              | `src/components/layout/AppShell.tsx`   | Cabecera + navegación inferior según rol, contenedor de páginas.                                                               |
| `MapView`                               | `src/components/map/MapView.tsx`       | Mapa Leaflet cargado solo en cliente; marcadores `divIcon` SVG.                                                                |
| `CrudManager`                           | `src/components/forms/CrudManager.tsx` | Formulario + lista genéricos usados por los tres CRUD del panel creador (campos configurables, alta/edición/borrado).          |
| Escáner                                 | `_app.alumno.escaner.tsx`              | Video en vivo con `getUserMedia({ video: { facingMode: "environment" } })`, marco animado y diálogo de confirmación de puntos. |
| shadcn/ui                               | `src/components/ui/*`                  | Base accesible (dialog, accordion, input, sonner, etc.).                                                                       |

### 2.3 Estado y llamadas a API

- **Store central**: `src/lib/store.ts`. Mantiene sesión, premios, guías,
  circuito, puntos verdes y ranking. Expone acciones asíncronas: `login`,
  `register`, `logout`, `sumarPuntos`, `canjearPremio`, `upsert`, `remove`.
- **Doble modo**: cada acción consulta `usingMocks()` de `src/lib/api.ts`.
  Si `VITE_API_BASE_URL` está vacía, opera sobre `localStorage`
  (semillas en `src/lib/mock-data.ts`); si está definida, llama al endpoint PHP
  y, ante fallo de red, degrada a modo local en vez de romper la UI.
- **Cliente HTTP**: `src/lib/api.ts` — `apiFetch()` con
  `credentials: "include"`, headers JSON, parseo tolerante y clase `ApiError`
  (`status = 0` ⇒ backend inaccesible).
- **Tipos compartidos**: `src/lib/types.ts` (`User`, `Premio`, `Guia`,
  `EtapaCircuito`, `PuntoVerde`, `RankingRow`, `Rol`).

Endpoints consumidos desde la interfaz:

`api.register`, `api.login`, `api.logout`, `api.me`, `api.scan`, `api.canjear`,
`api.ranking`, `api.premios.{list,save,remove}`, `api.guias.{list,save,remove}`,
`api.circuito.{list,save,remove}`.

---

## 3. Backend y endpoints

### 3.1 Arquitectura del servidor

- **No** hay Node/Express ni edge functions para la lógica de negocio: el
  backend es **PHP procedural/PDO** servido por Apache.
- Cada endpoint es un archivo `.php` independiente que:
  1. abre sesión (`session_start()`),
  2. emite cabeceras CORS (`Access-Control-Allow-Origin` con el origen exacto
     del frontend y `Access-Control-Allow-Credentials: true`), respondiendo
     vacío al preflight `OPTIONS`,
  3. valida el método y el payload JSON,
  4. usa las funciones SQL de `php-api/queries/*`,
  5. responde `application/json`.
- **Conexión**: `php-api/config/db.php` crea el PDO (`localhost`, base
  `karmaverde`, usuario `root`) y define `KARMAVERDE_CREATOR_CODE`, que debe
  coincidir con `CREATOR_CODE` en `src/lib/store.ts`.
- **Autenticación**: `password_hash`/`password_verify` (bcrypt) y sesión PHP;
  `$_SESSION['user_id']` identifica al usuario en cada request.
- El proyecto React se sirve con TanStack Start (Vite / Worker) únicamente como
  frontend SSR; no expone rutas de API propias.

### 3.2 Rutas disponibles

Base: `VITE_API_BASE_URL`, p. ej. `http://localhost/karmaverde/php-api`.

#### Auth

| Método | Ruta                 | Entrada                                                                                                                                                         | Respuesta                                                                                                                                                                                |
| ------ | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/auth/register.php` | `{ nombre, email, password, rol: "alumno"\|"creador", escuela, codigo? }` — `codigo` obligatorio y validado contra `KARMAVERDE_CREATOR_CODE` si `rol="creador"` | `201 { user: { id, nombre, email, rol, escuela, puntos, canjes } }` · errores: `400 { error }` (datos inválidos), `403 { error }` (código incorrecto), `409 { error }` (email existente) |
| POST   | `/auth/login.php`    | `{ email, password }`                                                                                                                                           | `200 { user: {...} }` · `401 { error: "Credenciales inválidas" }`                                                                                                                        |
| POST   | `/auth/logout.php`   | —                                                                                                                                                               | `200 { ok: true }`                                                                                                                                                                       |
| GET    | `/auth/me.php`       | — (cookie de sesión)                                                                                                                                            | `200 { user: {...} \| null }`                                                                                                                                                            |

#### Alumno (requiere sesión con rol `alumno`)

| Método | Ruta                  | Entrada                                | Respuesta                                                                                   |
| ------ | --------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------- |
| POST   | `/alumno/scan.php`    | `{ material: string, puntos: number }` | `200 { ok: true, puntos: <total del usuario> }` · `401 { error }`                           |
| POST   | `/alumno/canjear.php` | `{ premio_id: number\|string }`        | `200 { ok: true, puntos, canjes }` · `400 { error: "Puntos insuficientes" \| "Sin stock" }` |
| GET    | `/alumno/ranking.php` | —                                      | `200 [ { id, nombre, escuela, puntos, canjes } ]` ordenado por `puntos DESC`                |

#### Creador (requiere sesión con rol `creador` para escritura)

| Método | Ruta                            | Entrada                                                        | Respuesta                                                                                |
| ------ | ------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| GET    | `/creador/premios.php`          | —                                                              | `200 [ { id, nombre, descripcion, puntos, stock, imagen } ]`                             |
| POST   | `/creador/premios.php`          | `{ id?, nombre, descripcion, puntos, stock, imagen }`          | `200 { ...premio }` (alta si no hay `id`, edición si lo hay)                             |
| DELETE | `/creador/premios.php?id=<id>`  | query `id`                                                     | `200 { ok: true }`                                                                       |
| GET    | `/creador/guias.php`            | —                                                              | `200 [ { id, titulo, categoria, contenido, icono } ]`                                    |
| POST   | `/creador/guias.php`            | `{ id?, titulo, categoria, contenido, icono }`                 | `200 { ...guia }`                                                                        |
| DELETE | `/creador/guias.php?id=<id>`    | query `id`                                                     | `200 { ok: true }`                                                                       |
| GET    | `/creador/circuito.php`         | —                                                              | `200 [ { id, orden, titulo, descripcion, estado, imagen, video } ]` ordenado por `orden` |
| POST   | `/creador/circuito.php`         | `{ id?, orden, titulo, descripcion, estado, imagen?, video? }` | `200 { ...etapa }`                                                                       |
| DELETE | `/creador/circuito.php?id=<id>` | query `id`                                                     | `200 { ok: true }`                                                                       |

Formato de error uniforme: `{ "error": "mensaje legible" }` con el código HTTP
correspondiente (400/401/403/404/409/500).

---

## 4. Base de datos y modelado

**Motor:** MySQL / MariaDB, base `karmaverde`, `utf8mb4_unicode_ci`, InnoDB.
Script: `php-api/sql/schema.sql`. Guía de importación: `DATABASE_GUIDE.md`.

### 4.1 Tablas

**`usuarios`**

| Columna         | Tipo                     | Notas                     |
| --------------- | ------------------------ | ------------------------- |
| `id`            | INT AI                   | PK                        |
| `nombre`        | VARCHAR(100)             | NOT NULL                  |
| `email`         | VARCHAR(120)             | NOT NULL, UNIQUE          |
| `password_hash` | VARCHAR(255)             | bcrypt                    |
| `rol`           | ENUM('alumno','creador') | NOT NULL                  |
| `escuela`       | VARCHAR(120)             | NOT NULL                  |
| `puntos`        | INT                      | DEFAULT 0                 |
| `canjes`        | INT                      | DEFAULT 0                 |
| `creado_en`     | DATETIME                 | DEFAULT CURRENT_TIMESTAMP |

**`premios`** — `id` PK · `nombre` VARCHAR(120) · `descripcion` TEXT ·
`puntos` INT · `stock` INT DEFAULT 0 · `imagen` VARCHAR(255)

**`guias`** — `id` PK · `titulo` VARCHAR(150) · `categoria` VARCHAR(60) ·
`contenido` TEXT · `icono` VARCHAR(10)

**`circuito`** — `id` PK · `orden` INT · `titulo` VARCHAR(150) ·
`descripcion` TEXT · `estado` ENUM('activa','en_proceso','pendiente') ·
`imagen` VARCHAR(255) · `video` VARCHAR(255)

**`puntos_verdes`** — `id` PK · `nombre` VARCHAR(150) · `escuela` VARCHAR(120) ·
`lat` DECIMAL(10,7) · `lng` DECIMAL(10,7) · `materiales` VARCHAR(255) ·
`puntos_acumulados` INT DEFAULT 0

**`scans`** — `id` PK · `usuario_id` INT FK → `usuarios.id` (ON DELETE CASCADE) ·
`material` VARCHAR(60) · `puntos` INT · `fecha` DATETIME DEFAULT NOW

**`canjes`** — `id` PK · `usuario_id` INT FK → `usuarios.id` (CASCADE) ·
`premio_id` INT FK → `premios.id` (CASCADE) · `fecha` DATETIME DEFAULT NOW

### 4.2 Relaciones

```text
usuarios (1) ──< scans  (N)     un alumno registra muchos escaneos
usuarios (1) ──< canjes (N)     un alumno realiza muchos canjes
premios  (1) ──< canjes (N)     un premio puede canjearse muchas veces
```

`premios`, `guias`, `circuito` y `puntos_verdes` son catálogos independientes,
escritos solo desde el panel de creador.

---

## 5. Estructura de archivos

```text
.
├── ARCHITECTURE.md              # este documento
├── DATABASE_GUIDE.md            # guía phpMyAdmin + esquema
├── .env                         # VITE_API_BASE_URL (comentada = modo local)
├── vite.config.ts               # build Vite 7 + TanStack Start
├── components.json              # config shadcn/ui
│
├── src/
│   ├── styles.css               # tokens oklch, texturas y animaciones papercraft
│   ├── router.tsx               # creación del router
│   ├── start.ts / server.ts     # entradas TanStack Start
│   ├── routeTree.gen.ts         # generado — no editar
│   │
│   ├── routes/
│   │   ├── __root.tsx           # fuentes, CSS de Leaflet, meta, providers
│   │   ├── index.tsx            # landing + login/registro
│   │   ├── _app.tsx             # layout autenticado + guarda de rol
│   │   ├── _app.alumno.index.tsx
│   │   ├── _app.alumno.mapa.tsx
│   │   ├── _app.alumno.escaner.tsx
│   │   ├── _app.alumno.ranking.tsx
│   │   ├── _app.alumno.premios.tsx
│   │   ├── _app.alumno.viaje.tsx
│   │   ├── _app.alumno.aprende.tsx
│   │   ├── _app.creador.index.tsx
│   │   ├── _app.creador.premios.tsx
│   │   ├── _app.creador.educacion.tsx
│   │   ├── _app.creador.circuito.tsx
│   │   └── _app.creador.ranking.tsx
│   │
│   ├── components/
│   │   ├── paper/Paper.tsx      # PaperCard, PaperButton, PaperTape
│   │   ├── layout/AppShell.tsx  # shell + bottom nav
│   │   ├── map/MapView.tsx      # Leaflet (client-only)
│   │   ├── forms/CrudManager.tsx
│   │   └── ui/*                 # shadcn/ui
│   │
│   ├── hooks/use-mobile.tsx
│   └── lib/
│       ├── api.ts               # apiFetch, ApiError, endpoints tipados
│       ├── store.ts             # estado global + CREATOR_CODE + modo dual
│       ├── mock-data.ts         # semillas para modo prototipo
│       ├── types.ts             # modelos de dominio
│       └── utils.ts
│
└── php-api/                     # backend PHP (se copia a htdocs/ o www/)
    ├── README.md
    ├── config/db.php            # PDO + KARMAVERDE_CREATOR_CODE
    ├── sql/schema.sql           # 7 tablas
    ├── queries/
    │   ├── usuarios.php         # crearUsuario, usuarioPorEmail, usuarioPorId, sumarPuntos, obtenerRanking
    │   └── premios.php          # CRUD + canjearPremio
    ├── auth/{register,login,logout,me}.php
    ├── alumno/{scan,canjear,ranking}.php
    └── creador/{premios,guias,circuito}.php
```

### Configuración y ejecución

```bash
# Frontend
bun install && bun run dev          # http://localhost:8080

# Backend: copiar php-api/ a htdocs/karmaverde/ y en .env:
# VITE_API_BASE_URL=http://localhost/karmaverde/php-api
```

# Karmaverde — Plan de implementación

App web mobile-first con estética **papercraft** (verdes ecológicos + marrones tierra) para reciclaje en escuelas. Frontend React + TanStack Start en Lovable; el backend PHP/MySQL lo alojas tú aparte y dejo los `fetch` listos con una capa de API centralizada.

## 1. Sistema de diseño papercraft

- Tokens en `src/styles.css` (oklch) con paleta:
  - Verdes: musgo, hoja, menta, oliva profundo
  - Marrones: kraft, cartón, tierra, sepia
  - Acentos: crema papel, tinta oscura
- Texturas: fondo con gradiente sutil + `data:` SVG de grano/fibra de papel.
- Sombras multicapa (`--shadow-paper`, `--shadow-cutout`) simulando recortes apilados.
- Bordes irregulares con `clip-path` SVG reutilizable + utilidad `.paper-card`.
- Tipografía: display manuscrita (Caveat Brush o Fraunces) + sans legible (Nunito) vía `<link>` en `__root.tsx`.
- Animaciones keyframes: `float`, `paper-pop`, `wiggle`, `stamp`; utilidades `hover-float`, `active-stamp`.

## 2. Estructura de archivos

```text
src/
  routes/
    __root.tsx           (fuentes, meta, providers)
    index.tsx            (landing + login/registro)
    _app.tsx             (layout autenticado con bottom-nav papercraft)
    _app.alumno.index.tsx        (home alumno)
    _app.alumno.mapa.tsx         (Leaflet: puntos verdes)
    _app.alumno.escaner.tsx      (simulación cámara + carga puntos)
    _app.alumno.ranking.tsx
    _app.alumno.premios.tsx
    _app.alumno.viaje.tsx        (timeline reciclaje)
    _app.alumno.aprende.tsx
    _app.creador.index.tsx
    _app.creador.premios.tsx     (CRUD)
    _app.creador.educacion.tsx   (CRUD)
    _app.creador.circuito.tsx    (CRUD)
    _app.creador.ranking.tsx
  components/
    paper/  (PaperCard, PaperButton, PaperTab, PaperBadge, TornEdge)
    layout/ (AppShell, BottomNav, TopBar)
    icons/  (íconos SVG papercraft animados)
    forms/  (FormRow, ImageUpload)
  lib/
    api.ts               (cliente fetch a PHP externo, base URL vía VITE_API_BASE_URL)
    auth.ts              (sesión mock + hook useAuth, listo para reemplazar por PHP session)
    mock-data.ts         (datos semilla para prototipar sin backend)
    types.ts             (User, Premio, Guia, EtapaCircuito, PuntoVerde, RankingRow)
  styles.css
```

Para el backend PHP entrego además una carpeta `php-api/` en el repo con estructura sugerida (no se ejecuta en Lovable, es referencia para tu servidor):

```text
php-api/
  config/db.php
  auth/{login,register,logout,me}.php
  alumno/{puntos,ranking,premios,circuito,guias,mapa}.php
  creador/{premios,guias,circuito}.php   (GET/POST/PUT/DELETE)
  uploads/
  sql/schema.sql
```

## 3. Roles y flujo

- `POST /auth/login` devuelve `{ user: { id, nombre, rol: 'alumno'|'creador', escuela } }`.
- `useAuth()` guarda sesión en `localStorage` (prototipo) y expone `login/logout`.
- `_app.tsx` (guard): si no hay sesión → redirige a `/`. Redirige `alumno`→`/alumno`, `creador`→`/creador` y bloquea cruce de rutas.
- Login/registro unificado en `index.tsx` con toggle papercraft.

## 4. Panel Alumno (tarjetas recortadas)

- **Home**: saludo, puntos, escuela, accesos rápidos animados.
- **Mapa**: Leaflet + OSM, marcadores custom SVG hoja, popup papercraft con datos de escuela.
- **Escáner**: viewport simulado con marco animado, botón "Escanear" → dialog papercraft que suma puntos (mock) y anima confetti de papel.
- **Ranking**: tabla ordenable por puntos y por canjes, top 3 con medallas recortadas.
- **Premios**: grid de tarjetas con imagen, puntos requeridos, botón "Canjear".
- **Viaje del reciclaje**: timeline vertical con etapas (recolección → planta → nuevo producto), cada nodo es un recorte con imagen/video.
- **Aprende a reciclar**: acordeón papercraft con guías y tips.

## 5. Panel Creador

- Dashboard con métricas (totales de premios, guías, canjes).
- CRUD (form + lista) para Premios, Guías educativas y Etapas del circuito, con subida de imagen/URL de video.
- Vista de ranking en solo lectura.
- Todos los formularios llaman a `api.ts` (endpoints PHP); en modo prototipo escriben a `mock-data` en memoria.

## 6. Mapa (Leaflet)

- `bun add leaflet react-leaflet @types/leaflet`.
- Cargar CSS de Leaflet vía `<link>` en `__root.tsx` (no `@import` remoto en styles.css).
- Íconos custom con `L.divIcon` usando SVG papercraft.

## 7. Integración con PHP externo

- `VITE_API_BASE_URL` configurable; por defecto usa mocks si no está definida.
- `lib/api.ts` con `apiFetch(path, opts)` que agrega `credentials: 'include'` para cookies de sesión PHP y maneja JSON/errores.
- Documento `php-api/README.md` con contrato de endpoints y ejemplos de payloads.

## 8. Entregable de esta iteración

1. Sistema de diseño papercraft + tokens + animaciones.
2. Shell autenticado, login/registro, guardas de rol.
3. Panel Alumno completo con datos mock (mapa Leaflet funcional).
4. Panel Creador completo con CRUD sobre mocks (persistencia en memoria + localStorage).
5. Capa `api.ts` lista para conectar a PHP + carpeta `php-api/` con esquema SQL y endpoints de referencia.
6. Meta/SEO por ruta y viewport preview en mobile.

## Notas técnicas

- Sin PHP ejecutándose en Lovable: el runtime aquí es Worker/React. El código PHP es entregable estático de referencia para tu hosting.
- Rutas TanStack con file-based routing (dots = slashes); layout `_app` con `<Outlet />`.
- Todo color vía tokens semánticos, nunca clases `bg-white`/`text-black` sueltas.
- Mobile-first; bottom nav en alumno, sidebar colapsable en creador.

# Karmaverde — Guía de Base de Datos (MySQL + phpMyAdmin)

Esta guía explica cómo levantar la base `karmaverde` en tu servidor MySQL
local (XAMPP / WAMP / Laragon / MAMP) y conectarla con la API PHP incluida
en `php-api/`.

---

## 1. Requisitos

- **XAMPP / WAMP / Laragon / MAMP** con Apache + MySQL + PHP ≥ 8.0.
- **phpMyAdmin** activo (viene incluido en todos los paquetes anteriores).
- Credenciales por defecto:
  - **Usuario:** `root`
  - **Contraseña:** _(vacía)_
  - **Host:** `localhost`

Si cambiaste estas credenciales, editá `php-api/config/db.php`.

---

## 2. Crear la base de datos

1. Iniciá Apache + MySQL desde el panel de XAMPP/WAMP.
2. Abrí <http://localhost/phpmyadmin>.
3. Click en la pestaña **Bases de datos**.
4. Nombre: `karmaverde` — Cotejamiento: `utf8mb4_unicode_ci`.
5. Click en **Crear**.

---

## 3. Importar el esquema SQL

1. En phpMyAdmin, seleccioná la base `karmaverde` (menú izquierdo).
2. Click en la pestaña **Importar**.
3. En **Archivo a importar**, elegí `php-api/sql/schema.sql`.
4. Dejá el formato en **SQL** y click en **Importar** (abajo).
5. Deberías ver el mensaje verde _“La importación se ha ejecutado exitosamente”_
   y las 7 tablas listadas a la izquierda.

> Alternativa por línea de comandos:
>
> ```bash
> mysql -u root karmaverde < php-api/sql/schema.sql
> ```

---

## 4. Esquema de tablas

```sql
-- ===== USUARIOS =====
CREATE TABLE usuarios (
  id            INT PRIMARY KEY AUTO_INCREMENT,
  nombre        VARCHAR(100) NOT NULL,
  email         VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol           ENUM('alumno','creador') NOT NULL,
  escuela       VARCHAR(120) NOT NULL,
  puntos        INT NOT NULL DEFAULT 0,
  canjes        INT NOT NULL DEFAULT 0,
  creado_en     DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===== PREMIOS (editables por creadores) =====
CREATE TABLE premios (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  nombre      VARCHAR(120) NOT NULL,
  descripcion TEXT,
  puntos      INT NOT NULL,
  stock       INT NOT NULL DEFAULT 0,
  imagen      VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===== GUÍAS educativas =====
CREATE TABLE guias (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  titulo     VARCHAR(150) NOT NULL,
  categoria  VARCHAR(60),
  contenido  TEXT,
  icono      VARCHAR(10)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===== CIRCUITO (viaje del reciclaje) =====
CREATE TABLE circuito (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  orden       INT NOT NULL,
  titulo      VARCHAR(150) NOT NULL,
  descripcion TEXT,
  estado      ENUM('activa','en_proceso','pendiente') DEFAULT 'pendiente',
  imagen      VARCHAR(255),
  video       VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===== PUNTOS VERDES (mapa Leaflet) =====
CREATE TABLE puntos_verdes (
  id                 INT PRIMARY KEY AUTO_INCREMENT,
  nombre             VARCHAR(150) NOT NULL,
  escuela            VARCHAR(120),
  lat                DECIMAL(10,7) NOT NULL,
  lng                DECIMAL(10,7) NOT NULL,
  materiales         VARCHAR(255),
  puntos_acumulados  INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===== SCANS (historial del escáner) =====
CREATE TABLE scans (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  material   VARCHAR(60) NOT NULL,
  puntos     INT NOT NULL,
  fecha      DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_scans_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===== CANJES (historial de premios) =====
CREATE TABLE canjes (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  premio_id  INT NOT NULL,
  fecha      DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_canjes_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_canjes_premio
    FOREIGN KEY (premio_id)  REFERENCES premios(id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 5. Relaciones (claves foráneas)

```
usuarios (1) ───< scans   (muchos)   ← cada scan pertenece a un alumno
usuarios (1) ───< canjes  (muchos)   ← cada canje pertenece a un alumno
premios  (1) ───< canjes  (muchos)   ← cada canje refiere un premio
```

- `scans.usuario_id → usuarios.id` (ON DELETE CASCADE)
- `canjes.usuario_id → usuarios.id` (ON DELETE CASCADE)
- `canjes.premio_id  → premios.id` (ON DELETE CASCADE)

Las tablas `premios`, `guias`, `circuito` y `puntos_verdes` son
**independientes** — sólo los **creadores** pueden crearlas/editarlas
(desde el panel `/creador/...`).

---

## 6. Conectar el frontend

1. Copiá la carpeta `php-api/` dentro de `htdocs/` (XAMPP) o `www/` (WAMP).
2. En la raíz del proyecto React, editá `.env`:
   ```
   VITE_API_BASE_URL=http://localhost/karmaverde/php-api
   ```
3. Reiniciá el dev server (`bun run dev`).
4. Al registrarte, los datos irán a la tabla `usuarios` de MySQL en lugar
   de a `localStorage`.

Si dejás `VITE_API_BASE_URL` vacío, la app sigue funcionando en modo
prototipo (sin backend) con exactamente las mismas reglas de negocio.

---

## 7. Verificar que funciona

- **phpMyAdmin → usuarios → Examinar**: tras registrar una cuenta, deberías
  ver la fila con `password_hash` (bcrypt) y `rol`.
- **Consola del navegador → Network**: las llamadas van a
  `http://localhost/.../php-api/auth/register.php` con cookies enviadas.
- Errores de **CORS**: verificá que cada endpoint PHP envíe
  `Access-Control-Allow-Origin: http://localhost:8080`
  y `Access-Control-Allow-Credentials: true`.

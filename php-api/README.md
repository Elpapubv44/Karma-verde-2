# Karmaverde — API PHP (referencia abierta)

Este directorio contiene el **backend PHP** de Karmaverde. Se aloja en tu
servidor local (XAMPP / WAMP / Laragon / MAMP) y expone endpoints REST
que el frontend React consume vía `fetch` con `credentials: "include"`.

> ℹ️ Lovable corre en Cloudflare Workers y **no ejecuta PHP** — esta carpeta
> es la base para tu servidor local o VPS.

---

## 1. Levantar el entorno local

1. Instalá **XAMPP** (recomendado) desde <https://www.apachefriends.org>.
2. Iniciá **Apache** y **MySQL** desde el panel de XAMPP.
3. Copiá esta carpeta `php-api/` dentro de:
   - XAMPP: `C:\xampp\htdocs\karmaverde\php-api`
   - WAMP: `C:\wamp64\www\karmaverde\php-api`
   - MAMP: `/Applications/MAMP/htdocs/karmaverde/php-api`
4. Verificá que abre <http://localhost/karmaverde/php-api/auth/me.php>
   (debería devolver JSON `{ "user": null }`).

---

## 2. Base de datos

Ver [`../DATABASE_GUIDE.md`](../DATABASE_GUIDE.md) para el paso a paso
completo. En resumen:

- Base: **`karmaverde`** (utf8mb4).
- Usuario por defecto: **`root`**, contraseña **vacía**.
- Importar `php-api/sql/schema.sql` desde phpMyAdmin.

Si cambiás credenciales, editá **`config/db.php`**:

```php
$host     = 'localhost';
$dbname   = 'karmaverde';
$username = 'root';
$password = '';
define('KARMAVERDE_CREATOR_CODE', 'KARMA-VERDE-2026');
```

> ⚠️ `KARMAVERDE_CREATOR_CODE` debe coincidir con `CREATOR_CODE` en
> `src/lib/store.ts` del frontend. Cambialos juntos.

---

## 3. Conectar el frontend

En la raíz del proyecto React, editá `.env`:

```
VITE_API_BASE_URL=http://localhost/karmaverde/php-api
```

Reemplazá `karmaverde` por el nombre de carpeta que uses en `htdocs/`.
Reiniciá `bun run dev`. Sin esa variable, el frontend sigue en modo
prototipo (localStorage).

---

## 4. Estructura de archivos

```
php-api/
  config/
    db.php               # Conexión PDO + KARMAVERDE_CREATOR_CODE
  sql/
    schema.sql           # Esquema completo (7 tablas)
  queries/               # SQL puro reutilizable
    usuarios.php
    premios.php
  auth/
    register.php         # POST — valida código para 'creador'
    login.php            # POST — verifica password_hash
    logout.php           # POST — session_destroy
    me.php               # GET  — devuelve sesión actual
  alumno/
    scan.php             # POST { material, puntos }
    ranking.php          # GET
    canjear.php          # POST { premio_id }
  creador/
    premios.php          # GET / POST / DELETE
    guias.php
    circuito.php
```

---

## 5. Sesión y CORS

Cada endpoint PHP debe empezar con:

```php
session_start();
header('Access-Control-Allow-Origin: http://localhost:8080'); // origen exacto del frontend
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;
```

El frontend ya envía `credentials: "include"` (ver `src/lib/api.ts`).

---

## 6. Tabla de equivalencias — endpoints

| Frontend (React)                  | Endpoint PHP               | Función SQL         | Tabla                             |
| --------------------------------- | -------------------------- | ------------------- | --------------------------------- |
| `api.register(...)`               | `POST /auth/register.php`  | `crearUsuario()`    | `usuarios`                        |
| `api.login(...)`                  | `POST /auth/login.php`     | `usuarioPorEmail()` | `usuarios`                        |
| `api.logout()`                    | `POST /auth/logout.php`    | —                   | (sesión)                          |
| `api.me()`                        | `GET  /auth/me.php`        | `usuarioPorId()`    | `usuarios`                        |
| `api.scan({ material, puntos })`  | `POST /alumno/scan.php`    | `sumarPuntos()`     | `usuarios` + `scans`              |
| `api.canjear(premio_id)`          | `POST /alumno/canjear.php` | `canjearPremio()`   | `usuarios` + `premios` + `canjes` |
| `api.ranking()`                   | `GET  /alumno/ranking.php` | `obtenerRanking()`  | `usuarios` (rol=alumno)           |
| `api.premios.list/save/remove()`  | `/creador/premios.php`     | CRUD                | `premios`                         |
| `api.guias.list/save/remove()`    | `/creador/guias.php`       | CRUD                | `guias`                           |
| `api.circuito.list/save/remove()` | `/creador/circuito.php`    | CRUD                | `circuito`                        |

---

## 7. Modo simulación vs producción

El store del frontend (`src/lib/store.ts`) detecta automáticamente si
`VITE_API_BASE_URL` está definida:

- **Vacía** → todo se guarda en `localStorage` (útil para diseñar sin backend).
- **Definida** → cada acción dispara `fetch()` al endpoint PHP correspondiente
  y sincroniza la UI con la respuesta real.

La transición es transparente: no hace falta tocar componentes.

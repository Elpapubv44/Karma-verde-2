# Análisis Completo de Karmaverde — Hallazgos y Cambios Necesarios

> **Fecha del análisis:** 2026-09-02  
> **Proyecto:** Karmaverde v2 (Karma-verde-2-main)  
> **Stack:** React + TanStack Start + Zustand + TailwindCSS + Leaflet + PHP/MySQL  
> **Estilo:** Papercraft (verdes ecológicos + marrones tierra)

---

## RESUMEN EJECUTIVO

La app tiene una base sólida con un sistema de diseño papercraft bien definido, cuatro roles de usuario, un backend PHP completo y un frontend React funcional. Sin embargo, hay **gaps significativos** en seguridad, funcionalidades esenciales, pulido estético, integración frontend-backend, accesibilidad y experiencia de usuario que deben resolverse antes de cualquier despliegue en producción.

---

## 1. ESTÉTICA — DETALLES MÍNIMOS QUE FALTAN PULIR

### 1.1. Micro-interacciones y Feedback Visual
| # | Problema | Ubicación | Severidad |
|---|----------|-----------|-----------|
| 1 | **Sin estado de carga (loading states)** en ningún `fetch`. Los botones no muestran spinner ni deshabilitan durante peticiones. | `api.ts`, todos los formularios | 🔴 Alta |
| 2 | **Sin skeleton screens** ni placeholders mientras cargan datos. La UI salta bruscamente de vacío a contenido. | Todas las rutas con `useStore` | 🟡 Media |
| 3 | **Sin toast/notificación** tras acciones exitosas (canje, escaneo, guardado CRUD). El usuario no sabe si funcionó. | Global | 🔴 Alta |
| 4 | **Sin animación de transición** entre rutas. Los cambios de página son instantáneos y bruscos. | `router.tsx` | 🟡 Media |
| 5 | **El escáner QR no tiene animación de escaneo visual** (línea láser, pulso de marco). Solo muestra un div gris estático. | `_app.alumno.escaner.tsx` | 🟡 Media |
| 6 | **Sin confetti o celebración visual** al canjear premio o completar quiz. El gamification pierde impacto. | `_app.alumno.premios.tsx`, `aprende.tsx` | 🟡 Media |
| 7 | **El mapa Leaflet no tiene popup personalizado papercraft**. Usa el popup nativo feo de Leaflet. | `MapView.tsx` | 🟡 Media |
| 8 | **Sin micro-animación en los contadores de puntos**. Al sumar puntos, el número debería animarse (count-up). | `_app.alumno.index.tsx` | 🟢 Baja |
| 9 | **El bottom nav no tiene indicador de ruta activa animado**. Solo cambia de color, sin transición. | `AppShell.tsx` | 🟢 Baja |
| 10 | **Sin efecto hover en tarjetas de premios**. Deberían tener `hover-float` o `hover:scale` sutil. | `_app.alumno.premios.tsx` | 🟢 Baja |

### 1.2. Consistencia Visual
| # | Problema | Ubicación | Severidad |
|---|----------|-----------|-----------|
| 11 | **Inconsistencia en bordes**: algunos usan `rounded-2xl`, otros `rounded-xl`, otros sin redondeo. No hay sistema unificado. | Global | 🟡 Media |
| 12 | **Las imágenes de premios usan emojis como fallback** (`🎁`) en vez de una imagen SVG/placeholder coherente con el tema. | `mock-data.ts`, CRUD premios | 🟡 Media |
| 13 | **El campo "URL imagen" en CRUD premios no tiene preview**. El creador no ve qué imagen está cargando. | `CrudManager.tsx` | 🟡 Media |
| 14 | **Sin dark mode**. La app solo funciona en modo claro; en dispositivos con dark mode forzado se ve mal. | `styles.css` | 🟡 Media |
| 15 | **El error page (`error-page.ts`) está en inglés** y no respeta la estética papercraft del resto de la app. | `src/lib/error-page.ts` | 🟡 Media |
| 16 | **Sin favicon personalizado**. Usa `/favicon.ico` genérico que probablemente no existe. | `__root.tsx` | 🟢 Baja |
| 17 | **Sin PWA manifest ni service worker**. No se puede instalar como app en móvil. | Raíz del proyecto | 🟡 Media |
| 18 | **Las tareas en el panel Asociado no tienen indicador visual de progreso** (solo texto). Debería haber una barra de progreso. | `_app.asociado.logistica.tsx` | 🟡 Media |
| 19 | **El ranking no tiene paginación ni filtro por escuela**. Con 500 alumnos la tabla sería inmanejable. | `_app.alumno.ranking.tsx`, `_app.creador.ranking.tsx` | 🟡 Media |
| 20 | **Sin empty states personalizados**. Cuando no hay datos, solo muestra texto plano gris. Deberían ser ilustraciones papercraft. | Global | 🟢 Baja |

### 1.3. Tipografía y Espaciado
| # | Problema | Ubicación | Severidad |
|---|----------|-----------|-----------|
| 21 | **El `line-height` de los párrafos es muy apretado** en algunas tarjetas (`leading-relaxed` no se aplica consistentemente). | Múltiples rutas | 🟢 Baja |
| 22 | **Los inputs del login no tienen focus ring visible** en modo de alto contraste. | `index.tsx` | 🟡 Media |
| 23 | **El placeholder del input de EcoChat es muy largo** y se corta en móvil. | `EcoChat.tsx` | 🟢 Baja |

---

## 2. FUNCIONES ESENCIALES QUE NO TIENE

### 2.1. Autenticación y Sesión
| # | Función Faltante | Impacto |
|---|------------------|---------|
| 24 | **Sin "Olvidé mi contraseña" / recuperación de cuenta.** | Los usuarios no pueden recuperar acceso. |
| 25 | **Sin "Recordarme" / persistencia de sesión más allá de localStorage.** | Al cerrar el navegador se pierde la sesión. |
| 26 | **Sin verificación de email.** | Cualquiera puede registrarse con email falso. |
| 27 | **Sin logout explícito en el frontend.** | No hay botón de cerrar sesión visible. |
| 28 | **Sin protección CSRF en los endpoints PHP.** | Vulnerable a ataques CSRF. |
| 29 | **Sin rate limiting en login.** | Vulnerable a fuerza bruta. |
| 30 | **Sin historial de sesiones / dispositivos activos.** | No se puede revocar acceso remoto. |

### 2.2. Perfil de Usuario
| # | Función Faltante | Impacto |
|---|------------------|---------|
| 31 | **Sin página de perfil editable.** | El alumno no puede cambiar su nombre, escuela, avatar ni contraseña. |
| 32 | **Sin avatar real / subida de imagen.** | Solo muestra iniciales; no hay carga de foto de perfil. |
| 33 | **Sin historial personal de scans y canjes.** | El alumno no ve qué hizo ni cuándo. |
| 34 | **Sin logros/badges/medallas visibles en el perfil.** | El gamification está incompleto. |

### 2.3. Escáner y QR
| # | Función Faltante | Impacto |
|---|------------------|---------|
| 35 | **El escáner es una simulación visual** (no usa cámara real). No puede escanear códigos QR reales. | Funcionalidad central rota. |
| 36 | **Sin integración con `html5-qrcode` o `zxing`.** | No hay librería de escaneo real. |
| 37 | **Sin historial de códigos escaneados.** | El alumno no ve qué escaneó antes. |
| 38 | **Sin generador de QR para creadores.** | Los creadores no pueden generar códigos QR para los puntos verdes. |
| 39 | **El análisis con Gemini no se conecta al frontend.** | `gemini-qr-analyzer.ts` existe pero no se usa en ninguna ruta. | 🔴 |

### 2.4. Canjes y Premios
| # | Función Faltante | Impacto |
|---|------------------|---------|
| 40 | **Sin carrito de canjes.** | Solo se puede canjear de a un premio por vez. |
| 41 | **Sin confirmación de canje con modal.** | El usuario puede canjear por error sin confirmar. |
| 42 | **Sin notificación de "stock bajo" para creadores.** | No se alerta cuando un premio se agota. |
| 43 | **Sin categorización de premios.** | Todos los premios están en una lista plana. |
| 44 | **Sin búsqueda/filtro de premios.** | Con muchos premios es difícil encontrar uno. |

### 2.5. Mapa y Geolocalización
| # | Función Faltante | Impacto |
|---|------------------|---------|
| 45 | **Sin geolocalización del usuario** (no pide permiso de GPS). | El mapa no centra en la ubicación actual. |
| 46 | **Sin ruta/direcciones hacia puntos verdes.** | No indica cómo llegar. |
| 47 | **Sin filtro de puntos verdes por material.** | No se puede ver solo los que reciben PET, por ejemplo. |
| 48 | **Sin CRUD de puntos verdes en el panel Creador.** | Solo existen en mock-data; no se pueden agregar/editar. |
| 49 | **El mapa no tiene fallback offline** ni tile caching. | Sin internet no funciona. |

### 2.6. Panel Creador / Superior
| # | Función Faltante | Impacto |
|---|------------------|---------|
| 50 | **Sin dashboard con métricas reales** (gráficos, tendencias). | Solo muestra contadores planos. |
| 51 | **Sin exportación de datos** (CSV/Excel de ranking, canjes, etc.). | No se pueden sacar reportes. |
| 52 | **Sin gestión de escuelas como entidad propia.** | Las escuelas son solo strings en usuarios. |
| 53 | **Sin logs de auditoría.** | No se sabe quién hizo qué cambio ni cuándo. |
| 54 | **Sin gestión de temporadas/ciclos escolares.** | Los puntos no se resetean por año/cuatrimestre. |
| 55 | **El panel Superior/config no persiste los flags** (escaner, canjes, mapa, registro). | Son `useState` local; se pierden al recargar. |
| 56 | **Sin panel de notificaciones/mensajes masivos** para enviar avisos a alumnos. | Comunicación unidireccional rota. |

### 2.7. Educación y Quiz
| # | Función Faltante | Impacto |
|---|------------------|---------|
| 57 | **Sin CRUD de preguntas de quiz en el panel Creador.** | Las preguntas están hardcodeadas en `mock-data.ts`. |
| 58 | **Sin sistema de niveles/dificultad en quizzes.** | Todas las preguntas valen 50 pts planos. |
| 59 | **Sin temporizador en quizzes.** | No hay presión ni dinamismo. |
| 60 | **Sin leaderboard de quizzes separado.** | Solo hay ranking general por puntos. |

### 2.8. Circuito / Viaje del Reciclaje
| # | Función Faltante | Impacto |
|---|------------------|---------|
| 61 | **Los videos no se reproducen.** | El campo `video` existe pero no hay reproductor. |
| 62 | **Sin galería de imágenes por etapa.** | Solo una imagen por etapa. |
| 63 | **Sin actualización de estado automática** del circuito. | Los estados son manuales. |

---

## 3. SEGURIDAD — PROBLEMAS CRÍTICOS Y MEDIOS

### 3.1. Frontend
| # | Problema | Riesgo | Ubicación |
|---|----------|--------|-----------|
| 64 | **Las contraseñas se envían en texto plano** al backend (el frontend no hashea nada antes del POST). | Interceptación en red. | `index.tsx` (registro) |
| 65 | **Los códigos de acceso (CREATOR_CODE, SUPERIOR_CODE, ASOCIADO_CODE)** están hardcodeados en el frontend (`store.ts`) como strings planos. | Cualquiera puede leerlos en DevTools y registrarse con rol elevado. | `src/lib/store.ts` |
| 66 | **Sin sanitización de inputs en el chatbot.** | Aunque es local, un payload largo podría causar DoS del render. | `EcoChat.tsx` |
| 67 | **El `localStorage` guarda el usuario completo** incluyendo `rol`, `puntos`, `canjes`. | Fácilmente modificable por el usuario para darse puntos o cambiar de rol. | `src/lib/store.ts` |
| 68 | **Sin Content Security Policy (CSP)** en headers. | Vulnerable a XSS si se inyecta contenido malicioso. | `__root.tsx` |
| 69 | **Las imágenes de premios usan URLs arbitrarias** sin validación ni proxy. | Posible SSRF o carga de imágenes maliciosas. | `CrudManager.tsx`, `premios.tsx` |
| 70 | **Sin validación de formato de email** en frontend (solo HTML5 `type="email"` básico). | Registros con emails inválidos. | `index.tsx` |
| 71 | **Sin validación de fortaleza de contraseña.** | Los usuarios pueden poner "123456". | `index.tsx` |
| 72 | **El token de sesión se guarda en `localStorage`** en vez de `httpOnly` cookie. | Vulnerable a XSS que roba el token. | `src/lib/store.ts` |

### 3.2. Backend PHP
| # | Problema | Riesgo | Ubicación |
|---|----------|--------|-----------|
| 73 | **Sin CORS headers configurados explícitamente** en todos los endpoints. | Posibles errores de integración o bloqueos. | Todos los `.php` |
| 74 | **Sin validación de rol en la mayoría de endpoints PHP.** | Un alumno autenticado podría llamar a endpoints de creador/superior. | `php-api/creador/*.php`, `superior/*.php` |
| 75 | **El endpoint `superior/usuarios.php` tiene la validación de rol comentada/incompleta.** | Cualquiera autenticado puede listar/eliminar usuarios. | `php-api/superior/usuarios.php` línea 14-18 |
| 76 | **Sin prepared statements en algunos lugares** (aunque la mayoría sí los usa). | Riesgo de SQL injection residual. | Revisar todos los `.php` |
| 77 | **Sin rate limiting en ningún endpoint.** | Vulnerable a DoS y scraping masivo. | Global PHP |
| 78 | **Sin logging de errores estructurado.** | Cuando falla algo, no hay trazabilidad. | Global PHP |
| 79 | **Las contraseñas usan `PASSWORD_BCRYPT` pero sin `cost` explícito ni pepper.** | Configuración por defecto; sin capa extra de seguridad. | `php-api/queries/usuarios.php` |
| 80 | **Sin rotación de sesiones** ni regeneración de `session_id` tras login. | Fijación de sesión (session fixation). | `php-api/auth/login.php` |
| 81 | **Sin expiración de sesión configurada** (`session.gc_maxlifetime` por defecto del servidor). | Sesiones potencialmente eternas. | `php-api/auth/*.php` |
| 82 | **Sin validación de `Content-Type`** en los endpoints que reciben JSON. | Posible bypass enviando form-data. | Todos los POST/DELETE |
| 83 | **El endpoint `scan.php` no valida el `material` contra una whitelist.** | Podría inyectarse cualquier string. | `php-api/alumno/scan.php` |
| 84 | **Sin firma digital ni HMAC en los códigos QR generados.** | Los QR pueden ser falsificados fácilmente. | `php-api/alumno/scan_qr.php` |
| 85 | **La tabla `qr_codes` permite insertar cualquier código** sin validación previa. | Ataque de flooding de QR. | `php-api/alumno/scan_qr.php` |
| 86 | **Sin sanitización de output** en los endpoints PHP (aunque usan `json_encode`, los inputs no se escapan al mostrar). | Reflected XSS potencial. | Global PHP |
| 87 | **El archivo `db.php` expone credenciales en texto plano** si el servidor no interpreta PHP. | Fuga de credenciales si se sirve como texto. | `php-api/config/db.php` |
| 88 | **Sin `.htaccess` en `php-api/config/`** para bloquear acceso directo a archivos sensibles. | `db.php` accesible por URL. | `php-api/config/` |
| 89 | **Sin backup automático de base de datos.** | Pérdida de datos irreversible en caso de fallo. | Infraestructura |
| 90 | **Sin HTTPS forzado** ni HSTS headers. | Todo el tráfico en texto plano si no hay SSL. | Infraestructura |

---

## 4. ARQUITECTURA Y CÓDIGO

### 4.1. Frontend React
| # | Problema | Impacto |
|---|----------|---------|
| 91 | **El store de Zustand no tiene persistencia híbrida.** | En modo PHP, los datos mock se mezclan con datos reales sin estrategia clara. | `store.ts` |
| 92 | **Sin React Query / TanStack Query para cacheo de servidor.** | Cada vez que entras a una ruta se vuelven a fetchear los datos. | Global |
| 93 | **El `apiFetch` no tiene timeout ni retry logic.** | Si el servidor PHP tarda o falla, la app se cuelga. | `api.ts` |
| 94 | **Sin manejo de errores de red desconectada.** | Si no hay internet, los errores no son amigables. | `api.ts` |
| 95 | **El `ProjectDossier` tiene un `TODO` sin resolver** sobre mostrar/ocultar el dossier. | Funcionalidad incompleta. | `ProjectDossier.tsx` |
| 96 | **Sin lazy loading de rutas.** | Todo el bundle se carga de una, incluso rutas que el usuario nunca visita. | `router.tsx` |
| 97 | **Sin code splitting por rol.** | Un alumno carga el código del panel creador innecesariamente. | Global |
| 98 | **El `EcoChat` no tiene límite de mensajes.** | El array de mensajes puede crecer infinitamente y causar memory leak. | `EcoChat.tsx` |
| 99 | **Sin debounce en el input del chatbot.** | Cada tecla no dispara nada, pero el form submit tampoco tiene throttle. | `EcoChat.tsx` |
| 100 | **Las animaciones CSS (`float`, `wiggle`) no respetan `prefers-reduced-motion`.** | Problema de accesibilidad para usuarios con vestibulopatías. | `styles.css` |

### 4.2. Backend PHP
| # | Problema | Impacto |
|---|----------|---------|
| 101 | **Sin API REST consistente** (algunos usan POST con body, otros GET con query params, otros DELETE con `$_GET`). | Difícil de mantener y documentar. | Global PHP |
| 102 | **Sin versión de API** (`/v1/`, `/v2/`). | Cambios futuros rompen compatibilidad. | Global PHP |
| 103 | **Sin middleware de autenticación reutilizable.** | Cada endpoint repite la lógica de `session_start()` y validación. | Global PHP |
| 104 | **Sin modelo de datos / ORM.** | Todo es SQL crudo; propenso a errores y difícil de escalar. | Global PHP |
| 105 | **Sin migraciones de base de datos.** | El schema.sql es estático; no hay forma de aplicar cambios incrementales. | `php-api/sql/` |
| 106 | **Sin tests unitarios ni de integración** ni en frontend ni en backend. | Cualquier cambio puede romper algo sin saberlo. | Global |
| 107 | **Sin documentación OpenAPI/Swagger** de los endpoints. | Difícil integrar para terceros o mobile app futura. | Global PHP |
| 108 | **El `DATABASE_GUIDE.md` tiene el schema desactualizado** (falta la tabla `qr_codes` y los roles `asociado`/`superior`). | Documentación inconsistente con el código. | `DATABASE_GUIDE.md` |

---

## 5. ACCESIBILIDAD (a11y)

| # | Problema | Impacto |
|---|----------|---------|
| 109 | **Sin atributos `aria-label` en botones de icono** (bottom nav, escáner, canje). | Los lectores de pantalla no describen la acción. | Global |
| 110 | **Sin `role` ni `aria-live` en notificaciones/alertas.** | Los cambios de estado no se anuncian. | Global |
| 111 | **El contraste de color no fue verificado** (verdes sobre crema pueden fallar WCAG AA). | Usuarios con baja visión pueden no distinguir elementos. | `styles.css` |
| 112 | **Sin skip-link para navegación.** | Usuarios de teclado deben tabular todo el nav para llegar al contenido. | `AppShell.tsx` |
| 113 | **Los inputs de formulario no tienen `aria-describedby`** vinculado a mensajes de error. | Los errores de validación no se anuncian. | `index.tsx`, `CrudManager.tsx` |
| 114 | **Sin focus trap en modales/dialogs.** | Al abrir un modal, el foco puede escapar al fondo. | `CrudManager.tsx` |
| 115 | **El mapa Leaflet no es navegable por teclado.** | Usuarios de teclado no pueden interactuar con marcadores. | `MapView.tsx` |

---

## 6. PERFORMANCE

| # | Problema | Impacto |
|---|----------|---------|
| 116 | **Leaflet CSS se carga desde CDN** (`unpkg.com`) sin fallback local. | Si el CDN falla, el mapa no tiene estilos. | `__root.tsx` |
| 117 | **Las fuentes de Google se cargan sincrónicamente** bloqueando render. | Mayor LCP (Largest Contentful Paint). | `__root.tsx` |
| 118 | **Sin preconnect a la API PHP.** | Cada fetch tiene handshake DNS+TLS adicional. | `__root.tsx` |
| 119 | **Las imágenes no tienen `srcset` ni lazy loading inteligente.** | Carga innecesaria de imágenes grandes en móvil. | Global |
| 120 | **Sin compresión de assets configurada** (Gzip/Brotli depende del hosting, pero no hay indicación). | Bundle más grande de lo necesario. | Infraestructura |

---

## 7. DATOS Y ESTADO

| # | Problema | Impacto |
|---|----------|---------|
| 121 | **Los datos mock no se sincronizan con el backend** cuando `VITE_API_BASE_URL` está configurado. | El usuario ve datos locales que no reflejan la BD. | `store.ts` |
| 122 | **Sin migración de localStorage** si cambia el schema del store. | Actualizaciones futuras pueden romper datos guardados. | `store.ts` |
| 123 | **El store no tiene reset/rehydrate limpio.** | Al hacer logout, algunos datos mock persisten. | `store.ts` |
| 124 | **Sin sincronización en tiempo real** (WebSockets/SSE). | Dos usuarios no ven cambios simultáneos (ej: stock de premios). | Global |
| 125 | **Sin modo offline / Service Worker.** | Sin internet la app no funciona para nada. | Global |

---

## 8. DOCUMENTACIÓN Y DEVEX

| # | Problema | Impacto |
|---|----------|---------|
| 126 | **El `README.md` es genérico de AI Studio** y no describe el proyecto. | Difícil onboarding para nuevos devs. | `README.md` |
| 127 | **Sin `.env.example` completo.** | Solo tiene `VITE_API_BASE_URL`; falta `GEMINI_API_KEY`, etc. | `.env.example` |
| 128 | **Sin guía de contribución ni estándares de código.** | Código inconsistente entre contribuidores. | Global |
| 129 | **El `ARCHITECTURE.md` describe una arquitectura que no se implementó** (middleware, rate limiting, etc.). | Documentación engañosa. | `ARCHITECTURE.md` |
| 130 | **Los prompts de Kimi (`KIMI_K3_PROMPT_*`) están desfasados** respecto al código actual. | Los prompts no reflejan el estado real del proyecto. | `KIMI_K3_PROMPT_*.txt` |

---

## MATRIZ DE PRIORIDADES

### 🔴 CRÍTICO (bloqueante para producción)
- #1, #3, #5, #24, #25, #27, #28, #29, #35, #36, #39, #55, #64, #65, #67, #72, #74, #75, #80, #84, #90, #91, #93

### 🟡 ALTO (debe resolverse antes del lanzamiento)
- #2, #4, #6, #7, #11, #14, #15, #18, #19, #26, #31, #32, #33, #37, #38, #40, #41, #45, #46, #47, #48, #50, #52, #56, #57, #73, #77, #78, #81, #82, #83, #85, #86, #87, #88, #92, #94, #96, #101, #103, #104, #105, #108, #109, #111, #112, #116, #117, #121, #125

### 🟢 MEDIO (mejora la experiencia)
- #8, #9, #10, #12, #13, #16, #17, #20, #21, #22, #23, #34, #42, #43, #44, #49, #51, #53, #54, #58, #59, #60, #61, #62, #63, #66, #68, #69, #70, #71, #95, #97, #98, #99, #100, #106, #107, #110, #113, #114, #115, #118, #119, #120, #122, #123, #124, #126, #127, #128, #129, #130

---

*Fin del análisis. Ver archivo `KARMAVERDE_CAMBIOS.txt` para los prompts de implementación de cada cambio.*

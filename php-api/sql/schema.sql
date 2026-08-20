-- =====================================================================
-- Karmaverde — Esquema completo de base de datos MySQL
-- Importar desde phpMyAdmin o consola en la base `karmaverde`.
-- =====================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- --------- USUARIOS ----------
CREATE TABLE IF NOT EXISTS usuarios (
  id            INT PRIMARY KEY AUTO_INCREMENT,
  nombre        VARCHAR(100) NOT NULL,
  email         VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol           ENUM('alumno','creador','superior','asociado') NOT NULL DEFAULT 'alumno',
  escuela       VARCHAR(120) NOT NULL,
  puntos        INT NOT NULL DEFAULT 0,
  canjes        INT NOT NULL DEFAULT 0,
  avatar        VARCHAR(255) NULL,
  creado_en     DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------- PREMIOS ----------
CREATE TABLE IF NOT EXISTS premios (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  nombre      VARCHAR(120) NOT NULL,
  descripcion TEXT,
  puntos      INT NOT NULL DEFAULT 0,
  stock       INT NOT NULL DEFAULT 0,
  imagen      VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------- GUÍAS EDUCATIVAS ----------
CREATE TABLE IF NOT EXISTS guias (
  id        INT PRIMARY KEY AUTO_INCREMENT,
  titulo    VARCHAR(150) NOT NULL,
  categoria VARCHAR(60),
  contenido TEXT,
  icono     VARCHAR(10)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------- CIRCUITO (Viaje del reciclaje) ----------
CREATE TABLE IF NOT EXISTS circuito (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  orden       INT NOT NULL DEFAULT 0,
  titulo      VARCHAR(150) NOT NULL,
  descripcion TEXT,
  estado      ENUM('activa','en_proceso','pendiente') DEFAULT 'pendiente',
  imagen      VARCHAR(255),
  video       VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------- PUNTOS VERDES (Mapa) ----------
CREATE TABLE IF NOT EXISTS puntos_verdes (
  id                INT PRIMARY KEY AUTO_INCREMENT,
  nombre            VARCHAR(150) NOT NULL,
  escuela           VARCHAR(120),
  lat               DECIMAL(10,7) NOT NULL,
  lng               DECIMAL(10,7) NOT NULL,
  materiales        VARCHAR(255),
  puntos_acumulados INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------- TAREAS / LOGÍSTICA (Asociados) ----------
CREATE TABLE IF NOT EXISTS tareas (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  titulo      VARCHAR(150) NOT NULL,
  escuela     VARCHAR(120) NOT NULL,
  material    VARCHAR(60) NOT NULL,
  meta        INT NOT NULL DEFAULT 0,
  progreso    INT NOT NULL DEFAULT 0,
  estado      ENUM('pendiente','en_curso','completada') DEFAULT 'pendiente',
  responsable VARCHAR(120) NULL,
  creado_en   DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------- SCANS ----------
CREATE TABLE IF NOT EXISTS scans (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  material   VARCHAR(60) NOT NULL,
  puntos     INT NOT NULL,
  fecha      DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_scans_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------- CANJES ----------
CREATE TABLE IF NOT EXISTS canjes (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  premio_id  INT NOT NULL,
  fecha      DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_canjes_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_canjes_premio
    FOREIGN KEY (premio_id)  REFERENCES premios(id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------- CÓDIGOS QR ----------
CREATE TABLE IF NOT EXISTS qr_codes (
  id        VARCHAR(64) PRIMARY KEY,
  material  VARCHAR(40) NOT NULL,
  puntos    INT NOT NULL,
  vence     DATETIME NULL,
  usado_por INT NULL,
  usado_en  DATETIME NULL,
  CONSTRAINT fk_qr_usuario FOREIGN KEY (usado_por) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- Datos semilla iniciales (opcionales)
INSERT IGNORE INTO premios (id, nombre, descripcion, puntos, stock, imagen) VALUES
(1, 'Cuaderno Kraft Reciclado', 'Cuaderno 80 hojas de papel 100% reciclado con anillado ecológico.', 150, 25, '📓'),
(2, 'Kit de Semillas Nativas', 'Sobre con semillas autóctonas para plantar en el cole o casa.', 80, 50, '🌱'),
(3, 'Botella Térmica Reutilizable', 'Botella de acero inoxidable 500ml libre de BPA.', 300, 15, '🍶'),
(4, 'Lápiz Plantable con Semilla', 'Lápiz de grafito que al terminarse se planta.', 50, 100, '✏️');

INSERT IGNORE INTO guias (id, titulo, categoria, contenido, icono) VALUES
(1, 'Cómo separar papel y cartón', 'Papel', 'Asegurate de que estén secos, limpios y sin restos de comida ni grasa. Desplegá las cajas.', '📦'),
(2, 'Plásticos reciclables: qué sí y qué no', 'Plástico', 'Enjuagá botellas PET (n° 1) y envases PEAD (n° 2). Aplastalos para reducir volumen.', '🧴'),
(3, 'Compostaje escolar paso a paso', 'Orgánicos', 'Capas alternadas de restos verdes (frutas, verduras) y secos (hojas, cartón sin tintas).', '🍂');

INSERT IGNORE INTO circuito (id, orden, titulo, descripcion, estado, imagen) VALUES
(1, 1, 'Puntos Verdes y Depósito', 'Los alumnos depositan materiales limpios y secos en los tachos clasificados.', 'activa', '🏫'),
(2, 2, 'Recolección y Pesaje', 'El camión de recolección pasa periódicamente y pesa el material acopiado.', 'en_proceso', '🚛'),
(3, 3, 'Planta de Clasificación', 'Separación fina por tipo de polímero y fibra en la cooperativa local.', 'pendiente', '🏭'),
(4, 4, 'Transformación y Nuevos Productos', 'El material reciclado vuelve en forma de nuevos cuadernos y bancos de plaza.', 'pendiente', '♻️');

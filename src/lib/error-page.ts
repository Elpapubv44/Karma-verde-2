export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Karmaverde — Se despegó una hoja</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Caveat+Brush&family=Nunito:wght@400;700;800&display=swap" rel="stylesheet">
    <style>
      body {
        font-family: 'Nunito', system-ui, sans-serif;
        background: #f7f5ed;
        color: #2b2520;
        display: grid;
        place-items: center;
        min-height: 100vh;
        margin: 0;
        padding: 1.5rem;
      }
      .card {
        max-width: 28rem;
        width: 100%;
        text-align: center;
        padding: 2.5rem 2rem;
        background: #fffdf9;
        border: 2px dashed #c4b59d;
        border-radius: 1.5rem;
        box-shadow: 0 10px 25px -8px rgba(50, 40, 30, 0.15);
        transform: rotate(-1deg);
      }
      .icon {
        font-size: 3rem;
        margin-bottom: 0.5rem;
      }
      h1 {
        font-family: 'Caveat Brush', cursive;
        font-size: 2.2rem;
        color: #3b7a44;
        margin: 0 0 0.5rem;
      }
      p {
        color: #635748;
        font-size: 0.95rem;
        margin: 0 0 1.5rem;
      }
      .actions {
        display: flex;
        gap: 0.75rem;
        justify-content: center;
        flex-wrap: wrap;
      }
      a, button {
        padding: 0.6rem 1.4rem;
        border-radius: 9999px;
        font-weight: 800;
        font-size: 0.875rem;
        cursor: pointer;
        text-decoration: none;
        transition: transform 0.15s, opacity 0.15s;
        border: 2px solid transparent;
      }
      a:hover, button:hover {
        transform: translateY(-2px);
      }
      .primary {
        background: #3b7a44;
        color: #fff;
        border-color: #2c5e34;
      }
      .secondary {
        background: #fdfbf7;
        color: #2b2520;
        border-color: #c4b59d;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="icon">🌿</div>
      <h1>Se despegó una hoja</h1>
      <p>Ocurrió un error inesperado al cargar esta sección. Podés reintentar o volver al inicio de Karmaverde.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Reintentar</button>
        <a class="secondary" href="/">Volver al inicio</a>
      </div>
    </div>
  </body>
</html>`;
}

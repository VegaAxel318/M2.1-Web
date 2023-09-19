const http = require('http');
const url = require('url');
const querystring = require('querystring');
const fs = require('fs');

const servidor = http.createServer((req, res) => {
  const { method, url: requestUrl } = req;
  const parsedUrl = url.parse(requestUrl);
  const parsedQuery = querystring.parse(parsedUrl.query);

  if (method === 'GET') {
    if (parsedUrl.pathname === '/formulario') {
      // Servir la página HTML del formulario
      fs.readFile('formulario.html', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Error interno del servidor');
          return;
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      });
    } else {
      // Si no se quiere el formulario Respondemos con un HTML
      res.writeHead(200, { 'Content-Type': 'text/html' });
      
      res.end(`
      <html>
        <head>
            <body>
                <h1>Request headers:</h1>
                <code>
                  <pre>${JSON.stringify(req.headers, null, 2)}</pre>
                </code>
                <h1>Metodo: GET</h1>
                <h1>URL: ${requestUrl}</h1>
            </body>
        </head>
      </html>`);
    }
  } else if (method === 'POST') {
    // Manejar la solicitud POST
      let data = '';

      req.on('data', (chunk) => {
        data += chunk;
      });

      req.on('end', () => {
        const parsedData = querystring.parse(data);

          res.writeHead(200, { 'Content-Type': 'text/html' });
          
          res.end(`
          <html>
            <head>
                <body>
                    <h1>Request headers:</h1>
                    <code>
                      <pre>${JSON.stringify(req.headers, null, 2)}</pre>
                    </code>
                    <h1>Metodo: POST</h1>
                    <h1>URL: ${requestUrl}</h1>
                    <h1>Datos enviados: ${JSON.stringify(parsedData)}</h1>
                </body>
            </head>
          </html>`);
        }
      );
  } else {
    // Manejar otras solicitudes
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Página no encontrada');
  }
});

const puerto = 3000;
servidor.listen(puerto, () => {
  console.log(`El servidor está escuchando en el puerto ${puerto}`);
});

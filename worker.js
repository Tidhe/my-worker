addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const { pathname } = new URL(request.url);

  if (pathname === '/secure') {
    // Handle /secure endpoint
    const email = "chongkeatop@gmail.com";
    const timestamp = new Date().toISOString();
    const country = "Malaysia";

    const htmlResponse = `
      <html>
      <body>
        ${email} authenticated at ${timestamp} from <a href="/secure/${country}">${country}</a>
        <p><a href="/secure/${country}">Click here to view Malaysia flag</a></p>
      </body>
      </html>
    `;

    return new Response(htmlResponse, {
      headers: {
        'Content-Type': 'text/html'
      }
    });
  } else if (pathname.startsWith('/secure/')) {
    // Handle /secure/${COUNTRY} endpoint
    const country = pathname.split('/').pop().toLowerCase();
    const bucketUrl = `https://your-r2-bucket-url/flags/${country}.png`;

    const flagResponse = await fetch(bucketUrl);
    if (flagResponse.ok) {
      return new Response(flagResponse.body, {
        headers: {
          'Content-Type': 'image/png'
        }
      });
    } else {
      return new Response('Flag not found', {
        status: 404,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }
  }

  return new Response('Not found', { status: 404 });
}

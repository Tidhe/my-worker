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
        ${email} authenticated at ${timestamp} from ${country}
        <p><a href="/secure/${country}">Click here to view ${country} flag</a></p>
      </body>
      </html>
    `;

    return new Response(htmlResponse, {
      headers: {
        'Content-Type': 'text/html'
      }
    });
  }

  const countryCode = pathname.split('/secure/')[1];

  if (countryCode) {
    // Handle /secure/{COUNTRY} endpoint
    // Fetch flag image from R2 bucket
    const flagUrl = `https://e5f65b945d2eec0b2e9eb6ad71cc41ab.r2.cloudflarestorage.com/flags/${countryCode}.png`;
    const imageResponse = await fetch(flagUrl);
    
    if (!imageResponse.ok) {
      return new Response("Flag not found", { status: 404 });
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    return new Response(imageBuffer, { headers: { 'Content-Type': 'image/png' } });
  }

  return new Response("Not Found", { status: 404 });
}

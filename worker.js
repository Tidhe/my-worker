addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const { pathname } = new URL(request.url);

  // This checks for exactly '/secure' or '/secure/' and shows the main page
  if (pathname === '/secure' || pathname === '/secure/') {
    const email = "chongkeatop@gmail.com";
    const timestamp = new Date().toISOString();
    const responseHtml = `
      <html>
      <body>
        ${email} authenticated at ${timestamp} from Malaysia
        <p><a href="/secure/Malaysia">Click here to view Malaysia flag</a></p>
      </body>
      </html>
    `;

    return new Response(responseHtml, {
      headers: {
        'Content-Type': 'text/html'
      }
    });
  }

  // This checks for the path to include '/secure/Malaysia' and serves the flag image
  else if (pathname.includes('/secure/Malaysia')) {
    const flagUrl = 'https://pub-ff0cd70a6c1d48efa3aa1e89b84bd817.r2.dev/image.png';
    const imageResponse = await fetch(flagUrl);
    if (!imageResponse.ok) {
      return new Response("Flag not found", { status: 404 });
    }
    return new Response(imageResponse.body, { headers: { 'Content-Type': 'image/png' } });
  }

  // If no paths match, return 'Not Found'
  return new Response("Not Found", { status: 404 });
}

// Cloudflare Pages Function — handles GitHub OAuth for Decap CMS
// File location in your repo: /functions/api/auth.js

const CLIENT_ID = typeof GITHUB_CLIENT_ID !== 'undefined' ? GITHUB_CLIENT_ID : '';
const CLIENT_SECRET = typeof GITHUB_CLIENT_SECRET !== 'undefined' ? GITHUB_CLIENT_SECRET : '';

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/auth', '');

  // Step 1: Redirect to GitHub OAuth
  if (path === '' || path === '/') {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo,user&state=${crypto.randomUUID()}`;
    return Response.redirect(githubAuthUrl, 302);
  }

  // Step 2: GitHub redirects back with a code — exchange it for a token
  if (path === '/callback') {
    const code = url.searchParams.get('code');
    if (!code) {
      return new Response('Missing code parameter', { status: 400 });
    }

    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      return new Response(`OAuth error: ${tokenData.error_description}`, { status: 400 });
    }

    // Return token to Decap CMS via postMessage
    const html = `
<!doctype html>
<html>
<body>
<script>
  const token = ${JSON.stringify(tokenData.access_token)};
  const message = "authorization:github:success:${JSON.stringify({ token: tokenData.access_token, provider: 'github' })}";
  window.opener.postMessage(message, '*');
  window.close();
</script>
</body>
</html>`;

    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  }

  return new Response('Not found', { status: 404 });
}

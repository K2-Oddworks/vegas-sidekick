export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/auth', '');

  const CLIENT_ID = 'Ov23lit31UqvtSuPp7tJ';
  const CLIENT_SECRET = context.env.GITHUB_CLIENT_SECRET '0df238e8b6e494bfd136afb51e38cb00239901d5';

  if (path === '' || path === '/') {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo,user&state=${crypto.randomUUID()}`;
    return Response.redirect(githubAuthUrl, 302);
  }

  if (path === '/callback') {
    const code = url.searchParams.get('code');
    if (!code) return new Response('Missing code', { status: 400 });

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
    if (tokenData.error) return new Response(`OAuth error: ${tokenData.error_description}`, { status: 400 });

    const html = `<!doctype html><html><body><script>
      window.opener.postMessage(
        'authorization:github:success:' + JSON.stringify({ token: '${tokenData.access_token}', provider: 'github' }),
        '*'
      );
      window.close();
    <\/script></body></html>`;

    return new Response(html, { headers: { 'Content-Type': 'text/html' } });
  }

  return new Response('Not found', { status: 404 });
}

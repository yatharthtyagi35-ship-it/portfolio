// Vercel serverless function: finishes the GitHub login and hands the token to the CMS window.
module.exports = async (req, res) => {
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const origin = `https://${host}`;
  const url = new URL(req.url, origin);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookie = (req.headers.cookie || '').split(/;\s*/).find((c) => c.startsWith('decap_state='));
  const saved = cookie ? cookie.slice('decap_state='.length) : '';

  let status = 'error';
  let content = { error: 'Login failed. Please try again.' };

  if (!code || !state || state !== saved) {
    content = { error: 'Login expired or was interrupted. Please try again.' };
  } else {
    try {
      const r = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });
      const data = await r.json();
      if (data.access_token) {
        status = 'success';
        content = { token: data.access_token, provider: 'github' };
      } else {
        content = { error: data.error_description || 'GitHub did not return a token.' };
      }
    } catch (e) {
      content = { error: 'Could not reach GitHub.' };
    }
  }

  const message = JSON.stringify(`authorization:github:${status}:${JSON.stringify(content)}`).replace(/</g, '\\u003c');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Set-Cookie', 'decap_state=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
  res.end(`<!doctype html><html><body style="font-family:sans-serif;background:#0d0e0a;color:#ecebe2"><p>Finishing login…</p><script>
(function () {
  var origin = ${JSON.stringify(origin)};
  function receive(e) {
    if (e.origin !== origin) return;
    window.opener.postMessage(${message}, origin);
    window.removeEventListener('message', receive);
    setTimeout(function () { window.close(); }, 300);
  }
  window.addEventListener('message', receive);
  if (window.opener) window.opener.postMessage('authorizing:github', origin);
})();
</script></body></html>`);
};

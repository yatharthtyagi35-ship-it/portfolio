// Vercel serverless function: starts the GitHub login for the CMS at /admin.
// Needs GITHUB_CLIENT_ID (and GITHUB_CLIENT_SECRET for /api/callback) in Vercel → Settings → Environment Variables.
const crypto = require('crypto');

module.exports = (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    res.statusCode = 500;
    return res.end('GITHUB_CLIENT_ID is not set in Vercel environment variables.');
  }
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const state = crypto.randomBytes(16).toString('hex');
  const redirect = `https://${host}/api/callback`;
  res.setHeader('Set-Cookie', `decap_state=${state}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600`);
  res.statusCode = 302;
  res.setHeader(
    'Location',
    `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirect)}&scope=repo,user&state=${state}`
  );
  res.end();
};

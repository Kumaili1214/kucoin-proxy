export default async function handler(req, res) {
  const targetUrl = 'https://api.kucoin.com' + req.url;

  const headers = {};
  const forwardHeaders = [
    'kc-api-key', 'kc-api-sign', 'kc-api-passphrase',
    'kc-api-timestamp', 'kc-api-key-version', 'content-type'
  ];

  forwardHeaders.forEach(h => {
    if (req.headers[h]) headers[h] = req.headers[h];
  });

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: ['POST', 'PUT', 'DELETE'].includes(req.method) ? JSON.stringify(req.body) : undefined
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export default async function handler(req, res) {
  // Client URL se path uthana
  let rawPath = req.url ? req.url.split('?')[0] : '';

  // Agar /api do dafa aa jaye (jaise /api/api/v1) to usay ek dafa kar dena
  rawPath = rawPath.replace(/^(\/api)+/, '/api');
  if (!rawPath.startsWith('/api')) {
    rawPath = '/api' + rawPath;
  }

  const url = `https://api.kucoin.com${rawPath}`;

  // Headers setup
  const headers = {
    'Content-Type': 'application/json',
    'KC-API-KEY': req.headers['kc-api-key'] || req.headers['KC-API-KEY'] || '',
    'KC-API-SIGN': req.headers['kc-api-sign'] || req.headers['KC-API-SIGN'] || '',
    'KC-API-PASSPHRASE': req.headers['kc-api-passphrase'] || req.headers['KC-API-PASSPHRASE'] || '',
    'KC-API-TIMESTAMP': req.headers['kc-api-timestamp'] || req.headers['KC-API-TIMESTAMP'] || '',
    'KC-API-KEY-VERSION': req.headers['kc-api-key-version'] || req.headers['KC-API-KEY-VERSION'] || '2'
  };

  try {
    const fetchOptions = {
      method: req.method,
      headers: headers
    };

    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method.toUpperCase()) && req.body) {
      fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const response = await fetch(url, fetchOptions);
    const data = await response.text();

    res.status(response.status).send(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

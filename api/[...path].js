export default async function handler(req, res) {
  let targetPath = req.url || '';
  if (!targetPath.startsWith('/api')) {
    targetPath = '/api' + targetPath;
  }

  const url = `https://api.kucoin.com${targetPath}`;

  // KuCoin ke required headers ko exact format mein send karna
  const headers = {
    'Content-Type': 'application/json',
    'KC-API-KEY': req.headers['kc-api-key'] || req.headers['KC-API-KEY'],
    'KC-API-SIGN': req.headers['kc-api-sign'] || req.headers['KC-API-SIGN'],
    'KC-API-PASSPHRASE': req.headers['kc-api-passphrase'] || req.headers['KC-API-PASSPHRASE'],
    'KC-API-TIMESTAMP': req.headers['kc-api-timestamp'] || req.headers['KC-API-TIMESTAMP'],
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

export default async function handler(req, res) {
  // Path se extra /api cleanup karna
  let path = req.url ? req.url.split('?')[0] : '';
  
  // Agar path mein pehle se /api laga hai toh usay normalize karein
  if (path.startsWith('/api')) {
    path = path.replace('/api', '');
  }

  const url = `https://api.kucoin.com/api${path}`;

  const getHeader = (name) => req.headers[name.toLowerCase()] || req.headers[name] || '';

  const headers = {
    'Content-Type': 'application/json',
    'KC-API-KEY': getHeader('KC-API-KEY'),
    'KC-API-SIGN': getHeader('KC-API-SIGN'),
    'KC-API-PASSPHRASE': getHeader('KC-API-PASSPHRASE'),
    'KC-API-TIMESTAMP': getHeader('KC-API-TIMESTAMP'),
    'KC-API-KEY-VERSION': getHeader('KC-API-KEY-VERSION') || '2'
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

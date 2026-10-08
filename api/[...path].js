export default async function handler(req, res) {
  let targetPath = req.url || '';
  if (!targetPath.startsWith('/api')) {
    targetPath = '/api' + targetPath;
  }

  const url = `https://api.kucoin.com${targetPath}`;

  const headers = {};
  for (const [key, value] of Object.entries(req.headers)) {
    if (!['host', 'x-forwarded-for', 'x-real-ip', 'connection', 'content-length'].includes(key.toLowerCase())) {
      headers[key] = value;
    }
  }

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

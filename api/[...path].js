export default async function handler(req, res) {
  const pathArray = req.query.path || [];
  const path = Array.isArray(pathArray) ? pathArray.join('/') : pathArray;
  const url = `https://api.kucoin.com/api/${path}`;

  const headers = {};
  for (const [key, value] of Object.entries(req.headers)) {
    if (!['host', 'x-forwarded-for', 'x-real-ip', 'connection'].includes(key.toLowerCase())) {
      headers[key] = value;
    }
  }

  try {
    const options = {
      method: req.method,
      headers: headers
    };

    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method.toUpperCase()) && req.body) {
      options.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const response = await fetch(url, options);
    const data = await response.text();
    
    res.status(response.status).send(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

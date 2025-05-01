import jwt from 'jsonwebtoken'

export function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.access_token;
  
  const token = authHeader?.startsWith('Bearer ')
  ? authHeader.split(' ')[1]
  : cookieToken;
  
  if (!token) {
  return res.status(403).json({ message: 'No token provided' });
  }
  
  try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded.user;
  next();
  } catch (err) {
  return res.status(401).json({ message: 'Token inválido o expirado' });
  }
}
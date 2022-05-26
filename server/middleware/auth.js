// middleware to decode jwts
import 'dotenv/config';
import jsonwebtoken from 'jsonwebtoken';

const SIGNATURE = process.env.JWT_SIGNATURE;

const authorization = (req, res, next) => {
  const token = req.cookies.auth;
  if (!token) {
    console.log('auth failed, no token');
    return res.sendStatus(401);
  }
  try {
    const data = jsonwebtoken.verify(token, SIGNATURE);
    req.userId = data.userId;
    return next();
  } catch {
    console.log('token expired or modified');
    return res.sendStatus(401);
  }
};

export default authorization;

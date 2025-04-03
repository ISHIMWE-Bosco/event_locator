const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_jwt_secret_key'; // Store this in an environment variable

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ msg: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Store the decoded user info in the request object
    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    res.status(400).json({ msg: 'Invalid token.' });
  }
};

module.exports = authenticate;

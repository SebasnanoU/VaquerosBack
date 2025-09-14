const jwt = require('jsonwebtoken');
const verifyGoogleToken = require('../utils/googleVerify');

const loginWithGoogle = async (req, res) => {
  try {
    const { id_token } = req.body;
    if (!id_token) return res.status(400).json({ error: 'id_token requerido' });

    const user = await verifyGoogleToken(id_token);
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.json({ token, user });
  } catch (error) {
    console.error('Error autenticando con Google:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = { loginWithGoogle };

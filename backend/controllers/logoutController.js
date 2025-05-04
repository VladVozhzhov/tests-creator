const User = require('../model/User');

const isProduction = process.env.NODE_ENV === 'production';

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204).json({ message: 'No refresh token' }); 

  const refreshToken = cookies.jwt;
  const foundUser = await User.findOne({ refreshToken }).exec();

  if (foundUser) {
    foundUser.refreshToken = '';
    await foundUser.save();
  }

  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'None',
    secure: isProduction,
  });

  res.sendStatus(204);
};

module.exports = { handleLogout };

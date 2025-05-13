const User = require('../model/User');

const isProduction = process.env.NODE_ENV === 'production';

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204).json({ message: 'No token' }); 

  const accessToken = cookies.jwt;
  const foundUser = await User.findOne({ accessToken }).exec();

  if (foundUser) {
    foundUser.accessToken = '';
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

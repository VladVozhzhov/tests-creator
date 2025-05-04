const bcrypt = require('bcrypt');
const User = require('../model/User');

const handleRegister = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username and password are required.' });
    
    const duplicate = await User.findOne({ username: username }).exec();
    if (duplicate) return res.sendStatus(409); // Conflict

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
          username,
          password: hashedPassword
        });
        res.status(201).json({ message: `User ${username} created successfully.` });
      } catch (err) {
        res.status(500).json({ message: `Error creating new user: ${err}` });
      }
}

module.exports = { handleRegister };
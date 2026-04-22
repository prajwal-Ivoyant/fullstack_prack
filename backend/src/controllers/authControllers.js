const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt= require('jsonwebtoken');

const register = async (req, res) => {
    const {email, password} = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
        email,
        password : hashed,
    });

    res.json(`${user} ADDED TO DB`)
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (err) {
    console.error("LOGIN ERROR:", err); 
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {login, register}

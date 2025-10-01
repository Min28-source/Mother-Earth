require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");

// Signup controller
exports.signup = async (req, res) => {
    try {
        const { password, username, email } = req.body.data;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json({ error: "A user with the same email already exists!" });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        let url;
        if (req.file) {
            url = req.file.path;
        }

        const user = new User({
            username,
            password: hashedPassword,
            email,
            url,
        });

        if (!user) {
            return res.status(400).json({ message: "Incomplete credentials!" });
        }

        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.json({ token, userId: user._id, message: "User registered successfully" });
    } catch (err) {
        res
            .status(500)
            .json({ message: "Something went wrong!", error: err.message });
    }
};

// Login controller
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json("The username or password is incorrect.");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid username or password." });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.json({ token, id: user._id, message: "Logged in successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong!", error: err.message });
    }
};

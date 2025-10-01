const Posts = require("../models/posts");
const User = require("../models/Users");

exports.createPost = async (req, res) => {
    try {
        const { title, description, amount, location } = req.body.data;
        const { id } = req.params;
        const url = req.file.path;

        const post = new Posts({
            title,
            description,
            amount,
            url,
            location,
            postedBy: id,
        });

        await post.save();
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getMyProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).populate("likedPosts");
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllPosts = async (req, res) => {
    const found = await Posts.find();
    res.json(found);
};

exports.getPostById = async (req, res) => {
    const { id } = req.params;
    const data = await Posts.findById(id).populate("postedBy");
    res.json(data);
};

exports.getProfile = async (req, res) => {
    const { id } = req.params;
    const data = await User.findById(id);
    res.json(data);
};

exports.karmaPoint = async (req, res) => {
    try {
        const { postId, contains, userId } = req.body;
        const postIdStr = postId.toString();
        const post = await Posts.findById(postId);

        if (contains) {
            post.$inc("karmaPoints", -1);
        } else {
            post.$inc("karmaPoints", 1);
        }
        await post.save();

        const user = await User.findById(userId);
        if (contains) {
            user.likedPosts = user.likedPosts.filter(
                (item) => item.toString() !== postIdStr
            );
        } else {
            user.likedPosts.push(postId);
        }
        await user.save();

        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getLikes = async (req, res) => {
    try {
        const { userId } = req.query;
        const user = await User.findById(userId);
        res.status(200).json(user.likedPosts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

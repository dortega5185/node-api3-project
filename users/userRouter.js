const express = require("express");

const router = express.Router();

const Users = require("../users/userDb");

const Posts = require("../posts/postDb");

router.post("/", validateUser, (req, res) => {
  const newPost = req.body;

  Users.insert(newPost)
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error adding the post.",
      });
    });
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  let text = req.body;
  text.user_id = req.user.id;

  Posts.insert(text)
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "There was an error while saving the post to the database",
      });
    });
});

router.get("/", (req, res) => {
  Users.get(req.query)
    .then((allUsers) => {
      res.status(200).json(allUsers);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "All the users could not be retrieved.",
      });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  Users.getById(req.params.id)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "The user information could not be retrieved.",
      });
    });
});

router.get("/:id/posts", validateUserId, (req, res) => {
  Users.getUserPosts(req.params.id)
    .then((posts) => {
      if (posts === undefined || posts.length === 0) {
        res.status(404).json({
          message: "The post with the specified ID does not exist.",
        });
      } else {
        res.status(200).json(posts);
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "The posts could not be retrieved.",
      });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  Users.remove(req.params.id)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "The user could not be removed.",
      });
    });
});

router.put("/:id", validateUserId, validateUser, (req, res) => {
  const id = req.params.id;
  const newUser = req.body;

  Users.update(id, newUser)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "Please provide name for the update",
      });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  Users.getById(req.params.id)
    .then((userId) => {
      console.log(userId);
      if (userId === undefined) {
        res.status(400).json({ message: "invalid user id" });
      } else {
        req.user = userId;
        next();
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        message: "invalid user id",
      });
    });
}

function validateUser(req, res, next) {
  const user = req.body;

  if (Object.keys(user).length === 0) {
    res.status(400).json({ message: "missing user data" });
  } else if (user.name === "" || user.name === undefined) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  const post = req.body;
  console.log(post);
  if (Object.keys(post).length === 0) {
    res.status(400).json({ message: "missing post data" });
  } else if (post.text === "" || post.text === undefined) {
    res.status(400).json({ message: "missing required text field" });
  } else {
    next();
  }
}

module.exports = router;

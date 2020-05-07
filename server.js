const express = require("express");

const postRouter = require("./posts/postRouter");

const userRouter = require("./users/userRouter");

const server = express();

server.use(express.json());

server.use(logger);

server.use("/api/users", userRouter);

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  const today = new Date().toISOString();
  console.log(`[${today}] ${req.method} to ${req.url}`);

  next();
}

module.exports = server;

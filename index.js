// code away!
const server = require("./server.js");
const colors = require("colors");

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(
    `\n* Server Running on http://localhost:${port} *\n`.bgWhite.underline.black
  );
});

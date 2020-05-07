// code away!
const server = require("./server.js");
const colors = require("colors");

server.listen(5000, () => {
  console.log(
    "\n* Server Running on http://localhost:5000 *\n".bgWhite.underline.black
  );
});

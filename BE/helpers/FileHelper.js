const fs = require("fs");

function write(fileName, data) {
  fs.writeFileSync(fileName, JSON.stringify(data), function (err) {
    if (err) throw err;
    console.log("Saved!");
  });
}

module.exports = { write };

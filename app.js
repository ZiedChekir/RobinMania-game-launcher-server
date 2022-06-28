var express = require("express");
var app = express();
var zip = require("express-zip");
var fs = require("fs");
var bodyParser = require("body-parser");
var XXHash = require("xxhash");

function getByteArray(filePath) {
  let fileData = fs.readFileSync(filePath).toString("hex");
  let result = [];
  for (var i = 0; i < fileData.length; i += 2)
    result.push("0x" + fileData[i] + "" + fileData[i + 1]);
  return result;
}
var fs = require("fs");
const { file } = require("jszip");

function hashFile(filePath) {
  var file = Buffer.from(getByteArray(filePath));
  var result = XXHash.hash(file, 0);
  return result;
}



app.get("/download/version", function (req, res) {
  console.log("downloading version");
  res.download(__dirname + "/Files/version.txt");
});

app.get("/download/game", function (req, res) {
  console.log("Downloading Game");
  res.download(__dirname + "/Files/game.zip");
});

app.get("/download/nftjson", function (req, res) {
  console.log("downloading NFTJSON");
  res.download(__dirname + "/Files/nft.json");
});

app.get("/download/nfts", function (req, res, next) {
  try {
    var nftsArray = [];
    fs.readdir(__dirname + "/Files/nfts", (err, files) => {
      files.forEach((file) => {
        nftsArray.push({ path: __dirname + "/Files/nfts/" + file, name: file });
      });
      console.log("downloading NFTS");
      res.zip(nftsArray, "Nfts.zip");
    });
  } catch (e) {
    next(e);
  }
});

app.get("/download/nfts/custom", function (req, res, next) {
  try {
    var nftsToDownload = JSON.parse(req.query.nfts);
    var nftsArray = [];
    nftsToDownload.forEach((nftFileName) => {
      nftsArray.push({
        path: __dirname + "/Files/nfts/" + nftFileName,
        name: nftFileName,
      });
    });

    console.log("downloading custom NFTS");
    res.zip(nftsArray, "Nfts.zip");
  } catch (e) {
    next(e);
  }
});


app.listen(3000);

var fs = require("fs");

exports.serveFile = (file,status,headers,response) => {
  fs.readFile("template/top.html",(errorTop,htmlTop) => {
    fs.readFile("template/bottom.html",(errorBottom,htmlBottom) => {
      fs.readFile(file,(error,fileData) => {
        response.writeHead(status,headers);         // (status 200 ok, response headers object)
        if (headers["Content-type"] == "text/html") { fileData = htmlTop+fileData+htmlBottom }
        response.end(fileData);    // html content
      });
    });
  });
};


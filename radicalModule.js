var fs = require("fs"); var util = require("util"); var formidable = require("formidable");
//var mysql = require("mysql"); 

exports.serveFile = (file,status,headers,response) => {
  fs.readFile(file,(error,fileData) => {
    response.writeHead(status,headers); 
    response.end(fileData);
  });
};

exports.servePage = (page,status,headers,response) => {
  headers["Content-type"] = "text/html";
  fs.readFile("html/top.html",(errorTop,htmlTop) => {
    fs.readFile("html/bottom.html",(errorBottom,htmlBottom) => {
      fs.readFile("html/"+page+".html",(error,fileData) => {
        response.writeHead(status,headers);         
        response.end(htmlTop+fileData+htmlBottom);
      });
    });
  });
}

exports.processPOST = (request,response,daFunction) => {
  var filenameList = [];
  var form = new formidable.IncomingForm({
    multiples: true, uploadDir: "temp/", maxFileSize: 50 * 1024 * 1024, keepExtensions: true, 
    filename: (name, ext, part, form) => { 
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; newName = "";
      for (let i=0;i<16;i++) { newName += characters.charAt(Math.floor(Math.random()*characters.length)) }
      filenameList.push(newName+ext);
      return newName+ext
    }
  }); 
  form.parse(request, function (parseError, fields, files) {
    if (parseError) { 
      response.writeHead(400,{}); 
      response.end(JSON.stringify({"response":"Image uploads failed; please check the validity of your images"})) 
    }
    formData = {};
    for (var key of Object.keys(fields)) { formData[key] = fields[key][0] }
    formData.filenameList = filenameList;
    daFunction(formData);
  });
}

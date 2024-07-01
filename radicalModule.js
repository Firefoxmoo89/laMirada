var fs = require("fs"); var util = require("util"); var formidable = require("formidable");
//var mysql = require("mysql"); 

exports.servePage = (page,status,headers,response) => {
  headers["Content-type"] = "text/html";
  fs.readFile("html/top.html",(errorTop,htmlTop) => { if (errorTop) { console.error(errorTop); }
    fs.readFile("html/bottom.html",(errorBottom,htmlBottom) => { if (errorBottom) { console.error(errorBottom) }
      fs.readFile("html/"+page+".html",(error,fileData) => { if (error) { console.error(error) }
        response.writeHead(status,headers);         
        response.end(htmlTop+fileData+htmlBottom);
      });
    });
  });
}

exports.serveFile = (file,status,headers,response) => {
  fs.readFile(file,(error,fileData) => { if (error) { console.error(error); this.servePage("missing",404,{},response); return }
    response.writeHead(status,headers); 
    response.end(fileData);
  });
};

exports.processPOST = (request,daFunction) => {
  var filenameList = [];
  var form = new formidable.IncomingForm({
    multiples: true, uploadDir: "temp/", maxFileSize: 500 * 1024 * 1024, keepExtensions: true, 
    filename: (name, ext, part, form) => { 
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; newName = "";
      for (let i=0;i<16;i++) { newName += characters.charAt(Math.floor(Math.random()*characters.length)) }
      filenameList.push(newName+ext);
      return newName+ext
    }
  }); 

  form.parse(request, function (parseError, fields, files) {
    if (parseError) { console.log(parseError); daFunction(formData,parseError) } 
    else {
    formData = {};
    for (var key of Object.keys(fields)) { formData[key] = fields[key][0] }
    formData.filenameList = filenameList;
    daFunction(formData,false);
    }
  });
}

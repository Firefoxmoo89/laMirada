var fs = require("fs"); var util = require("util");
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

exports.processPOST = (request,daFunction) => {
  var formData = {}; var stream;
  request.on("data", (chunk) => { stream += chunk } )
  request.on("end", () => { 
    chunks = [];
    while (stream.includes("Content-Disposition")) {
      start = stream.indexOf("Content-Disposition"); stream = stream.slice(start+"Content-Disposition: ".length,-1)+stream.slice(-1,-1); 
      end = stream.indexOf("Content-Disposition"); 
      dataString = stream.slice(0,end); output = {};
      stream = stream.slice(end,-1)+stream.slice(-1,-1);
      type = dataString.slice(0,dataString.indexOf(";"));
      if (!type.includes("image")) {
        dataString = dataString.slice(dataString.indexOf("\"")+1,-1)+dataString.slice(-1,-1);
        daKey = dataString.slice(0,dataString.indexOf("\"")); dataString = dataString.replace(daKey+"\"","");
        dataString = dataString = dataString.slice(dataString.indexOf("\"")+1,-1)+dataString.slice(-1,-1);
        daValue = dataString.slice(0,dataString.indexOf("\"")); dataString = dataString.replace(daValue+"\"","");
        formData[daKey] = daValue;
      }
    }
    daFunction(formData);
  });
}

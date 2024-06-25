require("./instrument.js");
var http = require('http'); var url = require("url"); var fs = require("fs"); 
var rad = require("./radicalModule.js"); var mail = require("./mail.js");

/*
datetime = new Date(); datetime = datetime.toISOString().slice(0,19).replaceAll(":",""); console.log("datetime",datetime);
for (html of ["top.html","bottom.html"]) { console.log("html",html);
  content = fs.readFileSync("html/"+html,"utf8");
  for (location of ["script","style"]) { console.log("location",location);
    files = fs.readdirSync(location); console.log("files",files);
    for (daFile of files) { console.log("daFile",daFile);
      daIndex = content.indexOf(daFile)+daFile.length
    }
  }
  fs.writeFileSync("html/"+html,content);
}
*/
function daServer(request, response) {
  deets = url.parse(request.url, true);
 
  if (deets.pathname == "/") {
      response.writeHead(301, {
        Location: "location",
      });
      response.end();
  }
  else if (deets.pathname == "/location") {
    rad.servePage("location",200,{},response);
  }
  else if (deets.pathname == "/apply") {
    if (request.method == "GET") {
      rad.servePage("apply",200,{},response);
    } else if (request.method == "POST") {
      formData = rad.processPOST(request,(formData,error) => {
        if (error) {
          response.writeHead(400,{}); 
          response.end(JSON.stringify({"response":"Image uploads failed; please check the validity of your images"}));
        } else {
          mail.submittedApplication(formData);
          response.writeHead(200,{});
          response.end(JSON.stringify({"response": "Thank you for your application!\nWe will respond to let you know of our decision through your provided contact methods."}));
        }
      });
    }
  }
  else if (deets.pathname == "/contact") {
    if (request.method == "GET") {
      rad.servePage("contact",200,{},response);
    } else if (request.method == "POST") {
      formData = rad.processPOST(request,(formData,error) => { 
        if (error) { 
          response.writeHead(400,{});
          response.end(JSON.stringify({"response":"An error has occured and the form could not be submitted"}));
          throw error;
        } else {
        mail.sendEmail("Inquiry from "+formData.firstName+" "+formData.lastName,formData.body,"<br>Email: "+formData.daAddress+"<br>Number: "+formData.daNumber+"<br>Prefers: "+formData.contactMethod);
        response.writeHead(200,{});
        response.end(JSON.stringify({"response":"Success! Your message has been sent.\nA response will be sent to you shortly.\nThank you for using our service!"}));
        }
      });
    }
  }
  else if (deets.pathname.includes("/style")) { rad.serveFile(deets.pathname.slice(1),200,{"Content-type":"text/css"},response) }
  else if (deets.pathname.includes("/script")) { rad.serveFile(deets.pathname.slice(1),200,{"Content-type":"text/javascript"},response) }
  else if (deets.pathname.includes("/image")) { rad.serveFile(deets.pathname.slice(1),200,{"Content-type":"image/png"},response) }
  else if (deets.pathname == "/sitemap.xml") { rad.serveFile("sitemap.xml",200,{},response) }
  else { rad.servePage("missing",404,{},response) }
}

http.createServer(daServer).listen(80);
http.createServer(daServer).listen(3000);


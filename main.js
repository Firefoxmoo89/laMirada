var http = require('http'); var url = require("url"); var fs = require("fs"); 
var rad = require("./radicalModule.js"); var mail = require("./mail.js");
console.log("Go to http://localhost")  

http.createServer((request, response) => {
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
      formData = rad.processPOST(request,(formData) => {
        mail.submittedApplication(formData);
        response.writeHead(200,{});
      });        
      response.end(JSON.stringify({"response": "Thank you for your application!\nWe will respond to let you know of our decision through your provided contact methods."}));
    }
  }
  else if (deets.pathname == "/contact") {
    if (request.method == "GET") {
      rad.servePage("contact",200,{},response);
    } else if (request.method == "POST") {
      formData = rad.processPOST(request,(formData) => {
        console.log(formData);
        mail.sendEmail("Inquiry from "+formData.daName,formData.body,formData.daName+"<br>Email: "+formData.daAddress+"<br>Number: "+formData.daNumber+"<br>Prefers: "+formData.contactMethod);
      });
      response.end(JSON.stringify({"response":"Success! Your message has been sent.\nA response will be sent to you shortly.\nThank you for using our service!"}));
    }
  }
  else if (deets.pathname.includes("/style")) { rad.serveFile(deets.pathname.slice(1),200,{"Content-type":"text/css"},response) }
  else if (deets.pathname.includes("/script")) { rad.serveFile(deets.pathname.slice(1),200,{"Content-type":"text/javascript"},response) }
  else if (deets.pathname.includes("/image")) { rad.serveFile(deets.pathname.slice(1),200,{"Content-type":"image/png"},response) }
  else {
    rad.servePage("missing",404,{},response);
  }
}).listen(80);
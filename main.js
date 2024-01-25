var http = require('http'); var url = require("url"); var fs = require("fs"); var rad = require("./radicalModule.js");
console.log("Go to http://localhost:3000")  

http.createServer((request, response) => { // request is object
  

  deets = url.parse(request.url, true); // deets.query for post ? information as object

  if (deets.pathname == "/") {
    response.writeHead(301, {
      Location: "location",
    });
    response.end();
  }
  else if (deets.pathname == "/location") {
    rad.serveFile("template/location.html",200,{"Content-type":"text/html"},response);
  }
  else if (deets.pathname == "/apply") {
    if (request.method == "GET") {
      rad.serveFile("template/apply.html",200,{"Content-type":"text/html"},response);
    } else if (request.method == "POST") {
      // submittedApplication (request)
      response.end(JSON.stringify({"response": "Thank you for your application!\nWe will respond to let you know of our decision through your provided contact methods."}));
    }
  }
  else if (deets.pathname == "/contact") {
    if (request.method == "GET") {
      rad.serveFile("template/contact.html",200,{"Content-type":"text/html"},response);
    } else if (request.method == "POST") {
      formData = deets.query;
      // sendEmail("Inquiry from "+formData.name,formData.body,formData.name+"<br>Email: "+formData.address+"<br>Number: "+formData.number+"<br>Prefers: "+formData.contactMethod);
      response.end(JSON.stringify({"response":"Success! Your message has been sent.\nA response will be sent to you shortly.\nThank you for using our service!"}));
    }
  }
  else if (deets.pathname.includes("/style")) { rad.serveFile(deets.pathname.slice(1),200,{"Content-type":"text/css"},response) }
  else if (deets.pathname.includes("script")) { rad.serveFile(deets.pathname.slice(1),200,{"Content-type":"text/javascript"},response) }
  else if (deets.pathname.includes("image")) { rad.serveFile(deets.pathname.slice(1),200,{"Content-type":"image/png"},response) }
  else {
    rad.serveFile("template/missing.html",404,{"Content-type":"text/html"},response);
  }
}).listen(3000);
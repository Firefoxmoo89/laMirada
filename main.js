var http = require('http'); var url = require("url"); var fs = require("fs"); var rad = require("./radicalModule.js");

http.createServer((request, response) => { // request is object
  
  deets = url.parse(request.url, true); // deets.query for post ? information as object
  fs.readFile("templates/top.html",(error,data) => { htmlTop = data })
  fs.readFile("templates/bottom.html",(error,data) => {htmlBottom = data})
  
  function serveFile(file,status,headers) {
    fs.readFile(file,(error,data) => {
      response.writeHead(status,headers);         // (status 200 ok, response headers object)
      response.write(htmlTop+data+htmlBottom);    // html content
      response.end();
    });
  }

  if (deets.pathname == "/") {
    response.writeHead(302, {
      "Location": "templates/location.html",
    });
    response.end();
  }
  else if (deets.pathname == "/location") {
    serveFile("templates/location.html",200,{"Content-type":"text/html"});
  }
  else if (deets.pathname == "/apply") {
    if (request.method == "GET") {
      serveFile("templates/apply.html",200,{"Content-type":"text/html"});
    } else if (request.method == "POST") {
      // submittedApplication (request)
      response.end(JSON.stringify({"feedback": "Thank you for your application!\nWe will respond to let you know of our decision through your provided contact methods."}));
    }
  }
  else if (deets.pathname == "/contact") {
    if (request.method == "GET") {
      serveFile("template/contact.html",200,{"Content-type":"text/html"});
    } else if (request.method == "POST") {
      formData = deets.query;
      // sendEmail("Inquiry from "+formData.name,formData.body,formData.name+"<br>Email: "+formData.address+"<br>Number: "+formData.number+"<br>Prefers: "+formData.contactMethod);
      response.end(JSON.stringify({"feedback":"Success! Your message has been sent.\nA response will be sent to you shortly.\nThank you for using our service!"}));
    }
  }
  else {
    serveFile("template/missing.html",404,{"Content-type":"text/html"});
  }
console.log("Listening at https://localhost:8080")}).listen(8080);
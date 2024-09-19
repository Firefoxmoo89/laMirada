require("./instrument.js");
var http = require('http'); var url = require("url"); var fs = require("fs"); 
var rad = require("./radicalModule.js"); var mail = require("./mail.js");

datetime = new Date(); datetime = "D"+datetime.toISOString().slice(0,19).replaceAll(":","").replaceAll("-","");
for (html of ["top.html","bottom.html"]) {
  content = fs.readFileSync("html/"+html,"utf8");
  content = content.replace(/\?v=.*\"/g,"?v="+datetime+"\"");
  fs.writeFileSync("html/"+html,content);
}

function daServer(request, response) {
  deets = url.parse(request.url, true);
 
  if (deets.pathname == "/") {
    if (request.method == "GET") {
      response.writeHead(302, {
        Location: "location",
      });
      response.end();
    }
  }
  else if (deets.pathname.includes("/location")) {
    rad.servePage("location",200,{},response);
  }
  else if (deets.pathname.includes("/apply")) {
    if (request.method == "GET") {
      rad.servePage("apply",200,{},response);
    } else if (request.method == "POST") {
      formData = rad.processPOST(request,(formData,error) => {
        if (error) {
          response.writeHead(400,{}); 
          response.end("Image uploads failed; please check the validity of your images");
        } else {
          mail.submittedApplication(formData);
          response.writeHead(200,{});
          response.end("Thank you for your application!\nWe will respond to let you know of our decision through your provided contact methods.");
        }
      });
    }
  }
  else if (deets.pathname.includes("/contact")) {
    if (request.method == "GET") {
      rad.servePage("contact",200,{},response);
    } else if (request.method == "POST") {
      formData = rad.processPOST(request,(formData,error) => { 
        if (error) { 
          response.writeHead(400,{});
          response.end("An error has occured and the form could not be submitted");
          throw error;
        } else {
        mail.sendEmail("Inquiry from "+formData.firstName+" "+formData.lastName,formData.body,"<br>Email: "+formData.daAddress+"<br>Number: "+formData.daNumber+"<br>Prefers: "+formData.contactMethod);
        response.writeHead(200,{});
        response.end("Success! Your message has been sent.\nA response will be sent to you shortly.\nThank you for using our service!");
        }
      });
    }
  }
  else if (deets.pathname.includes("/listings")) { 
   rad.servePage("listings",200,{},response)
  }
  else if (deets.pathname.includes("/style")) { rad.serveFile(deets.pathname.slice(1),200,{"Content-type":"text/css"},response) }
  else if (deets.pathname.includes("/script")) { rad.serveFile(deets.pathname.slice(1),200,{"Content-type":"text/javascript"},response) }
  else if (deets.pathname.includes("/image")) { 
    extension = deets.pathname.slice(deets.pathname.indexOf(".")+1);
    if (extension == "svg") { extension = "svg+xml" }
    rad.serveFile(deets.pathname.slice(1),200,{"Content-type":"image/"+extension},response) 
  }
  else if (deets.pathname == "/sitemap.xml") { rad.serveFile("sitemap.xml",200,{},response) }
  else if (deets.pathname =="/favicon.ico") {rad.serveFile("image/icon/favicon.ico",200,{},response)}
  else { rad.servePage("missing",404,{},response) }
}

http.createServer(daServer).listen(process.env.PORT || 80);


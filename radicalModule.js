var fs = require("fs"); var nodemailer = require("nodemailer"); var mysql = require("mysql"); var secret = require("./secret.json"); var util = require("util");

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

exports.sendEmail = (subject,body,signature,files=[]) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user:secret.sender,
      pass: secret.sendPass
    }
  });
  var mailContent = {
    from: secret.sender,
    to: secret.receiver,
    subject: subject,
    html: "<!DOCTYPE html><html><body>"+body+"<p style=\"color: #ADADAD\">"+signature+"</p></body></html>",
    attachements: [
      { filename: "Palm Tree Homie", path: "image/palmTree.png" }
    ]
  };
  transporter.sendMail(mailContent, function(error, info){
    if (error) { console.log(error) } 
  });
}

exports.submittedApplication = (formData) => {
  daFiles = [];
  //for (let i=0;i<formData.files.to_dict(flat=False);i++) { daFile.push(formData.files[i]) }
  incomeList = ["monthlySalary","monthlySalary1","otherIncomeAmount"]; var totalIncome = 0; 
  for (let i=0;i<incomeList.length;i++) { 
    if (formData[incomeList[i]] != "") { totalIncome += formData[incomeList[i]] } 
  }
  fs.readFile("html/applicationDocument.html",(error,htmlFile) => {
    htmlPage = util.format(htmlFile.toString(),
      formData["firstName"],
      formData["lastName"],
      formData["phoneNumber"],
      formData["emailAddress"],
      
      formData["otherAdults"],
      formData["numOfKids"], 
      formData["numOfPets"],
      formData["petType"],
      formData["numOfDruggies"],
      
      formData["tenantScale"],
      formData["savedAmount"],
      formData["hearAboutUs"],
      formData["moveDate"],
      
      formData["currentAddress"],
      formData["priorAddress"],

      formData["currentMovedIn"],
      formData["currentMovedOut"],
      formData["currentMonthlyRent"],
      formData["priorMovedIn"],
      formData["priorMovedOut"],
      formData["priorMonthlyRent"],

      formData["currentLandlord"],
      formData["currentLandlordPhone"],
      formData["priorLandlord"],
      formData["priorLandlordPhone"],

      formData["currentLeave"],
      formData["priorLeave"],

      formData["companyName"],
      formData["occupation"],
      formData["jobLocation"],
      formData["position"],
      formData["supervisorName"],
      formData["supervisorPhone"],
      formData["schedule"],
      formData["startDate"],
      formData["endDate"],
      formData["monthlySalary"],

      formData["companyName1"],
      formData["occupation1"],
      formData["jobLocation1"],
      formData["position1"],
      formData["supervisorName1"],
      formData["supervisorPhone1"],
      formData["schedule1"],
      formData["startDate1"],
      formData["endDate1"],
      formData["monthlySalary1"],

      formData["otherIncome"],
      formData["otherIncomeAmount"],
      totalIncome,

      formData["parking"],
      formData["lateBills"],
      formData["oddHours"],
      formData["evicted"],
      formData["overnightGuests"],
      formData["sued"],
      formData["againstRules"],
      formData["informedLandlord"],

      formData["person1Name"],
      formData["person1Phone"],
      formData["person1Relationship"],
      formData["person2Name"],
      formData["person2Phone"],
      formData["person2Relationship"]
    );
    this.sendEmail("New Application from "+formData["firstName"]+" "+formData["lastName"],
      htmlPage,
      "",
      daFiles)
  });
}

var fs = require("fs"); var nodemailer = require("nodemailer"); var util = require("util");

exports.sendEmail = (subject,body,signature,filenameList=[]) => {
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user:process.env.sender,
        pass: process.env.sendPass
      }
    });
    attachments = [];
    for (var filename of filenameList) { attachments.push({filename:filename,path:"temp/"+filename}) }
    var mailContent = {
      from: process.env.sender,
      to: process.env.receiver,
      subject: subject,
      html: "<!DOCTYPE html><html><body>"+body+"<p style=\"color: #ADADAD\">"+signature+"</p></body></html>",
      attachments: attachments
    };
    transporter.sendMail(mailContent, function(error, info){
      if (error) { console.log(error) } 
      for (var filename of filenameList) {
        fs.unlink("temp/"+filename, (err) => { if (err) { console.error(err) } });
      }
    });
  }
  
  exports.submittedApplication = (formData) => {
    incomeList = ["monthlySalary","monthlySalary1","otherIncomeAmount"]; var totalIncome = 0; 
    for (let id of incomeList) { if (formData[id] != "") { totalIncome += Number(formData[id]) } }
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
        totalIncome.toString(),
  
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
        formData.filenameList)
    });
  }
  
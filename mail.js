var fs = require("fs"); var nodemailer = require("nodemailer"); var secret = require("./secret.json"); var util = require("util");

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
  
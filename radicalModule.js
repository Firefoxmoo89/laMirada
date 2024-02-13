var fs = require("fs");

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

exports.sendEmail = (subject,body,signature,files=[]) => {
  msg = MIMEMultipart();
	msg["To"] = getenv("emailTo");
	msg["From"] = getenv("emailFrom");
	msg["Subject"] = subject;
	content = MIMEText("<!DOCTYPE html><html><body>"+mainContent+"<p style=\"color: #ADADAD\">"+signature+"</p></body></html>","html");
	msg.attach(content);
  for (let i=0;i<files.length;i++) { msg.attach(MIMEImage(files[i].read())) }
	server = smtplib.SMTP_SSL('smtp.gmail.com', 465);
	server.login(getenv("emailFrom"), getenv("loginPassword"));
	server.send_message(msg);
	server.quit();
}

exports.submittedApplication = (formData) => {
  daFiles = [];
  for (let i=0;i<formData.files.to_dict(flat=False);i++) { daFile.push(formData.files[i]) }
  incomeList = ["monthlySalary","monthlySalary1","otherIncomeAmount"]; toatalIncome = 0; 
  for (let i=0;i<incomeList.length;i++) { 
    if (formData[incomeList[i]] != "") { totalIncome += formData[incomeList[i]] } 
  }
  fs.readFile("html/applicationDocument.html",(error,htmlFile) => {
    htmlPage = htmlFile.format(
      firstName=formData.firstName,
      lastName=formData.lastName,
      phoneNumber=formData.phoneNumber,
      emailAddress=formData.emailAddress,
      
      otherAdults=formData.otherAdults,
      numOfKids=formData.numOfKids, 
      numOfPets=formData.numOfPets,
      petType=formData.petType,
      numOfDruggies=formData.numOfDruggies,
      
      tenantScale=formData.tenantScale,
      savedAmount=formData.savedAmount,
      hearAboutUs=formData.hearAboutUs,
      moveDate=formData.moveDate,
      
      currentAddress=formData.currentAddress,
      currentMovedIn=formData.currentMovedIn,
      currentMovedOut=formData.currentMovedOut,
      currentMonthlyRent=formData.currentMonthlyRent,
      currentLandlord=formData.currentLandlord,
      currentLandlordPhone=formData.currentLandlordPhone,
      currentLeave=formData.currentLeave,
      
      priorAddress=formData.priorAddress,
      priorMovedIn=formData.priorMovedIn,
      priorMovedOut=formData.priorMovedOut,
      priorMonthlyRent=formData.priorMonthlyRent,
      priorLandlord=formData.priorLandlord,
      priorLandlordPhone=formData.priorLandlordPhone,
      priorLeave=formData.priorLeave,

      companyName=formData.companyName,
      occupation=formData.occupation,
      jobLocation=formData.jobLocation,
      position=formData.position,
      supervisorName=formData.supervisorName,
      supervisorPhone=formData.supervisorPhone,
      schedule=formData.schedule,
      startDate=formData.startDate,
      endDate=formData.endDate,
      monthlySalary=formData.monthlySalary,

      companyName1=formData.companyName1,
      occupation1=formData.occupation1,
      jobLocation1=formData.jobLocation1,
      position1=formData.position1,
      supervisorName1=formData.supervisorName1,
      supervisorPhone1=formData.supervisorPhone1,
      schedule1=formData.schedule1,
      startDate1=formData.startDate1,
      endDate1=formData.endDate1,
      monthlySalary1=formData.monthlySalary1,

      otherIncome=formData.otherIncome,
      otherIncomeAmount=formData.otherIncomeAmount,
      totalIncome=totalIncome,

      parking=formData.parking,
      oddHours=formData.oddHours,
      overnightGuests=formData.overnightGuests,
      againstRules=formData.againstRules,
      lateBills=formData.lateBills,
      evicted=formData.evicted,
      sued=formData.sued,
      informedLandlord=formData.informedLandlord,

      person1Name=formData.person1Name,
      person1Phone=formData.person1Phone,
      person1Relationship=formData.person1Relationship,
      person2Name=formData.person2Name,
      person2Phone=formData.person2Phone,
      person2Relationship=formData.person2Relationship,
      
      signature=formData.signature,
      signDate=formData.signDate
    )
    sendEmail("New Application from "+formData.firstName+" "+formData.lastName,
      htmlPage,
      "",
      daFiles)
  });
}

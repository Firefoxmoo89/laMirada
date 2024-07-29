function ignoreEvent(event) { event.preventDefault(); event.stopPropagation() }

function toggleProcessCursor(element) {
	if (element.classList.contains("forceProgress")) { 
		element.classList.remove("forceProgress");
		element.removeEventListener("click",ignoreEvent,true)	
	}
	else { 
		element.classList.add("forceProgress");
		element.addEventListener("click",ignoreEvent,true)	
	} 
}

function toggleDisplay(selector,option1="none",option2="block") {
	element = document.querySelector(selector);
	if (element.style.display == option1) { element.style.display = option2 }
	else { element.style.display = option1 }
}

async function fetchadids(source, type, options, daFunction=false) {
	if (type == "json") { function process(response){return response.json()} } 
	else if (type == "text") { function process(response){return response.text()} }
	else { function process(response){return response.text()} }
	await fetch(source,options).then(process)
	.then(data => { if (daFunction != false) { daFunction(data) } else { console.log("fetch at",source,":",data) } })
}

function telFormat(element) {
	element.value = element.value.replace(/[\D\s\._\-]+/g, "");
		if (element.value.length>10) { element.value = element.value.slice(0,10) }
		theGuts = element.value;

		part1=""; part2=""; part3="";
		if (theGuts.length<=3) { part1 = theGuts }
		else if (theGuts.length>3 && theGuts.length<=6) {	part1 = theGuts.slice(0,3); part2 = theGuts.slice(3,-1)+theGuts.slice(-1)	}
		else if (theGuts.length>6 && theGuts.length<=10) { part1 = theGuts.slice(0,3); part2 = theGuts.slice(3,6); part3 = theGuts.slice(6,-1)+theGuts.slice(-1) }
		element.value = part1;
		if (part2!="") { element.value += "-"+part2 }
		if (part3!="") { element.value += "-"+part3 }
}

function isVisible(element) {
	const { top,bottom } = element.getBoundingClientRect();
	return (top>0 || bottom>0) && top < window.innerHeight;
}

var invalidSpan = document.createElement("span"); invalidSpan.innerHTML = " *Required";invalidSpan.setAttribute("class","invalid"); 
function validateInput(daInput,display="inline") {
	if (daInput.required) {
		newInvalid = invalidSpan.cloneNode(true); newInvalid.style.display = display;
		daLabel = document.querySelector("label[for='"+daInput.id+"']");
		if (daLabel.querySelector(".invalid") != null) { daLabel.querySelector(".invalid").remove() }
		if (daInput.type == "radio" || daInput.type == "checkbox") {
			daLabel = document.querySelector("#"+daInput.name+"Label"); if (daLabel == null) {console.error(daInput)}
			if (document.querySelector("input[name='"+daInput.name+"']:checked") == null) { 
				if (daLabel.querySelector(".invalid") == null) {
				daLabel.appendChild(newInvalid); return false
				}
			} else if (daLabel.querySelector(".invalid")!=null) { daLabel.querySelector(".invalid").remove() }
		} else if (daInput.type == "tel") {	telFormat(daInput);	
			if ( daInput.value.length<12) { daLabel.appendChild(newInvalid); return false }
		}	else if (daInput.value=="") { daLabel.appendChild(newInvalid); return false }	
	} return true
}
function validateInputs(parent=document,display="inline",selectors="input[required],textarea[required],select[required]") { 
	inputList = parent.querySelectorAll(selectors); validParent = true; var i;
	if (inputList.length > 0) {																
		for (i=0;i<inputList.length;i++) { 
			if(!validateInput(inputList[i],display)) { validParent = false }
		}
	} return validParent
}

function constValidate(parent=document,display="inline",selectors="input[required],textarea[required],select[required]") {
	inputList = parent.querySelectorAll(selectors);
  for (daInput of inputList) { daInput.addEventListener("input",event=>{validateInput(event.target,display)}) }
}

function inputFinder(parent=document,selectSelectors,labelSelectors) {
	function collect(direction=false) {
		if (document.querySelector(".blinky")!=null) { document.querySelector(".blinky").classList.remove("blinky") }
		requiredList = parent.querySelectorAll(".invalid"); requiredList = Array.from(requiredList);
		parent.querySelector(labelSelectors[1]).innerText = requiredList.length.toString();
		indexSpan = parent.querySelector(labelSelectors[0]); 
		if (direction == false) { index = 0 }
		else if (direction == "up") { index = Number(parent.querySelector(labelSelectors[0]).innerText-2)
		} else { index = Number(parent.querySelector(labelSelectors[0]).innerText) }
		indexSpan.innerText = index+1;
		selected = requiredList[index];
		selected.scrollIntoView({behavior:"smooth",block:"center"});
		selected.parentElement.classList.add("blinky");
	} collect();
	function collectUp(event) { collect("up") } function collectDown(event) {collect("down") }
	parent.querySelector(selectSelectors[0]).addEventListener("click",collectUp);
	parent.querySelector(selectSelectors[1]).addEventListener("click",collectDown);		
}

function storeForm(parent=document,selectors="input:not([data-autofill='ignore'],[type='file']),select:not([data-autofill='ignore']),textarea:not([data-autofill='ignore'])") {
	try { elementList = parent.querySelectorAll(selectors) } 
	catch(error) { console.error(error); elementList = parent.querySelectorAll("input,textarea,select") }
	for (element of elementList) {
		key = element.name; 
		if (element.type == "radio") {	
			value = document.querySelector("input[name='"+key+"']:checked").value;
			localStorage.setItem(key,value); 
		}	else if (element.type == "checkbox") {
			boxList = document.querySelectorAll("input[name='"+element.name+"']:checked"); 
			value = ""; for (checked of boxList) { value += checked.value+"," }
			localStorage.setItem(key,value);
		} else { localStorage.setItem(element.name, element.value) }
	}
}

function constStoreForm(parent=document,selectors="input:not([data-autofill='ignore'],[type='file']),select:not([data-autofill='ignore']),textarea:not([data-autofill='ignore'])") {
	try { elementList = parent.querySelectorAll(selectors) } 
	catch(error) { console.error(error); elementList = parent.querySelectorAll("input,textarea,select") }
	for (element of elementList) {
		element.addEventListener("change",event => { 
			changedInput = event.target; key = changedInput.name; 
      if (changedInput.type == "radio") {	
        value = document.querySelector("input[name='"+key+"']:checked").value;
        localStorage.setItem(key,value); 
      }	else if (changedInput.type == "checkbox") {
        boxList = document.querySelectorAll("input[name='"+changedInput.name+"']:checked"); 
        value = ""; for (checked of boxList) { value += checked.value+"," }
				localStorage.setItem(key,value);
      } else { localStorage.setItem(changedInput.name, changedInput.value) }
    })
	}
}

function loadForm(parent=document,selectors="input:not([data-autofill='ignore'],[type='file']),select:not([data-autofill='ignore']),textarea:not([data-autofill='ignore'])") {
	try { elementList = parent.querySelectorAll(selectors) } 
	catch(error) { console.error(error); elementList = parent.querySelectorAll("input,textarea,select") }
	for (element of elementList) { 
		key = element.name;
		if (localStorage.getItem(key)!="" && localStorage.getItem(key)!=null) { 
			value = localStorage.getItem(key); 
			if (element.type == "radio") { parent.querySelector("input[name='"+key+"'][value='"+value+"']").checked = true }
			else if (element.type == "checkbox") { 
				valueList = value.split(",");
				for (let daValue of valueList) { 
					if (daValue != "") { parent.querySelector("input[name='"+key+"'][value='"+daValue+"']").checked = true }
				}
			} else { element.value = value }
		}
    if (element.type == "range") { element.nextElementSibling.innerHTML = element.value }
  }
}

function submitForm(source, daFunction, selectors="input:not([data-submitform='ignore']),textarea:not([data-submitform='ignore']),select:not([data-submitform='ignore'])", daParent=document) {
	daFormData = new FormData(); finishedOptions = []; 
	try { inputList = daParent.querySelectorAll(selectors) } 
	catch(error) { console.error(error); inputList = daParent.querySelectorAll("input,textarea,select") }
	for (let daInput of inputList) { try {
		if (daInput.type == "file") { for ( let ii=0;ii<daInput.files.length;ii++) {	daFormData.append(daInput.name+ii.toString(),daInput.files[ii])	}	}
		else if (daInput.type == "radio" || daInput.type == "checkbox") { daName = daInput.name; daValue = daParent.querySelector("input[name='"+daName+"']:checked").value;
			if (!finishedOptions.includes(daName)&&daValue!=null) {daFormData.append(daName,daValue); finishedOptions.push(daName) }																				 
		} else { daFormData.append(daInput.name,daInput.value) }																
	} catch(error) { daFormData.append(daInput.name,"[not filled]") } }
	fetchadids(source, "text", { method: "POST", body: daFormData }, daFunction);
}
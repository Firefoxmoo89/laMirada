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

async function fetchadids(source, options, daFunction) {
	await fetch(source,options)
	.then(response => response.json())
	.then(data => { daFunction(data) })
}
invalidSpan = document.createElement("span"); invalidSpan.innerHTML = "*Required";invalidSpan.setAttribute("class","invalid"); 
function validateInput(daInput,display="inline") {
	if (daInput.required) {
		newInvalid = invalidSpan.cloneNode(true); newInvalid.style.display = display;
		daLabel = document.querySelector("label[for='"+daInput.id+"']");
		if (daLabel.querySelector(".invalid") != null) { daLabel.querySelector(".invalid").remove();trash=true }
		if (daInput.type == "radio" || daInput.type == "checkbox") {
			daLabel = document.querySelector("#"+daInput.name+"Label");
			console.log(daInput,"checked", document.querySelector("input[name='"+daInput.name+"']:checked") != null,"has label", document.querySelector("#"+daInput.name+"Label").querySelector(".invalid") != null);
			if (document.querySelector("input[name='"+daInput.name+"']:checked") == null) { 
				if (document.querySelector("#"+daInput.name+"Label").querySelector(".invalid") == null) {
				document.querySelector("#"+daInput.name+"Label").appendChild(newInvalid); return false; console.log("duck",document.querySelector("#"+daInput.name+"Label").querySelector(".invalid") == null);
				} else {console.log("sup")} 
			} else if (document.querySelector("#"+daInput.name+"Label").querySelector(".invalid")!=null) { document.querySelector("#"+daInput.name+"Label").querySelector(".invalid").remove() }
		} else if (daInput.type == "tel" && daInput.value.length<12) { daLabel.appendChild(newInvalid); return false }
		else if (daInput.value=="") { daLabel.appendChild(newInvalid); return false }	
	} return true
}
function validateInputs(parentElement=document,display="inline",selectors="input[required],textarea[required],select[required]") { 
	inputList = parentElement.querySelectorAll(selectors); validParent = true; var i;
	if (inputList.length > 0) {																
		for (i=0;i<inputList.length;i++) { 
			if(!validateInput(inputList[i],display)) { validParent = false }
		}
	} return validParent
}

function submitForm(source, daFunction, selectors="input:not([data-submitform='ignore']),textarea:not([data-submitform='ignore']),select:not([data-submitform='ignore'])", daParent=document) {
	daFormData = new FormData();
	inputList = daParent.querySelectorAll(selectors); finishedOptions = []; 
	for (let i=0;i<inputList.length;i++) { daInput = inputList[i];
		if (daInput.type == "file") { for ( let ii=0;ii<daInput.files.length;ii++) {	daFormData.append(daInput.name+ii.toString(),daInput.files[ii])	}	}
		else if (daInput.type == "radio" || daInput.type == "checkbox") { daName = daInput.name; daValue = daParent.querySelector("input[name='"+daName+"']:checked").value;
			if (!finishedOptions.includes(daName)&&daValue!=null) {daFormData.append(daName,daValue); finishedOptions.push(daName) }																				 
		} else { daFormData.append(daInput.name,daInput.value) }																
	} 
	fetchadids(source, { method: "POST", body: daFormData }, daFunction);
}
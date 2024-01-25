function contentLines(content,site) {
	document.getElementById("main-content").innerHTML = content;
	if (article.querySelector("h1") != null) { daTitle = article.querySelector("h1").innerText } 
	else if (article.querySelector("h2") != null) { daTitle = article.querySelector("h2").innerText }
	else if (article.querySelector("h3") != null) { daTitle = article.querySelector("h3").innerText }
	else { daTitle = "Untitled"	}
	document.title = daTitle+" - La Mirada Mobile Home Park";
}

function populateArticles(id, fileList, contentList, path, number) {
	element = document.querySelector("#"+id);
	fileList = fileList.slice(0,number); finalString = "";
	contentList = contentList.slice(0,number);
	for (i=0;i<contentList.length;i++) { item=contentList[i];
		finalString += "<div class=\"articleDiv\"> \
			<a href=\""+path+fileList[i].slice(0,-5)+"\"> \
			<article class=\"post__card height-full\">"+contentList[i]+"</article></a></div>";
	} element.innerHTML = finalString;
	
	articleList = element.querySelectorAll("article"); 
	for (i=0;i<articleList.length;i++) {article=articleList[i]; 
		
		if (article.querySelector("h1") != null) { daTitle = article.querySelector("h1").innerHTML } 
		else if (article.querySelector("h2") != null) { daTitle = article.querySelector("h2").innerHTML }
		else if (article.querySelector("h3") != null) { daTitle = article.querySelector("h3").innerHTML }
		else { daTitle = "Untitled"	}
																			
		if (article.querySelector("img") != null) { daBanner = article.querySelector("img").src }	
		else { daBanner = "" }
																			
		article.innerHTML = "<div class=\"post__card--image\" style=\"background-image: url('"+daBanner+"')\"> \
			<div class=\"post__card--title\">"+daTitle+"</div></div> \
			<div class=\"post__card--content\"><div class=\"post__card--excerpt\">"+article.innerText.slice(0,200)+"&hellip;</div></div>";
	} 
}

function writePythonHTML(id,content) {
	document.getElementById(id).innerHTML = content;
}

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

async function fetchadids(source, options, daFunction) {
	await fetch(source,options)
	.then(response => response.json())
	.then(data => { daFunction(data) })
}

function hide(selector,all=false,parent=document) {
	if (all) {
		elementList = parent.querySelectorAll(selector);
		for (i=0;i<elementList.length;i++) { elementList[i].style.display = "none" }
	} else { parent.querySelector(selector).style.display = "none" }
}

function reveal(selector,all=false,parent=document) {
	if (all) {
		elementList = parent.querySelectorAll(selector);
		for (i=0;i<elementList.length;i++) { elementList[i].style.display = "block" }
	} else { parent.querySelector(selector).style.display = "block" }
}

function mark(daInput,display="inline") {
	invalidSpan = document.createElement("span"); invalidSpan.innerHTML = "*Required";
	invalidSpan.setAttribute("class","invalid"); invalidSpan.style.display = display;
	if (daInput.parentElement.querySelector(".invalid")==null) { daInput.parentElement.appendChild(invalidSpan) }
}
function validateInput(daInput,display="inline") { 
	if (daInput.required) {
		if (daInput.parentElement.querySelector(".invalid")!=null) { daInput.parentElement.removeChild(daInput.parentElement.querySelector(".invalid")) }
		if (daInput.type == "radio" || daInput.type == "checkbox") { 
			if (document.querySelector("input[name='"+daInput.name+"']:checked") == null) { mark(daInput,display); return false } 
		} else if (daInput.type == "tel" && daInput.value.length<14) { mark (daInput,display); return false }
		else if (daInput.value=="") { mark(daInput,display); return false }	
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
	daFormData = new FormData(); var i;
	inputList = daParent.querySelectorAll(selectors); finishedOptions = [];
	for (i=0;i<inputList.length;i++) { daInput = inputList[i];
		if (daInput.type == "file") { for (ii=0;ii<daInput.files.length;ii++) {	daFormData.append(daInput.name+ii.toString(),daInput.files[ii])	}	}
		else if (daInput.type == "radio" || daInput.type == "checkbox") { name = daInput.name; daValue = daParent.querySelector("input[name='"+name+"']:checked").value;
			if (!finishedOptions.includes(name)&&daValue!=null) {daFormData.append(name,daValue); finishedOptions.push(name) }																				 
		}	else { daFormData.append(daInput.name,daInput.value) }																
	}
	fetchadids(source, { method: "POST", body: daFormData }, daFunction);
}

function toggleDisplay(selector,display1="none",display2="block") {
	let daList = document.querySelectorAll(selector); let i;
	for (i=0;i<daList.length;i++) { daElement = daList[i];
		if (daElement.style.display == display1) { daElement.style.display = display2 }
		else if (daElement.style.display == display2) { daElement.style.display = display1 }
	}
}

function listenerValidate(selectors="input,select,textarea",daParent=document,display="block") {
	inputList = daParent.querySelectorAll(selectors);
	for (i=0;i<inputList.length;i++) { inputList[i].addEventListener("change",event=>{validateInput(event.target,display)}) }
}
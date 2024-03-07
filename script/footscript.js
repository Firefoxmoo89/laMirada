telInputList = document.querySelectorAll("input[type=tel]");
for (i=0;i<telInputList.length;i++) { 
	telInputList[i].addEventListener("keyup", function(event) { telInput = event.target;
		
		selection = window.getSelection().toString(); 
		if (selection!=='' || [38,40,37,39].includes(event.keyCode)) { return }
		
		telInput.value = telInput.value.replace(/[\D\s\._\-]+/g, "");
		if (telInput.value.length>10) { telInput.value = telInput.value.slice(0,10) }
		theGuts = telInput.value;

		part1=""; part2=""; part3="";
		if (theGuts.length<=3) { part1 = theGuts }
		else if (theGuts.length>3 && theGuts.length<=6) {	part1 = theGuts.slice(0,3); part2 = theGuts.slice(3,-1)+theGuts.slice(-1)	}
		else if (theGuts.length>6 && theGuts.length<=10) { part1 = theGuts.slice(0,3); part2 = theGuts.slice(3,6); part3 = theGuts.slice(6,-1)+theGuts.slice(-1) }
		if (part1!="") { telInput.value = "("+part1 }
		if (part2!="") { telInput.value += ") "+part2; }
		if (part3!="") { telInput.value += "-"+part3; }
	});
}

document.querySelector("button#mobileNav").addEventListener("click", () => { 
	nav = document.querySelector("nav"); 
	if (nav.style.display == "none") { nav.style.display = "flex" }
	else { nav.style.display = "none" }
});


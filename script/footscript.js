telInputList = document.querySelectorAll("input[type=tel]");
for (input of telInputList) { input.addEventListener("input", (event) => { telFormat(event.target) }) }

document.querySelector("button#mobileNav").addEventListener("click", () => { 
	nav = document.querySelector("nav"); 
	if (nav.style.display != "flex") { nav.style.display = "flex" }
	else { nav.style.display = "none" }
});


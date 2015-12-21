console.log("---portfolio.js---");
nv.functions.cascade([nv.selectors.spreads.children[0].children[0], document.getElementById("hero")]);
nv.functions.grid(2);
var projects = "projects/";
nv.functions.get(projects, function (e) {
	console.log("projects downloaded");
	var filelist = JSON.parse(e.target.response),
		x = filelist.length,
		refined = [];
	while (x--) {
		if (filelist[x].indexOf(".") === 0) filelist[x] = !!0
		else if (filelist[x].indexOf("index.php") !== -1) filelist[x] = !!0
		if (filelist[x]) refined.push(filelist[x])
	}
	x = refined.length;
	var srcLI = document.createElement("LI"),
		srcA = document.createElement("A"),
		srcDIV = document.createElement("DIV"),
		srcP = document.createElement("P"),
		frag = document.createDocumentFragment();
	while (x--) {
		var div = srcDIV.cloneNode(!!0),
			innerDiv = srcDIV.cloneNode(!!0),
			a = srcA.cloneNode(!!0),
			p = srcP.cloneNode(!!0);
		p.textContent = refined[x];
		innerDiv.appendChild(p);
		div.appendChild(innerDiv);
		// div.textContent = refined[x];
		div.style.backgroundImage = ["url(", projects, refined[x].replace(/\s/g, "%20"), "/hero.jpg", ")"].join("");
		a.appendChild(div);
		a.href = "projects/" + refined[x];
		frag.appendChild(a);
	}
	document.getElementById("projects").appendChild(frag);
});

nv.selectors.Navigation.addEventListener("click", function (e) {
	if (!nv.booleans.projects && e.target.textContent == "Projects") {
		nv.booleans.projects = !0;
		nv.functions.cascade([document.getElementById("projects")])
	}
});

var foreground = document.getElementsByTagName("foreground")[0];
window.addEventListener("scroll", function () {
	foreground.className = nv.spreads.active.el.id // Foreground color change.
	nv.selectors.A3.addEventListener("click", function () { // When using the nav it does not fire scroll.
		if (!nv.booleans.projects) {
			nv.booleans.projects = !0; // Switch to not run again.
			nv.functions.cascade([document.getElementById("projects")])
		}
	});
	if (!nv.booleans.projects && nv.spreads.active.el.id == "Projects") {
		nv.booleans.projects = !0;
		nv.functions.cascade([document.getElementById("projects")])
	}
});
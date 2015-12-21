! function () { //util\experimental
	"use strict";

	window.addEventListener("keydown", function (e) {
		switch (e.keyIdentifier) {
		case "Right":
			window.scrollBy(0, nv.spreads.active.el.clientHeight)
			break;
		case "Left":
			window.scrollBy(0, -nv.spreads.active.el.clientHeight)
			break;
		case "Down":
			nv.functions.scroll(nv.spreads.active.el.clientHeight, 250)
			break;
		case "Up":
			nv.functions.scroll(-nv.spreads.active.el.clientHeight, 250)
			break;
		}
	});
	nv.functions.scroll = function (Y, duration, callback) {
		var start = Date.now(),
			elem = document.documentElement.scrollTop ? document.documentElement : document.body,
			from = elem.scrollTop;
		Y += from;
		if (from === Y && callback) {
			callback();
			return
		}

		function scroll(timestamp) {
			function min(a, b) {
				return a < b ? a : b
			}
			var currentTime = Date.now(),
				t = min(1, ((currentTime - start) / duration)),
				easedT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
			elem.scrollTop = (easedT * (Y - from)) + from;
			if (t < 1) requestAnimationFrame(scroll)
			else if (callback) callback()
		}
		requestAnimationFrame(scroll)
	};


	nv.functions.newspread = function (DOMelement) { // Add 'native' spread, without a URL.
		var spreadel = new Spread(DOMelement);
		nv.selectors.spreads.insertBefore(spreadel.el, nv.selectors.spreads.children[nv.selectors.spreads.childElementCount - 1]); // Insert new spread before footer in DOM.
		nv.spreads.models.push(spreadel); // Register to controller.
		return spreadel
	};
	nv.functions.killspread = function (target) {
		var newtarget = document.getElementById(target);
		nv.selectors.spreads.removeChild(newtarget); // Remove spread from DOM.
		var x = nv.spreads.models.length;
		while (x--) {
			if (nv.spreads.models[x].el === newtarget) nv.spreads.models.splice(x, 1); // Search and remove from controller. // Need to test second argument.
		}
		nv.functions.respawn()
	};
	nv.functions.respawn = function (settings, callback) {
		settings = settings || { // If "settings" resolves to false, make a dummy object.
			functions: {}
		};
		settings.functions.respawn = spawner ? spawner : !1 // Passing in respawn function for future use, only normally accessible upon program launch.
		spawner(settings, typeof callback == "function" ? callback : !1)
	};
	nv.functions.install = function (target, callback) { // NVAPI
		nv.functions.get(["http://api.inventumdigital.com/install/", target, ".js"].join(""), function (e) {
			var s = document.createTextNode(e.target.response);
			var sc = document.createElement("SCRIPT").appendChild(s);
			document.body.appendChild(sc);
			if (typeof callback == "function") callback(e)
			return !0
		});
	};


	nv.functions.cascade = function (target) { // fades in elements sequentially
		nv.selectors.cascade = Array.isArray(target) ? target : [target]
		nv.numbers.cascadeDuration = 61.25;
		nv.numbers.cascadeTimeId = window.setInterval(function () {
			if (nv.selectors.cascade && nv.selectors.cascade[0] !== undefined) {
				var el = nv.selectors.cascade.pop(),
					x = el.children.length;
				while (x--) {
					el.children[x].setAttribute("data-timeout", x);
					window.setTimeout(function () {
						++x;
						if (el.children[x].getAttribute("data-timeout") == x) {
							if (el.children[x].tagName === "svg") el.children[x].setAttribute("class", "Active");
							else {
								var cl = el.children[x].className;
								if (cl != "") el.children[x].className = cl + " Active";
								else el.children[x].className = "Active";
							}
						}
					}, el.children[x].getAttribute("data-timeout") * nv.numbers.cascadeDuration);
				}
			} else clearInterval(nv.numbers.cascadeTimeId);
		}, 250)
	};
	nv.functions.testinject = function () { // tests spread injection and respawn..
		var a = document.createElement("section");
		a.id = "Injected";
		var b = document.createElement("p");
		b.innerHTML = "TESTINJECT";
		a.appendChild(b);
		a.id = "testinject";
		var c = nv.functions.newspread(a);
		nv.functions.respawn({
			booleans: {
				respawn: !0
			},
			functions: {
				respawn: nv.functions.respawn
			}
		})
	};
	nv.functions.grid = function (number) {
		number *= 48;
		var x = window.innerWidth / number,
			y = window.innerHeight / number;
		++y;
		number = Math.floor(x) * Math.floor(y);
		var body = document.body[0],
			style = document.createElement("style"),
			CSS = "",
			subStyle = [],
			attribute = "animation",
			keyframes = "twinkle";
		var x = 0xff;
		while (x--) {
			var out = function prefixes(attribute, animationName, time) {
				var constuct = attribute + ":" + animationName + " " + time + "s cubic-bezier(0,1,1,1) infinite;",
					moz = "-moz-" + constuct,
					o = "-o-" + constuct,
					webkit = "-webkit-" + constuct,
					shell = [moz, o, webkit, constuct];
				shell = shell.join("");
				return shell
			}(attribute, keyframes, x);
			subStyle[x] = "*.grid .t" + x + "{" + out + "}"
		}
		CSS = subStyle.join("");
		var prefix = ["-moz-", "-o-", "-webkit-", ""];
		var x = prefix.length;
		while (x--) {
			var data = [
				"0%{background:rgba(255,255,255,0)}",
				"50%{background:rgba(255,255,255,.030625)}",
				"75%{background:rgba(255,255,255,.06125)}",
				"100%{background:rgba(255,255,255,0)}"
			];
			CSS += "@" + prefix[x] + "keyframes twinkle{" + data.join("") + "}"
		}
		if (style.styleSheet) css.styleSheet.cssText = CSS;
		else style.appendChild(document.createTextNode(CSS));
		document.getElementsByTagName("head")[0].appendChild(style);
		String.prototype.repeat = function (num) {
			return new Array(num + 2).join(this)
		};
		var grid = "<div class='out'><div class='st0'></div></div>",
			bkg = document.getElementsByClassName("grid")[0].innerHTML = grid.repeat(number),
			cells = document.getElementsByClassName("st0"),
			cSelect = cells.length - 1,
			counter = cSelect,
			theTimer = function () {
				clearInterval(newInterval);
				if (cSelect >= 0) {
					var randomNumber = Math.ceil(Math.random() * 0xff);
					if (randomNumber < 0x80) randomNumber += randomNumber
					var time = "t" + randomNumber;
					cells[cSelect].className = "st0 st1 " + time;
				}
				counter /= 2;
				counter = Math.ceil(counter);
				cSelect--;
				number = cSelect;
				newInterval = setInterval(theTimer, counter)
			};
		var newInterval = setInterval(theTimer, counter)
	};
	nv.functions.fetchApp = function () {
		var ajax = new XMLHttpRequest;
		ajax.open("GET", nv.spreads.active.el.getAttribute("data-injected") + "/application")
		ajax.addEventListener("load", function () {
			if (this.status === 200 && this.readyState === 4) {
				nv.objects.lastApp = this;
				var iframe = document.createElement("iframe");
				iframe.src = nv.spreads.active.el.getAttribute("data-injected") + "/application";
				nv.spreads.active.el.children[0].appendChild(iframe);
			} else if (this.status === 404 && this.readyState === 4) nv.functions.fallbackFetch()
		});
		ajax.send()
	};
	nv.functions.fallbackFetch = function () { // copy-pasted fetchApp...can be optimized
		var ajax = new XMLHttpRequest;
		ajax.open("GET", nv.spreads.active.el.getAttribute("data-injected"))
		ajax.addEventListener("load", function () {
			if (this.status === 200 && this.readyState === 4) {
				nv.objects.lastApp = this;
				var iframe = document.createElement("iframe");
				iframe.src = nv.spreads.active.el.getAttribute("data-injected");
				nv.spreads.active.el.children[0].appendChild(iframe);
			} else if (this.status === 404 && this.readyState === 4) {
				var div = document.createElement("div");
				div.innerHTML = "<p>No Application Found! 😭</p>"
				nv.spreads.active.el.children[0].appendChild(div);
			}
		});
		ajax.send()
	};

}();
// nv.functions.motto = function (array) {
// 	nv.selectors.hero = document.getElementById("hero");
// 	var hero = nv.selectors.hero,
// 		x = array.length,
// 		y = array.length,
// 		div_src = document.createElement("div"),
// 		motto_frag = document.createDocumentFragment();
// 	this.nv.selectors.mottoel = [];
// 	window.setTimeout(function () {
// 		console.log(this.nv.selectors.mottoel)
// 		hero.children[0].setAttribute("class", "Hide");
// 		window.setTimeout(function () {
// 			var container_frag = motto_frag.cloneNode(!!0),
// 				container = div_src.cloneNode(!!0);
// 			container.id = "motto";
// 			while (x--) {
// 				var div = div_src.cloneNode(!!0);
// 				div.innerHTML = array[x];
// 				div.className = "Hide";
// 				this.nv.selectors.mottoel[x] = div;
// 				motto_frag.appendChild(div);
// 			}
// 			container.appendChild(motto_frag);
// 			container_frag.appendChild(container);
// 			var splash = hero.getElementsByTagName("svg")[0];
// 			hero.insertBefore(container_frag, splash);
// 			splash.parentNode.removeChild(splash);
// 			// next step
// 			var theClas = "";
// 			var t1 = window.setInterval(function () {
// 				if (!y) y = array.length;
// 				var z = array.length;
// 				while (z--) this.nv.selectors.mottoel[z].className = "Hide";
// 				this.nv.selectors.mottoel[--y].className = "";
// 			}, 3000)
// 		}, 500)
// 	}, 3000)
// }("Design,Video,Web,Discover Your Image,Discover Your Story,Discover Excellence".split(",").reverse());
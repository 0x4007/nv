function nv(settings, callback) { // invntm.js / zeta.
	"use strict";

	function Spread(el) {
		this.el = el;
		return this;
	}
	Spread.prototype = {
		wrap: function () { // Constructs vertical-align: middle Spread by placing all content inside of a cell, as well as removing white-space in HTML (inline-block bug fix).
			var spread = this,
				el = spread.el,
				inner = el.innerHTML;
			if (el.children[0]) { // Might be redundant - but this is for handling injecting an empty spread.
				if (el.children[0].getAttribute("onclick") != "" && el.children[0].tagName != "ARTICLE") { // For respawn, check if null-onclick-article is the child, a signature of generated spreads.
					el.innerHTML = ['<article onclick>', el.innerHTML.replace(/\n\s+/g, ''), '</article>'].join(""); // Inserts AJAX'd HTML, and removes line indentation, for pretty DOM and "display: inline-block" bug fix.
				} else nv.booleans.respawn = !0 // Sound the alarm!.
			}
			return spread;
		},
		addClass: function (clas) { // Polyfill for classList.add().
			var el = this.el,
				classNames = el.className.split(' ');
			if (classNames[0] === '') classNames.shift()
			if (classNames.indexOf(clas) === -1) {
				classNames.push(clas);
				el.className = classNames.join(' ');
			}
			return this;
		},
		removeClass: function (clas) { // Polyfill for classList.remove().
			var el = this.el,
				classNames = el.className.split(' '),
				cnIndex = classNames.indexOf(clas);
			if (cnIndex !== -1) {
				classNames.splice(cnIndex, 1);
				el.className = classNames.join(' ');
			}
			return this;
		}
	};

	function Spreads(els, inject) { // Spread constructor and adds each to controller. Also marks which spreads will be AJAX filled later in the program.
		this.models = []; // Spreads completed prototype looks like: ".models", ".injected", ".active".
		if (inject) {
			this.injected = [];
			var x = inject.injected.length,
				sectionSRC = document.createElement("section");


			while (x--) {
				var section = sectionSRC.cloneNode(!!0); // The most efficient way to recreate an element.

				if (typeof inject.injected[x] == "string") { // URL hopefully. This is the proper way to pass in injected spreads.
					var tempid = inject.injected[x].split("/");
					section.setAttribute("data-injected", inject.injected[x]); // Stores the URL of the spread's target file, read later during AJAX for injection.
					section.innerHTML = ['<article>Inserting "', inject.injected[x], '" now.</article>'].join(""); // Test performance hit to possibly remove because this is only visible if the user has an incredibly slow connection.
				} else if (typeof inject.injected[x] == "object" && inject.injected[x] instanceof HTMLElement) { // Handler for improper way to pass in injected spreads (as an actual spread HTML object.)
					if (inject.injected[x].getAttribute("data-injected")) {
						console.warn("You passed in a previously injected spread in \"spreads.injected\". Please pass in a URL.");
						continue; // Skip this one.
					}
				} else {
					console.error("You passed in something unexpected for the injected spreads. Please pass in a URL.");
					continue;
				}

				tempid = tempid[tempid.length - 1].split(".")[0]; // Remove AJAX target file path, and file extension (typically ".html")
				section.id = tempid.charAt(0).toUpperCase().concat(tempid.slice(1)); // Capitalize the first character.

				// if (els[0]) els[0].parentNode.insertBefore(section, els[els.length - 1]); // Place spread in DOM before last spread.
				// else
				nv.selectors.spreads.appendChild(section) // If no existing spread(s), just append this spread.
				this.injected.unshift(section); // Place "section" into beginning of nv.spreads.injected
			}
		}
		this.add(els);
		return this;
	}
	Spreads.prototype = {
		add: function (els) {
			var spreads = this.models,
				i = 0,
				len = els.length;
			if (typeof len !== 'number') els = [els]
			while (len > i) spreads.push(new Spread(els[--len]))
			return this;
		},
		each: function (fn) {
			var spreads = this,
				spreadArr = spreads.models,
				x = spreadArr.length;
			while (x--) fn(spreadArr[x])
			return spreads;
		},
		wrapAll: function () {
			this.each(function (spread) {
				spread.wrap()
			});
			return this
		},
		eq: function (num) {
			return this.models[num]
		},
		hero: function () {
			return this.models[this.models.length - 1]
		},
		measure: function () {
			var spreads = this;
			spreads.each(function (spread) {
				var overHalf = spread.el.getBoundingClientRect().top < window.innerHeight / 2
				if (overHalf) spreads.active = spread
			});
			spreads.each(function (spread) {
				if (spread == spreads.active) spread.addClass("Active")
				else spread.removeClass("Active")
			});
			return spreads
		}
	};
	if (typeof window.nv == "function") { // Upon first spawn, this is a function.
		var spawner = window.nv;
		nv = {
			arrays: {},
			booleans: {},
			events: {},
			functions: {
				scanUI: function (node, func) {
					func(node);
					node = node.firstChild;
					while (node) {
						this.scanUI(node, func);
						node = node.nextSibling;
					}
				},
				buildNav: function () {
					var docFrag = document.createDocumentFragment(),
						srcLI = document.createElement('li'),
						srcA = document.createElement("a");
					nv.spreads.each(function (spread) {
						var el = spread.el,
							id = el.id,
							li = srcLI.cloneNode(!!0),
							a = srcA.cloneNode(!!0);
						if (!id) id = el.tagName || el.className
						a.href = "#".concat(id);
						a.textContent = id; // innerText does not work in Firefox!
						li.appendChild(a);
						docFrag.appendChild(li);
					});
					if (nv.booleans.respawn) nv.selectors.Navigation.innerHTML = "" // If respawned, wipe nav clean.
					nv.selectors.Navigation.appendChild(docFrag);
					return nv;
				},
				newspread: function (DOMelement) { // Add 'native' spread, without a URL.
					var spreadel = new Spread(DOMelement);
					nv.selectors.spreads.insertBefore(spreadel.el, nv.selectors.spreads.children[nv.selectors.spreads.childElementCount - 1]); // Insert new spread before footer in DOM.
					nv.spreads.models.push(spreadel); // Register to controller.
					return spreadel
				},
				respawn: function (settings, callback) {
					settings = settings || { // If "settings" resolves to false, make a dummy object.
						booleans: {},
						functions: {}
					};
					settings.booleans.respawn = !0; // The official signal to bypass some initializations.
					settings.functions.respawn = spawner ? spawner : !!0 // Passing in respawn function for future use, only normally accessible upon program launch.
					spawner(settings, callback == "function" ? callback : !!0)
				},
				killspread: function (target) {
					var newtarget = document.getElementById(target);
					nv.selectors.spreads.removeChild(newtarget); // Remove spread from DOM.
					var x = nv.spreads.models.length;
					while (x--) {
						if (nv.spreads.models[x].el === newtarget) nv.spreads.models.splice(x); // Search and remove from controller.
					}
					nv.functions.respawn()
				},
				spreads: function (target, callback, globalQ) { // This is the auto-spread-injector function. These arguments are not finished. Attempting to make queue work. See below.

					// I unintentionally ended up building a href scraper originally intended for the Apache auto-generated directory listing.
					// Scraper can be unintentionally activated if "spreads(target)" == file with no extension in URL, for example, for when "index.html" is automatically served up for "//invntm.com", but ".html" is not present in the URL.

					// ? // if (callback) nv.functions.lastCallback = callback, callback = null; // Make callback globally accessible for after all initialization operations are complete.

					// Step one: check if URL or array of URLs.
					// Download array synchronously
					// At the end of everything, run the callback (usually scripts that require the spreads in DOM.)

					if (Array.isArray(target)) { // If array, pull out elements and fetch. This is a simple queue system.

						// ###
						// Need to make this block below recursive and fire off on completion. They must go in order and in sync.
						if (target.length) nv.functions.spreads(target.pop(), callback, target)
							// else callback();
							// ###

					} else if (target != undefined) { // Assume this is a URL (string).

						var isDirectory = !0; // Assume that this URL points to a directory.
						if (target.lastIndexOf(".") != -1) // Is there a "." ?
							if (target.lastIndexOf(".") > target.lastIndexOf("/")) // Is this dot pattern after the last "/" ?
								if (target.lastIndexOf("..") == -1) isDirectory = !!0 // If this "." is not a "..", then this is a file.

						console.log("Spreads target", ["\"", target, "\""].join(""), "is a", isDirectory ? "directory." : "file.")

						if (isDirectory && target.slice(-1) != "/") target = target.concat("/") // Add missing forward slash to URL if directory.
						nv.functions.get(target, function (e) {
							// console.log(isDirectory ? "Scraping" : "Fetching", "Spreads");

							if (e.currentTarget.responseURL.indexOf(".htm") != -1) { // If document containing html snippet individual injection.

								console.log(["✅ \"", target, "\""].join(""))
								nv.spreads.injected = [target];
								nv.functions.respawn(nv, e.currentTarget.selector(globalQ))

							} else {
								if (e.currentTarget.response.toUpperCase().indexOf("<!DOCTYPE HTML") != -1) { // HTML detected, time to scrape anchors.
									var raw = e.currentTarget.response.match(/a href=\".+?\"/ig),
										options = [];
									if (raw != null) var x = raw.length;
									else console.warn("Failed to scrape hrefs from target document.")
									while (x--) {
										if (raw[x].charAt(8) != "?") { // hrefs starting with "?" are only for the Apache directory screen.
											options.push((raw[x].replace('a href="', '')).slice(0, -1)) // Extracts URL from within 'a href="', '"' wrapper.
										}
									}

								} else { // If HTML is not detected, assume that it is the proper array of URLs to spreads to inject.
									try {
										var options = JSON.parse(e.currentTarget.response); // JSON.parse is always risky business, so wrapping inside of try catch.
									} catch (e) {
										console.log("Invalid response from nv.functions.spreads(*) target", e)
										console.log(e.currentTarget.response);
									}
								}
								var refined = [],
									x = options.length,
									greenlight = !0;
								while (x--) {
									if (options[x].match(/.+(?=(\.html?|\.xxx)).+/i) && options[x].charAt(0) != "." && options[x] != "index.php") {
										refined.push(target.concat(options[x]));
										console.log(["✅ \"", options[x], "\""].join(""))
									} else console.log(["❌ \"", options[x], "\""].join(""))
								}
								if (!options.length) greenlight = !!0;
								if (greenlight) { // Abort respawn if all options are rejected.
									nv.spreads.injected = refined;
									nv.functions.respawn(nv, e.currentTarget.selector(globalQ))
								}
							}
						}, function (globalQ) {
							console.log(globalQ, callback);
							if (globalQ != undefined) nv.functions.spreads(globalQ.pop(), callback)
							else if (typeof callback === "function") callback();
							else console.warn("Callback ignored.")
						});
					}
				},
				defer: function (arrayofurls, filetype, cb3) {
					if (typeof arrayofurls === "string") arrayofurls = [arrayofurls] // If string, place into array with one element.
					if (filetype == "js") var elementSRC = document.createElement("script");
					else if (filetype == "css") var elementSRC = document.createElement("style");
					var x = arrayofurls.length;

					function cb(e) {
						var URL = e.target.responseURL, // Fluff
							filename = (URL.slice(URL.lastIndexOf("/") + 1)) // Fluff
						console.log("✅", filename.charAt(0).toUpperCase().concat(filename.slice(1))); // Fluff

						var s = elementSRC.cloneNode(!!0),
							t = document.createTextNode(e.target.responseText);
						s.appendChild(t);
						document.body.appendChild(s);
						if (--x) nv.functions.get(arrayofurls.shift(), cb, e.target.selector)
						else if (e.target.selector) e.target.selector()
					}
					nv.functions.get(arrayofurls.shift(), cb, cb3)
				},
				scripts: function (arrayofscripts, cb) {
					nv.functions.defer(arrayofscripts, "js", cb)
				},
				styles: function (arrayofstyles, cb) {
					nv.functions.defer(arrayofstyles, "css", cb)
				},
				get: function (target, callback, selector) {
					var req = new XMLHttpRequest();
					req.selector = selector;
					req.open('GET', target);
					req.addEventListener("readystatechange", function (e) {
						if (req.readyState == 4) callback(e)
					});
					req.send();
				},
				phase2: function () { // This is synchronous, and is invoked AFTER spread AJAX.
					if (nv.functions.lastCallback) nv.functions.lastCallback(); // Callback
					nv.spreads.wrapAll().measure();
					if (nv.booleans.allpresent) {
						nv.functions.buildNav();
						nv.functions.scanUI(nv.selectors.UI, function (node) { // Registers UI and all child elements thereof to nv.selectors for convenience.
							if (node.nodeType == 1) { // Ensures that it will only register nodes with TAGs, unlike text nodes.
								if (nv.selectors[(node.id || node.className || node.tagName)] == undefined) nv.selectors[(node.id || node.className || node.tagName)] = node // If slot in nv.selectors is empty, register DOM element.
								else if (nv.selectors[(node.id || node.className || node.tagName)] === node) { // If slot is occupied by the identical node.
									// Do nothing.
								} else { // Slot is not occupied by identical node.
									var x = 1;
									! function noclobber(x) { // Increments the property name until a slot is available.
										if (nv.selectors[(node.id || node.className || node.tagName) + ++x] == undefined) nv.selectors[(node.id || node.className || node.tagName) + x] = node
										else noclobber(x)
									}(x);
								}
							}
						});
					}
					if (nv.selectors.Navigation) nv.numbers.navOriginalLength = nv.selectors.Navigation.children.length
				}
			},
			numbers: {},
			objects: {},
			spreads: {},
			selectors: {},
			strings: {},
			writable: !0
		};
	} else if (typeof window.nv == "object") { // Respawned.
		var spawner = settings.functions.respawn; // NV original constructor must be passed in via settings if you plan to respawn again, so as to have the ability to overwrite window.nv.
		nv = window.nv;
	}
	if (settings) { // Map all settings to NV object.
		for (var x in settings) // Traverse layer one nv.*
			for (var y in settings[x]) // Traverse layer two nv.*.*
				if (settings[x].hasOwnProperty(y)) nv[x][y] = settings[x][y]
		if (settings.spreads != undefined) {
			if (typeof settings.spreads == "object" && typeof settings.spreads.injected == "object") { // If it is not undefined it should only be an object.
				nv.spreads.injected = settings.spreads.injected // Manually set as an exception, because it is the only object that is deep and important. This is required for injecting spreads.
			} else { // injected is either an array (URL queue, hack method), or undefined.
				nv.spreads.injected = settings.spreads // Not sure if this is correct.
			}
		}
		if (callback) nv.functions.lastCallback = callback, callback = null; // Easy callback access for after all initialization operations are complete.
	}
	settings = settings || !!0
	var s = nv.selectors;
	if (!s.UI) s.UI = document.getElementById("UI") || document.getElementsByClassName("UI")[0] || document.getElementsByTagName("UI")[0] || !!0 // If no UI tag, find it.
	if (s.UI) { // Navigation must be present only within UI. If no UI found, implies no Navigation.
		if (!s.UI.id) s.UI.id = "UI" // If no UI id, assign it.
		if (!s.Navigation) s.Navigation = document.getElementById("Navigation") || s.UI.getElementsByClassName("Navigation")[0] || s.UI.getElementsByTagName("ol")[0] || s.UI.getElementsByTagName("ul")[0] || !!0
		if (!s.Navigation.id) s.Navigation.id = "Navigation"
	}
	s.spreads = document.getElementById('Spreads') || document.getElementsByTagName("main")[0];
	if (!s.spreads.id) s.spreads.id = "Spreads"
	if (nv.spreads == undefined || !Object.keys(nv.spreads).length) nv.spreads = !!0; //nv.spreads.injected = [];
	var Navigation = nv.selectors.Navigation;
	nv.booleans.allpresent = Navigation ? !0 : !!0 // This boolean determines bypassing the construction of the Navigation bar.
	nv.spreads = new Spreads(nv.selectors.spreads.children, nv.spreads) // Register main#Spreads children, and injected spreads, to controller.
	if (!nv.booleans.respawn) { // Add events once.
		window.addEventListener("blur", function () {
			nv.spreads.active.removeClass("Active")
		});
		window.addEventListener("focus", function () {
			nv.spreads.active.addClass("Active")
		});
		window.addEventListener("beforeunload", function () {
			nv.spreads.active.removeClass("Active")
		});
		// window.addEventListener("scroll", function () {

		var framedata = function () {
			nv.spreads.measure();
			if (nv.booleans.allpresent) {
				// nv.spreads.hero().el.id == nv.spreads.active.el.id ? UI.className = "" : UI.className = "Active"; // Hide UI on hero.
				var x = nv.numbers.navOriginalLength;
				while (x--) {
					var viewing = nv.selectors.Navigation.children[x].children[0];
					if (nv.spreads.active.el.id == viewing.innerHTML) viewing.className = "Active"
					else viewing.className = "";
				}
				nv.selectors.Navigation.setAttribute("data-viewing", nv.spreads.active.el.id)
			}
			if (nv.selectors.video) nv.spreads.hero().el.id == nv.spreads.active.el.id ? nv.selectors.video.play() : nv.selectors.video.pause();

			window.setTimeout(function () {
				window.requestAnimationFrame(framedata)
			}, (1000 / 30));

		};

		framedata();

		// });
	}
	if (nv.spreads.injected != undefined && nv.spreads.injected.length) {
		var Q = nv.spreads.injected.slice(0),
			x = nv.spreads.injected.length;
		nv.functions.get((Q[Q.length - 1].getAttribute("data-injected")), function cb2(e) {
			console.log("✅", e.currentTarget.selector);
			e.currentTarget.selector.innerHTML = ["<article onclick>", e.currentTarget.response.replace(/\n\s+/g, ''), "</article>"].join("");
			if (Q.length) nv.functions.get((Q[Q.length - 1].getAttribute("data-injected")), cb2, Q.pop())
			else nv.functions.phase2()
		}, Q.pop())
	} else nv.functions.phase2()
	window.nv = nv;
	return nv
}
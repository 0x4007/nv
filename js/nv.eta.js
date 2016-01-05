function nv(settings, callback) { // NVETA.
    "use strict";
    var subroutine = [
        function SRT0(settings, callback) { // "nv initialization."
            if (settings && typeof settings != "object") settings = !1, console.error("Settings is to be an object.");
            if (callback && typeof callback != "function") callback = !1, console.error("Callback is to be a function.");
            if (typeof window.nv == "function") { // Upon first spawn, this is a constructor.
                nv = {
                    arrays: {},
                    booleans: {
                        respawn: !1 // This is the initial spawn, so run all initializations.
                    },
                    events: {},
                    functions: {
                        scanUI: function(node, func) {
                            func(node);
                            node = node.firstChild;
                            while (node) {
                                this.scanUI(node, func);
                                node = node.nextSibling;
                            }
                        },
                        buildUI: function() {
                            var docFrag = document.createDocumentFragment(),
                                srcLI = document.createElement('LI'),
                                srcA = document.createElement("A");
                            nv.spreads.each(function(spread) {
                                var el = spread.el,
                                    id = el.id,
                                    li = srcLI.cloneNode(!1),
                                    a = srcA.cloneNode(!1);
                                if (!id) id = el.tagName || el.className
                                a.href = "#".concat(id);
                                a.textContent = id;
                                li.appendChild(a);
                                docFrag.appendChild(li)
                            });
                            if (nv.booleans.respawn) nv.selectors.Navigation.innerHTML = "" // If respawned, wipe nav clean.
                            nv.selectors.Navigation.appendChild(docFrag);
                            return nv;
                        },
                        get: function(target, onsuccess, data, onfail, callback) {
                            var elementToCreate = function(URL) {
                                if (URL.indexOf(".js") != -1) return "SCRIPT"
                                if (URL.indexOf(".css") != -1) return "STYLE"
                                return !1
                            };
                            if (onsuccess == undefined) { // Assumes .JS or .CSS target.
                                if (typeof target == "string") {
                                    onsuccess = function(xhr) {
                                        var s = document.createElement(elementToCreate(target));
                                        s.textContent = xhr.responseText;
                                        document.body.appendChild(s);
                                    };
                                    onfail = function() {};
                                }
                            }
                            // if (onfail == undefined) onfail = onsuccess;
                            if (Array.isArray(target)) {
                                var Q = target.reverse(),
                                    x = Q.length;
                                callback = onsuccess;
                                while (x--) { // CSS / JS handler is redundant.
                                    if (Q[x].indexOf(".js") != -1) {
                                        onsuccess = function(xhr) {
                                            var s = document.createElement("SCRIPT");
                                            s.textContent = xhr.responseText;
                                            document.body.appendChild(s);
                                        };
                                        onfail = function() {}
                                    } else if (Q[x].indexOf(".css") != -1) {
                                        onsuccess = function(xhr) {
                                            var s = document.createElement("STYLE");
                                            s.textContent = xhr.responseText;
                                            document.body.appendChild(s);
                                        };
                                        onfail = function() {}
                                    }
                                    if (!x) {
                                        var final = onsuccess;
                                        return nv.functions.get(Q[x], function(e) {
                                            final(e);
                                            if (typeof callback == "function") callback(e)
                                        }, data, onfail)
                                    }
                                    nv.functions.get(Q[x], onsuccess, data, onfail, callback)
                                }
                                return !0
                            }
                            var xhr = new XMLHttpRequest();
                            xhr.data = data;
                            xhr.open("GET", target);
                            xhr.onloadend = function() {
                                xhr.status == 200 ? onsuccess(xhr) : onfail(xhr);
                            };
                            xhr.send();
                        }
                    },
                    numbers: {},
                    objects: {},
                    selectors: {},
                    spreads: {
                        injected: [],
                        models: [],
                        cache: [] // Temporary for initialization.
                    },
                    strings: {},
                    subroutine: subroutine,
                    // arr: nv.arrays,
                    // bln: nv.booleans,
                    // evn: nv.events,
                    // fnc: nv.functions,
                    // nmb: nv.numbers,
                    // obj: nv.objects,
                    // slc: nv.selectors,
                    // spr: nv.spreads,
                    // str: nv.strings,
                    // sbr: nv.subroutine,
                    writable: !0
                }
            } else if (typeof window.nv == "object") { // Respawned.
                nv.booleans.respawn = !0;
                nv = window.nv;
            }
            if (callback) nv.functions.callback = callback
            return subroutine[1](settings);
        },
        function SRT1(settings) { // "Map settings."
            if (settings) {
                for (var x in settings) { // Traverse layer one nv.*
                    if (x !== "spreads") { // "spreads" special keyword for settings.
                        for (var y in settings[x]) { // Traverse layer two nv.*.*
                            if (settings[x].hasOwnProperty(y)) nv[x][y] = settings[x][y]
                        }
                    } else if (typeof settings[x] == "string") {
                        nv[x].injected.push(settings[x]); // Fix for single spread inject. Tears up string of URL and uses each letter. Untested with nv.spreads proto.
                    } else if (Array.isArray(settings[x])) {
                        var z = settings[x].length;
                        while (z--) nv[x].injected.push(settings[x][z]) // Push settings spreads to "nv.spreads.injected"
                    }
                }
            }
            var $ = nv.selectors;
            if (!$.UI) $.UI = document.getElementById("UI") || document.getElementsByClassName("UI")[0] || document.getElementsByTagName("UI")[0] || !1 // If no UI tag, find it.
            else { // Navigation must be present only within UI. If no UI found, implies no Navigation.
                if (!$.UI.id) $.UI.id = "UI" // If no UI id, assign it.
                if (!$.Navigation) $.Navigation = document.getElementById("Navigation") || $.UI.getElementsByClassName("Navigation")[0] || $.UI.getElementsByTagName("ol")[0] || $.UI.getElementsByTagName("ul")[0] || $.UI.getElementsByTagName("nav")[0] || !1
                if (!$.Navigation.id) $.Navigation.id = "Navigation"
            }
            $.Spreads = document.getElementById('Spreads') || !1
            if ($.Spreads) {
                if (!$.Spreads.id) $.Spreads.id = "Spreads"
                if (nv.spreads.injected.length) return subroutine[2](nv.spreads.injected) // Injection and native spreads.
                else return subroutine[3]() // Native only.
            } else {
                if (nv.spreads.injected.length) { // Injection only.
                    var MAIN = document.createElement("MAIN");
                    MAIN.id = "Spreads";
                    $.Spreads = MAIN;
                    document.body.appendChild(MAIN);
                    return subroutine[2](nv.spreads.injected);
                } else return subroutine[4]() // Skip spread initializations (toolkit mode).
            }
        },
        function SRT2(spreadURL) { // "Spreads; scan for directories; scrape; restart."
            if (!spreadURL || spreadURL == undefined) {
                console.log("Spread inject queue completed.");
                if (nv.spreads.cache) nv.spreads.injected = nv.spreads.cache // Merge cache to injected...not sure if best place?
                return subroutine[3]();
            }
            /**
             * This is the auto-spread-injector function. These arguments are not finished. Attempting to make queue work. See below.
             * I unintentionally ended up building a href scraper originally intended for the Apache auto-generated directory listing.
             * Scraper can be unintentionally activated if "spreads(nv.spreads)" == file with no extension in URL, for example, for when "index.html" is automatically served up for "//invntm.com", but ".html" is not present in the URL.
             * Step one: check if URL or array of URLs.
             * Download array synchronously.
             */
            if (Array.isArray(spreadURL)) { // If array, pull out elements and fetch. This is a simple queue system.
                if (spreadURL.length) return subroutine[2](nv.spreads.injected.pop())
                else return subroutine[3]()
            } else if (typeof spreadURL == "string") { // Assume this is a URL (string).
                var isDirectory = !0; // Assume that this URL points to a directory.
                if (spreadURL.lastIndexOf(".") != -1) // Is there a "." ?
                    if (spreadURL.lastIndexOf(".") > spreadURL.lastIndexOf("/")) // Is this dot pattern after the last "/" ?
                        if (spreadURL.lastIndexOf("..") < spreadURL.lastIndexOf("/")) isDirectory = !1 // If this "." is not a ".." after the last "/" then this is a file.
                        // # Nice comment for demos -> // console.log("Spread", ["\"", spreadURL, "\""].join(""), "is a", isDirectory ? "directory." : "file.")
                if (isDirectory && spreadURL.slice(-1) != "/") spreadURL = spreadURL.concat("/") // Add missing forward slash to URL if directory.
                nv.functions.get(spreadURL, function onsuccess(xhr) {
                    if (xhr.responseURL.indexOf(".htm") != -1 || xhr.responseURL.indexOf(".php") != -1) { // If target URL containing .htm (.html) or .php extension, defer to individual injection.
                        // # Nice comment for demos -> // console.log(["✅ \"", spreadURL, "\""].join(""))
                        nv.spreads.cache.push(spreadURL);
                        subroutine[2](nv.spreads.injected.pop())
                    } else {
                        if (xhr.response.toUpperCase().indexOf("<!DOCTYPE HTML") != -1) { // HTML detected, time to scrape anchors.
                            var raw = xhr.response.match(/a href=\".+?\"/ig),
                                options = [];
                            if (raw != null) var x = 0;
                            else console.warn("Failed to scrape hrefs from target document.")
                            while (raw.length - 1 > x++) {
                                if (raw[x].charAt(8) != "?") { // hrefs starting with "?" are only for the Apache directory screen. charAt(8) because 'a href="' is 7 characters long.
                                    options.push((raw[x].replace('a href="', '')).slice(0, -1)) // Extracts URL from within 'a href="', '"' wrapper.
                                }
                            }
                        } else { // If HTML is not detected, assume that it is the proper array of URLs to spreads to inject. This could be the CMS array( ! )
                            try {
                                var options = JSON.parse(xhr.response); // JSON.parse is always risky business, so wrapping inside of try catch.
                            } catch (e) {
                                console.log("Invalid response from nv.functions.spreads(*) target", e, xhr.response);
                                return subroutine[2](nv.spreads.injected.pop()); // Exit
                            }
                        }
                        var x = 0;
                        while (options.length - 1 > x++) { // This has not been tested with ++ direction.
                            if (Array.isArray(options[x])) {
                                var y = 0, // Array length of multidimensional (internal) array. [ "" , [ "" , ""] , "" ]
                                    z = y; // Offset.
                                while (options[x].length - 1 > y++) options.unshift(options[x][y]) // Flatten multidimensional array.
                                options.splice(x -= z, 1); // Remove multidimensional array.
                                /**
                                 * Could use more testing!
                                 */
                            }
                            if (options[x].match(/.+(?=(\.html?$|\.php$)).+/i) && options[x].charAt(0) != "." && options[x] != "index.php") {
                                nv.spreads.cache.push(spreadURL.concat(options[x])); // ajax "cache" store in ".cache". Also on line 180.
                                // nv.spreads.push(spreadURL.concat(options[x]));
                                console.log(["✅ \"", options[x], "\""].join(""))
                            } else console.log(["❌ \"", options[x], "\""].join(""))
                        }
                        subroutine[2](nv.spreads.injected.pop()); // This allows for multiple directory checks.
                    }
                }, null, function onfail(xhr) {
                    console.error("XHR failure.", xhr);
                    subroutine[2](nv.spreads.injected.pop()); // Proceed to next.
                });
            } else { // Constructed spread (object) encountered, likely a respawn. This is now damage control.
                nv.spreads.injected = []; // Wipe clean because one has already been popped off.
                var incomingSpreads = nv.spreads.cache,
                    collisions = [],
                    x = incomingSpreads.length;
                while (x--) {
                    nv.spreads.each(function(s) { // Search and destroy spread name collisions, reject incoming redundant spread names.
                        if (incomingSpreads[x].slice(incomingSpreads[x].lastIndexOf("/") + 1).toLowerCase().indexOf(s.el.id.toLowerCase()) !== -1) collisions.push(incomingSpreads.splice(x, 1)) // Reject the conflict.
                    })
                }
                console.error(["❌ Conflicts rejected: \"", collisions, "\""].join("")) // Report collisions.
                return subroutine[2](nv.spreads.cache.pop()) // Damage control complete.
            }
        },
        function SRT3() { // "Spread construction."
            if (nv.selectors.Spreads) {
                var Spreads = function Spreads(DOMSpreads, injectURLs) { // Spread constructor and adds each to controller. Also marks which spreads will be AJAX filled later in the program.
                    this.models = []; // Spreads completed prototype looks like: ".models", ".injected", ".active", ".scripts".
                    this.cache = [];
                    if (injectURLs) {
                        this.scripts = { // Parses scripts from injected spreads, appends to document.body after AJAX to automatically execute.
                            urls: [],
                            codes: []
                        };
                        this.injected = []; // nv.spreads.active serves as the URL cache in the SEPERATE OBJECT for dev clarity, must change later.
                        var x = injectURLs.injected.length,
                            sectionSRC = document.createElement("SECTION");
                        while (x--) {
                            var section = sectionSRC.cloneNode(!1); // The most efficient way to recreate an element.
                            if (typeof injectURLs.injected[x] == "string") { // URL expected. This is the proper way to pass in injected spreads.
                                var tempid = injectURLs.injected[x].split("/");
                                section.setAttribute("data-injected", injectURLs.injected[x]); // Stores the URL of the spread's target file, read later during AJAX for injection.
                                section.innerHTML = ['<article>Inserting "', injectURLs.injected[x], '" now.</article>'].join(""); // User feedback during inject process.
                            } else if (typeof injectURLs.injected[x] == "object" && injectURLs.injected[x] instanceof HTMLElement) { // Handler for improper way to pass in injected spreads (as an actual spread HTML object.)
                                if (injectURLs.injected[x].getAttribute("data-injected")) {
                                    console.warn("You passed in a previously injected spread in \"spreads.injected\". Please pass in a URL.");
                                    continue; // Skip this one.
                                }
                            } else {
                                console.error(injectURLs.injected[x], "You passed in something unexpected for the injected spread. Please pass in a URL.");
                                continue;
                            }
                            tempid = tempid[tempid.length - 1].split(".")[0]; // Remove AJAX target file path, and file extension (typically ".html")
                            section.id = tempid.charAt(0).toUpperCase().concat(tempid.slice(1)); // Capitalize the first character.
                            // if (DOMSpreads[1]) DOMSpreads[1].parentNode.insertBefore(section, DOMSpreads[DOMSpreads.length - 1]); // Place spread in DOM before last spread.
                            if (DOMSpreads[1]) DOMSpreads[1].parentNode.insertBefore(section, DOMSpreads[1]); // Place spread in DOM before second spread.
                            else nv.selectors.Spreads.appendChild(section) // If no existing spread(s), just append this spread as child of #Spreads.
                            this.injected.unshift(section); // Place this spread ("section") into beginning of nv.spreads.injected
                        }
                    }
                    this.register(DOMSpreads);
                    return this;
                };
                Spreads.prototype = {
                    register: function(DOMSpreads) {
                        var spreads = this.models,
                            i = 0,
                            len = DOMSpreads.length;
                        if (typeof len !== 'number') DOMSpreads = [DOMSpreads]
                        while (len > i) spreads.push(new Spread(DOMSpreads[--len]))
                        return this;
                    },
                    each: function(fn) {
                        var spreads = this,
                            spreadArr = spreads.models,
                            x = spreadArr.length;
                        while (x--) fn(spreadArr[x])
                        return spreads;
                    },
                    wrapAll: function() {
                        this.each(function(spread) {
                            spread.wrap()
                        });
                        return this
                    },
                    hero: function() {
                        return this.models[this.models.length - 1]
                    },
                    measure: function() {
                        var spreads = this;
                        spreads.each(function(spread) {
                            var spreadTop = spread.el.getBoundingClientRect().top;
                            if (spreadTop < window.innerHeight / 2) spreads.active = spread
                                // if (spreadTop < 16 && spreadTop > -16) window.location.hash = "#".concat(spread.el.id)
                        });
                        spreads.each(function(spread) {
                            if (spread == spreads.active) spread.addClass("Active")
                            else spread.removeClass("Active")
                        });
                        return spreads
                    }
                };
                var Spread = function Spread(el) {
                    this.el = el;
                    return this;
                };
                Spread.prototype = {
                    wrap: function() { // Constructs vertical-align: middle Spread by placing all content inside of a cell, as well as removing white-space in HTML (inline-block bug fix).
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
                    addClass: function(clas) { // Polyfill for classList.add().
                        var el = this.el,
                            classNames = el.className.split(' ');
                        if (classNames[0] === '') classNames.shift()
                        if (classNames.indexOf(clas) === -1) {
                            classNames.push(clas);
                            el.className = classNames.join(' ');
                        }
                        return this;
                    },
                    removeClass: function(clas) { // Polyfill for classList.remove().
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
                nv.spreads = new Spreads(nv.selectors.Spreads.children, nv.spreads) // Register main#Spreads children, and injected spreads, to controller.
                if (nv.spreads.injected != undefined && nv.spreads.injected.length) {
                    var Q = nv.spreads.injected.slice(0),
                        x = nv.spreads.injected.length;
                    nv.functions.get((Q[0].getAttribute("data-injected")), function cb2(e) {
                        // # Nice comment for demos -> // console.log("✅", e.data);
                        var spreadData = e.response;
                        if (spreadData.indexOf("<script") != -1) { // Scans for scripts.
                            var scriptParses = spreadData.match(/<script(.|\n)+?<\/script>/ig), // Parses scripts, preserves line breaks.
                                urls = [],
                                codesIndicies = [];
                            var x = scriptParses.length;
                            while (x--) urls.push(scriptParses[x].match(/src=\".+?\"/ig))
                            x = urls.length;
                            var z = x - 1; // Length offset to prepare for next loop.
                            while (x--) { // urls = [Array[1], null]
                                if (urls[x]) { // Script has source, collect URL.
                                    var y = urls[x].length;
                                    while (y--) { // Remove src=, and all single/double quotes to expose only script URL
                                        if (urls[x][y]) {
                                            urls[x][y] = urls[x][y].replace("src=", "");
                                            nv.spreads.scripts.urls.push(urls[x][y].replace(/['"]+/g, ''))
                                        }
                                    }
                                } else codesIndicies.push(z - x) // Reverse index to loop again backwards.
                            }
                            x = codesIndicies.length;
                            while (x--) { // Non matches for "script src=".
                                spreadData = scriptParses[codesIndicies[x]].replace(/<scrip.+?>/, "");
                                spreadData = spreadData.replace(/<\/scrip.+?>/, "");
                                if (spreadData.length) nv.spreads.scripts.codes.push(spreadData);
                            }
                        }
                        var spreadData = e.response.replace(/\n\s+|\n/g, ''); // :-( Regex twice to preserve line breaks for code, then remove whitespace for "display:inline-block" bug, and pretty DOM.
                        e.data.innerHTML = ["<article onclick>", spreadData, "</article>"].join("");
                        if (Q.length) nv.functions.get((Q[0].getAttribute("data-injected")), cb2, Q.shift())
                        else return subroutine[6]();
                    }, Q.shift())
                }
            }
            return subroutine[4]();
        },
        function SRT4() { // "Scan UI; build navigation."
            nv.functions.scanUI(nv.selectors.UI, function(node) { // Registers UI and all child elements thereof to nv.selectors for convenience.
                if (node.nodeType == 1) { // Ensures that it will only register nodes with TAGs, unlike text nodes.
                    if (nv.selectors[(node.id || node.className || node.tagName)] == undefined) nv.selectors[(node.id || node.className || node.tagName)] = node // If slot in nv.selectors is empty, register DOM element.
                    else if (nv.selectors[(node.id || node.className || node.tagName)] === node) { // If slot is occupied by the identical node.
                        // Do nothing.
                    } else { // Slot is not occupied by identical node.
                        var x = 1;
                        ! function noclobber(x) { // Increments the property name until a slot is available.
                            if (nv.selectors[(node.id || node.className || node.tagName) + ++x] == undefined) nv.selectors[(node.id || node.className || node.tagName) + x] = node
                            else return noclobber(x)
                        }(x);
                    }
                }
            });
            if (nv.selectors.Navigation) {
                nv.functions.buildUI();
                nv.numbers.navOriginalLength = nv.selectors.Navigation.children.length; // Seems very dirty.
            }
            return subroutine[5]()
        },
        function SRT5() { // "Events."
            if (!nv.booleans.respawn) { // Add events once.
                if (window.location.href.indexOf("beta") == -1 && window.location.href.indexOf("localhost:") == -1) nv.functions.get("//api.inventum.digital/intel.js")
                var idleMode = function() {
                    nv.spreads.active.removeClass("Active");
                    window.setTimeout(function() {
                        window.requestAnimationFrame(framedata)
                    }, (1000 / 2));
                };
                window.addEventListener("blur", function() {
                    framedata = idleMode;
                });
                window.addEventListener("focus", function() {
                    nv.spreads.each(function(e) {
                        e.addClass("Active");
                    });
                    framedata = activeMode;
                });
                window.addEventListener("beforeunload", function() {
                    framedata = idleMode;
                });
                // window.addEventListener("scroll", function () {
                var activeMode = function() {
                        nv.spreads.measure();
                        if (nv.selectors.Navigation) {
                            // nv.spreads.hero().el.id == nv.spreads.active.el.id ? UI.className = "" : UI.className = "Active"; // Hide UI on hero.
                            var x = nv.numbers.navOriginalLength;
                            while (x--) {
                                var viewing = nv.selectors.Navigation.children[x].children[0];
                                if (nv.spreads.active.el.id == viewing.innerHTML) viewing.className = "Active"
                                else viewing.className = "";
                            }
                            if (nv.spreads.hero().el.id != nv.spreads.active.el.id) nv.selectors.Navigation.setAttribute("data-viewing", nv.spreads.active.el.id) // Sets UI title to name of spread if not looking at the first spread.
                            else nv.selectors.Navigation.setAttribute("data-viewing", "Navigation") // If looking at the first spread, set title to "Navigation" so that it is clear to the user that it is a navigation bar.
                        }
                        if (nv.selectors.video) nv.spreads.hero() == nv.spreads.active ? nv.selectors.video.play() : nv.selectors.video.pause();
                        window.setTimeout(function() {
                            window.requestAnimationFrame(framedata)
                        }, (1000 / 30));
                    },
                    framedata = activeMode;
                framedata();
            }
            return !0
        },
        function SRT6(callback) { // Handle scripts within injected spreads. Called synchronously after all spreads are injected.
            var scriptSRC = document.createElement("SCRIPT");
            if (nv.spreads.scripts.codes.length) { // Could be optimized? "var x" declaration in IF?
                var x = nv.spreads.scripts.codes.length;
                while (x--) {
                    var s = scriptSRC.cloneNode(!1);
                    s.textContent = nv.spreads.scripts.codes[x];
                    document.body.appendChild(s)
                }
            }
            if (nv.spreads.scripts.urls.length) { // Redundant logic.
                var x = nv.spreads.scripts.urls.length;
                while (x--) {
                    var s = scriptSRC.cloneNode(!1);
                    s.src = nv.spreads.scripts.urls[x];
                    document.body.appendChild(s) // Independently appended (no document fragment) to each will execute each.
                }
            }
            if (window.location.hash.length) window.location = window.location; // Jump to hash href.
            if (nv.functions.callback) return nv.functions.callback()
            else return !0
        }
    ];
    window.nv = nv;
    return subroutine[0](settings, callback)
}

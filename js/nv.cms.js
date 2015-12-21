nv.cms = function(settings) {
    if (typeof settings != "object") settings = !1;
    var get = function(target, onsuccess, data, onfail) {
        var elementToCreate = function(URL) {
            if (URL.indexOf(".js") != -1) return "SCRIPT";
            if (URL.indexOf(".css") != -1) return "STYLE";
            return !1;
        };
        if (onsuccess == undefined) {
            // Assumes .JS or .CSS target.
            if (typeof target == "string") {
                onsuccess = function(xhr) {
                    var s = document.createElement(elementToCreate(target));
                    s.textContent = xhr.responseText;
                    document.body.appendChild(s);
                };
                onfail = function() {};
            }
        }
        if (onfail == undefined) onfail = onsuccess;
        if (Array.isArray(target)) {
            var Q = target.reverse(), x = Q.length;
            while (x--) {
                // CSS / JS handler is redundant.
                if (Q[x].indexOf(".js") != -1) {
                    onsuccess = function(xhr) {
                        var s = document.createElement("SCRIPT");
                        s.textContent = xhr.responseText;
                        document.body.appendChild(s);
                    };
                    onfail = function() {};
                } else if (Q[x].indexOf(".css") != -1) {
                    onsuccess = function(xhr) {
                        var s = document.createElement("STYLE");
                        s.textContent = xhr.responseText;
                        document.body.appendChild(s);
                    };
                    onfail = function() {};
                }
                nv.functions.get(Q[x], onsuccess, data, onfail);
            }
            return !0;
        }
        var xhr = new XMLHttpRequest();
        xhr.data = data;
        xhr.open("GET", target);
        xhr.onloadend = function() {
            xhr.status == 200 ? onsuccess(xhr) : onfail(xhr);
        };
        xhr.send();
    };
    var target = "http://cms.inventumdigital.com/service?".concat(window.location.href.replace(window.location.hash, ""));
    get(target, function(e) {
        var settings = e.data, execute = {
            spreads: []
        }, CMSspreads = JSON.parse(e.responseText);
        if (settings) {
            for (var x in settings) {
                // Traverse layer one nv.*
                if (x !== "spreads") {
                    // "spreads" special keyword for settings.
                    for (var y in settings[x]) {
                        // Traverse layer two nv.*.*
                        if (settings[x].hasOwnProperty(y)) execute[x][y] = settings[x][y];
                    }
                } else if (typeof settings[x] == "string") {
                    execute[x].spreads.push(settings[x]);
                } else if (Array.isArray(settings[x])) {
                    var z = settings[x].length;
                    while (z--) execute[x].spreads.push(settings[x][z]);
                }
            }
        } else execute.spreads = CMSspreads;
        nv(execute);
    }, settings ? settings : undefined);
};
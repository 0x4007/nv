var forms = document.forms,
x = forms.length,
terminal = document.getElementById("terminal");

nv.functions.xhr = function (method, target, onsuccess, data, onfail) {
							if (onfail == undefined) onfail = onsuccess;
							if (Array.isArray(target)) {
								var Q = target.reverse(),
									x = Q.length;
									while (x--) { // CSS / JS handler is redundant.
										if (Q[x].indexOf(".js") != -1) {
											onsuccess = function (xhr) {
												var s = document.createElement("SCRIPT");
												s.textContent = xhr.responseText;
												document.body.appendChild(s);
											};
											onfail = function () {}
										} else if (Q[x].indexOf(".css") != -1) {
											onsuccess = function (xhr) {
												var s = document.createElement("STYLE");
												s.textContent = xhr.responseText;
												document.body.appendChild(s);
											};
											onfail = function () {}
										}
										nv.functions.get(Q[x], onsuccess, data, onfail)
								}
								return !0
							}
							var xhr = new XMLHttpRequest();
							xhr.data = data;
							xhr.open(method, target);
							xhr.onloadend = function () {
								xhr.status == 200 ? onsuccess(xhr) : onfail(xhr);
							};
							xhr.send();
						};

while(x--) {
	forms[x].addEventListener("submit", function(e){
		switch(e.target.method){
			case "get":
				getFn(e);
			break;
			case "post":
				postFn(e);
			break;
			case "delete":
				deleteFn(e);
			break;
			case "put":
				putFn(e);
			break;
			default:
			return !1
		}
		return !0
		debugger;
	})
}

function getFn(e){
	nv.functions.get(".?".concat(e.target[0].value), function(e){
		terminal.textContent = e.responseText
	})
	return !1
}
function postFn(e){}
function deleteFn(e){}
function putFn(e){}
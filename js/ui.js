// nv.selectors.UI.addEventListener('click', function (e) {
// 	var $ = e.target.id || e.target.tagName;
// 	console.log($);
// 	switch ($) {
// 	case "add":
// 		var theForm = document.getElementsByTagName("form")[0],
// 			input = document.createElement("input");
// 		input.type = "text";
// 		var counter = --theForm.children.length;
// 		input.placeholder = "URL ".concat(counter);
// 		input.name = counter;
// 		theForm.appendChild(input);
// 		break;
// 	case "preview":
// 		nv.functions.get("output.json", function (e) {
// 			nv.arrays.preview = JSON.parse(e.target.response);
// 			var inputs = document.getElementsByTagName("input"),
// 				x = inputs.length;
// 			while (x--) {
// 				if (inputs[x].type == "text" && inputs[x].value.length == 0) {
// 					inputs[x].value = nv.arrays.preview[0];
// 					break
// 				}
// 			}
// 		})
// 		break;
// 	case "url":
// 		var inputs = document.getElementsByTagName("input"),
// 			x = inputs.length,
// 			array = [];
// 		while (x--) {
// 			if (inputs[x].type == "text" && inputs[x].value.length) array.push(inputs[x].value)
// 		}
// 		var settings = {
// 			spreads: {
// 				injected: array
// 			}
// 		}
// 		nv.functions.respawn(settings)
// 		console.log(array);
// 		break;
// 	case "export":
// 		var inputs = document.getElementsByTagName("input"),
// 			x = inputs.length;
// 		while (x--) {
// 			if (inputs[x].type == "text" && inputs[x].value.length == 0) {
// 				inputs[x].value = JSON.stringify(nv)
// 				break
// 			}
// 		}
// 		break;
// 	case "execute":
// 		nv.functions.get("output.json", function (e) {
// 			nv.arrays.preview = JSON.parse(e.target.response);
// 			var settings = JSON.parse(nv.arrays.preview[0]);
// 			settings.functions = {
// 				respawn: nv.functions.respawn
// 			};
// 			settings.booleans = {
// 				respawn: !0
// 			}
// 			console.log(settings);
// 			nv.functions.respawn(settings)
// 		});
// 	}
// })
nv.selectors.UI.addEventListener('click', function (e) {
	var $ = e.target.id || e.target.tagName;
	console.log($);
	var inputs = document.getElementsByTagName("input"),
		x = inputs.length,
		array = [];

	if (x) {
		while (x--) {
			if (inputs[x].type == "text" && inputs[x].value.length) array.push(inputs[x].value)
		}
		switch ($) {
		case "add":
			var theForm = document.getElementsByTagName("form")[0],
				input = document.createElement("input");
			input.type = "text";
			var counter = --theForm.children.length;
			input.placeholder = "URL ".concat(counter);
			input.name = counter;
			theForm.appendChild(input);
			break;
		case "url":
			var settings = {
				// spreads: ["URLs"] Assumed replacing method
				//
				spreads: { // Additive method.
					injected: array // Additive method.
				},
				functions: {
					respawn: nv.functions.respawn
				},
				booleans: {
					respawn: !0
				}
			}

			nv.functions.respawn(settings)
			console.log(array);
			break;
		case "spreads":
			nv.functions.spreads(array)
		}
	}
})
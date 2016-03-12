# NV

Engineered from the ground-up to achieve maximum performance.

A performance-first front-end framework.

# Usage

```javascript
nv({}, fn);
```
Usage: (settings object, callback function.)

# Example

As seen on http://inventum.digital

```javascript
nv({
	spreads: [
		"spreads/main", // This is a directory, NV will scrape the URLs if your server outputs a directory map. Or if you have your server return an array, NV will JSON.parse it.
		"spreads/body/services.htm",
		"spreads/body/portfolio.htm", // I manually put in spread URLs for fine control of the order. Scraping will just add the spreads by alphabetical order.
		"spreads/body/location.htm",
		"spreads/footer.htm"
	]
}, function() {
	nv.functions.get([ // Callback to load in more stuff after the page renders.
		"js/utils.js",
		"js/videosearch.js",
		"js/indexeddb.js"
	]);
});
```

Settings may include:
* arrays: {},
* booleans: {},
* events: {},
* functions:{},
* numbers: {},
* objects: {},
* selectors: {},
* spreads: {}
* strings: {},
* subroutine: []

Settings allows you to store and access your data in one central object, accessible after the framework is launched at `nv.*`

A special note on specific setting properties:
* selectors: Anything within ```<UI>``` or ```< id="UI">``` in DOM is automatically connected to ```nv.selectors.UI.*``` for developer convenience.
* spreads: Pass in URLs of HTML snippets to have them inject into your app. You can do an array of URLs or folders (assuming that your server outputs the directory contents.)
* subroutine: Core functions of nv are divided into six parts. You can "hot swap" how the program runs by passing in custom subroutines to replace the original ones. Useful for very specific page configurations but you still want the framework cached.

# Details
===
######HTML:
NV prefers to work with a DOM that includes the following, but will still work even if you are missing some stuff. "Some stuff" includes the IDs and tag names. If you are missing stuff, the program branches off into different modes, including at the very least (no Spreads or UI), a "toolkit" mode which skips all of the spread setup functions, adds your passed-in settings, runs your callback, and allows accessibility to `nv.*` later in your app.

```html
<body>
<main id="Spreads">
	<section> <!-- With an ID -->
		<h1>
			Hello, World!<!-- With initial view content -->
		</h1>
	</section>
</main>
<UI id="UI">
	<ul id="Navigation"><!-- Can be any tag name, "UL" or "OL" is probably best. -->
	<!-- Spread hash navigation will be added here automatically, based on the filename of the spread. -->
	</ul>
</UI>
</body>
```
===
######CSS:
I always include this in the head of my HTML to allow the spreads to be 100% height and width of the screen. In theory this is not the only appropriate display style. You can still use this framework to asynchronously load in "modules" instead of calling them spreads. After all, they import their own javascript and styles. Additionally, they load in the order that you queue them in.

```css
#Spreads>*.Active{opacity:1}#Spreads>*:first-child{height:100%}#Spreads>*>*{text-align:center;display:table-cell;vertical-align:middle}#Spreads>*{display:table;height:100%;width:100%;transition:0.25s all ease-in-out;position:relative;opacity:0.125}#Spreads{height:100%;-webkit-overflow-scrolling:touch;font:400 16px/1.5 sans-serif}*{-webkit-text-size-adjust:none;-webkit-touch-callout:none;margin:0 auto;text-decoration:none;box-sizing:border-box;text-rendering:geometricPrecision}@viewport{width:device-width;zoom:1}a{color:inherit;font:inherit;pointer-events:auto}body,html,main{font:400 16px/1.5 sans-serif;color:#000;height:100%;width:100%;padding:0;margin:0}
```
===
######JS:

The framework comes with three exposed functions. `"buildUI"`, `"scanUI"`, `"get"`. The first two will be unexposed at a later date, as I just realized that they are not particularly useful for the developer after the framework finishes setting up the navigation bar.

```javascript
nv.functions.get(target, onsuccess, data, onfail)
```

Get is super great because of its flexibility. For the following arguments, here is a description of how it will handle it:

`target`

* String -> Assumes URL, fetches and retrieves.
	* -> If contains ".js", will append to DOM on success.
	* -> If contains ".css" will append to DOM on success.

* Array -> Requests each element in order, but will accept them asynchronously. This is important to note if you are loading in JS dependencies. In this case... call `nv.functions.get` on the dependent within the callback, as it will fire off when everything is loaded.

`onsuccess`

* Function -> will execute on successful or failed XHR, unless you pass in a function for argument "onfail"!

`data`

* Any data type -> May be removed from official documentation (here) in the future. This is to pass in data (such as an object, or string) and have it be accessible from within the XHR and consequently, the callbacks.

`onfail`

* Function -> to handle when the XHR fails.

Secret: `callback`

* Function -> This really is only here for when you pass in an array of targets, and then an onsuccess function to fire off at the very end of the array. This is here because the function calls itself recursively and moves the "onsuccess" function to "callback", until the array contents are all expired, then it is moved back to "onsuccess"
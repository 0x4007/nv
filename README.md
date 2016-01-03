# NV
Performance-first front-end framework.

```javascript
nv({}, fn);
```
Usage: (settings object, callback function.)

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
*selectors: Anything within ```html
<UI>``` or `<* id="UI">` in DOM is automatically connected to `nv.selectors.UI.*` for developer convenience.
*spreads: Pass in URLs of HTML snippets to have them inject into your app. You can do an array of URLs or folders (assuming that your server outputs the directory contents.)
*subroutine: Core functions of nv are divided into six parts. You can "hot swap" how the program runs by passing in custom subroutines to replace the original ones. Useful for very specific app configurations.


var	cssPurge = require('css-purge');


//purging some CSS
var css = "p { color: blue; color: blue; } ";
console.log(
	cssPurge.purgeCSS(css, {
		trim : true,
		shorten : true,
		verbose : false,
	})
);

//purging a CSS file with HTML and options
cssPurge.purgeCSSFiles('demo/test1.css', 'demo/html/test1.html', {
	trim : true,
	shorten : true,
	verbose : true
});
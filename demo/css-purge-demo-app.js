var	cssPurge = require('css-purge');

//purging a CSS file with HTML and options
cssPurge.purgeCSSFiles({
  	css: 'test1.css', 
  	html: 'html/test1.html',
  	trim : true,
  	shorten : true,
  	verbose : true
  }
);

//purging some CSS
var css = "p { color: blue; color: blue; } ";
cssPurge.purgeCSS(css, {
	trim : true,
	shorten : true,
	verbose : false
}, function(error, result){
	if (error)
		console.log(error)
	else
		console.log('Output CSS: ',  result);
});
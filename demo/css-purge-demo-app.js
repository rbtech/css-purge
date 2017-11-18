var	cssPurge = require('css-purge');


//purging some CSS
var css = "p { color: blue; color: blue; } ";
cssPurge.purgeCSS(css, {
	trim : true,
	shorten : true
	verbose : false,
}, function(error, result){
	if (error)
		console.log(error)
	else
		console.log('Output CSS: ',  result);
});


//purging a CSS file with HTML and options
cssPurge.purgeCSSFiles({
  	css: 'demo/test1.css', 
  	html: 'demo/html/test1.html',
  	trim : true,
  	shorten : true,
  	verbose : true
  }
);
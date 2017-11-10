var through2 = require('through2');
var	cssPurge = require('./lib/css-purge');


//for streams
function write(buffer, encoding, next) {

	this.push(cssPurge.purgeCSS(buffer.toString(), {
		trim : true,
		shorten : true,
		verbose : false,
	}));

	next();
}
function end(done) {

	done();
}

process.stdin.pipe(through2(write, end)).pipe(process.stdout);
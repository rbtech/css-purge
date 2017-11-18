var through2 = require('through2');
var	cssPurge = require('./css-purge');


//for streams
function write(buffer, encoding, next) {

	cssPurge.purgeCSS(buffer.toString(), {
		trim : true,
		shorten : true,
		verbose : false,
	}, function(error, result){

		this.push(result);

		next();
	});
}
function end(done) {

	done();
}

process.stdin.pipe(through2(write, end)).pipe(process.stdout);
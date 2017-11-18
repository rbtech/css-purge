#!/usr/bin/env node
var through2 = require('through2');
var clc = require('cli-color');
var program = require('commander');
var cssPurge = require('./lib/css-purge');

var error = clc.red.bold;
var info = clc.xterm(123);
var warn = clc.yellow;
var logoRed = clc.xterm(197);

program
	.version('3.0.0')
	.option('-c, --cssinput - CSS <the css>', 'The CSS to purge')
	.option('-i, --input - CSS file(s) <input filenames, foldernames or url>', 'The CSS file(s) to parse')
	.option('-m, --inputhtml - HTML file(s) <input html filenames, foldernames or url>', 'The HTML file(s) to parse for CSS')
	.option('-o, --output - CSS file <output filename>', 'The new css filename to output as')
	.option('-f, --customconfig - <config filename> - run with custom config filename', 'Global Workflow - All options must be defined in a json file')
	.option('-d, --defaultconfig - run with default config file', 'Local Workflow - All options are defined in a config_css.json')
	.option('-v, --verbose - displays internal messages', 'Outputs CSS-PURGE activity')
	.parse(process.argv);


if (program.cssinput) {

	if (program.output) {
		cssPurge.purgeCSS(program.cssinput, {
			css_output: program.output,
			trim : true,
			shorten : true,
			verbose : (program.verbose) ? true : false
		}, function(error, result){
			if (error)
				console.log(error)
			else
				console.log(result);
		});
	} else {
		cssPurge.purgeCSS(program.cssinput, {
			trim : true,
			shorten : true,
			verbose : (program.verbose) ? true : false
		}, function(error, result){
			if (error)
				console.log(error)
			else
				console.log(result);
		});
	}

} else if (program.input && program.inputhtml && program.output) {
	cssPurge.purgeCSSFiles(
		{
			css: program.input,
			css_output: program.output,
			trim : true,
			shorten : true,
			special_reduce_with_html: true,
			html: program.inputhtml,
			verbose : (program.verbose) ? true : false
		}, 
		(program.customconfig !== undefined) ? program.customconfig : 'cmd_default'
	);


} else if (program.input && program.inputhtml) {
	cssPurge.purgeCSSFiles(
		{
			css: program.input,
			css_output: program.input.substr(0, program.input.lastIndexOf('.')) + '.min.css',
			trim : true,
			shorten : true,
			special_reduce_with_html: true,
			html: program.inputhtml,
			verbose : (program.verbose) ? true : false
		}, 
		(program.customconfig !== undefined) ? program.customconfig : 'cmd_default'
	);


} else if (program.input && program.output) {
	cssPurge.purgeCSSFiles(
		{
			css: program.input,
			css_output: program.output,
			trim : true,
			shorten : true,
			verbose : (program.verbose) ? true : false
		}, 
		(program.customconfig !== undefined) ? program.customconfig : 'cmd_default'
	);
} else if (program.input) {

	cssPurge.purgeCSSFiles(
		{
			css: program.input,
			css_output: program.input.substr(0, program.input.lastIndexOf('.')) + '.min.css',
			trim : true,
			shorten : true,
			verbose : (program.verbose) ? true : false
		}, 
		(program.customconfig !== undefined) ? program.customconfig : 'cmd_default'
	);
} else if (program.customconfig) {
	cssPurge.purgeCSSFiles(null, '' + program.customconfig);
} else if (program.defaultconfig) {
	cssPurge.purgeCSSFiles();
} else {
	program.help();
}
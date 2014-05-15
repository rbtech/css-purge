var clc = require('cli-color'),
	fs = require('fs'),
	parse = require('css-parse'), 
	read = fs.readFileSync, 
	write = fs.writeFileSync;

var success = clc.greenBright,
	success2 = clc.green,
	error = clc.red,
	error2 = clc.redBright,
	warning = clc.yellow,
	awesome = clc.magentaBright;

var filenameIn = '';
var filenameOut = '';

var is_verbose = false,
	is_no_duplicate_property = false;

function CSSPurge(filenameInput, filenameOutput, options) {

	filenameIn = filenameInput;
	filenameOut = filenameOutput;
	is_verbose = options.verbose;
	is_no_duplicate_property = options.no_duplicate_property;

	try {
		var css = read(filenameIn, 'utf8');

		var parsedCSS = parse(css),
			parsedRules = parsedCSS.stylesheet.rules,
			parsedRulesLen = parsedRules.length;

		var baseDuplicates = [], mediaDuplicates = [], keyFramesDuplicates = [],
			supportsDuplicates = [];

		var mediaDuplicatesLen = 0, keyFramesDuplicatesLen = 0, supportsDuplicatesLen = 0;

		var i = 0;

		// console.log(parsedCSS);
		// console.log(parsedCSS.stylesheet);
		// console.log(parsedCSS.stylesheet.rules);
		// console.log('----');

		///detect duplicates
			if(is_verbose) {
				console.log('-------------------------');
				console.log(warning('Detecting base duplicates...'));
			}
			baseDuplicates = get_duplicates(parsedRules, parsedRules);

			for (i = 0; i < parsedRulesLen; i++) {

				//@media
				if (parsedRules[i].media != undefined) {
					if(is_verbose) {
						console.log('-------------------------');
						console.log(warning('Detecting media duplicates...'));
					}
					// console.log(parsedRules[i].rules);
					mediaDuplicates.push([get_duplicates(parsedRules[i].rules, parsedRules[i].rules), i]); //duplicates for the media query and index of media query
				}

				//@keyframes
				if (parsedRules[i].name != undefined && parsedRules[i].keyframes != undefined) {
					if(is_verbose) {
						console.log('-------------------------');
						console.log(warning('Detecting keyframes duplicates...'));
					}

					// console.log(parsedRules[i].keyframes);
					keyFramesDuplicates.push([get_duplicates(parsedRules[i].keyframes, parsedRules[i].keyframes), i]); //duplicates for the keyframes and index of media query
				}

				//@supports
				if (parsedRules[i].supports != undefined) {
					if(is_verbose) {
						console.log('-------------------------');
						console.log(warning('Detecting supports duplicates...'));
					}

					// console.log(parsedRules[i].rules);		
					supportsDuplicates.push([get_duplicates(parsedRules[i].rules, parsedRules[i].rules), i]); //duplicates for the supports and index of media query
				}

			}
			// console.log(keyFramesDuplicates);
			// console.log(supportsDuplicates);
			// console.log(mediaDuplicates);
		///end detect duplicates

		///merge properties
			mediaDuplicatesLen = mediaDuplicates.length,
			keyFramesDuplicatesLen = keyFramesDuplicates.length
			supportsDuplicatesLen = supportsDuplicates.length;

			//base
			if(is_verbose) {
				console.log('-------------------------');
				console.log(warning('Copying base properties...'));
			}
			copy_properties(parsedRules, baseDuplicates);

			//@media
			for (i = 0; i < mediaDuplicatesLen; i++) {
				if(is_verbose) {
					console.log('-------------------------');
					console.log(warning('Copying media properties...'));
				}
				if (mediaDuplicates[i][0].length > 0) {

					// console.log(mediaDuplicates[i]);
					copy_properties(parsedRules[mediaDuplicates[i][1]].rules, mediaDuplicates[i][0]);
				}
			}

			//@keyframes
			for (i = 0; i < keyFramesDuplicatesLen; i++) {

				if(is_verbose) {
					console.log('-------------------------');
					console.log(warning('Copying keyframes properties...'));
				}
				if (keyFramesDuplicates[i][0].length > 0) {

					// console.log(keyFramesDuplicates[i]);
					copy_properties(parsedRules[keyFramesDuplicates[i][1]].keyframes, keyFramesDuplicates[i][0]);
				}
			}

			//@supports
			for (i = 0; i < supportsDuplicatesLen; i++) {

				if(is_verbose) {
					console.log('-------------------------');
					console.log(warning('Copying supports properties...'));
				}
				if (supportsDuplicates[i][0].length > 0) {

					// console.log(supportsDuplicates[i]);
					copy_properties(parsedRules[supportsDuplicates[i][1]].rules, supportsDuplicates[i][0]);
				}
			}
		///end merge properties

		///remove duplicate rules -- reversed: remove all inner duplicates first to not disturb the main index structure

			//@media
			for (i = 0; i < mediaDuplicatesLen; i++) {
				if(is_verbose) {
					console.log('-------------------------');
					console.log(warning('Removing media duplicates...'));
				}
				if (mediaDuplicates[i][0].length > 0) {

					// console.log(mediaDuplicates[i]);
					// console.log(parsedRules[mediaDuplicates[i][1]].rules);
					remove_duplicates(parsedRules[mediaDuplicates[i][1]].rules, mediaDuplicates[i][0]);
				}
			}

			//@keyframes
			for (i = 0; i < keyFramesDuplicatesLen; i++) {
				if(is_verbose) {
					console.log('-------------------------');
					console.log(warning('Removing keyframes duplicates...'));
				}
				if (keyFramesDuplicates[i][0].length > 0) {

					// console.log(keyFramesDuplicates[i]);
					remove_duplicates(parsedRules[keyFramesDuplicates[i][1]].keyframes, keyFramesDuplicates[i][0]);
				}
			}

			//@supports
			for (i = 0; i < supportsDuplicatesLen; i++) {
				if(is_verbose) {
					console.log('-------------------------');
					console.log(warning('Removing supports duplicates...'));
				}
				if (supportsDuplicates[i][0].length > 0) {

					// console.log(supportsDuplicates[i]);
					remove_duplicates(parsedRules[supportsDuplicates[i][1]].rules, supportsDuplicates[i][0]);
				}
			}

			//base
			if(is_verbose) {
				console.log('-------------------------');
				console.log(warning('Removing base duplicates...'));
			}
			remove_duplicates(parsedRules, baseDuplicates);

		///end remove duplicate rules

		output_css(parsedRules);


	} catch (e) {

		console.log(error('\nDarn it, something went wrong: \n\n') + error2(e.stack) + '\n');
	}
}

function output_css(rules) {

	var outputCSS = '';

	if(is_verbose) {
		console.log('-------------------------');
		console.log(warning('Writing file...'));
	}

	// console.log(filenameOut);

	rules.forEach(function(rule){
		
		//@charset
		if (rule.charset != undefined) {

			// console.log(rule.charset);
			outputCSS += '@charset ' + rule.charset + ';\n';
		}

		//@import
		if (rule.import != undefined) {

			outputCSS += '@import ' + rule.import + ';\n';
		}

		//@keyframes
		if (rule.name != undefined && rule.keyframes != undefined) {

			// console.log(rule);
			outputCSS += '\n@keyframes ' + rule.name + ' {\n';

			rule.keyframes.forEach(function(rule){

				// console.log(rule);
				outputCSS += _get_rule(rule, 1);
			});

			outputCSS += '}\n';
		}

		//@supports
		if (rule.supports != undefined) {

			outputCSS += '\n@supports ' + rule.supports + ' {\n\n';

			rule.rules.forEach(function(rule){

				// console.log(rule);
				outputCSS += _get_rule(rule, 1);
			});

			outputCSS += '}\n';
		}

		//@media
		if (rule.media != undefined) {

			// console.log(rule.media);
			// console.log(rule.rules);

			outputCSS += '\n@media ' + rule.media + ' {\n\n';


			rule.rules.forEach(function(rule){

				outputCSS += _get_rule(rule, 1);
			});

			outputCSS += '}\n';
		}

		//handle normal selectors
		outputCSS += _get_rule(rule);
	});


	write(filenameOut, outputCSS);

	console.log('\n' + new Date() + ' ' + awesome('Success! ') + success2(filenameIn) + ' : ' + success(filenameOut) + '');
}


function _get_rule(rule, no_indents) {

	outputCSS = '';

	for (i = 0; i < no_indents; i++) {
		outputCSS += '\t';
	}

	//@page
	if (rule.type != undefined) {

		switch(rule.type) {

			case 'page': outputCSS += '@page ';
				break;
		}
	}

	if (rule.selectors != undefined) {
		outputCSS += '' + rule.selectors + ' {';
	} else if (rule.values != undefined) {
		outputCSS += '' + rule.values + ' {';
	}
	
	if (rule.declarations != undefined) {
		// console.log(rule.declarations);
		rule.declarations.forEach(function(declaration){

			outputCSS += '\n';

			for (i = 0; i < no_indents; i++) {
				outputCSS += '\t';
			}
			// console.log(declaration);
		 	outputCSS += '\t' + declaration.property + ': ' + declaration.value + ';';
	
		});
	}

	outputCSS += '\n';

	for (i = 0; i < no_indents; i++) {
		outputCSS += '\t';
	}

	if (rule.selectors != undefined || rule.values != undefined) {
		outputCSS += '}\n';
	}

	return outputCSS;
}




function get_duplicates(fRules, oRules) { //fRules - Final Rules, oRules = Original Rules

	//the list of rules to ignore checking for duplication, duh.
	var ignoreRulesList = ['@font-face'],
		ruleToIgnoreFound = false;
	
	// console.log(fRules);
	// console.log('----------------------------');
	// console.log(oRules);

	var fRulesLen = fRules.length,
		oRulesLen = oRules.length;

	var i = 0, j = 0, k = 0, 
		l = 0, m = 0, peetsake = 0;

	var rulesToChange = [],
		ruleTo, 
		ruleFrom;

	var isRescan = false;

	for (i = 0; i < fRulesLen; i++) {

		if ((fRules[i].selectors !== undefined || fRules[i].values !== undefined) && fRules[i].declarations !== undefined 
			&& fRules[i].type === undefined) {
			
			if (fRules[i].selectors !== undefined)
				selectorsTo = '' + fRules[i].selectors;
			else if (fRules[i].values !== undefined)
				selectorsTo = '' + fRules[i].values;

			for (m = 0; m < rulesToChange.length; m++) {

				if (fRules[i].selectors !== undefined) {
					if (rulesToChange[m][0].selectors + '' == selectorsTo) {

						isRescan = true;
					}
				} else if (fRules[i].values !== undefined) {
					if (rulesToChange[m][0].values + '' == selectorsTo) {

						isRescan = true;
					}
				}
			}

			if (!isRescan) {

				for (j = 0; j < oRulesLen; j++) {

					if ((oRules[j].selectors !== undefined || oRules[j].values !== undefined) && oRules[j].declarations !== undefined 
						&& oRules[j].type === undefined) {

						if (oRules[j].selectors !== undefined)
							selectorsFrom = '' + oRules[j].selectors;
						else if (oRules[j].values !== undefined)
							selectorsFrom = '' + oRules[j].values;


						if (is_verbose) {
							console.log('Comparing [' + i + ']' + selectorsTo + ' ' + '[' + j + ']' + selectorsFrom);
						}
						

						for (k = 0; k < rulesToChange.length; k++) {

							for (l = 0; l < rulesToChange[k][1].length; l++) {

								if (oRules[j].selectors !== undefined) {
									if (selectorsFrom == rulesToChange[k][1].selectors + '') {

										isRescan = true;
									}
								} else if (oRules[j].values !== undefined) {
									if (selectorsFrom == rulesToChange[k][1].values + '') {

										isRescan = true;
									}
								}
							}
						}
						
						if (!isRescan) {

							ruleToIgnoreFound = false;
							for (peetsake = 0; peetsake < ignoreRulesList.length; peetsake++) {

								if (selectorsTo == ignoreRulesList[peetsake] || selectorsFrom == ignoreRulesList[peetsake]) {
									ruleToIgnoreFound = true;
									break;
								}
							}

							if (selectorsTo == selectorsFrom && i != j && !ruleToIgnoreFound) {

								if (is_verbose) {
									console.log('! Comparing [' + i + ']' + selectorsTo + ' ' + '[' + j + ']' + selectorsFrom);
								}

								ruleToIndex = i;
								ruleFromIndex = j;
								ruleTo = fRules[i];
								ruleFrom = oRules[j];

								rulesToChange.push([ruleTo, ruleFrom, ruleToIndex, ruleFromIndex]);

								if (is_verbose) {

									if (oRules[j].selectors !== undefined) {
										console.log('CopyTo: [' + i + ']' + ruleTo.selectors);
										console.log('Duplicate: [' + j + ']' + ruleFrom.selectors);
										console.log('RuleTo: ');
										console.log(ruleTo);
										console.log('RuleFrom: ');
										console.log(ruleFrom);
									} else if (oRules[j].values !== undefined) {
										console.log('CopyTo: [' + i + ']' + ruleTo.values);
										console.log('Duplicate: [' + j + ']' + ruleFrom.values);
										console.log('RuleTo: ');
										console.log(ruleTo);
										console.log('RuleFrom: ');
										console.log(ruleFrom);
									}
								}
							}

						} else {

							isRescan = false;	
						}

					}

				} //end for

			} else {

				isRescan = false;
			}

		} // end of if (undefined)
	}

	return rulesToChange;
}




function copy_properties(rules, rulesToChange) {
	

	var isDuplicateProperty = false,
		propertiesToCheck = [],
		duplicatePropertiesIndexes = [],
		newProperties = [];


	for (i = 0; i < rules.length; i++) {

		for (j = 0; j < rulesToChange.length; j++) {

			if (rulesToChange[j][2] == i) {

				// console.log(rules[i]);
				// console.log(rulesToChange[j][1]);

				if (rulesToChange[j][1].declarations != undefined) {


					//check rules for duplicate properties
					var arr = {};

					for ( var l=0; l < rules[i].declarations.length; l++ )
					    arr[rules[i].declarations[l]['property']] = rules[i].declarations[l];

					rules[i].declarations = new Array();
					for ( key in arr )
					    rules[i].declarations.push(arr[key]);
					// console.log(rules[i].declarations)



					//check rules to change with for duplicate properties
					arr = {};

					for ( var l=0; l < rulesToChange[j][1].declarations.length; l++ )
					    arr[rulesToChange[j][1].declarations[l]['property']] = rulesToChange[j][1].declarations[l];

					rulesToChange[j][1].declarations = new Array();
					for ( key in arr )
					    rulesToChange[j][1].declarations.push(arr[key]);
					// console.log(rulesToChange[j][1]);



					//the copy
					for (k = 0; k < rulesToChange[j][1].declarations.length; k++) {

						//check for duplicate			
						for (l = 0; l < rules[i].declarations.length; l++) {

							if (rules[i].declarations[l].property + '' == rulesToChange[j][1].declarations[k].property + '') {

								if (is_no_duplicate_property) {
									isDuplicateProperty = true;

									if(is_verbose) {
										console.log('[' + i + ']B ' + rules[i].declarations[l].property + ' : ' +  rules[i].declarations[l].value);
									}
									rules[i].declarations[l].value = rulesToChange[j][1].declarations[k].value;

									if(is_verbose) {
										console.log('[' + i + ']A ' + rules[i].declarations[l].property + ' : ' +  rules[i].declarations[l].value);
									}
								}

								if(is_verbose) {
									console.log('[' + i + '] ' + rules[i].declarations[l].property + ' : ' +  rules[i].declarations[l].value);
									
								}
							}
						}

						if (!isDuplicateProperty) {

							rules[i].declarations.push({

								property: rulesToChange[j][1].declarations[k].property,
								value: rulesToChange[j][1].declarations[k].value

							});

						} else {

							isDuplicateProperty = false;
						}
					} //end of for
				}

				// console.log('----');
			}
		}
	}
}


function remove_duplicates(rules, rulesToChange) {
		
	//remove duplicates from the back to the front (to avoid index changes)
	for (i = rules.length; i > 0; i--) {

		for (j = 0; j < rulesToChange.length; j++) {

			if (rulesToChange[j][3] == i) {

				if(is_verbose) {

					console.log('[' + i + '] ');
					console.log(rules[i]);
				}

		        rules.splice(i, 1);
		    }
		}

	}
}


module.exports = CSSPurge;
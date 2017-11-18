
const clc = require('cli-color'),
	fs = require('fs'),
  path = require('path'),
	css = require('css'),
	parseCssFont = require('parse-css-font'),
	read = fs.readFileSync, 
	write = fs.writeFileSync,
	appendToFileSync = fs.appendFileSync,
	validUrl = require('valid-url'),
	request = require('request');


const jsdom = require("jsdom");
const { JSDOM } = jsdom;

var success = clc.greenBright,
	success2 = clc.green,
	info = clc.xterm(123),
	error = clc.red,
	error2 = clc.redBright,
	warning = clc.yellow,
	awesome = clc.magentaBright,
	logoRed = clc.xterm(197),
	cool = clc.xterm(105);

const EventEmitter = require('events');
const crypto = require('crypto');
var hash;


class CSSPurgeEmitter extends EventEmitter {}

function CSSPurge() {

	var timeLabel = null;

	var CPEVENTS = new CSSPurgeEmitter();

	var CONFIG = {
		"options": {

			"css": ["demo/test1.css"],

			"trim": true,
	    "trim_keep_non_standard_inline_comments": false,
	    "trim_removed_rules_previous_comment": true,
			"trim_comments": true,
	    "trim_whitespace": true,
	    "trim_breaklines": true,
	    "trim_last_semicolon": true,
	    "bypass_media_rules": true,
	    "bypass_document_rules": false,
	    "bypass_supports_rules": false,
	    "bypass_page_rules": false,
	    "bypass_charset": false,
	    "shorten": true,
	    "shorten_zero": true,
	    "shorten_hexcolor": true,
	    "shorten_hexcolor_extended_names": true,
	    "shorten_hexcolor_UPPERCASE": false,
	    "shorten_font": true,
	    "shorten_background": true,
	    "shorten_background_min": 2,
	    "shorten_margin": true,
	    "shorten_padding": true,
	    "shorten_list_style": true,
	    "shorten_outline": true,
	    "shorten_border": true,
	    "shorten_border_top": true,
	    "shorten_border_right": true,
	    "shorten_border_bottom": true,
	    "shorten_border_left": true,
	    "shorten_border_radius": true,
	    "format": true,
	    "format_font_family": true,
	    "format_4095_rules_legacy_limit": false,
	    "special_convert_rem": false,
	    "special_convert_rem_browser_default_px": "16",
	    "special_convert_rem_desired_html_px": "10",
	    "special_convert_rem_font_size": true,
	    "special_reduce_with_html" : false,
	    "special_reduce_with_html_ignore_selectors" : [
	            "@-ms-",
	            ":-ms-",
	            "::",
	            ":valid",
	            ":invalid",
	            "+.",
	            ":-"
	    ],

	    "generate_report": false,
	    "report_file_location": "css_purge_report.json",

	    "verbose": false,
		  "zero_units": "em, ex, %, px, cm, mm, in, pt, pc, ch, rem, vh, vw, vmin, vmax",
		  "zero_ignore_declaration": ["filter"],
		  "reduce_declarations_file_location": "config_reduce_declarations.json"
		}
	};

	var OPTIONS = {
		css_output: CONFIG.options.css_output,
		css: CONFIG.options.css,
		html: CONFIG.options.html,
		js: CONFIG.options.js,

		trim: CONFIG.options.trim,
		trim_keep_non_standard_inline_comments: CONFIG.options.trim_keep_non_standard_inline_comments,
		trim_removed_rules_previous_comment: CONFIG.options.trim_removed_rules_previous_comment,
		trim_comments: CONFIG.options.trim_comments,
		trim_whitespace: CONFIG.options.trim_whitespace,
		trim_breaklines: CONFIG.options.trim_breaklines,
		trim_last_semicolon: CONFIG.options.trim_last_semicolon,
		bypass_media_rules: CONFIG.options.bypass_media_rules,
		bypass_document_rules: CONFIG.options.bypass_document_rules,
		bypass_supports_rules: CONFIG.options.bypass_supports_rules,
		bypass_page_rules: CONFIG.options.bypass_page_rules,
		bypass_charset: CONFIG.options.bypass_charset,
		shorten: CONFIG.options.shorten,
		shorten_zero: CONFIG.options.shorten_zero,
		shorten_hexcolor: CONFIG.options.shorten_hexcolor,
		shorten_hexcolor_extended_names: CONFIG.options.shorten_hexcolor_extended_names,
		shorten_hexcolor_UPPERCASE: CONFIG.options.shorten_hexcolor_UPPERCASE,
		shorten_font: CONFIG.options.shorten_font,
		shorten_background: CONFIG.options.shorten_background,
		shorten_background_min: CONFIG.options.shorten_background_min,
		shorten_margin: CONFIG.options.shorten_margin,
		shorten_padding: CONFIG.options.shorten_padding,
		shorten_list_style: CONFIG.options.shorten_list_style,
		shorten_outline: CONFIG.options.shorten_outline,
		shorten_border: CONFIG.options.shorten_border,
		shorten_border_top: CONFIG.options.shorten_border_top,
		shorten_border_right: CONFIG.options.shorten_border_right,
		shorten_border_bottom: CONFIG.options.shorten_border_bottom,
		shorten_border_left: CONFIG.options.shorten_border_left,
		shorten_border_radius: CONFIG.options.shorten_border_radius,
		format: CONFIG.options.format,
		format_font_family: CONFIG.options.format_font_family,
		format_4095_rules_legacy_limit: CONFIG.options.format_4095_rules_legacy_limit,
		special_convert_rem: CONFIG.options.special_convert_rem,
		special_convert_rem_browser_default_px: CONFIG.options.special_convert_rem_browser_default_px,
		special_convert_rem_desired_html_px: CONFIG.options.special_convert_rem_desired_html_px,
		special_convert_rem_font_size: CONFIG.options.special_convert_rem_font_size,
		special_reduce_with_html: CONFIG.options.special_reduce_with_html,
		special_reduce_with_html_ignore_selectors: CONFIG.options.special_reduce_with_html_ignore_selectors,

		generate_report: CONFIG.options.generate_report,
		verbose: CONFIG.options.verbose,
		zero_units: CONFIG.options.zero_units,
		zero_ignore_declaration: CONFIG.options.zero_ignore_declaration,
		report_file_location: CONFIG.options.report_file_location,
		reduce_declarations_file_location: CONFIG.options.reduce_declarations_file_location
	};

	var currentConfig = null;

	var dataCSSIn = [];
	var dataHTMLIn = [];
	var dataJSIn = [];

	var tmpCSSPaths = [];
	var tmpHTMLPaths = [];
	var tmpJSPaths = [];

	var jsDom = null, jsDomWindow = null, jsDomDoc = null,
			resultsCount = 0;


	var REPORT_DUPLICATE_CSS = CONFIG.options.report_file_location;
	var summary = {
		"files" : {
			"input": [],
			"output": [],
			"input_html": [],
			"input_js": []
		},
		"options_used" : {
			"trim" : OPTIONS.trim,
			"trim_comments" : OPTIONS.trim_comments,
			"trim_keep_non_standard_inline_comments" : OPTIONS.trim_keep_non_standard_inline_comments,
			"trim_removed_rules_previous_comment" : OPTIONS.trim_removed_rules_previous_comment,
			"trim_whitespace" : OPTIONS.trim_whitespace,
			"trim_breaklines" : OPTIONS.trim_breaklines,
			"trim_last_semicolon" : OPTIONS.trim_last_semicolon,
			"shorten" : OPTIONS.shorten,
			"shorten_zero" : OPTIONS.shorten_zero,
			"shorten_hexcolor" : OPTIONS.shorten_hexcolor,
			"shorten_hexcolor_extended_names" : OPTIONS.shorten_hexcolor_extended_names,
			"shorten_hexcolor_UPPERCASE" : OPTIONS.shorten_hexcolor_UPPERCASE,
			"shorten_font": OPTIONS.shorten_font,
			"shorten_background": OPTIONS.shorten_background,
			"shorten_margin": OPTIONS.shorten_margin,
			"shorten_padding": OPTIONS.shorten_padding,
			"shorten_list_style": OPTIONS.shorten_list_style,
			"shorten_outline": OPTIONS.shorten_outline,
			"shorten_border": OPTIONS.shorten_border,
			"shorten_border_top": OPTIONS.shorten_border_top,
			"shorten_border_right": OPTIONS.shorten_border_right,
			"shorten_border_bottom": OPTIONS.shorten_border_bottom,
			"shorten_border_left": OPTIONS.shorten_border_left,
			"shorten_border_radius": OPTIONS.shorten_border_radius,
			"format": OPTIONS.format,
			"format_font_family": OPTIONS.format_font_family,
			"format_4095_rules_legacy_limit": OPTIONS.format_4095_rules_legacy_limit,
			"special_convert_rem": OPTIONS.special_convert_rem,
			"special_convert_rem_browser_default_px": OPTIONS.special_convert_rem_browser_default_px,
			"special_convert_rem_desired_html_px": OPTIONS.special_convert_rem_desired_html_px,
			"special_convert_rem_font_size": OPTIONS.special_convert_rem_font_size,
			"generate_report" : OPTIONS.generate_report,
			"verbose" : OPTIONS.verbose,
			"bypass_media_rules" : OPTIONS.bypass_media_rules,
			"bypass_document_rules" : OPTIONS.bypass_document_rules,
			"bypass_supports_rules" : OPTIONS.bypass_supports_rules,
			"bypass_page_rules" : OPTIONS.bypass_page_rules,
			"bypass_charset" : OPTIONS.bypass_charset,
			"special_reduce_with_html" : OPTIONS.special_reduce_with_html,
			"special_reduce_with_html_ignore_selectors" : OPTIONS.special_reduce_with_html_ignore_selectors
		},
		"stats" : {},
		"duplicate_rules" : [],
		"duplicate_declarations" : [],
		'empty_declarations' : [],
		"selectors_removed" : []
	};

	//stats
	var stats = {
		files: {
			css: [],
			html: [],
			js: []
		},
		before: {
			totalFileSizeKB: 0,
			noNodes : 0,
			noRules : 0,
			noDeclarations : 0,
			noComments : 0,
			noCharset : 0,
			noCustomMedia : 0,
			noDocument : 0,
			noFontFace : 0,
			noHost : 0,
			noImport : 0,
			noKeyframes : 0,
			noKeyframe : 0,
			noMedia : 0,
			noNamespace : 0,
			noPage : 0,
			noSupports : 0
		},
		after: {
			totalFileSizeKB: 0,
			noNodes : 0,
			noRules : 0,
			noDeclarations : 0,
			noComments : 0,
			noCharset : 0,
			noCustomMedia : 0,
			noDocument : 0,
			noFontFace : 0,
			noHost : 0,
			noImport : 0,
			noKeyframes : 0,
			noKeyframe : 0,
			noMedia : 0,
			noNamespace : 0,
			noPage : 0,
			noSupports : 0
		},
		summary: {
			savingsKB: 0,
			savingsPercentage: 0,
			noDuplicateRules : 0,
			noDuplicateDeclarations : 0,
			noZerosShortened: 0,
			noNamedColorsShortened: 0,
			noHexColorsShortened: 0,
			noRGBColorsShortened: 0,
			noHSLColorsShortened: 0,
			noFontsShortened: 0,
			noBackgroundsShortened: 0,
			noMarginsShortened: 0,
			noPaddingsShortened: 0,
			noListStylesShortened: 0,
			noOutlinesShortened: 0,
			noBordersShortened: 0,
			noBorderTopsShortened: 0,
			noBorderRightsShortened: 0,
			noBorderBottomsShortened: 0,
			noBorderLeftsShortened: 0,
			noBorderRadiusShortened: 0,
			noLastSemiColonsTrimmed: 0,
			noInlineCommentsTrimmed: 0,
			noReductions: {
				noNodes : 0,
				noRules : 0,
				noDeclarations : 0,
				noComments : 0,
				noCharset : 0,
				noCustomMedia : 0,
				noDocument : 0,
				noFontFace : 0,
				noHost : 0,
				noImport : 0,
				noKeyframes : 0,
				noKeyframe : 0,
				noMedia : 0,
				noNamespace : 0,
				noPage : 0,
				noSupports : 0
			}
		}
	};

	/* read declaration reduce lists */

	var CONFIG_REDUCE_DECLARATIONS = 'config_reduce_declarations.json';
	var hasReadReduceDeclarations = false;

	var reduceRulesListSelector = '';
	var reduceRulesListSelectorPName = [];
	var reduceRulesListSelectorCount = 0;
	var reduceRulesListName = [
			"font",
			"margin",
			"padding",
			"list-style",
			"outline",
			"border",
			"border-top",
			"border-right",
			"border-bottom",
			"border-left",
			"border-radius",
			"border-color",
			"border-top-color",
			"border-right-color",
			"border-bottom-color",
			"border-left-color",
			"color",
			"background-color",
			"font-color",
			"outline-color",
			"box-shadow",
			"text-shadow",
			"float",
			"font-family",
			"font-size",
			"font-weight",
			"font-style",
			"font-variant",
			"font-stretch"
		];
	var reduceRulesListNameCount = reduceRulesListName.length;




	var configFileLocation = 'config_css.json';
	var fileLocation = 'demo/test1.css';
	var outputFileLocation = 'demo/test1_out.css';

	var htmlFileLocation = '';


	var readStream;
	var readHTMLStream;
	var readJSStream;
	var readCSSFileCount = 0;
	var readHTMLFileCount = 0;
	var readJSFileCount = 0;
	var filesizeKB = 0;
	var filesizeKBHTML = 0;
	var filesizeKBJS = 0;


	var tokenex = null;


	var font = null, fontProps = null, fontValues = null, fontIndex = 0, hasFont = false,
			fontPropsOutput = [], fontValuesOutput = [], fontTmpIdx = null, fontTmpVal = null,
			fontVal = null, fontHasImportant = false, fontHasInherit = false;
	var background = null, backgroundProps = null, backgroundValues = null, backgroundIndex = 0,
			backgroundTmp = null, backgroundTmp2 = null, hasBackground = false, hasMultipleBackgrounds = false,
			hasGradient = false, backgroundHasImportant = false,
			backgroundPropsOutput = [], backgroundValuesOutput = [], backgroundTmpIdx = null, 
			backgroundHasInherit = false;
	var margin = null, marginProps = null, marginValues = null, marginIndex = 0,
			marginLeftIdx = null, marginRightIdx = null, marginRightLeftVal = null,
			marginTopIdx = null, marginBottomIdx = null, marginTopBottomVal = null,
			marginSingleMerge = false, marginTmp = null, hasMargin = false,
			marginPropsOutput = [], marginValuesOutput = [], marginTmpIdx = null, marginTmpVal = null,
			marginHasImportant = false, marginHasInherit = false;
	var padding = null, paddingProps = null, paddingValues = null, paddingIndex = 0,
			paddingLeftIdx = null, paddingRightIdx = null, paddingRightLeftVal = null,
			paddingTopIdx = null, paddingBottomIdx = null, paddingTopBottomVal = null,
			paddingSingleMerge = false, paddingTmp = null, hasPadding = false,
			paddingPropsOutput = [], paddingValuesOutput = [], paddingTmpIdx = null,
			paddingHasImportant = false, paddingHasInherit = false;
	var listStyle = null, listStyleProps = null, listStyleValues = null, listStyleIndex = 0,
			listStyleTmp = null, listStyleTmp2 = null, hasListStyle = false,
			listStylePropsOutput = [], listStyleValuesOutput = [], listStyleTmpIdx = null,
			listStyleHasImportant = false, listStyleHasInherit = false;
	var outline = null, outlineProps = null, outlineValues = null, outlineIndex = 0,
			outlineTmp = null, outlineTmp2 = null, hasOutline = false,
			outlinePropsOutput = [], outlineValuesOutput = [], outlineTmpIdx = null,
			outlineHasImportant = false, outlineHasInherit = false;
	var border = null, borderProps = null, borderValues = null, borderIndex = 0,
			borderTmp = null, borderTmp2 = null, hasBorder = false,
			borderPropsOutput = [], borderValuesOutput = [], borderTmpIdx = null
			borderIsBeforeAfter = null, borderHasImportant = false, 
			borderHasInherit = false;
	var borderTop = null, borderTopProps = null, borderTopValues = null, borderTopIndex = 0,
			borderTopTmp = null, borderTopTmp2 = null, hasBorderTop = false,
			borderTopPropsOutput = [], borderTopValuesOutput = [], borderTopTmpIdx = null,
			borderTopHasImportant = false, borderTopHasInherit = false;
	var borderRight = null, borderRightProps = null, borderRightValues = null, borderRightIndex = 0,
			borderRightTmp = null, borderRightTmp2 = null, hasBorderRight = false,
			borderRightPropsOutput = [], borderRightValuesOutput = [], borderRightTmpIdx = null, 
			borderRightHasImportant = false, borderRightHasInherit = false;
	var borderBottom = null, borderBottomProps = null, borderBottomValues = null, borderBottomIndex = 0,
			borderBottomTmp = null, borderBottomTmp2 = null, hasBorderBottom = false,
			borderBottomPropsOutput = [], borderBottomValuesOutput = [], borderBottomTmpIdx = null,
			borderBottomHasImportant = false, borderBottomHasInherit = false;
	var borderLeft = null, borderLeftProps = null, borderLeftValues = null, borderLeftIndex = 0,
			borderLeftTmp = null, borderLeftTmp2 = null, hasBorderLeft = false,
			borderLeftPropsOutput = [], borderLeftValuesOutput = [], borderLeftTmpIdx = null,
			borderLeftHasImportant = false, borderLeftHasInherit = false;
	var borderRadius = null, borderRadiusProps = null, borderRadiusValues = null, borderRadiusIndex = 0,
			borderRadiusLeftIdx = null, borderRadiusRightIdx = null, borderRadiusRightLeftVal = null,
			borderRadiusTopIdx = null, borderRadiusBottomIdx = null, borderRadiusTopBottomVal = null,
			borderRadiusSingleMerge = false, borderRadiusTmp = null, borderRadiusTmp2 = null, hasBorderRadius = false,
			borderRadiusPropsOutput = [], borderRadiusValuesOutput = [], borderRadiusTmpIdx = null,
			borderRadiusHasImportant = false, borderRadiusHasInherit = false;

	var tmpVal = 0;
	var tokens_comments = [];
	var token3_chars = [];
	var token4_vals = [];
	var token5_vals = [];


	var g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, o = 0, dCount = 0, rCount = 0, cCount = 0;
	var ilen = 0, jlen = 0, klen = 0, llen = 0, mlen = 0, olen = 0;


	var colors = {
		'aqua' : '#0ff',
		'#00ffff' : '#0ff',
		'black' : '#000',
		'#000000' : '#000',
		'blue' : '#00f',
		'#0000ff' : '#00f',
		'fuchsia' : '#f0f',
		'#ff00ff' : '#f0f',
		'grey'		: 'grey',
		'green'		: 'green',
		'#808080' : 'grey', //grey / gray
		'#008000' : 'green',
		'lime' : '#0f0',
		'#00ff00' : '#0f0',
		'#800000' : 'maroon',
		'#000080' : 'navy',
		'#808000' : 'olive',
		'#800080' : 'purple',
		'#ff0000' : 'red',
		'maroon' : 'maroon',
		'navy' : 'navy',
		'olive' : 'olive',
		'purple' : 'purple',
		'red' : 'red',
		'#f00' : 'red',
		'silver' : 'silver',
		'teal' : 'teal',
		'#c0c0c0' : 'silver',
		'#008080' : 'teal',
		'white' : '#fff',
		'#ffffff' : '#fff',
		'yellow': '#ff0',
		'#ffff00': '#ff0'
	};

	var extended_colors = {
		'aliceblue' : '#f0f8ff',
		'antiquewhite': '#faebd7',
	  'aquamarine': '#7fffd4',
	  'azure': 'azure',
	  'beige': 'beige',
	  'bisque': 'bisque',
	  '#f0ffff': 'azure',
	  '#f5f5dc': 'beige',
	  '#ffe4c4': 'bisque',
	  'blanchedalmond': '#ffebcd',
	  'blueviolet': '#8a2be2',
	  'brown': 'brown',
	  '#a52a2a': 'brown',
	  'burlywood': '#deb887',
	  'cadetblue': '#5f9ea0',
	  'chartreuse': '#7fff00',
	  'chocolate': '#d2691e',
	  'coral': 'coral',
	  '#ff7f50': 'coral',
	  'cornflowerblue': '#6495ed',
	  'cornsilk': '#fff8dc',
	  'crimson': '#dc143c',
	  'cyan': '#0ff',
	  'darkblue': '#00008b',
	  'darkcyan': '#008b8b',
	  'darkgoldenrod': '#b8860b',
	  'darkgray': '#a9a9a9',
	  'darkgreen': '#006400',
	  'darkgrey': '#a9a9a9',
	  'darkkhaki': '#bdb76b',
	  'darkmagenta': '#8b008b',
	  'darkolivegreen': '#556b2f',
	  'darkorange': '#ff8c00',
	  'darkorchid': '#9932cc',
	  'darkred': '#8b0000',
	  'darksalmon': '#e9967a',
	  'darkseagreen': '#8fbc8f',
	  'darkslateblue': '#483d8b',
	  'darkslategray': '#2f4f4f',
	  'darkslategrey': '#2f4f4f',
	  'darkturquoise': '#00ced1',
	  'darkviolet': '#9400d3',
	  'deeppink': '#ff1493',
	  'deepskyblue': '#00bfff',
	  'dimgray': '#696969',
	  'dimgrey': '#696969',
	  'dodgerblue': '#1e90ff',
	  'firebrick': '#b22222',
	  'floralwhite': '#fffaf0',
	  'forestgreen': '#228b22',
	  'gainsboro': '#dcdcdc',
	  'ghostwhite': '#f8f8ff',
	  'gold': 'gold',
	  '#ffd700': 'gold',
	  'goldenrod': '#daa520',
	  'greenyellow': '#adff2f',
	  'honeydew': '#f0fff0',
	  'hotpink': '#ff69b4',
	  'indianred': '#cd5c5c',
	  'indigo': 'indigo',
	  'ivory': 'ivory',
	  'khaki': 'khaki',
	  '#4b0082': 'indigo',
	  '#fffff0': 'ivory',
	  '#f0e68c': 'khaki',
	  'lavender': '#e6e6fa',
	  'lavenderblush': '#fff0f5',
	  'lawngreen': '#7cfc00',
	  'lemonchiffon': '#fffacd',
	  'lightblue': '#add8e6',
	  'lightcoral': '#f08080',
	  'lightcyan': '#e0ffff',
	  'lightgoldenrodyellow': '#fafad2',
	  'lightgray': '#d3d3d3',
	  'lightgreen': '#90ee90',
	  'lightgrey': '#d3d3d3',
	  'lightpink': '#ffb6c1',
	  'lightsalmon': '#ffa07a',
	  'lightseagreen': '#20b2aa',
	  'lightskyblue': '#87cefa',
	  'lightslategray': '#789',
	  'lightslategrey': '#789',
	  'lightsteelblue': '#b0c4de',
	  'lightyellow': '#ffffe0',
	  'limegreen': '#32cd32',
	  'linen': 'linen',
	  '#faf0e6': 'linen',
	  'magenta': '#ff00ff',
	  'mediumaquamarine': '#66cdaa',
	  'mediumblue': '#0000cd',
	  'mediumorchid': '#ba55d3',
	  'mediumpurple': '#9370db',
	  'mediumseagreen': '#3cb371',
	  'mediumslateblue': '#7b68ee',
	  'mediumspringgreen': '#00fa9a',
	  'mediumturquoise': '#48d1cc',
	  'mediumvioletred': '#c71585',
	  'midnightblue': '#191970',
	  'mintcream': '#f5fffa',
	  'mistyrose': '#ffe4e1',
	  'moccasin': '#ffe4b5',
	  'navajowhite': '#ffdead',
	  'oldlace': '#fdf5e6',
	  'olivedrab': '#6b8e23',
	  'orange': '#ffa500',
	  'orangered': '#ff4500',
	  'orchid': '#da70d6',
	  'palegoldenrod': '#eee8aa',
	  'palegreen': '#98fb98',
	  'paleturquoise': '#afeeee',
	  'palevioletred': '#db7093',
	  'papayawhip': '#ffefd5',
	  'peachpuff': '#ffdab9',
	  'peru': 'peru',
	  'pink': 'pink',
	  'plum': 'plum',
	  '#cd853f': 'peru',
	  '#ffc0cb': 'pink',
	  '#dda0dd': 'plum',
	  'powderblue': '#b0e0e6',
	  'rebeccapurple': '#639',
	  'rosybrown': '#bc8f8f',
	  'royalblue': '#4169e1',
	  'saddlebrown': '#8b4513',
	  'salmon': 'salmon',
	  '#fa8072': 'salmon',
	  'sandybrown': '#f4a460',
	  'seagreen': '#2e8b57',
	  'seashell': '#fff5ee',
	  'sienna': 'sienna',
	  '#a0522d': 'sienna',
	  'skyblue': '#87ceeb',
	  'slateblue': '#6a5acd',
	  'slategray': '#708090',
	  'slategrey': '#708090',
	  'snow': 'snow',
	  '#fffafa': 'snow',
	  'springgreen': '#00ff7f',
	  'steelblue': '#4682b4',
	  'tan': 'tan',
	  '#d2b48c': 'tan',
	  'thistle': '#d8bfd8',
	  'tomato': 'tomato',
	  '#ff6347': 'tomato',
	  'turquoise': '#40e0d0',
	  'violet': 'violet',
	  '#ee82ee': 'violet',
	  'wheat': 'wheat',
	  '#f5deb3': 'wheat',
	  'whitesmoke': '#f5f5f5',
	  'yellowgreen': '#9acd32'
	};

	var rgbRes = null, hslRes = null;
	var cnum = 0, cr = 0, cg = 0, cb = 0, ch = 0, cs = 0, cl = 0;
	var has_changed = false, colorPos = 0, key = null;
	var colorex = null;
	var hexMatch = null;
	var valueInBefore = null;

	function processColor(valueIn, selectorsIn = '') {
		
		if (valueIn !== undefined) {

			has_changed = false;
			colorPos = 0;

			//named
			if (OPTIONS.shorten_hexcolor_extended_names || OPTIONS.shorten) {
				
				for (key in extended_colors) {

			    if (!extended_colors.hasOwnProperty(key)) continue;
			    
			    colorPos = valueIn.toLowerCase().indexOf(key, colorPos);

			    while (colorPos != -1) {

			    	colorex = new RegExp(key + "(?![\"\'.a-zA-Z0-9_-])", "g"); //global for multiple colors e.g. gradient
			    	
			    	valueInBefore = valueIn;
			    	valueIn = valueIn.replace(colorex, function(capture){
			    		capture = capture.trim();
			    		return '' +
			    			(capture.substring(0,1) == '(' ? '(' : '') +
			    			((OPTIONS.shorten_hexcolor_UPPERCASE) ? extended_colors[key].toUpperCase() : extended_colors[key]) +
			    			(capture.substring(capture.length-1,capture.length) == ',' ? ',' : '') +
			    			(capture.substring(capture.length-1,capture.length) == ')' ? ')' : '')
			    		;
			    	});
			    	valueIn = valueIn.trim();
			    	
			    	colorPos = valueIn.toLowerCase().indexOf(colorex, colorPos);

			    	if (valueInBefore != valueIn) {
			    		has_changed = true;

				    	summary.stats.summary.noNamedColorsShortened += 1;
							if (OPTIONS.verbose) { console.log(success('Process - Values - Named Color : ' + (selectorsIn ? selectorsIn.join(', ') : ''))); }
			    	}
			    }

			    colorPos = 0;

				}
			}

			for (key in colors) {

		    if (!colors.hasOwnProperty(key)) continue;
		    						    
		    colorPos = valueIn.toLowerCase().indexOf(key, colorPos);

		    while (colorPos != -1) {

		    	colorex = new RegExp(key + "(?![\"\'.a-zA-Z0-9_-])", "g"); //global for multiple colors e.g. gradient

		    	valueInBefore = valueIn;
		    	valueIn = valueIn.replace(colorex, function(capture){
			    		capture = capture.trim();

		    		return '' +
			    		(capture.substring(0,1) == '(' ? '(' : '') +
			    		((OPTIONS.shorten_hexcolor_UPPERCASE) ? colors[key].toUpperCase() : colors[key] ) +
			    		(capture.substring(capture.length-1,capture.length) == ',' ? ',' : '') +
			    		(capture.substring(capture.length-1,capture.length) == ')' ? ')' : '')
		    		;
		    	});
		    	valueIn = valueIn.trim();

		    	colorPos = valueIn.toLowerCase().indexOf(colorex, colorPos);

		    	if (valueInBefore != valueIn) {

			    	has_changed = true;

			    	summary.stats.summary.noNamedColorsShortened += 1;

			    	if (OPTIONS.verbose) { console.log(success('Process - Values - Named Color : ' + (selectorsIn ? selectorsIn.join(', ') : ''))); }
		    	}
		    }
				
				colorPos = 0;
			}

			if (!has_changed) {
				
				//rgb to hex
				if (rgbRes=/(rgb)[(]\s*([\d.]+\s*%?)\s*,\s*([\d.]+\s*%?)\s*,\s*([\d.]+\s*%?)\s*(?:,\s*([\d.]+)\s*)?[)]/g.exec(valueIn)) {
					
					cr = componentFromStr(rgbRes[2], 255);
					cg = componentFromStr(rgbRes[3], 255);
					cb = componentFromStr(rgbRes[4], 255);
		      
					valueIn = "#" + ((1 << 24) + (cr << 16) + (cg << 8) + cb).toString(16).slice(1);
		    	summary.stats.summary.noRGBColorsShortened += 1;

					if (OPTIONS.shorten_hexcolor_UPPERCASE) {
						valueIn = valueIn.toUpperCase();
					}
		    	if (OPTIONS.verbose) { console.log(success('Process - Values - RGB Color : ' + (selectorsIn ? selectorsIn.join(', ') : ''))); }
				}

				//hsl to hex
				if (hslRes=/(hsl)[(]\s*([\d.]+\s*%?)\s*,\s*([\d.]+\s*%?)\s*,\s*([\d.]+\s*%?)\s*(?:,\s*([\d.]+)\s*)?[)]$/.exec(valueIn)) {
					
					ch = componentFromStr(hslRes[2], 360);
					cs = componentFromStr(hslRes[3], 100);
					cl = componentFromStr(hslRes[4], 100);
		      rgbRes = hslToRgb(ch/360,cs/100,cl/100);
					cr = rgbRes[0];
					cg = rgbRes[1];
					cb = rgbRes[2];
					valueIn = "#" + ((1 << 24) + (cr << 16) + (cg << 8) + cb).toString(16).slice(1);

		    	summary.stats.summary.noHSLColorsShortened += 1;

					if (OPTIONS.shorten_hexcolor_UPPERCASE) {
						valueIn = valueIn.toUpperCase();
					}
		    	if (OPTIONS.verbose) { console.log(success('Process - Values - HSL Color : ' + (selectorsIn ? selectorsIn.join(', ') : ''))); }
				}

				//hex
				if (hexMatch = /#(.)\1\1\1\1\1/.exec(valueIn)) { //#aaaaaa
					valueIn = valueIn.replace(hexMatch[0], hexMatch[0].substr(0,4)); //#aaa
		    	summary.stats.summary.noHexColorsShortened += 1;
					if (OPTIONS.shorten_hexcolor_UPPERCASE) {
						valueIn = valueIn.toUpperCase();
					}
		    	if (OPTIONS.verbose) { console.log(success('Process - Values - Hex Color : ' + (selectorsIn ? selectorsIn.join(', ') : ''))); }
				}

				//hex pairs
				if ( hexMatch = /(#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2}))/.exec(valueIn) ) {
					if (
						hexMatch[2][0] == hexMatch[2][1]
						&& hexMatch[3][0] == hexMatch[3][1]
						&& hexMatch[4][0] == hexMatch[4][1]
					) {
						valueIn = valueIn.replace(hexMatch[0], '#' + hexMatch[2][0] + hexMatch[3][0] + hexMatch[4][0]); //#aaa
			    	summary.stats.summary.noHexColorsShortened += 1;

						if (OPTIONS.shorten_hexcolor_UPPERCASE) {
							valueIn = valueIn.toUpperCase();
						}
			    	if (OPTIONS.verbose) { console.log(success('Process - Values - Hex Color : ' + (selectorsIn ? selectorsIn.join(', ') : ''))); }	
					}
				}
			}
		}

		return valueIn;
	}


	function componentFromStr(numStr, max) {

		cnum = 0;
		if (/%$/g.test(numStr)) { //is percentage
			cnum = Math.floor(max * (parseFloat(numStr) / 100.0));
		} else {
			cnum = parseInt(numStr);
		}
		return cnum;
	}

	/**
	 * Converts an HSL color value to RGB. Conversion formula
	 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
	 * Assumes h, s, and l are contained in the set [0, 1] and
	 * returns r, g, and b in the set [0, 255].
	 *
	 * @param   {number}  h       The hue
	 * @param   {number}  s       The saturation
	 * @param   {number}  l       The lightness
	 * @return  {Array}           The RGB representation
	 */
	function hslToRgb(h, s, l){
	    var r, g, b;

	    if(s == 0){
	        r = g = b = l; // achromatic
	    }else{
	        var hue2rgb = function hue2rgb(p, q, t){
	            if(t < 0) t += 1;
	            if(t > 1) t -= 1;
	            if(t < 1/6.0) return p + (q - p) * 6 * t;
	            if(t < 1/2.0) return q;
	            if(t < 2/3.0) return p + (q - p) * (2/3.0 - t) * 6;
	            return p;
	        }

	        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	        var p = 2 * l - q;
	        r = hue2rgb(p, q, h + 1/3.0);
	        g = hue2rgb(p, q, h);
	        b = hue2rgb(p, q, h - 1/3.0);
	    }
	    return [
		    Math.min(Math.floor(r*256),255), 
		    Math.min(Math.floor(g*256),255), 
		    Math.min(Math.floor(b*256),255)
	    ];
	}

	// function 

	function getValueOfFontProp(valueIn, prop, position) {
		if (valueIn !== '') {
			try {
				var value = parseCssFont(valueIn)[prop];
				value = (value == 'normal') ? '' : value;
				return value;
			} catch(err) {
				if (
					err.message.indexOf('Missing required font-size.') != -1
					// && prop != 'size'
				) {

					return 'check size';
				} else if (
					err.message.indexOf('Missing required font-family.') != -1
					// && prop != 'family'
				) {

					return 'check family';
				} else {
					console.log(error('Error Parsing Font Declaration'));
					console.log(error2('Source: ' + position.source))
					console.log(error2('Line: ' + position.start.line + ', column: ' + position.start.column))
					console.log(err)
					process.exit(1);
				}
				
			}
		}

		return '';
	}

	function getValueOfTriProp(valueIn, prop) {
		// console.log(valueIn, prop)
		switch(prop) {
			case 'type':
				var value = valueIn.match(/\bnone\b|\bcircle\b|\bdisc\b|\bsquare\b|\barmenian\b|\bcjk-ideographic\b|\bdecimal\b|\bdecimal-leading-zero\b|\bgeorgian\b|\bhebrew\b|\bhiragana\b|\bhiragana-iroha\b|\bkatakana\b|\bkatakana-iroha\b|\blower-alpha\b|\blower-greek\b|\blower-latin\b|\blower-roman\b|\bupper-alpha\b|\bupper-greek\b|\bupper-latin\b|\bupper-roman\b/g);
				if (value !== null) {
					return value[0];
				} else {
					return '';
				}
				break;
			case 'position':
				var value = valueIn.match(/\binside\b|\boutside\b/g);
				if (value !== null) {
					return value[0];
				} else {
					return '';
				}
				break;
			case 'image':
				var value = valueIn.match(/(url\()(.*)(\))|\bnone\b/g);
				if (value !== null) {
					return value[0];
				} else {
					return '';
				}
				break;
			case 'style':
				var value = valueIn.match(/\bnone\b|\bhidden\b|\bdotted\b|\bdashed\b|\bsolid\b|\bdouble\b|\bgroove\b|\bridge\b|\binset\b|\boutset\b/g);
				if (value !== null) {
					return value[0];
				} else {
					return '';
				}
				break;
			case 'color':
				
				//check for hex, rgb, hsl
				var value = valueIn.match(/\btransparent\b|(#(?:[0-9a-f]{2}){2,4}|(#[0-9a-f]{3})|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))/i);
				if (value !== null) {
					return value[0];
				}

				//check extended colors
				for (o in extended_colors) {
					colorex = new RegExp( "(^|[^\"\'.a-z0-9_-])" + o + "([^\"\'.a-z0-9_-]|$)");
					if (valueIn.match(colorex) !== null) {
						return o;
					}
				}

				//check normal colors
				for (o in colors) {
					colorex = new RegExp( "(^|[^\"\'.a-z0-9_-])" + o + "([^\"\'.a-z0-9_-]|$)");
					if (valueIn.match(colorex) !== null) {
						return o;
					}
				}

				return '';
				break;
			case 'width':

				var value = valueIn.match(/\bmedium\b|\bthin\b|\bthick\b|\b0\b|(([0-9][.]?)+(pt|pc|px|in|cm|mm|q|cap|em|ex|rem|ic|lh|rlh|vh|vw|vi|vb|vmin|vmax))/g);

				if (value !== null) {
					return value[0];
				} else {
					return '';
				}
				break;
			default:
				return '';
				break;
		}
	}

	function getValueOfSquareProp(valueIn, side) {
		var value = valueIn.split(' ');
		switch(value.length) {
			case 1: return value[0];
				break;
			case 2: 
				switch(side) {
					case 'top':
					case 'topleft':
					case 'bottom':
					case 'bottomright':
						return value[0];
						break;
					case 'right':
					case 'topright':
					case 'left':
					case 'bottomleft':
						return value[1];
						break;
				}
				break;
			case 3:
				switch(side) {
					case 'top':
					case 'topleft':
						return value[0];
						break;
					case 'right':
					case 'topright':
					case 'left':
					case 'bottomleft':
						return value[1];
						break;
					case 'bottom':
					case 'bottomright':
						return value[2];
						break;
				}
				break;
			case 4:
				switch(side) {
					case 'top':
					case 'topleft':
						return value[0];
						break;
					case 'right':
					case 'topright':
						return value[1];
						break;
					case 'bottom':
					case 'bottomright':
						return value[2];
						break;
					case 'left':
					case 'bottomleft':
						return value[3];
						break;
				}
				break;
		}

		return '';
	}

	function getBackgroundProp(backgroundStrIn, prop) {
		// console.log(backgroundStrIn, prop);
		switch(prop) {
			case 'image':
				var value = backgroundStrIn.match(/(url\()(.*)(\))|\bnone\b/g);
				if (value !== null) {
					return value[0];
				} else {
					return '';
				}
				break;
			case 'repeat':
				var value = backgroundStrIn.match(/\brepeat-x\b|\brepeat-y\b|(\brepeat|\bspace\b|\bround\b|\bno-repeat\b){1,2}/g);
				if (value !== null) {
					return value[0];
				} else {
					return '';
				}
				break;
			case 'attachment':
				var value = backgroundStrIn.match(/\bscroll\b|\bfixed\b|\blocal\b/g);
				if (value !== null) {
					return value[0];
				} else {
					return '';
				}
				break;
			case 'position':
				if (backgroundStrIn.indexOf('#') == -1) {
					var value = backgroundStrIn.match(/(\bleft\b|\bcenter\b|\bright\b|\btop\b|\bbottom\b|\b0\b|((([0-9][.]?)+(pt|pc|px|in|cm|mm|q|cap|em|ex|rem|ic|lh|rlh|vh|vw|vi|vb|vmin|vmax))|(([0-9][.]?)+%)))|((\bleft\b|\bcenter\b|\bright\b|\b0\b|((([0-9][.]?)+(pt|pc|px|in|cm|mm|q|cap|em|ex|rem|ic|lh|rlh|vh|vw|vi|vb|vmin|vmax))|(([0-9][.]?)+%))) (\btop\b|\bcenter\b|\bbottom\b|\b0\b|((([0-9][.]?)+(pt|pc|px|in|cm|mm|q|cap|em|ex|rem|ic|lh|rlh|vh|vw|vi|vb|vmin|vmax))|(([0-9][.]?)+%))))|(\bcenter\b|(\bleft\b|\bright\b \b0\b|((([0-9][.]?)+(pt|pc|px|in|cm|mm|q|cap|em|ex|rem|ic|lh|rlh|vh|vw|vi|vb|vmin|vmax))|(([0-9][.]?)+%))))(\bcenter\b|(\btop\b|\bbottom\b \b0\b|((([0-9][.]?)+(pt|pc|px|in|cm|mm|q|cap|em|ex|rem|ic|lh|rlh|vh|vw|vi|vb|vmin|vmax))|(([0-9][.]?)+%))))/g);
				} else {
					var value = null;
				}
				var value2 = '';
				if (value !== null) {
					for (o in value) {
						if (value[o] == '0') {
							value2 += value[o] + ' ';
						}
					}
					if (value2 != '') {
						return value2.trim();
					} 
					return value[0];
				} else {
					return '';
				}
				break;
			case 'color':
			
				//check for hex, rgb, hsl
				var value = backgroundStrIn.match(/\btransparent\b|(#(?:[0-9a-f]{2}){2,4}|(#[0-9a-f]{3})|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))/i);
				if (value !== null) {
					return value[0];
				}

				//check extended colors
				for (o in extended_colors) {
					colorex = new RegExp( "(^|[^\"\'.a-z0-9_-])" + o + "([^\"\'.a-z0-9_-]|$)");
					if (backgroundStrIn.match(colorex) !== null) {
						return o;
					}
				}

				//check normal colors
				for (o in colors) {
					colorex = new RegExp( "(^|[^\"\'.a-z0-9_-])" + o + "([^\"\'.a-z0-9_-]|$)");
					if (backgroundStrIn.match(colorex) !== null) {
						return o;
					}
				}

				return '';
				break;

			default:
				return '';	
				break;
		}
	}

	function replaceAt(str,index,chr) {
	    if(index > str.length-1) return str;
	    return str.substr(0,index) + chr + str.substr(index+2);
	}

	function moveArrayEl(array, from, to) {
	    array.splice(to, 0, array.splice(from, 1)[0]);
	}

	function getFilesizeInKiloBytes(filename) {
		var stats = fs.statSync(filename);
		var fileSizeInBytes = stats["size"];
		return (fileSizeInBytes ? fileSizeInBytes : 0) / 1000;
	}

	//UTF8 assumed
	function kiloByteLength(str) {
	  // returns the byte length of an utf8 string
	  var s = str.length;
	  for (var i=str.length-1; i>=0; i--) {
	    var code = str.charCodeAt(i);
	    if (code > 0x7f && code <= 0x7ff) s++;
	    else if (code > 0x7ff && code <= 0xffff) s+=2;
	    if (code >= 0xDC00 && code <= 0xDFFF) i--; //trail surrogate
	  }
	  return (s ? s : 0) / 1000;
	}

	RegExp.escape= function(s) {
	    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	};

	function roundTo(n, digits) {
		if (digits === undefined) {
			digits = 0;
		}

		var multiplicator = Math.pow(10, digits);
		n = parseFloat((n * multiplicator).toFixed(11));
		var test =(Math.round(n) / multiplicator);
		return +(test.toFixed(digits));
	}

	function trimCSS(outputCSSIn) {

		//imports - move imports to top of page
		var imports = '';
		outputCSSIn = outputCSSIn.replace(/@import.*(([\n\r\t]*)(\s*)\/\*(_cssp_sc).\*\/)?([\n\r\t])+/gm, function (match, capture) { 
				imports += match.substr(0, match.length-1) + "";
		    return '';
		});
		outputCSSIn = imports + outputCSSIn;

		//charset - move charset to top of page
		charset = '';
		outputCSSIn = outputCSSIn.replace(/@charset.*(([\n\r\t]*)(\s*)\/\*(_cssp_sc).\*\/)?([\n\r\t])+/gm, function (match, capture) { 
				charset += match + "";
		    return '';
		});
		outputCSSIn = charset + outputCSSIn;

		if (OPTIONS.trim_breaklines || OPTIONS.trim) {
			outputCSSIn = outputCSSIn.replace(/\r?\n|\r/g,'');
		}
		if (OPTIONS.trim_whitespace || OPTIONS.trim) {

			if (OPTIONS.trim_comments || OPTIONS.trim) {
		    // remove any left over comments and tabs
				outputCSSIn = outputCSSIn.replace( /\/\*(?:(?!\*\/)[\s\S])*\*\/|[\t]+/g, '' );
			}
			// remove single adjacent spaces
	    outputCSSIn = outputCSSIn.replace( / {2,}/g, ' ' );
	    outputCSSIn = outputCSSIn.replace( / ([{:}]) /g, '$1' );
	    outputCSSIn = outputCSSIn.replace( /([{:}]) /g, '$1' );
	    outputCSSIn = outputCSSIn.replace( /([;,]) /g, '$1' );
	    outputCSSIn = outputCSSIn.replace( / !/g, '!' );
		}


		if (OPTIONS.trim_last_semicolon || OPTIONS.trim) { 
			outputCSSIn = outputCSSIn.replace(/{([^}]*)}/gm, function (match, capture) {
				
				summary.stats.summary.noLastSemiColonsTrimmed += 1;
					// console.log(capture)
					// return "{" + capture + "}";
			  return "{" + capture.replace(/\;(?=[^;]*$)/, '') + "}";
			});
		}

		return outputCSSIn;
	}

	function restoreHacks(outputCSSIn) {

		//tokens
		////hacks
		///**/
		outputCSSIn = outputCSSIn.replace(/(_1token_hck)/g, '/**/');
		///*\**/
		outputCSSIn = outputCSSIn.replace(/(_2token_hck)/g, '/*\\**/');
		//(specialchar)property
		outputCSSIn = outputCSSIn.replace(/(_3token_hck_([0-9]*): ;)/g, function(match){
			tmpVal = token3_chars[match.substring(12, match.length-3)-1];
			return tmpVal.substring(0, tmpVal.length) + ';';
		});
		//(;
		outputCSSIn = outputCSSIn.replace(/(_4token_hck_)[0-9]*[:][\s]*[;]/g, function(match){
			tmpVal = token4_vals[match.substring(12,match.length-3)-1];
			return tmpVal.substring(0, tmpVal.length-2);
		});
		//[;
		outputCSSIn = outputCSSIn.replace(/(_5token_hck_)[0-9]*[:][\s]*[;]/g, function(match){
			tmpVal = token5_vals[match.substring(12,match.length-3)-1];
			return tmpVal.substring(0, tmpVal.length-2);
		});
		////end of hacks

		
		//tokens - replace side comments
		for (key in tokens_comments) {
			tokenex = new RegExp("([\\n\\r\\t]*)(\\s*)\\/\\*(" + key + ")\\*\\/", "gm");
			outputCSSIn = outputCSSIn.replace(tokenex, tokens_comments[key]);
		}
		//tokens - end of replace side comments

		return outputCSSIn;
	}


	function processHTMLSelectors(cssSelectors, htmlDataIn = null, htmlOptionsIn = null) {

		if (OPTIONS.verbose) { console.log(info('Process - HTML - Determine Rules to Remove')); }

		var htmlData = dataHTMLIn.join("");
		if (htmlDataIn !== null && htmlDataIn !== undefined) {
			htmlData = htmlDataIn;
		}
		if (htmlOptionsIn !== null && htmlOptionsIn !== undefined) {

			for (key in htmlOptionsIn) {

				OPTIONS.html[key] = htmlOptionsIn[key];
			}
		}


		//find values in ids
		results = [];
		results1 = htmlData.match(/\bid\b[=](["'])(?:(?=(\\?))\2.)*?\1/gm);
		if (results1 !== null) {
			for (i = 0, ilen = results1.length; i < ilen; ++i) {

				if (results1[i] !== null) {
					results1[i] = results1[i].split('=')[1].replace(/['"]+/g, '');
				}
			}
			results1 = Array.from(new Set(results1));
			results = results.concat(results1);
		}

		//find values in classes
		results2 = htmlData.match(/\bclass\b[=](["'])(?:(?=(\\?))\2.)*?\1/gm);
		if (results2 !== null) {
			for (i = 0, ilen = results2.length; i < ilen; ++i) {

				if (results2[i] !== null) {
					results2[i] = results2[i].split('=')[1].replace(/['"]+/g, '');
				}
			}
			results2 = Array.from(new Set(results2));
			results = results.concat(results2);
		}


		//find values in internal selectors
		results3 = htmlData.match(/<style([\S\s]*?)>([\S\s]*?)<\/style>/gi);
		if (results3 !== null) {
			results4 = [];
			for (i = 0, ilen = results3.length; i < ilen; ++i) {

				if (results3[i] !== null) {
					results3[i] = results3[i].split('</')[0].split('>')[1];
					results4 = results4.concat(results3[i].match(/([#}.])([^0-9])([\S\s]*?){/g));
				}
			}
			results3 = [];
			for (i = 0, ilen = results4.length; i < ilen; ++i) {
				if (results4[i] !== null) {
					results4[i] = results4[i].replace(/\r?\n|\r|\s/g, '');
					results4[i] = results4[i].replace('{', '');
					results4[i] = results4[i].replace('}', '');
					results3 = results3.concat(results4[i].split(','));
				}
			}
			results3 = Array.from(new Set(results3));
			results = results.concat(results3);
		}


		//find values in the dom
		jsDom = new JSDOM(htmlData, {contentType: "text/html"});
		jsDomWindow = jsDom.window;
		jsDomDoc = jsDomWindow.document;

		for (i = 0, resultsCount = cssSelectors.length; i < resultsCount; ++i) {

			for (j = 0, jlen = results.length; j < jlen; ++j) {
				
				if (cssSelectors[i] == results[j]) {

					cssSelectors.splice(i, 1);
					resultsCount -= 1;
					i -= 1;
					break;
				}
			}

			if (jsDomDoc.querySelector(cssSelectors[i]) != null) {
				cssSelectors.splice(i, 1);
				resultsCount -= 1;
				i -= 1;
			}
		}

		return cssSelectors;
	} //end of processHTMLSelectors


	function processHTML(cssSelectors = [], htmlDataIn = null, htmlOptionsIn = null) {

		//read html files
		if (OPTIONS.html !== '' && OPTIONS.html !== undefined && OPTIONS.special_reduce_with_html) {

			var htmlFiles = OPTIONS.html;
			tmpHTMLPaths = [];

			//check for file or files
			switch (typeof htmlFiles) {
				case 'object':
				case 'array':
						
					for (i = 0; i < htmlFiles.length; ++i) {

						getFilePaths(htmlFiles[i], ['.html','.htm']);
					}

					if (tmpHTMLPaths.length) {
						htmlFiles = tmpHTMLPaths;
					}
					break;
				case 'string':
					//formats
					htmlFiles = htmlFiles.replace(/ /g, '');

					// comma delimited list - filename1.html, filename2.html
					if (htmlFiles.indexOf(',') > -1) { 
			
						htmlFiles = htmlFiles.replace(/^\s+|\s+$/g,'').split(',');
						tmpStr = '';
						for (i = 0; i < htmlFiles.length; ++i) {

							getFilePaths(htmlFiles[i], ['.html','.htm']);

						} //end of for

						if (tmpHTMLPaths.length) {
							htmlFiles = tmpHTMLPaths;
						}

					} else {

						//string path
						getFilePaths(htmlFiles, ['.html','.htm']);

						if (tmpHTMLPaths.length) {
							htmlFiles = tmpHTMLPaths;
						}

					}

					break;
			} //end of switch

			htmlFileLocation = (htmlFiles)?htmlFiles.toString():htmlFiles;

			readHTMLFile(htmlFiles);
			CPEVENTS.on('HTML_READ_AGAIN', function(){
				//process selectors
				processHTMLSelectors(cssSelectors, htmlDataIn, htmlOptionsIn);

				//read next file
				dataHTMLIn = [];
				readHTMLFile(htmlFiles);
			});
			CPEVENTS.on('HTML_READ_END', function(){
				//process selectors
				processHTMLSelectors(cssSelectors, htmlDataIn, htmlOptionsIn);

				dataHTMLIn = [];
				CPEVENTS.emit('HTML_RESULTS_END', cssSelectors);

			});


		} //end of html files check








	}

	function readHTMLFile(files = []) {

		if (OPTIONS.verbose) { console.log(info('Input - HTML File : ' + files[readHTMLFileCount])); }

		if (validUrl.isUri(files[readHTMLFileCount])) {
			request({
				url: files[readHTMLFileCount],
				method: "GET"
			}, function(err, headRes, body) {

				if (headRes !== undefined) {
					var size = headRes.headers['content-length'];

					if (size == undefined || size == 0) {
						filesizeKBHTML = kiloByteLength(body);
					} else {
						filesizeKBHTML = size/1000;	
					}
					
				} else {
					var size = kiloByteLength(body);
					filesizeKBHTML = size/1000;
				}

				stats.files.html.push({
					"filename" : files[readHTMLFileCount],
					"filesizeKB" : filesizeKBHTML
				});

			});
		} else {
			filesizeKBHTML = getFilesizeInKiloBytes(files[readHTMLFileCount]);	
			stats.files.html.push({
				"filename" : files[readHTMLFileCount],
				"filesizeKB" : filesizeKBHTML
			});

		}
		

		summary.files.input_html.push(files[readHTMLFileCount]);

		if (validUrl.isUri(files[readHTMLFileCount])) {
			
		  request(files[readHTMLFileCount], function (err, response, body) {

		  	if (response === undefined) {
		  		//try again
		  		request(files[readHTMLFileCount], function (err, response, body) {

						if (response.statusCode == 200) {
				    	dataHTMLIn.push(body);

				    	readHTMLFileCount += 1;

							if (readHTMLFileCount < files.length) {

								CPEVENTS.emit('HTML_READ_AGAIN');	
							} else {

								CPEVENTS.emit('HTML_READ_END');
							}

				    } else {
							CPEVENTS.emit('HTML_READ_ERROR');
							console.log(error("HTML File read error: check your HTML files and please try again."));
							console.log(err)
							process.exit(1);
				    }

		  		});
		  	} else if (response.statusCode == 200) {
		    	dataHTMLIn.push(body);

		    	readHTMLFileCount += 1;

					if (readHTMLFileCount < files.length) {

						CPEVENTS.emit('HTML_READ_AGAIN');	
					} else {

						CPEVENTS.emit('HTML_READ_END');
					}

		    } else {
					CPEVENTS.emit('HTML_READ_ERROR');
					console.log(error("HTML File read error: check your HTML files and please try again."));
					console.log(err)
					process.exit(1);
		    }
			});

		} else {
			readHTMLStream = fs.createReadStream(files[readHTMLFileCount], 'utf8');	

			readHTMLStream.on('data', function(chunk) {  

				dataHTMLIn.push(chunk);

			}).on('end', function() {

				readHTMLFileCount += 1;
				if (readHTMLFileCount < files.length) {

					CPEVENTS.emit('HTML_READ_AGAIN');	
				} else {

					CPEVENTS.emit('HTML_READ_END');
				}
				
			}).on('error', function(e) {
				CPEVENTS.emit('HTML_READ_ERROR');
				console.log(error("HTML File read error: Something went wrong while reading the file(s), check your HTML files and please try again."));
				console.log(e);
				process.exit(1);
			});
		}

		
	} //end of readHTMLFile


	function readReduceDeclarations(jsonConfigIn = '') {
		if (jsonConfigIn) {
			jsonConfig = jsonConfigIn;
			reduceRulesListName = jsonConfig.declaration_names;
			reduceRulesListSelector = jsonConfig.selectors;

			switch (typeof reduceRulesListSelector) {
				case 'string':
					if (reduceRulesListSelector.length) {
						reduceRulesListSelector = reduceRulesListSelector.replace(/^\s+|\s+$/g,'');
						reduceRulesListSelector = reduceRulesListSelector.replace(/\r?\n|\r/g,'');
						reduceRulesListSelector = reduceRulesListSelector.split(',');
						reduceRulesListSelectorCount = reduceRulesListSelector.length;
					} else {
						reduceRulesListSelector = null;
					}
					break;
				case 'object': 
					// reduceRulesListSelectorPName
					var tmp = [];
					for (var i in reduceRulesListSelector) {
						tmp.push(i);
						reduceRulesListSelectorPName[i] = reduceRulesListSelector[i].replace(/^\s+|\s+$/g,'').replace(/\r?\n|\r/g,'').split(',');
					}
					reduceRulesListSelector = tmp;
					reduceRulesListSelectorCount = reduceRulesListSelector.length;
					break;
			}
			
			//by name
			if (reduceRulesListName.length) {
					
				if (typeof reduceRulesListName == 'string') {
					
					reduceRulesListName = reduceRulesListName.replace(/^\s+|\s+$/g,'');
					reduceRulesListName = reduceRulesListName.split(',');
					reduceRulesListNameCount = reduceRulesListName.length;
				} else if (typeof reduceRulesListName == 'object' || typeof reduceRulesListName == 'array') {
					
					reduceRulesListName = reduceRulesListName.filter(function(entry) { return entry.trim() !== ''; });
					reduceRulesListNameCount = reduceRulesListName.length;
				}
			} else {
				reduceRulesListName = null;
			}

			hasReadReduceDeclarations = true;
			CPEVENTS.emit('CONFIG_READ_REDUCE_PROPS_END', OPTIONS);

		} else {

			var jsonConfig = '';
			readStream = fs.createReadStream(CONFIG_REDUCE_DECLARATIONS, 'utf8');	
			readStream.on('data', function(chunk) {  
				jsonConfig += chunk;
			}).on('end', function() {

				jsonConfig = JSON.parse(jsonConfig);

				reduceRulesListName = jsonConfig.declaration_names;
				reduceRulesListSelector = jsonConfig.selectors;

				switch (typeof reduceRulesListSelector) {
					case 'string':
						if (reduceRulesListSelector.length) {
							reduceRulesListSelector = reduceRulesListSelector.replace(/^\s+|\s+$/g,'');
							reduceRulesListSelector = reduceRulesListSelector.replace(/\r?\n|\r/g,'');
							reduceRulesListSelector = reduceRulesListSelector.split(',');
							reduceRulesListSelectorCount = reduceRulesListSelector.length;
						} else {
							reduceRulesListSelector = null;
						}
						break;
					case 'object': 
						// reduceRulesListSelectorPName
						var tmp = [];
						for (var i in reduceRulesListSelector) {
							tmp.push(i);
							reduceRulesListSelectorPName[i] = reduceRulesListSelector[i].replace(/^\s+|\s+$/g,'').replace(/\r?\n|\r/g,'').split(',');
						}
						reduceRulesListSelector = tmp;
						reduceRulesListSelectorCount = reduceRulesListSelector.length;
						break;
				}
				
				//by name
				if (reduceRulesListName.length) {
						
					if (typeof reduceRulesListName == 'string') {
						
						reduceRulesListName = reduceRulesListName.replace(/^\s+|\s+$/g,'');
						reduceRulesListName = reduceRulesListName.split(',');
						reduceRulesListNameCount = reduceRulesListName.length;
					} else if (typeof reduceRulesListName == 'object' || typeof reduceRulesListName == 'array') {
						
						reduceRulesListName = reduceRulesListName.filter(function(entry) { return entry.trim() !== ''; });
						reduceRulesListNameCount = reduceRulesListName.length;
					}
				} else {
					reduceRulesListName = null;
				}

				hasReadReduceDeclarations = true;
				CPEVENTS.emit('CONFIG_READ_REDUCE_PROPS_END', OPTIONS);


			}).on('error', function(e) {
				CPEVENTS.emit('CONFIG_READ_REDUCE_PROPS_ERROR', OPTIONS);
				console.log(error("Reduce Properties Config File read error: Something went wrong while reading the file, check your config_reduce_declarations.json and please try again."));
				console.log(e);
				process.exit(1);
			});
		}

	} //end of readReduceDeclarations


	function readConfig(configFileLocationIn = '', optionsIn = null) {

		var tmpCONFIG = '';
		if (configFileLocationIn == '') {

			readStream = fs.createReadStream(configFileLocation, 'utf8');
		} else {

			if (configFileLocationIn == 'cmd_default') {

				CONFIG = {};
				CONFIG.options = optionsIn;
				if (CONFIG.options.trim) {
					OPTIONS.trim_removed_rules_previous_comment = CONFIG.options.trim;
					OPTIONS.trim_comments = CONFIG.options.trim;
					OPTIONS.trim_whitespace = CONFIG.options.trim;
					OPTIONS.trim_breaklines = CONFIG.options.trim;
					OPTIONS.trim_last_semicolon = CONFIG.options.trim;
				}
				if (CONFIG.options.shorten) {
					OPTIONS.shorten_zero = CONFIG.options.shorten;
					OPTIONS.shorten_hexcolor = CONFIG.options.shorten;
					OPTIONS.shorten_hexcolor_extended_names = CONFIG.options.shorten;
					OPTIONS.shorten_font = CONFIG.options.shorten;
					OPTIONS.shorten_background = CONFIG.options.shorten;
					OPTIONS.shorten_margin = CONFIG.options.shorten;
					OPTIONS.shorten_padding = CONFIG.options.shorten;
					OPTIONS.shorten_list_style = CONFIG.options.shorten;
					OPTIONS.shorten_outline = CONFIG.options.shorten;
					OPTIONS.shorten_border = CONFIG.options.shorten;
					OPTIONS.shorten_border_top = CONFIG.options.shorten;
					OPTIONS.shorten_border_right = CONFIG.options.shorten;
					OPTIONS.shorten_border_bottom = CONFIG.options.shorten;
					OPTIONS.shorten_border_left = CONFIG.options.shorten;
					OPTIONS.shorten_border_radius = CONFIG.options.shorten;
				}
				if (CONFIG.options.special_reduce_with_html) {
					OPTIONS.special_reduce_with_html = CONFIG.special_reduce_with_html;
				}
				if (CONFIG.options.css_output) {
					OPTIONS.css_output = CONFIG.options.css_output;
				}
				if (CONFIG.options.verbose) {
					OPTIONS.verbose = CONFIG.options.verbose;
				}

				summary.files.output.push(CONFIG.options.css_output);
				REPORT_DUPLICATE_CSS = OPTIONS.report_file_location;
				CONFIG_REDUCE_DECLARATIONS = OPTIONS.reduce_declarations_file_location;
				summary.options_used = OPTIONS;

				CPEVENTS.emit('CONFIG_READ_END', OPTIONS);

				return true;
			} else { //custom
				readStream = fs.createReadStream(configFileLocationIn, 'utf8');	
			}
			
		}

		readStream.on('data', function(chunk) {  
			tmpCONFIG += chunk;
		}).on('end', function() {

			if (tmpCONFIG !== '') {
				try {
					CONFIG = JSON.parse(tmpCONFIG);	
				} catch(err) {
					console.log(error("Config File read error: " + configFileLocation + ", check your syntax, especially commas, then please try again."));
					console.log(err);
					process.exit(1);
				}
				summary.files.output.push(CONFIG.options.css_output);
				REPORT_DUPLICATE_CSS = CONFIG.options.report_file_location;
				CONFIG_REDUCE_DECLARATIONS = CONFIG.options.reduce_declarations_file_location;

				if (CONFIG.options.trim) {
					CONFIG.options.trim_removed_rules_previous_comment = CONFIG.options.trim;
					CONFIG.options.trim_comments = CONFIG.options.trim;
					CONFIG.options.trim_whitespace = CONFIG.options.trim;
					CONFIG.options.trim_breaklines = CONFIG.options.trim;
					CONFIG.options.trim_last_semicolon = CONFIG.options.trim;
				}
				if (CONFIG.options.shorten) {
					CONFIG.options.shorten_zero = CONFIG.options.shorten;
					CONFIG.options.shorten_hexcolor = CONFIG.options.shorten;
					CONFIG.options.shorten_hexcolor_extended_names = CONFIG.options.shorten;
					CONFIG.options.shorten_font = CONFIG.options.shorten;
					CONFIG.options.shorten_background = CONFIG.options.shorten;
					CONFIG.options.shorten_margin = CONFIG.options.shorten;
					CONFIG.options.shorten_padding = CONFIG.options.shorten;
					CONFIG.options.shorten_list_style = CONFIG.options.shorten;
					CONFIG.options.shorten_outline = CONFIG.options.shorten;
					CONFIG.options.shorten_border = CONFIG.options.shorten;
					CONFIG.options.shorten_border_top = CONFIG.options.shorten;
					CONFIG.options.shorten_border_right = CONFIG.options.shorten;
					CONFIG.options.shorten_border_bottom = CONFIG.options.shorten;
					CONFIG.options.shorten_border_left = CONFIG.options.shorten;
					CONFIG.options.shorten_border_radius = CONFIG.options.shorten;
				}
				OPTIONS = CONFIG.options;
				summary.options_used = OPTIONS;
			}

			CPEVENTS.emit('CONFIG_READ_END', OPTIONS);

		}).on('error', function(e) {
			CPEVENTS.emit('CONFIG_READ_ERROR');
			console.log(error("Config File read error: Something went wrong while reading the file, check your " + configFileLocation + " and please try again."));
			console.log(e);
			process.exit(1);

		});

		return readStream;
	}

	/* read css input files */
	function processCSSFiles(optionsIn = null, configFileLocationIn = '') {


		var continueCSSFilesProcess = function(optionsIn2){
			// console.log(optionsIn2)
				// console.log(optionsIn2.css)
			CPEVENTS.removeListener('CONFIG_READ_REDUCE_PROPS_END', continueCSSFilesProcess);

			var continueCSSFilesProcessAfterConfig = function(optionsIn3){

				
				CPEVENTS.removeListener('continueCSSFilesProcessAfterConfig', continueCSSFilesProcessAfterConfig);

				//config
				if (OPTIONS.css === undefined && CONFIG.options.css) {
					OPTIONS.css = CONFIG.options.css;
				}


				//Options
				if (optionsIn !== null && optionsIn !== undefined) {

					for (key in optionsIn) {

						OPTIONS[key] = optionsIn[key];	
						
					}
				}
				// console.log(CONFIG)
				// console.log(optionsIn.css)
				// console.log(optionsIn3)
				//CSS Files
				// var files = CONFIG.options.css;

				// if (optionsIn.css !== null && optionsIn.css !== undefined) {

				// files = optionsIn.css;
					
				// }

				files = OPTIONS.css;

				if (files !== undefined && files !== '') {
					tmpCSSPaths = [];

					//check for file or files
					switch (typeof files) {
						case 'object':
						case 'array':
								
							for (i = 0; i < files.length; ++i) {

								getFilePaths(files[i], ['.css']);
							}

							if (tmpCSSPaths.length) {
								files = tmpCSSPaths;
							}

							break;
						case 'string':
							//formats
							files = files.replace(/ /g, '');
							// comma delimited list - filename1.css, filename2.css
							if (files.indexOf(',') > -1) { 
								files = files.replace(/^\s+|\s+$/g,'').split(',');
								
								for (i = 0; i < files.length; ++i) {

									getFilePaths(files[i], ['.css']);

								}

								if (tmpCSSPaths.length) {
									files = tmpCSSPaths;
								}


							} else {

								//string path
								getFilePaths(files, ['.css']);

								if (tmpCSSPaths.length) {
									files = tmpCSSPaths;
								}

							}

							break;
					} //end of switch

					fileLocation = files.toString();

					CPEVENTS.on('CSS_READ_AGAIN', function(){

						readCSSFile(files);
					});
					CPEVENTS.on('CSS_READ_END', function(){
						// CPEVENTS.emit('CONFIG_READ_REDUCE_PROPS_END');
						processCSS(null,OPTIONS,function(){

						});	
						
					});

					readCSSFile(files);


				} else { //end of files nothing check

					//
				}




			};

			if (currentConfig != configFileLocationIn) { //don't read same config
				CPEVENTS.on('CONFIG_READ_END', continueCSSFilesProcessAfterConfig); //end of config read
			}

			currentConfig = configFileLocationIn;

			if (configFileLocationIn != 'cmd_default') {
				readConfig(configFileLocationIn);	
			} else if (configFileLocationIn == 'cmd_default') {
				readConfig(configFileLocationIn, optionsIn);	
			}
		};

		CPEVENTS.on('CONFIG_READ_REDUCE_PROPS_END', continueCSSFilesProcess); //end of reduce config read
		

		if (!hasReadReduceDeclarations && fs.existsSync(OPTIONS.reduce_declarations_file_location)) {
			
			readReduceDeclarations();
		}

		if (!hasReadReduceDeclarations && !fs.existsSync(OPTIONS.reduce_declarations_file_location)) {

			//default process settings
			var default_reduce_declarations_config = {
				"declaration_names" : [
					"font",
					"margin",
					"padding",
					"list-style",
					"outline",
					"border",
					"border-top",
					"border-right",
					"border-bottom",
					"border-left",
					"border-radius",
					"border-color",
					"border-top-color",
					"border-right-color",
					"border-bottom-color",
					"border-left-color",
					"color",
					"background-color",
					"font-color",
					"outline-color",
					"box-shadow",
					"text-shadow",
					"float",
					"font-family",
					"font-size",
					"font-weight",
					"font-style",
					"font-variant",
					"font-stretch"
				]
			};

			if (optionsIn !== null && (optionsIn['reduceConfig'] === undefined || optionsIn['reduceConfig'] === null)) {

				optionsIn['reduceConfig'] = default_reduce_declarations_config;
				readReduceDeclarations(optionsIn['reduceConfig']);
			} else {

				readReduceDeclarations();
			}
		}

	} //end of processCSSFiles

	function getFilePaths(strPath = '', exts = ['.css']) {

		if (validUrl.isUri(strPath)){

			switch(exts[0]) {
				case '.css':
					tmpCSSPaths.push(strPath);
					break;
				case '.html':
				case '.htm':
					tmpHTMLPaths.push(strPath);
					break;
				case '.js':
					tmpJSPaths.push(strPath);
					break;
			}
		} else {

			try {
				// Query the entry
				fileStats = fs.lstatSync(strPath);

				// directory given
				if (fileStats.isDirectory()) {

					var dir = path.join(path.dirname(fs.realpathSync(__dirname)), strPath);

					//traverse directory for .ext strPath
					try {

						fs.readdirSync(dir).forEach(filenameRead => {

							fileFound = false;

							for (m = 0, count = exts.length; m < count; ++m) {

								if (path.extname(filenameRead) == exts[m]) {
									fileFound = true;
								}
							}

							if (fileFound) {

								switch(exts[0]) {
									case '.css':
										tmpCSSPaths.push(dir + '/' + filenameRead);
										break;
									case '.html':
									case '.htm':
										tmpHTMLPaths.push(dir + '/' + filenameRead);
										break;
									case '.js':
										tmpJSPaths.push(dir + '/' + filenameRead);
										break;
								}

							} else if (path.extname(filenameRead) == '') {

								switch(exts[0]) {
									case '.css':
										getFilePaths(strPath+'/'+filenameRead, ['.css']);
										break;
									case '.html':
									case '.htm':
										getFilePaths(strPath+'/'+filenameRead, ['.html','.htm']);
										break;
									case '.js':
										getFilePaths(strPath+'/'+filenameRead, ['.js']);
										break;
								}

							}
						});



					} catch (e) {
						
						console.log(error("Directory read error: Something went wrong while reading the directory, check your [html] in " + configFileLocation + " and please try again."));
						console.log(e);
						process.exit(1);
					}

				} else if (fileStats.isFile()) { //filepath given

					if (exts.join(",").indexOf(strPath.substr(strPath.lastIndexOf('.') + 1)) != -1) {
						switch(exts[0]) {
							case '.css':
								tmpCSSPaths.push(strPath);
								break;
							case '.html':
							case '.htm':
								tmpHTMLPaths.push(strPath);
								break;
							case '.js':
								tmpJSPaths.push(strPath);
								break;
						}
					}
					
				}
			} catch (e) {
				
				console.log(error("CSS File read error: Something went wrong while reading the file(s), check your [html] in " + configFileLocation + " and please try again."));
				console.log(e);
				process.exit(1);
			}

		} //end of url check
	} //end of getFilePaths

	function readCSSFile(files = []) {

		if (OPTIONS.verbose) { console.log(info('Input - CSS File : ' + files[readCSSFileCount])); }

		if (validUrl.isUri(files[readCSSFileCount])) {
			request({
				url: files[readCSSFileCount],
				method: "GET"
			}, function(err, headRes, body) {
				if (headRes !== undefined) {
					var size = headRes.headers['content-length'];
					
					if (size == undefined || size == 0) {
						filesizeKB = kiloByteLength(body);
					} else {
						filesizeKB = size/1000;	
					}
				} else {
					var size = kiloByteLength(body);
					filesizeKB = size/1000;
				}

				
				stats.files.css.push({
					"filename" : files[readCSSFileCount],
					"filesizeKB" : filesizeKB
				});
				stats.before.totalFileSizeKB += filesizeKB;

			});
		} else {
			filesizeKB = getFilesizeInKiloBytes(files[readCSSFileCount]);

			stats.files.css.push({
				"filename" : files[readCSSFileCount],
				"filesizeKB" : filesizeKB
			});
			stats.before.totalFileSizeKB += filesizeKB;
		}


		summary.files.input.push(files[readCSSFileCount]);


		if (validUrl.isUri(files[readCSSFileCount])) {
			
		  request(files[readCSSFileCount], function (err, response, body) {

		  	if (response === undefined) {

		  		//try again
		  		request(files[readCSSFileCount], function (err, response, body) {

		  			if (response.statusCode == 200) {
				    	dataCSSIn.push(body);

				    	readCSSFileCount += 1;

							if (readCSSFileCount < files.length) {

								CPEVENTS.emit('CSS_READ_AGAIN');	
							} else {

								CPEVENTS.emit('CSS_READ_END');
							}

				    } else {
							CPEVENTS.emit('CSS_READ_ERROR');
							console.log(error("CSS File read error: check your CSS files and please try again."));
							console.log(err)
							process.exit(1);
				    }

		  		});


		  	} else if (response.statusCode == 200) {
		    	dataCSSIn.push(body);

		    	readCSSFileCount += 1;

					if (readCSSFileCount < files.length) {

						CPEVENTS.emit('CSS_READ_AGAIN');	
					} else {

						CPEVENTS.emit('CSS_READ_END');
					}

		    } else {
					CPEVENTS.emit('CSS_READ_ERROR');
					console.log(error("CSS File read error: check your CSS files and please try again."));
					console.log(err)
					process.exit(1);
		    }
			});

		} else {


			readStream = fs.createReadStream(files[readCSSFileCount], 'utf8');

			readStream.on('data', function(chunk) { 
				dataCSSIn.push(chunk);

			}).on('end', function() {
				readCSSFileCount += 1;
				if (readCSSFileCount < files.length) {

					CPEVENTS.emit('CSS_READ_AGAIN');	
				} else {
					CPEVENTS.emit('CSS_READ_END');
				}
				
			}).on('error', function(e) {
				CPEVENTS.emit('CSS_READ_ERROR');
				console.log(error("CSS File read error: Something went wrong while reading the file(s), check your CSS files and please try again."));
				console.log(e);
				process.exit(1);
			});

		} //end of url check
	} //end of readCSSFile

	function processValues(rules) {

		if (OPTIONS.verbose) { console.log(info('Process - Values')); }

		rulesCount = rules.length;

		for (i = 0; i < rulesCount; ++i) {


			if (rules[i] !== undefined && rules[i].declarations !== undefined  && rules[i].type == 'rule') {

				dCount = rules[i].declarations.length;

				//font
				if (OPTIONS.shorten_font || OPTIONS.shorten) {
					font = rules[i].declarations.filter(function( obj ) {
					  return obj.property == 'font-style' 
					  		|| obj.property == 'font-variant'
					  		|| obj.property == 'font-weight'
					  		|| obj.property == 'font-stretch'
					  		|| obj.property == 'font-size'
					  		|| obj.property == 'line-height'
					  		|| obj.property == 'font-family'
					  		|| obj.property == 'font'
					  ;
					});

					//font-weight shortening
					if ((fontIndex = font.map(function(o) { return o.property; }).indexOf('font-weight')) != -1) {
						
						switch(font[fontIndex].value.toLowerCase()) {
							case 'thin': 
							case 'hairline': fontTmp = '100';
								break;
							case 'extra light':
							case 'ultra light': fontTmp = '200';
								break;
							case 'light': fontTmp = '300';
								break;
							case 'normal': fontTmp = '400';
								break;
							case 'medium': fontTmp = '500';
								break;
							case 'semi bold':
							case 'demi bold': fontTmp = '600';
								break;
							case 'bold': fontTmp = '700';
								break;
							case 'extra bold':
							case 'ultra bold': fontTmp = '800';
								break;
							case 'black':
							case 'heavy': fontTmp = '900';
								break;
							default: fontTmp = font[fontIndex].value;
								break;
						}

						font[fontIndex] = {
							'type': font[fontIndex].type,
							'property': font[fontIndex].property,
							'value': fontTmp,
							'position': font[fontIndex].position
						};
					}

					//special - convert rem
					if (OPTIONS.special_convert_rem && OPTIONS.special_convert_rem_font_size) {

						//for singular declaration
						for (j = 0; j < dCount; ++j) {

							if (rules[i].declarations !== undefined && rules[i].declarations[j].property == 'font-size') {

								fontTmpVal = rules[i].declarations[j].value.toLowerCase();

								if (fontTmpVal.indexOf('px') != -1) {
									fontTmpVal = fontTmpVal.substr(0, fontTmpVal.length-2)/OPTIONS.special_convert_rem_desired_html_px + 'rem';
								}

								rules[i].declarations[j] = {
									'type': rules[i].declarations[j].type,
									'property': rules[i].declarations[j].property,
									'value': fontTmpVal,
									'position': rules[i].declarations[j].position
								};
							}
						}

						//for combined declaration
						if ((fontIndex = font.map(function(o) { return o.property; }).indexOf('font-size')) != -1) {
							
							fontTmpVal = font[fontIndex].value.toLowerCase();

							if (fontTmpVal.indexOf('px') != -1) {
								fontTmpVal = fontTmpVal.substr(0, fontTmpVal.length-2)/OPTIONS.special_convert_rem_desired_html_px + 'rem';
							}

							font[fontIndex] = {
								'type': font[fontIndex].type,
								'property': font[fontIndex].property,
								'value': fontTmpVal,
								'position': font[fontIndex].position
							};
						}
					}

					fontProps = font.map(function(o) { return o.property; });

					if (OPTIONS.format_font_family || OPTIONS.format) {

						//make sure multi-worded families have quotes
						if (fontProps.indexOf('font-family') != -1) {

							for (j = 0, jlen = rules[i].declarations.length; j < jlen; ++j) {

								if (rules[i].declarations[j].property == 'font-family') {

									fontVal = rules[i].declarations[j].value.split(',');
									fontTmpVal = '';
									for (k = 0, klen = fontVal.length; k < klen; ++k) {
										
										fontVal[k] = fontVal[k].trim();
										if (
											fontVal[k].indexOf(' ') != -1
											&& (
												fontVal[k].indexOf('"') == -1
											)
										) {
											fontTmpVal += '"' + fontVal[k].trim() + '",';
										} else {
											fontTmpVal += fontVal[k].trim() + ',';
										}
									}
									fontTmpVal = fontTmpVal.substring(0, fontTmpVal.length - 1);

									rules[i].declarations[j] = {
										'type': 'declaration',
										'property': 'font-family',
										'value': fontTmpVal,
										'position': rules[i].declarations[j].position
									};
								}
							}
						}
					}


					//reduce to font
					if (
						fontProps.indexOf('font-size') != -1 
						&& fontProps.indexOf('font-family') != -1
						|| fontProps.indexOf('font') != -1
					) {

						if (OPTIONS.verbose) { console.log(success('Process - Values - Font : ' + (rules[i].selectors ? rules[i].selectors.join(', ') : ''))); }

						fontHasInherit = false;
						fontValues = font.map(function(o) { 
							if (o.value.toLowerCase().indexOf('inherit') != -1) {
								fontHasInherit = true;
							}
							return o.value; 
						});

						if (fontHasInherit == false) {
							fontPositions = font.map(function(o) { return o.position; });
							fontPropsOutput = ['font-style', 'font-variant', 'font-weight', 'font-stretch', 'font-size', 'line-height', 'font-family'];
							fontValuesOutput = [
								(fontValues[fontProps.indexOf('font-style')]?fontValues[fontProps.indexOf('font-style')]:''), 
								(fontValues[fontProps.indexOf('font-variant')]?fontValues[fontProps.indexOf('font-variant')]:''), 
								(fontValues[fontProps.indexOf('font-weight')]?fontValues[fontProps.indexOf('font-weight')]:''), 
								(fontValues[fontProps.indexOf('font-stretch')]?fontValues[fontProps.indexOf('font-stretch')]:''), 
								(fontValues[fontProps.indexOf('font-size')]?fontValues[fontProps.indexOf('font-size')]:''), 
								(fontValues[fontProps.indexOf('line-height')]?fontValues[fontProps.indexOf('line-height')]:''), 
								(fontValues[fontProps.indexOf('font-family')]?fontValues[fontProps.indexOf('font-family')]:''), 
							];

							//existing font check
							fontTmpIdx = fontProps.indexOf('font')
							if (fontTmpIdx != -1) {
								fontTmp = fontValues[fontTmpIdx];

								//fill missing attribute with existing font
								if (fontProps.indexOf('font-size') > fontTmpIdx) {
									fontValuesOutput[4] = fontValues[fontProps.indexOf('font-size')];
								} else {
									
									fontValuesOutput[4] = getValueOfFontProp(fontTmp, 'size', fontPositions[fontProps.indexOf('font')]);
									
									if (fontValuesOutput[4] == 'check family') {
										//check required font-family property exists
										if (
											fontValues[fontProps.indexOf('font-family')] !== '' 
											&& fontValues[fontProps.indexOf('font-family')] !== undefined) {
											fontValuesOutput[4] = fontTmp;
											fontTmp = fontTmp + ' ' + fontValues[fontProps.indexOf('font-family')];
										} else {
											//throw error
											console.log(error('Error Parsing Font Declaration'));
											console.log(error2('Source: ' + fontPositions[fontProps.indexOf('font')].source))
											console.log(error2('Line: ' + fontPositions[fontProps.indexOf('font')].start.line + ', column: ' + fontPositions[fontProps.indexOf('font')].start.column))
											console.log('Required: font-family');
											process.exit(1);
										}
									} else if (fontValuesOutput[4] == 'check size') {
										//check required font-size property exists
										if (
											fontValues[fontProps.indexOf('font-size')] !== ''
											&& fontValues[fontProps.indexOf('font-size')] !== undefined
										) {
											fontValuesOutput[4] = fontTmp;
											fontTmp = fontValues[fontProps.indexOf('font-size')] + ' ' + fontTmp;
										} else {
											if (fontTmp == 'inherit') {
												fontValuesOutput[4] = fontTmp;
											} else {
												//throw error
												console.log(error('Error Parsing Font Declaration'));
												console.log(error2('Source: ' + fontPositions[fontProps.indexOf('font')].source))
												console.log(error2('Line: ' + fontPositions[fontProps.indexOf('font')].start.line + ', column: ' + fontPositions[fontProps.indexOf('font')].start.column))
												console.log('Required: font-size');
												process.exit(1);	
											}
											
										}
										
									}
								}

								if (fontProps.indexOf('font-family') > fontTmpIdx) {
									fontValuesOutput[6] = fontValues[fontProps.indexOf('font-family')];
									
								} else {
									fontValuesOutput[6] = getValueOfFontProp(fontTmp, 'family', fontPositions[fontProps.indexOf('font')]);
									
									if (fontValuesOutput[6] == 'check size') {
										//check required font-size property exists
										if (
											fontValues[fontProps.indexOf('font-size')] !== ''
											&& fontValues[fontProps.indexOf('font-size')] !== undefined
										) {
											fontValuesOutput[6] = fontTmp;
											fontTmp = fontValues[fontProps.indexOf('font-size')] + ' ' + fontTmp;
										} else {

											if (fontTmp == 'inherit') {
												if (fontValuesOutput[4] == 'inherit') {
													fontValuesOutput[6] = '';	
												}
											} else {
												//throw error
												console.log(error('Error Parsing Font Declaration'));
												console.log(error2('Source: ' + fontPositions[fontProps.indexOf('font')].source))
												console.log(error2('Line: ' + fontPositions[fontProps.indexOf('font')].start.line + ', column: ' + fontPositions[fontProps.indexOf('font')].start.column))
												console.log('Required: font-size');
												process.exit(1);
											}
										}
										
									} else if (fontValuesOutput[6] == 'check family') {
										//check required font-family property exists
										if (
											fontValues[fontProps.indexOf('font-family')] !== '' 
											&& fontValues[fontProps.indexOf('font-family')] !== undefined) {
											fontValuesOutput[6] = fontTmp;
											fontTmp = fontTmp + ' ' + fontValues[fontProps.indexOf('font-family')];
										} else {
											//throw error
											console.log(error('Error Parsing Font Declaration'));
											console.log(error2('Source: ' + fontPositions[fontProps.indexOf('font')].source))
											console.log(error2('Line: ' + fontPositions[fontProps.indexOf('font')].start.line + ', column: ' + fontPositions[fontProps.indexOf('font')].start.column))
											console.log('Required: font-family');
											process.exit(1);
										}
									} else {
										//make sure multi-worded families have quotes
										if (OPTIONS.format_font_family || OPTIONS.format) {

											fontVal = fontValuesOutput[6];
											fontTmpVal = '';
											for (k = 0, klen = fontVal.length; k < klen; ++k) {
												
												fontVal[k] = fontVal[k].trim();
												if (
													fontVal[k].indexOf(' ') != -1
													&& (
														fontVal[k].indexOf('"') == -1
													)
												) {
													fontTmpVal += '"' + fontVal[k].trim() + '",';
												} else {
													fontTmpVal += fontVal[k].trim() + ',';
												}
											}
											fontTmpVal = fontTmpVal.substring(0, fontTmpVal.length - 1);
											fontValuesOutput[6] = fontTmpVal;

										} //end of format
									} //end of font-family checks
								} //end of font-family

								if (fontProps.indexOf('font-style') > fontTmpIdx) {
									fontValuesOutput[0] = fontValues[fontProps.indexOf('font-style')];
								} else {
									fontValuesOutput[0] = getValueOfFontProp(fontTmp, 'style', fontPositions[fontProps.indexOf('font')]);
									if (
										fontValuesOutput[0] == 'check size'
										|| fontValuesOutput[0] == 'check family'
									) {
										fontValuesOutput[0] = '';
									}
								}
								if (fontProps.indexOf('font-variant') > fontTmpIdx) {
									fontValuesOutput[1] = fontValues[fontProps.indexOf('font-variant')];
								} else {
									fontValuesOutput[1] = getValueOfFontProp(fontTmp, 'variant', fontPositions[fontProps.indexOf('font')]);

									if (
										fontValuesOutput[1] == 'check size'
										|| fontValuesOutput[1] == 'check family'
									) {
										fontValuesOutput[1] = '';
									}
								}
								if (fontProps.indexOf('font-weight') > fontTmpIdx) {
									fontValuesOutput[2] = fontValues[fontProps.indexOf('font-weight')];
								} else {
									fontValuesOutput[2] = getValueOfFontProp(fontTmp, 'weight', fontPositions[fontProps.indexOf('font')]);
									if (
										fontValuesOutput[2] == 'check size'
										|| fontValuesOutput[2] == 'check family'
									) {
										fontValuesOutput[2] = '';
									}
								}
								if (fontProps.indexOf('font-stretch') > fontTmpIdx) {
									fontValuesOutput[3] = fontValues[fontProps.indexOf('font-stretch')];
								} else {
									fontValuesOutput[3] = getValueOfFontProp(fontTmp, 'stretch', fontPositions[fontProps.indexOf('font')]);
									if (
										fontValuesOutput[3] == 'check size'
										|| fontValuesOutput[3] == 'check family'
									) {
										fontValuesOutput[3] = '';
									}
								}
								if (fontProps.indexOf('line-height') > fontTmpIdx) {
									fontValuesOutput[5] = fontValues[fontProps.indexOf('line-height')];
								} else {
									fontValuesOutput[5] = getValueOfFontProp(fontTmp, 'lineHeight', fontPositions[fontProps.indexOf('font')]);
									if (
										fontValuesOutput[5] == 'check size'
										|| fontValuesOutput[5] == 'check family'
									) {
										fontValuesOutput[5] = '';
									}
								}

							}
							// console.log(fontPropsOutput)
							// console.log(fontValuesOutput)


							if (
								fontValuesOutput[0] == ''
								&& fontValuesOutput[1] == ''
								&& fontValuesOutput[2] == ''
								&& fontValuesOutput[3] == ''
								&& fontValuesOutput[4] == ''
								&& fontValuesOutput[5] == ''
							) {

							} else {

								fontProps = fontPropsOutput;
								fontValues = fontValuesOutput;
							}
							// console.log(fontProps)
							// console.log(fontValues)

							//check for !important
							fontHasImportant = false;
							for (k = 0, klen = fontValues.length; k < klen; ++k) {
									
								fontValues[k] = fontValues[k].toString().replace(/(!important)/g, function(capture){
									fontHasImportant = true;
									return '';
								});
							}

							if (fontHasImportant) {
									fontValues[fontValues.length-1] += ' !important';
							}
							

							//merge line-height with font-size
							if (fontValues[fontProps.indexOf('line-height')] !== '') {
								fontValues[fontProps.indexOf('font-size')] = fontValues[fontProps.indexOf('font-size')] + '/' + fontValues[fontProps.indexOf('line-height')];
								fontValues.splice(fontProps.indexOf('line-height'), 1);
							}

							//remove any spaces from empty values
							fontValues = fontValues.filter(Boolean);

							//add declaration
							fontTmpIdx = rules[i].declarations.length;
							for (j = 0; j < fontTmpIdx; ++j) {
								
								switch(rules[i].declarations[j].property) {
									case 'font-style': 
									case 'font-variant': 
									case 'font-weight': 
									case 'font-stretch': 
									case 'font-size': 
									case 'font-family': 
									case 'line-height': 
									case 'font': 
										fontIndex = j;
										if (fontIndex < fontTmpIdx && fontIndex != -1) { fontTmpIdx = fontIndex; }
										break;
								}
							}

							rules[i].declarations.splice(fontTmpIdx, 0, {
								type: 'declaration',
								property: 'font',
								value: fontValues.join(' ')
							});

							dCount+=1;
				    	summary.stats.summary.noFontsShortened += 1;

				    	//remove existing originals
							fontIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('font-style');
							if (fontIndex != -1) { rules[i].declarations.splice(fontIndex, 1); dCount-=1;	}
							fontIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('font-variant');
							if (fontIndex != -1) { rules[i].declarations.splice(fontIndex, 1); dCount-=1;	}
							fontIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('font-weight');
							if (fontIndex != -1) { rules[i].declarations.splice(fontIndex, 1); dCount-=1;	}
							fontIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('font-stretch');
							if (fontIndex != -1) { rules[i].declarations.splice(fontIndex, 1); dCount-=1;	}
							fontIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('font-size');
							if (fontIndex != -1) { rules[i].declarations.splice(fontIndex, 1); dCount-=1;	}
							fontIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('line-height');
							if (fontIndex != -1) { rules[i].declarations.splice(fontIndex, 1); dCount-=1;	}
							fontIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('font-family');
							if (fontIndex != -1) { rules[i].declarations.splice(fontIndex, 1); dCount-=1;	}

							//remove existing fonts
							font = rules[i].declarations.filter(function( obj ) { return obj.property });
							fontProps = font.map(function(o) { return o.property; });
							noPreviousFonts = fontProps.filter(function(value){ return value === 'font'; }).length - 1;
							if (noPreviousFonts > 0) {
								for (j = 0; j < noPreviousFonts; ++j) {
									fontTmpIdx = fontProps.indexOf('font',(fontProps.indexOf('font')+1));
									rules[i].declarations.splice(fontTmpIdx, 1); 
									dCount-=1;	
								}
							}

						} //end of inherit check

					} 
				}
				//end of font






				//background
				if (OPTIONS.shorten_background || OPTIONS.shorten) {
					background = rules[i].declarations.filter(function( obj ) {
					  return obj.property == 'background-color' 
					  		|| obj.property == 'background-image'
					  		|| obj.property == 'background-repeat'
					  		|| obj.property == 'background-attachment'
					  		|| obj.property == 'background-position'
					  		// || obj.property == 'background-size'
					  		// || obj.property == 'background-origin'
					  		// || obj.property == 'background-clip'
					  		|| obj.property == 'background'
					  ;
					});
					backgroundProps = background.map(function(o) { return o.property; });

					if (
						backgroundProps.length >= OPTIONS.shorten_background_min
					) {
						if (OPTIONS.verbose) { console.log(success('Process - Values - Background : ' + (rules[i].selectors ? rules[i].selectors.join(', ') : ''))); }

						backgroundHasInherit = false;
						backgroundValues = background.map(function(o) { 
							if (o.value.toLowerCase().indexOf('inherit') != -1) {
								backgroundHasInherit = true;
							}
							return o.value; 
						});

						if (backgroundHasInherit == false) {
							backgroundPropsOutput = ['background-color', 'background-image', 'background-repeat', 'background-attachment', 'background-position'];
							backgroundValuesOutput = [
								(backgroundValues[backgroundProps.indexOf('background-color')]?backgroundValues[backgroundProps.indexOf('background-color')]:''), 
								(backgroundValues[backgroundProps.indexOf('background-image')]?backgroundValues[backgroundProps.indexOf('background-image')]:''), 
								(backgroundValues[backgroundProps.indexOf('background-repeat')]?backgroundValues[backgroundProps.indexOf('background-repeat')]:''), 
								(backgroundValues[backgroundProps.indexOf('background-attachment')]?backgroundValues[backgroundProps.indexOf('background-attachment')]:''), 
								(backgroundValues[backgroundProps.indexOf('background-position')]?backgroundValues[backgroundProps.indexOf('background-position')]:''), 
							];
							hasMultipleBackgrounds = false;
							hasGradient = false;

							if (backgroundValues[0].match(/([^0-9]),([^0-9])/g) !== null) {
								hasMultipleBackgrounds = true;
							}

							// console.log(backgroundProps)
							// console.log(backgroundValues)
							//existing background check
							for (j = 0; j < backgroundProps.length; ++j) {

								if (backgroundValues[j].indexOf('gradient') != -1) {

									hasGradient = true;
								}

								if (backgroundProps[j] == 'background') {
									backgroundTmpIdx = j;
									backgroundTmp = backgroundValues[backgroundTmpIdx];

									if (backgroundTmp.indexOf('gradient') == -1) {
										//fill missing attribute with existing background props
										if (backgroundProps.indexOf('background-color') > backgroundTmpIdx) {
											backgroundValuesOutput[0] = backgroundValues[backgroundProps.indexOf('background-color')];
										} else {
											backgroundValuesOutput[0] = (backgroundTmp2 = getBackgroundProp(backgroundTmp, 'color')) ? backgroundTmp2 : backgroundValuesOutput[0];
										}
										if (backgroundProps.indexOf('background-image') > backgroundTmpIdx) {
											backgroundValuesOutput[1] = backgroundValues[backgroundProps.indexOf('background-image')];
										} else {
											backgroundValuesOutput[1] = (backgroundTmp2 = getBackgroundProp(backgroundTmp, 'image')) ? backgroundTmp2 : backgroundValuesOutput[1];
										}
										if (backgroundProps.indexOf('background-repeat') > backgroundTmpIdx) {
											backgroundValuesOutput[2] = backgroundValues[backgroundProps.indexOf('background-repeat')];
										} else {
											backgroundValuesOutput[2] = (backgroundTmp2 = getBackgroundProp(backgroundTmp, 'repeat')) ? backgroundTmp2 : backgroundValuesOutput[2];
										}
										if (backgroundProps.indexOf('background-attachment') > backgroundTmpIdx) {
											backgroundValuesOutput[3] = backgroundValues[backgroundProps.indexOf('background-attachment')];
										} else {
											backgroundValuesOutput[3] = (backgroundTmp2 = getBackgroundProp(backgroundTmp, 'attachment')) ? backgroundTmp2 : backgroundValuesOutput[3];
										}
										if (backgroundProps.indexOf('background-position') > backgroundTmpIdx) {
											backgroundValuesOutput[4] = backgroundValues[backgroundProps.indexOf('background-position')];
										} else {
											backgroundValuesOutput[4] = (backgroundTmp2 = getBackgroundProp(backgroundTmp, 'position')) ? backgroundTmp2 : backgroundValuesOutput[4];

										}
									}
								}
							}

							if (hasMultipleBackgrounds && hasGradient == false) {
								// console.log('hi')
								backgroundTmp = '';
								backgroundTmp2 = '';
								for (j = 0; j < backgroundValuesOutput.length; ++j) {
									backgroundTmpIdx = backgroundValuesOutput[j].split(',');
									backgroundTmp += (backgroundTmpIdx[0]) ? backgroundTmpIdx[0].trim() + ' ' : '';
									backgroundTmp2 += (backgroundTmpIdx[1]) ? backgroundTmpIdx[1].trim() + ' ' : '';
									backgroundValuesOutput[j] = '';
								}
								backgroundTmp = backgroundTmp.trim();
								backgroundTmp += ', ' + backgroundTmp2.trim();
								backgroundValuesOutput[0] = backgroundTmp;
							}
							// console.log(backgroundPropsOutput)
							// console.log(backgroundValuesOutput)

							if (hasGradient == false) {


								// console.log(backgroundProps)
								// console.log(backgroundValues)

								if (
									backgroundValuesOutput[0] == ''
									&& backgroundValuesOutput[1] == ''
									&& backgroundValuesOutput[2] == ''
									&& backgroundValuesOutput[3] == ''
									&& backgroundValuesOutput[4] == ''
								) {

								} else {

									backgroundProps = backgroundPropsOutput;
									backgroundValues = backgroundValuesOutput;
								}
								// console.log(backgroundProps)
								// console.log(backgroundValues)

								//check for !important
								backgroundHasImportant = false;
								for (k = 0, klen = backgroundValues.length; k < klen; ++k) {

									backgroundValues[k] = backgroundValues[k].toString().replace(/(!important)/g, function(capture){
										backgroundHasImportant = true;
										return '';
									});
								}

								if (backgroundHasImportant) {
										backgroundValues[backgroundValues.length-1] += ' !important';
								}


								//remove any spaces from empty values
								backgroundValues = backgroundValues.filter(Boolean);

								//add new declaration to highest property position
								backgroundTmpIdx = rules[i].declarations.length;
								for (j = 0; j < backgroundTmpIdx; ++j) {
									
									switch(rules[i].declarations[j].property) {
										case 'background-color': 
										case 'background-image': 
										case 'background-position': 
										case 'background-repeat': 
										case 'background-attachment': 
										// case 'background-size': 
										// case 'background-origin': 
										// case 'background-clip': 
										case 'background': 
											backgroundIndex = j;
											if (backgroundIndex < backgroundTmpIdx && backgroundIndex != -1) { backgroundTmpIdx = backgroundIndex; }
											break;
									}
								}
								rules[i].declarations.splice(backgroundTmpIdx, 0, {
									type: 'declaration',
									property: 'background',
									value: backgroundValues.join(' ')
								})
								dCount+=1;
					    	summary.stats.summary.noBackgroundsShortened += 1;

								//remove originals
								backgroundIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('background-color');
								if (backgroundIndex != -1) { rules[i].declarations.splice(backgroundIndex, 1); dCount-=1;	}
								backgroundIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('background-image');
								if (backgroundIndex != -1) { rules[i].declarations.splice(backgroundIndex, 1); dCount-=1;	}
								backgroundIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('background-position');
								if (backgroundIndex != -1) { rules[i].declarations.splice(backgroundIndex, 1); dCount-=1;	}
								backgroundIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('background-repeat');
								if (backgroundIndex != -1) { rules[i].declarations.splice(backgroundIndex, 1); dCount-=1;	}
								backgroundIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('background-attachment');
								if (backgroundIndex != -1) { rules[i].declarations.splice(backgroundIndex, 1); dCount-=1;	}
								// backgroundIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('background-size');
								// if (backgroundIndex != -1) { rules[i].declarations.splice(backgroundIndex, 1); dCount-=1;	}
								// backgroundIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('background-origin');
								// if (backgroundIndex != -1) { rules[i].declarations.splice(backgroundIndex, 1); dCount-=1;	}
								// backgroundIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('background-clip');
								// if (backgroundIndex != -1) { rules[i].declarations.splice(backgroundIndex, 1); dCount-=1;	}

								//remove existing backgrounds
								background = rules[i].declarations.filter(function( obj ) { return obj.property });
								backgroundProps = background.map(function(o) { return o.property; });
								noPreviousBackgrounds = backgroundProps.filter(function(value){ return value === 'background'; }).length - 1;
								if (noPreviousBackgrounds > 0) {
									for (j = 0; j < noPreviousBackgrounds; ++j) {
										backgroundTmpIdx = backgroundProps.indexOf('background',(backgroundProps.indexOf('background')+1));
										rules[i].declarations.splice(backgroundTmpIdx, 1); 
										dCount-=1;	
									}
								}
							}

						} //end of inherit check
					}
				} //end of background




				//listStyle
				if (OPTIONS.shorten_list_style || OPTIONS.shorten) {
					listStyle = rules[i].declarations.filter(function( obj ) {
					  return obj.property == 'list-style-type' 
					  		|| obj.property == 'list-style-position'
					  		|| obj.property == 'list-style-image'
					  		|| obj.property == 'list-style'
					  ;
					});
					listStyleProps = listStyle.map(function(o) { return o.property; });
					if (
						listStyleProps.indexOf('list-style-type') != -1 
						|| listStyleProps.indexOf('list-style-position') != -1 
						|| listStyleProps.indexOf('list-style-image') != -1 
						|| listStyleProps.indexOf('list-style') != -1
					) {
						if (OPTIONS.verbose) { console.log(success('Process - Values - List-style : ' + (rules[i].selectors ? rules[i].selectors.join(', ') : ''))); }

						listStyleHasInherit = false;
						listStyleValues = listStyle.map(function(o) { 
							if (o.value.toLowerCase().indexOf('inherit') != -1) {
								listStyleHasInherit = true;
							}
							return o.value; 
						});

						if (listStyleHasInherit == false) {

							listStylePropsOutput = ['list-style-type', 'list-style-position', 'list-style-image'];
							listStyleValuesOutput = [
								(listStyleValues[listStyleProps.indexOf('list-style-type')]?listStyleValues[listStyleProps.indexOf('list-style-type')]:''), 
								(listStyleValues[listStyleProps.indexOf('list-style-position')]?listStyleValues[listStyleProps.indexOf('list-style-position')]:''), 
								(listStyleValues[listStyleProps.indexOf('list-style-image')]?listStyleValues[listStyleProps.indexOf('list-style-image')]:''), 
							];

							//existing listStyle check
							listStyleTmpIdx = listStyleProps.indexOf('list-style')
							if (listStyleTmpIdx != -1) {
								listStyleTmp = listStyleValues[listStyleTmpIdx];

								if (listStyleTmp != 'none') {

									//fill missing attribute with existing listStyle
									if (listStyleProps.indexOf('list-style-type') > listStyleTmpIdx) {
										listStyleValuesOutput[0] = listStyleValues[listStyleProps.indexOf('list-style-type')];
									} else {
										listStyleValuesOutput[0] = (listStyleTmp2 = getValueOfTriProp(listStyleTmp, 'type')) ? listStyleTmp2 : listStyleValuesOutput[0];
									}
									if (listStyleProps.indexOf('list-style-position') > listStyleTmpIdx) {
										listStyleValuesOutput[1] = listStyleValues[listStyleProps.indexOf('list-style-position')];
									} else {
										listStyleValuesOutput[1] = (listStyleTmp2 = getValueOfTriProp(listStyleTmp, 'position')) ? listStyleTmp2 : listStyleValuesOutput[1];
									}
									if (listStyleProps.indexOf('list-style-image') > listStyleTmpIdx) {
										listStyleValuesOutput[2] = listStyleValues[listStyleProps.indexOf('list-style-image')];
									} else {
										listStyleValuesOutput[2] = (listStyleTmp2 = getValueOfTriProp(listStyleTmp, 'image')) ? listStyleTmp2 : listStyleValuesOutput[2];
									}

								} else {
									listStyleValuesOutput[0] = listStyleTmp;
									listStyleValuesOutput[1] = '';
									listStyleValuesOutput[2] = '';
								}
							}


							if (
								listStyleValuesOutput[0] == ''
								&& listStyleValuesOutput[1] == ''
								&& listStyleValuesOutput[2] == ''
							) {

							} else {

								listStyleProps = listStylePropsOutput;
								listStyleValues = listStyleValuesOutput;
							}
							// console.log(listStyleProps)
							// console.log(listStyleValues)

							//check for !important
							listStyleHasImportant = false;
							for (k = 0, klen = listStyleValues.length; k < klen; ++k) {

								listStyleValues[k] = listStyleValues[k].toString().replace(/(!important)/g, function(capture){
									listStyleHasImportant = true;
									return '';
								});
							}

							if (listStyleHasImportant) {
									listStyleValues[listStyleValues.length-1] += ' !important';
							}


							//remove any spaces from empty values
							listStyleValues = listStyleValues.filter(Boolean);

							//add declaration
							listStyleTmpIdx = rules[i].declarations.length;
							for (j = 0; j < listStyleTmpIdx; ++j) {
								
								switch(rules[i].declarations[j].property) {
									case 'list-style-type': 
									case 'list-style-position': 
									case 'list-style-image': 
									case 'list-style': 
										listStyleIndex = j;
										if (listStyleIndex < listStyleTmpIdx && listStyleIndex != -1) { listStyleTmpIdx = listStyleIndex; }
										break;
								}
							}
							rules[i].declarations.splice(listStyleTmpIdx, 0, {
								type: 'declaration',
								property: 'list-style',
								value: listStyleValues.join(' ')
							})
							dCount+=1;
				    	summary.stats.summary.noListStylesShortened += 1;

							listStyleIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('list-style-type');
							if (listStyleIndex != -1) { rules[i].declarations.splice(listStyleIndex, 1); dCount-=1;	}
							listStyleIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('list-style-position');
							if (listStyleIndex != -1) { rules[i].declarations.splice(listStyleIndex, 1); dCount-=1;	}
							listStyleIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('list-style-image');
							if (listStyleIndex != -1) { rules[i].declarations.splice(listStyleIndex, 1); dCount-=1;	}

							//remove existing listStyles
							listStyle = rules[i].declarations.filter(function( obj ) { return obj.property });
							listStyleProps = listStyle.map(function(o) { return o.property; });
							noPreviousMargins = listStyleProps.filter(function(value){ return value === 'list-style'; }).length;
							
							if (noPreviousMargins > 1) {
								for (j = 1; j < noPreviousMargins; ++j) {
									listStyleTmpIdx = listStyleProps.indexOf('list-style',(listStyleProps.indexOf('list-style')+1));
									
									rules[i].declarations.splice(listStyleTmpIdx, 1); 
									dCount-=1;	
								}
							}
						} // end of inherit check
					}
				} //end of listStyle



				//outline
				if (OPTIONS.shorten_outline || OPTIONS.shorten) {
					outline = rules[i].declarations.filter(function( obj ) {
					  return obj.property == 'outline-width' 
					  		|| obj.property == 'outline-style'
					  		|| obj.property == 'outline-color'
					  		|| obj.property == 'outline'
					  ;
					});
					outlineProps = outline.map(function(o) { return o.property; });
					if (
						outlineProps.indexOf('outline-style') != -1 
						|| outlineProps.indexOf('outline') != -1
					) {
						if (OPTIONS.verbose) { console.log(success('Process - Values - Outline : ' + (rules[i].selectors ? rules[i].selectors.join(', ') : ''))); }


						outlineHasInherit = false;
						outlineValues = outline.map(function(o) { 
							if (o.value.toLowerCase().indexOf('inherit') != -1) {
								outlineHasInherit = true;
							}
							return o.value; 
						});

						if (outlineHasInherit == false) {

							outlineValues = outline.map(function(o) { return o.value; });
							outlinePropsOutput = ['outline-width', 'outline-style', 'outline-color'];
							outlineValuesOutput = [
								(outlineValues[outlineProps.indexOf('outline-width')]?outlineValues[outlineProps.indexOf('outline-width')]:''), 
								(outlineValues[outlineProps.indexOf('outline-style')]?outlineValues[outlineProps.indexOf('outline-style')]:''), 
								(outlineValues[outlineProps.indexOf('outline-color')]?outlineValues[outlineProps.indexOf('outline-color')]:''), 
							];

							//existing outline check
							outlineTmpIdx = outlineProps.indexOf('outline')
							if (outlineTmpIdx != -1) {
								outlineTmp = outlineValues[outlineTmpIdx];
								if (outlineTmp != 'none') {

									//fill missing attribute with existing outline
									if (outlineProps.indexOf('outline-width') > outlineTmpIdx) {
										outlineValuesOutput[0] = outlineValues[outlineProps.indexOf('outline-width')];
									} else {
										outlineValuesOutput[0] = (outlineTmp2 = getValueOfTriProp(outlineTmp, 'width')) ? outlineTmp2 : outlineValuesOutput[0];
									}
									if (outlineProps.indexOf('outline-style') > outlineTmpIdx) {
										outlineValuesOutput[1] = outlineValues[outlineProps.indexOf('outline-style')];
									} else {
										outlineValuesOutput[1] = (outlineTmp2 = getValueOfTriProp(outlineTmp, 'style')) ? outlineTmp2 : outlineValuesOutput[1];
									}
									if (outlineProps.indexOf('outline-color') > outlineTmpIdx) {
										outlineValuesOutput[2] = outlineValues[outlineProps.indexOf('outline-color')];
									} else {
										outlineValuesOutput[2] = (outlineTmp2 = getValueOfTriProp(outlineTmp, 'color')) ? outlineTmp2 : outlineValuesOutput[2];
									}

								} else {
									outlineValuesOutput[0] = '0';
									outlineValuesOutput[1] = '';
									outlineValuesOutput[2] = '';
								}
							}

							if (
								outlineValuesOutput[0] == ''
								&& outlineValuesOutput[1] == ''
								&& outlineValuesOutput[2] == ''
							) {

							} else {

								outlineProps = outlinePropsOutput;
								outlineValues = outlineValuesOutput;
							}

							//check for !important
							outlineHasImportant = false;
							for (k = 0, klen = outlineValues.length; k < klen; ++k) {

								outlineValues[k] = outlineValues[k].toString().replace(/(!important)/g, function(capture){
									outlineHasImportant = true;
									return '';
								});
							}

							if (outlineHasImportant) {
									outlineValues[outlineValues.length-1] += ' !important';
							}

							//remove any spaces from empty values
							outlineValues = outlineValues.filter(Boolean);

							//add declaration
							outlineTmpIdx = rules[i].declarations.length;
							for (j = 0; j < outlineTmpIdx; ++j) {
								
								switch(rules[i].declarations[j].property) {
									case 'outline-width': 
									case 'outline-style': 
									case 'outline-color': 
									case 'outline': 
										outlineIndex = j;
										if (outlineIndex < outlineTmpIdx && outlineIndex != -1) { outlineTmpIdx = outlineIndex; }
										break;
								}
							}
							rules[i].declarations.splice(outlineTmpIdx, 0, {
								type: 'declaration',
								property: 'outline',
								value: outlineValues.join(' ')
							})
							dCount+=1;
				    	summary.stats.summary.noOutlinesShortened += 1;

							outlineIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('outline-width');
							if (outlineIndex != -1) { rules[i].declarations.splice(outlineIndex, 1); dCount-=1;	}
							outlineIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('outline-style');
							if (outlineIndex != -1) { rules[i].declarations.splice(outlineIndex, 1); dCount-=1;	}
							outlineIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('outline-color');
							if (outlineIndex != -1) { rules[i].declarations.splice(outlineIndex, 1); dCount-=1;	}

							//remove existing outlines
							outline = rules[i].declarations.filter(function( obj ) { return obj.property });
							outlineProps = outline.map(function(o) { return o.property; });
							noPreviousOutline = outlineProps.filter(function(value){ return value === 'outline'; }).length - 1;
							if (noPreviousOutline > 0) {
								for (j = 0; j < noPreviousOutline; ++j) {
									outlineTmpIdx = outlineProps.indexOf('outline',(outlineProps.indexOf('outline')+1));
									rules[i].declarations.splice(outlineTmpIdx, 1); 
									dCount-=1;	
								}
							}
						} //end of inherit check
					}
				} //end of outline




				//borderTop
				if (OPTIONS.shorten_border_top || OPTIONS.shorten) {
					borderTop = rules[i].declarations.filter(function( obj ) {
					  return obj.property == 'border-top-width' 
					  		|| obj.property == 'border-top-style'
					  		|| obj.property == 'border-top-color'
					  		|| obj.property == 'border-top'
					  ;
					});
					borderTopProps = borderTop.map(function(o) { return o.property; });
					if (
						borderTopProps.indexOf('border-top-style') != -1 
						|| borderTopProps.indexOf('border-top') != -1
					) {
						if (OPTIONS.verbose) { console.log(success('Process - Values - Border Top : ' + (rules[i].selectors ? rules[i].selectors.join(', ') : ''))); }

						borderTopHasInherit = false;
						borderTopValues = borderTop.map(function(o) { 
							if (o.value.toLowerCase().indexOf('inherit') != -1) {
								borderTopHasInherit = true;
							}
							return o.value; 
						});

						if (borderTopHasInherit == false) {

							borderTopPropsOutput = ['border-top-width', 'border-top-style', 'border-top-color'];
							borderTopValuesOutput = [
								(borderTopValues[borderTopProps.indexOf('border-top-width')]?borderTopValues[borderTopProps.indexOf('border-top-width')]:''), 
								(borderTopValues[borderTopProps.indexOf('border-top-style')]?borderTopValues[borderTopProps.indexOf('border-top-style')]:''), 
								(borderTopValues[borderTopProps.indexOf('border-top-color')]?borderTopValues[borderTopProps.indexOf('border-top-color')]:''), 
							];

							//existing borderTop check
							borderTopTmpIdx = borderTopProps.indexOf('border-top')
							if (borderTopTmpIdx != -1) {
								borderTopTmp = borderTopValues[borderTopTmpIdx];

								if (borderTopTmp != 'none') {
									//fill missing attribute with existing borderTop
									if (borderTopProps.indexOf('border-top-width') > borderTopTmpIdx) {
										
										borderTopValuesOutput[0] = borderTopValues[borderTopProps.indexOf('border-top-width')];
									} else {
										borderTopValuesOutput[0] = (borderTopTmp2 = getValueOfTriProp(borderTopTmp, 'width')) ? borderTopTmp2 : borderTopValuesOutput[0];
									}
									if (borderTopProps.indexOf('border-top-style') > borderTopTmpIdx) {
										
										borderTopValuesOutput[1] = borderTopValues[borderTopProps.indexOf('border-top-style')];
									} else {
										borderTopValuesOutput[1] = (borderTopTmp2 = getValueOfTriProp(borderTopTmp, 'style')) ? borderTopTmp2 : borderTopValuesOutput[1];
									}
									if (borderTopProps.indexOf('border-top-color') > borderTopTmpIdx) {
										
										borderTopValuesOutput[2] = borderTopValues[borderTopProps.indexOf('border-top-color')];
									} else {
										borderTopValuesOutput[2] = (borderTopTmp2 = getValueOfTriProp(borderTopTmp, 'color')) ? borderTopTmp2 : borderTopValuesOutput[2];
									}

								} else {
									borderTopValuesOutput[0] = '0';
									borderTopValuesOutput[1] = '';
									borderTopValuesOutput[2] = '';
								}
							}

							if (
								borderTopValuesOutput[0] == ''
								&& borderTopValuesOutput[1] == ''
								&& borderTopValuesOutput[2] == ''
							) {

							} else {

								borderTopProps = borderTopPropsOutput;
								borderTopValues = borderTopValuesOutput;
							}


							//check for !important
							borderTopHasImportant = false;
							for (k = 0, klen = borderTopValues.length; k < klen; ++k) {

								borderTopValues[k] = borderTopValues[k].toString().replace(/(!important)/g, function(capture){
									borderTopHasImportant = true;
									return '';
								});
							}

							if (borderTopHasImportant) {
									borderTopValues[borderTopValues.length-1] += ' !important';
							}

							//remove any spaces from empty values
							borderTopValues = borderTopValues.filter(Boolean);

							//add declaration
							borderTopTmpIdx = rules[i].declarations.length;
							for (j = 0; j < borderTopTmpIdx; ++j) {
								
								switch(rules[i].declarations[j].property) {
									case 'border-top-width': 
									case 'border-top-style': 
									case 'border-top-color': 
									case 'border-top': 
										borderTopIndex = j;
										if (borderTopIndex < borderTopTmpIdx && borderTopIndex != -1) { borderTopTmpIdx = borderTopIndex; }
										break;
								}
							}
							rules[i].declarations.splice(borderTopTmpIdx,0,{
								type: 'declaration',
								property: 'border-top',
								value: borderTopValues.join(' ')
							})
							dCount+=1;
				    	summary.stats.summary.noBorderTopsShortened += 1;

							borderTopIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('border-top-width');
							if (borderTopIndex != -1) { rules[i].declarations.splice(borderTopIndex, 1); dCount-=1;	}
							borderTopIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('border-top-style');
							if (borderTopIndex != -1) { rules[i].declarations.splice(borderTopIndex, 1); dCount-=1;	}
							borderTopIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('border-top-color');
							if (borderTopIndex != -1) { rules[i].declarations.splice(borderTopIndex, 1); dCount-=1;	}
							
							//remove existing borderTops
							borderTop = rules[i].declarations.filter(function( obj ) { return obj.property });
							borderTopProps = borderTop.map(function(o) { return o.property; });
							noPreviousBorderTop = borderTopProps.filter(function(value){ return value === 'border-top'; }).length - 1;
							if (noPreviousBorderTop > 0) {
								for (j = 0; j < noPreviousBorderTop; ++j) {
									borderTopTmpIdx = borderTopProps.indexOf('border-top',(borderTopProps.indexOf('border-top')+1));
									rules[i].declarations.splice(borderTopTmpIdx, 1); 
									dCount-=1;	
								}
							}
						} //end of inherit
					}
				} //end of borderTop


				//borderRight
				if (OPTIONS.shorten_border_top || OPTIONS.shorten) {
					borderRight = rules[i].declarations.filter(function( obj ) {
					  return obj.property == 'border-right-width' 
					  		|| obj.property == 'border-right-style'
					  		|| obj.property == 'border-right-color'
					  		|| obj.property == 'border-right'
					  ;
					});
					borderRightProps = borderRight.map(function(o) { return o.property; });
					if (
						borderRightProps.indexOf('border-right-style') != -1 
						|| borderRightProps.indexOf('border-right') != -1
					) {
						if (OPTIONS.verbose) { console.log(success('Process - Values - Border Right : ' + (rules[i].selectors ? rules[i].selectors.join(', ') : ''))); }
						
						
						borderRightHasInherit = false;
						borderRightValues = borderRight.map(function(o) { 
							if (o.value.toLowerCase().indexOf('inherit') != -1) {
								borderRightHasInherit = true;
							}
							return o.value; 
						});
						
						if (borderRightHasInherit == false) {

							borderRightPropsOutput = ['border-right-width', 'border-right-style', 'border-right-color'];
							borderRightValuesOutput = [
								(borderRightValues[borderRightProps.indexOf('border-right-width')]?borderRightValues[borderRightProps.indexOf('border-right-width')]:''), 
								(borderRightValues[borderRightProps.indexOf('border-right-style')]?borderRightValues[borderRightProps.indexOf('border-right-style')]:''), 
								(borderRightValues[borderRightProps.indexOf('border-right-color')]?borderRightValues[borderRightProps.indexOf('border-right-color')]:''), 
							];

							//existing borderRight check
							borderRightTmpIdx = borderRightProps.indexOf('border-right')
							if (borderRightTmpIdx != -1) {
								hasBorderRight = true;
								borderRightTmp = borderRightValues[borderRightTmpIdx];

								if (borderRightTmp != 'none') {
									//fill missing attribute with existing borderRight
									if (borderRightProps.indexOf('border-right-width') > borderRightTmpIdx) {
										borderRightValuesOutput[0] = borderRightValues[borderRightProps.indexOf('border-right-width')];
									} else {
										borderRightValuesOutput[0] = getValueOfTriProp(borderRightTmp, 'width');
									}
									if (borderRightProps.indexOf('border-right-style') > borderRightTmpIdx) {
										borderRightValuesOutput[1] = borderRightValues[borderRightProps.indexOf('border-right-style')];
									} else {
										borderRightValuesOutput[1] = getValueOfTriProp(borderRightTmp, 'style');
									}
									if (borderRightProps.indexOf('border-right-color') > borderRightTmpIdx) {
										borderRightValuesOutput[2] = borderRightValues[borderRightProps.indexOf('border-right-color')];
									} else {
										borderRightValuesOutput[2] = getValueOfTriProp(borderRightTmp, 'color');
									}

								} else {
									borderRightValuesOutput[0] = '0';
									borderRightValuesOutput[1] = '';
									borderRightValuesOutput[2] = '';
								}
							}

							if (
								borderRightValuesOutput[0] == ''
								&& borderRightValuesOutput[1] == ''
								&& borderRightValuesOutput[2] == ''
							) {

							} else {

								borderRightProps = borderRightPropsOutput;
								borderRightValues = borderRightValuesOutput;
							}

							//check for !important
							borderRightHasImportant = false;
							for (k = 0, klen = borderRightValues.length; k < klen; ++k) {

								borderRightValues[k] = borderRightValues[k].toString().replace(/(!important)/g, function(capture){
									borderRightHasImportant = true;
									return '';
								});
							}

							if (borderRightHasImportant) {
									borderRightValues[borderRightValues.length-1] += ' !important';
							}

							//remove any spaces from empty values
							borderRightValues = borderRightValues.filter(Boolean);

							//add declaration
							borderRightTmpIdx = rules[i].declarations.length;
							for (j = 0; j < borderRightTmpIdx; ++j) {
								
								switch(rules[i].declarations[j].property) {
									case 'border-right-width': 
									case 'border-right-style': 
									case 'border-right-color': 
									case 'border-right': 
										borderRightIndex = j;
										if (borderRightIndex < borderRightTmpIdx && borderRightIndex != -1) { borderRightTmpIdx = borderRightIndex; }
										break;
								}
							}
							rules[i].declarations.splice(borderRightTmpIdx,0,{
								type: 'declaration',
								property: 'border-right',
								value: borderRightValues.join(' ')
							})
							dCount+=1;
				    	summary.stats.summary.noBorderRightsShortened += 1;

							borderRightIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('border-right-width');
							if (borderRightIndex != -1) { rules[i].declarations.splice(borderRightIndex, 1); dCount-=1;	}
							borderRightIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('border-right-style');
							if (borderRightIndex != -1) { rules[i].declarations.splice(borderRightIndex, 1); dCount-=1;	}
							borderRightIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('border-right-color');
							if (borderRightIndex != -1) { rules[i].declarations.splice(borderRightIndex, 1); dCount-=1;	}
							
							//remove existing borderRights
							borderRight = rules[i].declarations.filter(function( obj ) { return obj.property });
							borderRightProps = borderRight.map(function(o) { return o.property; });
							noPreviousBorderRight = borderRightProps.filter(function(value){ return value === 'border-right'; }).length - 1;
							if (noPreviousBorderRight > 0) {
								for (j = 0; j < noPreviousBorderRight; ++j) {
									borderRightTmpIdx = borderRightProps.indexOf('border-right',(borderRightProps.indexOf('border-right')+1));
									rules[i].declarations.splice(borderRightTmpIdx, 1); 
									dCount-=1;	
								}
							}
						} //end of inherit
					}
				} //end of borderRight


				//borderBottom
				if (OPTIONS.shorten_border_top || OPTIONS.shorten) {
					borderBottom = rules[i].declarations.filter(function( obj ) {
					  return obj.property == 'border-bottom-width' 
					  		|| obj.property == 'border-bottom-style'
					  		|| obj.property == 'border-bottom-color'
					  		|| obj.property == 'border-bottom'
					  ;
					});
					borderBottomProps = borderBottom.map(function(o) { return o.property; });
					if (
						borderBottomProps.indexOf('border-bottom-style') != -1 
						|| borderBottomProps.indexOf('border-bottom') != -1
					) {
						if (OPTIONS.verbose) { console.log(success('Process - Values - Border Bottom : ' + (rules[i].selectors ? rules[i].selectors.join(', ') : ''))); }

						borderBottomHasInherit = false;
						borderBottomValues = borderBottom.map(function(o) { 
							if (o.value.toLowerCase().indexOf('inherit') != -1) {
								borderBottomHasInherit = true;
							}
							return o.value; 
						});
						
						if (borderBottomHasInherit == false) {

							borderBottomPropsOutput = ['border-bottom-width', 'border-bottom-style', 'border-bottom-color'];
							borderBottomValuesOutput = [
								(borderBottomValues[borderBottomProps.indexOf('border-bottom-width')]?borderBottomValues[borderBottomProps.indexOf('border-bottom-width')]:''), 
								(borderBottomValues[borderBottomProps.indexOf('border-bottom-style')]?borderBottomValues[borderBottomProps.indexOf('border-bottom-style')]:''), 
								(borderBottomValues[borderBottomProps.indexOf('border-bottom-color')]?borderBottomValues[borderBottomProps.indexOf('border-bottom-color')]:''), 
							];

							//existing borderBottom check
							borderBottomTmpIdx = borderBottomProps.indexOf('border-bottom')
							if (borderBottomTmpIdx != -1) {
								borderBottomTmp = borderBottomValues[borderBottomTmpIdx];

								if (borderBottomTmp != 'none') {
									//fill missing attribute with existing borderBottom
									if (borderBottomProps.indexOf('border-bottom-width') > borderBottomTmpIdx) {
										borderBottomValuesOutput[0] = borderBottomValues[borderBottomProps.indexOf('border-bottom-width')];
									} else {
										borderBottomValuesOutput[0] = (borderBottomTmp2 = getValueOfTriProp(borderBottomTmp, 'width')) ? borderBottomTmp2 : borderBottomValuesOutput[0];
									}
									if (borderBottomProps.indexOf('border-bottom-style') > borderBottomTmpIdx) {
										borderBottomValuesOutput[1] = borderBottomValues[borderBottomProps.indexOf('border-bottom-style')];
									} else {
										borderBottomValuesOutput[1] = (borderBottomTmp2 = getValueOfTriProp(borderBottomTmp, 'style')) ? borderBottomTmp2 : borderBottomValuesOutput[1];
									}
									if (borderBottomProps.indexOf('border-bottom-color') > borderBottomTmpIdx) {
										borderBottomValuesOutput[2] = borderBottomValues[borderBottomProps.indexOf('border-bottom-color')];
									} else {
										borderBottomValuesOutput[2] = (borderBottomTmp2 = getValueOfTriProp(borderBottomTmp, 'color')) ? borderBottomTmp2 : borderBottomValuesOutput[2];
									}

								} else {
									borderBottomValuesOutput[0] = '0';
									borderBottomValuesOutput[1] = '';
									borderBottomValuesOutput[2] = '';
								}
							}

							if (
								borderBottomValuesOutput[0] == ''
								&& borderBottomValuesOutput[1] == ''
								&& borderBottomValuesOutput[2] == ''
							) {

							} else {

								borderBottomProps = borderBottomPropsOutput;
								borderBottomValues = borderBottomValuesOutput;
							}

							//check for !important
							borderBottomHasImportant = false;
							for (k = 0, klen = borderBottomValues.length; k < klen; ++k) {

								borderBottomValues[k] = borderBottomValues[k].toString().replace(/(!important)/g, function(capture){
									borderBottomHasImportant = true;
									return '';
								});
							}

							if (borderBottomHasImportant) {
									borderBottomValues[borderBottomValues.length-1] += ' !important';
							}

							//remove any spaces from empty values
							borderBottomValues = borderBottomValues.filter(Boolean);

							//add declaration
							borderBottomTmpIdx = rules[i].declarations.length;
							for (j = 0; j < borderBottomTmpIdx; ++j) {
								
								switch(rules[i].declarations[j].property) {
									case 'border-bottom-width': 
									case 'border-bottom-style': 
									case 'border-bottom-color': 
									case 'border-bottom': 
										borderBottomIndex = j;
										if (borderBottomIndex < borderBottomTmpIdx && borderBottomIndex != -1) { borderBottomTmpIdx = borderBottomIndex; }
										break;
								}
							}
							rules[i].declarations.splice(borderBottomTmpIdx,0,{
								type: 'declaration',
								property: 'border-bottom',
								value: borderBottomValues.join(' ')
							})
							dCount+=1;
				    	summary.stats.summary.noBorderBottomsShortened += 1;

							borderBottomIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('border-bottom-width');
							if (borderBottomIndex != -1) { rules[i].declarations.splice(borderBottomIndex, 1); dCount-=1;	}
							borderBottomIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('border-bottom-style');
							if (borderBottomIndex != -1) { rules[i].declarations.splice(borderBottomIndex, 1); dCount-=1;	}
							borderBottomIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('border-bottom-color');
							if (borderBottomIndex != -1) { rules[i].declarations.splice(borderBottomIndex, 1); dCount-=1;	}
							
							//remove existing borderBottoms
							borderBottom = rules[i].declarations.filter(function( obj ) { return obj.property });
							borderBottomProps = borderBottom.map(function(o) { return o.property; });
							noPreviousBorderBottom = borderBottomProps.filter(function(value){ return value === 'border-bottom'; }).length - 1;
							if (noPreviousBorderBottom > 0) {
								for (j = 0; j < noPreviousBorderBottom; ++j) {
									borderBottomTmpIdx = borderBottomProps.indexOf('border-bottom',(borderBottomProps.indexOf('border-bottom')+1));
									rules[i].declarations.splice(borderBottomTmpIdx, 1); 
									dCount-=1;	
								}
							}
						} //end of inherit
					}
				} //end of borderBottom


				//borderLeft
				if (OPTIONS.shorten_border_left || OPTIONS.shorten) {
					borderLeft = rules[i].declarations.filter(function( obj ) {
					  return obj.property == 'border-left-width' 
					  		|| obj.property == 'border-left-style'
					  		|| obj.property == 'border-left-color'
					  		|| obj.property == 'border-left'
					  ;
					});
					borderLeftProps = borderLeft.map(function(o) { return o.property; });
					if (
						borderLeftProps.indexOf('border-left-style') != -1 
						|| borderLeftProps.indexOf('border-left') != -1
					) {
						if (OPTIONS.verbose) { console.log(success('Process - Values - Border Left : ' + (rules[i].selectors ? rules[i].selectors.join(', ') : ''))); }
						
						
						borderLeftHasInherit = false;
						borderLeftValues = borderLeft.map(function(o) { 
							if (o.value.toLowerCase().indexOf('inherit') != -1) {
								borderLeftHasInherit = true;
							}
							return o.value; 
						});
						
						if (borderLeftHasInherit == false) {

							borderLeftPropsOutput = ['border-left-width', 'border-left-style', 'border-left-color'];
							borderLeftValuesOutput = [
								(borderLeftValues[borderLeftProps.indexOf('border-left-width')]?borderLeftValues[borderLeftProps.indexOf('border-left-width')]:''), 
								(borderLeftValues[borderLeftProps.indexOf('border-left-style')]?borderLeftValues[borderLeftProps.indexOf('border-left-style')]:''), 
								(borderLeftValues[borderLeftProps.indexOf('border-left-color')]?borderLeftValues[borderLeftProps.indexOf('border-left-color')]:''), 
							];


							//existing borderLeft check
							borderLeftTmpIdx = borderLeftProps.indexOf('border-left')
							if (borderLeftTmpIdx != -1) {
								borderLeftTmp = borderLeftValues[borderLeftTmpIdx];

								if (borderLeftTmp != 'none') {
									//fill missing attribute with existing borderLeft
									if (borderLeftProps.indexOf('border-left-width') > borderLeftTmpIdx) {
										borderLeftValuesOutput[0] = borderLeftValues[borderLeftProps.indexOf('border-left-width')];
									} else {
										borderLeftValuesOutput[0] = (borderLeftTmp2 = getValueOfTriProp(borderLeftTmp, 'width')) ? borderLeftTmp2 : borderLeftValuesOutput[0];
									}
									if (borderLeftProps.indexOf('border-left-style') > borderLeftTmpIdx) {
										borderLeftValuesOutput[1] = borderLeftValues[borderLeftProps.indexOf('border-left-style')];
									} else {
										borderLeftValuesOutput[1] = (borderLeftTmp2 = getValueOfTriProp(borderLeftTmp, 'style')) ? borderLeftTmp2 : borderLeftValuesOutput[1];
									}
									if (borderLeftProps.indexOf('border-left-color') > borderLeftTmpIdx) {
										borderLeftValuesOutput[2] = borderLeftValues[borderLeftProps.indexOf('border-left-color')];
									} else {
										borderLeftValuesOutput[2] = (borderLeftTmp2 = getValueOfTriProp(borderLeftTmp, 'color')) ? borderLeftTmp2 : borderLeftValuesOutput[2];
									}
								} else {
									borderLeftValuesOutput[0] = '0';
									borderLeftValuesOutput[1] = '';
									borderLeftValuesOutput[2] = '';
								}
							}

							if (
								borderLeftValuesOutput[0] == ''
								&& borderLeftValuesOutput[1] == ''
								&& borderLeftValuesOutput[2] == ''
							) {

							} else {

								borderLeftProps = borderLeftPropsOutput;
								borderLeftValues = borderLeftValuesOutput;
							}

							//check for !important
							borderLeftHasImportant = false;
							for (k = 0, klen = borderLeftValues.length; k < klen; ++k) {

								borderLeftValues[k] = borderLeftValues[k].toString().replace(/(!important)/g, function(capture){
									borderLeftHasImportant = true;
									return '';
								});
							}

							if (borderLeftHasImportant) {
									borderLeftValues[borderLeftValues.length-1] += ' !important';
							}

							//remove any spaces from empty values
							borderLeftValues = borderLeftValues.filter(Boolean);

							//add declaration
							borderLeftTmpIdx = rules[i].declarations.length;
							for (j = 0; j < borderLeftTmpIdx; ++j) {
								
								switch(rules[i].declarations[j].property) {
									case 'border-left-width': 
									case 'border-left-style': 
									case 'border-left-color': 
									case 'border-left': 
										borderLeftIndex = j;
										if (borderLeftIndex < borderLeftTmpIdx && borderLeftIndex != -1) { borderLeftTmpIdx = borderLeftIndex; }
										break;
								}
							}
							rules[i].declarations.splice(borderLeftTmpIdx,0,{
								type: 'declaration',
								property: 'border-left',
								value: borderLeftValues.join(' ')
							})
							dCount+=1;
				    	summary.stats.summary.noBorderLeftsShortened += 1;

							borderLeftIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('border-left-width');
							if (borderLeftIndex != -1) { rules[i].declarations.splice(borderLeftIndex, 1); dCount-=1;	}
							borderLeftIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('border-left-style');
							if (borderLeftIndex != -1) { rules[i].declarations.splice(borderLeftIndex, 1); dCount-=1;	}
							borderLeftIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('border-left-color');
							if (borderLeftIndex != -1) { rules[i].declarations.splice(borderLeftIndex, 1); dCount-=1;	}
							
							//remove existing borderLefts
							borderLeft = rules[i].declarations.filter(function( obj ) { return obj.property });
							borderLeftProps = borderLeft.map(function(o) { return o.property; });
							noPreviousBorderLeft = borderLeftProps.filter(function(value){ return value === 'border-left'; }).length - 1;
							if (noPreviousBorderLeft > 0) {
								for (j = 0; j < noPreviousBorderLeft; ++j) {
									borderLeftTmpIdx = borderLeftProps.indexOf('border-left',(borderLeftProps.indexOf('border-left')+1));
									rules[i].declarations.splice(borderLeftTmpIdx, 1); 
									dCount-=1;	
								}
							}
						} //end of inherit check
					}
				} //end of borderLeft


				//border
				if (OPTIONS.shorten_border || OPTIONS.shorten) {




					border = rules[i].declarations.filter(function( obj ) {
					  return obj.property == 'border-top'
					  		|| obj.property == 'border-right'
					  		|| obj.property == 'border-bottom'
					  		|| obj.property == 'border-left'
					  		|| obj.property == 'border-top-width'
					  		|| obj.property == 'border-right-width'
					  		|| obj.property == 'border-bottom-width'
					  		|| obj.property == 'border-left-width'
					  ;
					});
					borderProps = border.map(function(o) { return o.property; });
					
					if (
						borderProps.indexOf('border-top') != -1 
						&& borderProps.indexOf('border-right') != -1 
						&& borderProps.indexOf('border-bottom') != -1 
						&& borderProps.indexOf('border-left') != -1 
					) {

						if (OPTIONS.verbose) { console.log(success('Process - Values - Border : ' + (rules[i].selectors ? rules[i].selectors.join(', ') : ''))); }
						
						borderHasInherit = false;
						borderValues = border.map(function(o) { 
							if (o.value.toLowerCase().indexOf('inherit') != -1) {
								borderHasInherit = true;
							}
							return o.value; 
						});
						
						if (borderHasInherit == false) {

							borderPropsOutput = ['border-width', 'border-style', 'border-color'];
							borderValuesOutput = [
								(borderValues[borderProps.indexOf('border-width')]?borderValues[borderProps.indexOf('border-width')]:''), 
								(borderValues[borderProps.indexOf('border-style')]?borderValues[borderProps.indexOf('border-style')]:''), 
								(borderValues[borderProps.indexOf('border-color')]?borderValues[borderProps.indexOf('border-color')]:''), 
							];



							if (
								borderValues[0] == borderValues[1]
								&& borderValues[0] == borderValues[2]
								&& borderValues[0] == borderValues[3]
							) {



								borderTmp = borderValues[0];

								if (borderProps.indexOf('border-width') == -1) {
									borderValuesOutput[0] = getValueOfTriProp(borderTmp, 'width');
								} else {
									borderValuesOutput[0] = borderValues[borderProps.indexOf('border-width')];
								}
								if (borderProps.indexOf('border-style') == -1) {
									borderValuesOutput[1] = getValueOfTriProp(borderTmp, 'style');
								} else {
									borderValuesOutput[1] = borderValues[borderProps.indexOf('border-style')];
								}
								if (borderProps.indexOf('border-color') == -1) {
									borderValuesOutput[2] = getValueOfTriProp(borderTmp, 'color');
								} else {
									borderValuesOutput[2] = borderValues[borderProps.indexOf('border-color')];
								}

								if (
									borderValuesOutput[0] == ''
									&& borderValuesOutput[1] == ''
									&& borderValuesOutput[2] == ''
								) {

								} else {

									borderProps = borderPropsOutput;
									borderValues = borderValuesOutput;
								}


								//check for !important
								borderHasImportant = false;
								for (k = 0, klen = borderValues.length; k < klen; ++k) {

									borderValues[k] = borderValues[k].toString().replace(/(!important)/g, function(capture){
										borderHasImportant = true;
										return '';
									});
								}

								if (borderHasImportant) {
										borderValues[borderValues.length-1] += ' !important';
								}

								//remove any spaces from empty values
								borderValues = borderValues.filter(Boolean);

								//add declaration
								borderTmpIdx = rules[i].declarations.length;
								for (j = 0; j < borderTmpIdx; ++j) {
									
									switch(rules[i].declarations[j].property) {
										case 'border-top': 
										case 'border-right': 
										case 'border-bottom': 
										case 'border-left': 
											borderIndex = j;
											if (borderIndex < borderTmpIdx && borderIndex != -1) { borderTmpIdx = borderIndex; }
											break;
									}
								}

								rules[i].declarations.splice(borderTmpIdx, 0, {
									type: 'declaration',
									property: 'border',
									value: borderValues.join(' ')
								})
								
								dCount+=1;

								borderIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('border-top');
								if (borderIndex != -1) { rules[i].declarations.splice(borderIndex, 1); dCount-=1;	}
								borderIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('border-right');
								if (borderIndex != -1) { rules[i].declarations.splice(borderIndex, 1); dCount-=1;	}
								borderIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('border-bottom');
								if (borderIndex != -1) { rules[i].declarations.splice(borderIndex, 1); dCount-=1;	}
								borderIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('border-left');
								if (borderIndex != -1) { rules[i].declarations.splice(borderIndex, 1); dCount-=1;	}
								
							}
						} //end of inherit check
					} //end of combining




					border = rules[i].declarations.filter(function( obj ) {
					  return obj.property == 'border'
					  || obj.property == 'border-width' 
					  		|| obj.property == 'border-style'
					  		|| obj.property == 'border-color'
					  		
					  ;
					});

					borderProps = border.map(function(o) { return o.property; });
					if (
						(borderProps.indexOf('border-width') != -1 
						&& borderProps.indexOf('border-style') != -1 
						&& borderProps.indexOf('border-color') != -1 )
						|| borderProps.indexOf('border') != -1
					) {
						borderValues = border.map(function(o) { return o.value; });

						borderHasInherit = false;
						borderValues = border.map(function(o) { 
							if (o.value.toLowerCase().indexOf('inherit') != -1) {
								borderHasInherit = true;
							}
							return o.value; 
						});
						
						if (borderHasInherit == false) {

							borderPropsOutput = ['border-width', 'border-style', 'border-color'];
							borderValuesOutput = [
								(borderValues[borderProps.indexOf('border-width')]?borderValues[borderProps.indexOf('border-width')]:''), 
								(borderValues[borderProps.indexOf('border-style')]?borderValues[borderProps.indexOf('border-style')]:''), 
								(borderValues[borderProps.indexOf('border-color')]?borderValues[borderProps.indexOf('border-color')]:''), 
							];

							//existing border check
							borderTmpIdx = borderProps.indexOf('border')
							if (borderTmpIdx != -1) {
								borderTmp = borderValues[borderTmpIdx];

								if (borderTmp != 'none') {
									//fill missing attribute with existing border
									if (borderProps.indexOf('border-width') > borderTmpIdx) {
										borderValuesOutput[0] = borderValues[borderProps.indexOf('border-width')];
									} else {
										borderValuesOutput[0] = (borderTmp2 = getValueOfTriProp(borderTmp, 'width')) ? borderTmp2 : borderValuesOutput[0];
									}
									if (borderProps.indexOf('border-style') > borderTmpIdx) {
										borderValuesOutput[1] = borderValues[borderProps.indexOf('border-style')];
									} else {
										borderValuesOutput[1] = (borderTmp2 = getValueOfTriProp(borderTmp, 'style')) ? borderTmp2 : borderValuesOutput[1];
									}
									if (borderProps.indexOf('border-color') > borderTmpIdx) {
										borderValuesOutput[2] = borderValues[borderProps.indexOf('border-color')];
									} else {
										borderValuesOutput[2] = (borderTmp2 = getValueOfTriProp(borderTmp, 'color')) ? borderTmp2 : borderValuesOutput[2];

									}

								} else {
									borderValuesOutput[0] = '0';
									borderValuesOutput[1] = '';
									borderValuesOutput[2] = '';
								}
							}

							if (
								borderValuesOutput[0] == ''
								&& borderValuesOutput[1] == ''
								&& borderValuesOutput[2] == ''
							) {

							} else {

								borderProps = borderPropsOutput;
								borderValues = borderValuesOutput;
							}

								// console.log(borderProps)
								// console.log(borderValues)

							//check for !important
							borderHasImportant = false;
							for (k = 0, klen = borderValues.length; k < klen; ++k) {

								borderValues[k] = borderValues[k].toString().replace(/(!important)/g, function(capture){
									borderHasImportant = true;
									return '';
								});
							}

							if (borderHasImportant) {
									borderValues[borderValues.length-1] += ' !important';
							}

							//remove any spaces from empty values
							borderValues = borderValues.filter(Boolean);

							//add declaration
							borderTmpIdx = rules[i].declarations.length;
							for (j = 0; j < borderTmpIdx; ++j) {
								
								switch(rules[i].declarations[j].property) {
									case 'border-width': 
									case 'border-style': 
									case 'border-color': 
									case 'border': 
										borderIndex = j;
										if (borderIndex < borderTmpIdx && borderIndex != -1) { borderTmpIdx = borderIndex; }
										break;
								}
							}
							rules[i].declarations.splice(borderTmpIdx, 0, {
								type: 'declaration',
								property: 'border',
								value: borderValues.join(' ')
							})

							dCount+=1;
				    	summary.stats.summary.noBordersShortened += 1;

							borderIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('border-width');
							if (borderIndex != -1) { rules[i].declarations.splice(borderIndex, 1); dCount-=1;	}
							borderIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('border-style');
							if (borderIndex != -1) { rules[i].declarations.splice(borderIndex, 1); dCount-=1;	}
							borderIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('border-color');
							if (borderIndex != -1) { rules[i].declarations.splice(borderIndex, 1); dCount-=1;	}

							//remove existing borders
							border = rules[i].declarations.filter(function( obj ) { return obj.property });
							borderProps = border.map(function(o) { return o.property; });
							noPreviousBorders = borderProps.filter(function(value){ return value === 'border'; }).length - 1;
							if (noPreviousBorders > 0) {
								for (j = 0; j < noPreviousBorders; ++j) {
									borderTmpIdx = borderProps.indexOf('border',(borderProps.indexOf('border')+1));
									rules[i].declarations.splice(borderTmpIdx, 1); 
									dCount-=1;	
								}
							}
						} //end of inherit check
					}
				} //end of border








				//borderRadius
				if (OPTIONS.shorten_border_radius || OPTIONS.shorten) {
					borderRadius = rules[i].declarations.filter(function( obj ) {
					  return obj.property == 'border-top-left-radius' 
					  		|| obj.property == 'border-top-right-radius'
					  		|| obj.property == 'border-bottom-left-radius'
					  		|| obj.property == 'border-bottom-right-radius'
					  		|| obj.property == 'border-radius'
					  ;
					});
					borderRadiusProps = borderRadius.map(function(o) { return o.property; });
					if (
						(borderRadiusProps.indexOf('border-top-left-radius') != -1 
						&& borderRadiusProps.indexOf('border-top-right-radius') != -1
						&& borderRadiusProps.indexOf('border-bottom-left-radius') != -1
						&& borderRadiusProps.indexOf('border-bottom-right-radius') != -1)
						|| borderRadiusProps.indexOf('border-radius') != -1
					) {

						if (OPTIONS.verbose) { console.log(success('Process - Values - Border Radius : ' + (rules[i].selectors ? rules[i].selectors.join(', ') : ''))); }
						
						borderRadiusHasInherit = false;
						borderRadiusValues = borderRadius.map(function(o) { 
							if (o.value.toLowerCase().indexOf('inherit') != -1) {
								borderRadiusHasInherit = true;
							}
							return o.value; 
						});
						
						if (borderRadiusHasInherit == false) {

							borderRadiusValues = borderRadius.map(function(o) { return o.value; });
							borderRadiusPropsOutput = ['border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius'];
							borderRadiusValuesOutput = [
								(borderRadiusValues[borderRadiusProps.indexOf('border-top-left-radius')]?borderRadiusValues[borderRadiusProps.indexOf('border-top-left-radius')]:''), 
								(borderRadiusValues[borderRadiusProps.indexOf('border-top-right-radius')]?borderRadiusValues[borderRadiusProps.indexOf('border-top-right-radius')]:''), 
								(borderRadiusValues[borderRadiusProps.indexOf('border-bottom-left-radius')]?borderRadiusValues[borderRadiusProps.indexOf('border-bottom-left-radius')]:''), 
								(borderRadiusValues[borderRadiusProps.indexOf('border-bottom-right-radius')]?borderRadiusValues[borderRadiusProps.indexOf('border-bottom-right-radius')]:''), 
							];
							
							//existing borderRadius check
							borderRadiusTmpIdx = borderRadiusProps.indexOf('border-radius')
							if (borderRadiusTmpIdx != -1) {
								borderRadiusTmp = borderRadiusValues[borderRadiusTmpIdx];

								//fill missing attribute with existing borderRadius
								if (borderRadiusProps.indexOf('border-top-left-radius') > borderRadiusTmpIdx) {
									borderRadiusValuesOutput[0] = borderRadiusValues[borderRadiusProps.indexOf('border-top-left-radius')];
								} else {
									borderRadiusValuesOutput[0] = (borderRadiusTmp2 = getValueOfSquareProp(borderRadiusTmp, 'top')) ? borderRadiusTmp2 : borderRadiusValuesOutput[0];
								}
								if (borderRadiusProps.indexOf('border-top-right-radius') > borderRadiusTmpIdx) {
									borderRadiusValuesOutput[1] = borderRadiusValues[borderRadiusProps.indexOf('border-top-right-radius')];
								} else {
									borderRadiusValuesOutput[1] = (borderRadiusTmp2 = getValueOfSquareProp(borderRadiusTmp, 'right')) ? borderRadiusTmp2 : borderRadiusValuesOutput[1];
								}
								if (borderRadiusProps.indexOf('border-bottom-left-radius') > borderRadiusTmpIdx) {
									borderRadiusValuesOutput[2] = borderRadiusValues[borderRadiusProps.indexOf('border-bottom-left-radius')];
								} else {
									borderRadiusValuesOutput[2] = (borderRadiusTmp2 = getValueOfSquareProp(borderRadiusTmp, 'bottom')) ? borderRadiusTmp2 : borderRadiusValuesOutput[2];
								}
								if (borderRadiusProps.indexOf('border-bottom-right-radius') > borderRadiusTmpIdx) {
									borderRadiusValuesOutput[3] = borderRadiusValues[borderRadiusProps.indexOf('border-bottom-right-radius')];
								} else {
									borderRadiusValuesOutput[3] = (borderRadiusTmp2 = getValueOfSquareProp(borderRadiusTmp, 'left')) ? borderRadiusTmp2 : borderRadiusValuesOutput[3];
								}

							}

							borderRadiusProps = borderRadiusPropsOutput;
							borderRadiusValues = borderRadiusValuesOutput;


							//check for requirements
							borderRadiusLeftIdx = borderRadiusProps.indexOf('border-bottom-right-radius');
							borderRadiusRightIdx = borderRadiusProps.indexOf('border-top-right-radius');
							borderRadiusTopIdx = borderRadiusProps.indexOf('border-top-left-radius');
							borderRadiusBottomIdx = borderRadiusProps.indexOf('border-bottom-left-radius');

							//apply rules
							//1 value
							if (
								borderRadiusTopIdx != -1 && borderRadiusBottomIdx != -1
								&& borderRadiusLeftIdx != -1 && borderRadiusRightIdx != -1
								&& borderRadiusValues[borderRadiusTopIdx] == borderRadiusValues[borderRadiusBottomIdx]
								&& borderRadiusValues[borderRadiusTopIdx] == borderRadiusValues[borderRadiusRightIdx]
								&& borderRadiusValues[borderRadiusTopIdx] == borderRadiusValues[borderRadiusLeftIdx]
							) {
								borderRadiusProps = ['border-radius'];
								borderRadiusValues = [borderRadiusValues[borderRadiusTopIdx]];

								borderRadiusSingleMerge = true;

							} else if ( //2
								borderRadiusTopIdx != -1 && borderRadiusBottomIdx != -1
								&& borderRadiusLeftIdx != -1 && borderRadiusRightIdx != -1
								&& borderRadiusValues[borderRadiusTopIdx] == borderRadiusValues[borderRadiusBottomIdx]
								&& borderRadiusValues[borderRadiusLeftIdx] == borderRadiusValues[borderRadiusRightIdx]
							) {
								borderRadiusTopBottomVal = borderRadiusValues[borderRadiusTopIdx];
								//remove Top + Bottom values
								borderRadiusValues.splice(borderRadiusTopIdx, 1);
								borderRadiusValues.splice(borderRadiusBottomIdx-1, 1);
								//add TopBottom value
								borderRadiusValues.splice(0,0,borderRadiusTopBottomVal);
								
								//remove Top + Bottom properties
								borderRadiusProps.splice(borderRadiusTopIdx, 1);
								borderRadiusProps.splice(borderRadiusBottomIdx-1, 1);
								//add TopBottom property - for alignment sake
								borderRadiusProps.splice(0,0,'border-radius-top-bottom');


								borderRadiusRightLeftVal = borderRadiusValues[borderRadiusRightIdx];
								//remove Right + Left values
								borderRadiusValues.splice(borderRadiusRightIdx, 1);
								borderRadiusValues.splice(borderRadiusLeftIdx-2, 1);
								//add RightLeft value
								borderRadiusValues.splice(1,0,borderRadiusRightLeftVal);
								
								//remove Right + Left properties
								borderRadiusProps.splice(borderRadiusRightIdx, 1);
								borderRadiusProps.splice(borderRadiusLeftIdx-2, 1);
								//add RightLeft property - for alignment sake
								borderRadiusProps.splice(1,0,'border-radius-right-left');


							} else if (	//3 values
								borderRadiusLeftIdx != -1 && borderRadiusRightIdx != -1
								&& borderRadiusTopIdx != -1 && borderRadiusBottomIdx != -1
								&& borderRadiusValues[borderRadiusLeftIdx] == borderRadiusValues[borderRadiusRightIdx]
							) {
								borderRadiusRightLeftVal = borderRadiusValues[borderRadiusRightIdx];

								//remove right + left values
								borderRadiusValues.splice(borderRadiusRightIdx, 1);
								borderRadiusValues.splice(borderRadiusLeftIdx-1, 1);
								//add rightleft value
								borderRadiusValues.splice(1,0,borderRadiusRightLeftVal);

								//remove right + left properties
								borderRadiusProps.splice(borderRadiusRightIdx, 1);
								borderRadiusProps.splice(borderRadiusLeftIdx-1, 1);
								//add rightleft property - for alignment sake
								borderRadiusProps.splice(1,0,'border-radius-left-right');
							}

							//check for !important
							borderRadiusHasImportant = false;
							for (k = 0, klen = borderRadiusValues.length; k < klen; ++k) {

								borderRadiusValues[k] = borderRadiusValues[k].toString().replace(/(!important)/g, function(capture){
									borderRadiusHasImportant = true;
									return '';
								});
							}

							if (borderRadiusHasImportant) {
									borderRadiusValues[borderRadiusValues.length-1] += ' !important';
							}

							//remove any spaces from empty values
							borderRadiusValues = borderRadiusValues.filter(Boolean);

							//add declaration
							borderRadiusTmpIdx = rules[i].declarations.length;
							for (j = 0; j < borderRadiusTmpIdx; ++j) {
								
								switch(rules[i].declarations[j].property) {
									case 'border-top-left-radius': 
									case 'border-top-right-radius': 
									case 'border-bottom-left-radius': 
									case 'border-bottom-right-radius': 
									case 'border-radius': 
										borderRadiusIndex = j;
										if (borderRadiusIndex < borderRadiusTmpIdx && borderRadiusIndex != -1) { borderRadiusTmpIdx = borderRadiusIndex; }
										break;
								}
							}
							rules[i].declarations.splice(borderRadiusTmpIdx, 0, {
								type: 'declaration',
								property: 'border-radius',
								value: borderRadiusValues.join(' ')
							})
							dCount+=1;
				    	summary.stats.summary.noPaddingsShortened += 1;

				    	//remove originals
							borderRadiusIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('border-top-left-radius');
							if (borderRadiusIndex != -1) { rules[i].declarations.splice(borderRadiusIndex, 1); dCount-=1;	}
							borderRadiusIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('border-top-right-radius');
							if (borderRadiusIndex != -1) { rules[i].declarations.splice(borderRadiusIndex, 1); dCount-=1;	}
							borderRadiusIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('border-bottom-left-radius');
							if (borderRadiusIndex != -1) { rules[i].declarations.splice(borderRadiusIndex, 1); dCount-=1;	}
							borderRadiusIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('border-bottom-right-radius');
							if (borderRadiusIndex != -1) { rules[i].declarations.splice(borderRadiusIndex, 1); dCount-=1;	}
							
							//remove existing borderRadiuss
							borderRadius = rules[i].declarations.filter(function( obj ) { return obj.property });
							borderRadiusProps = borderRadius.map(function(o) { return o.property; });
							noPreviousBorderRadius = borderRadiusProps.filter(function(value){ return value === 'border-radius'; }).length - 1;
							if (noPreviousBorderRadius > 0) {
								for (j = 0; j < noPreviousBorderRadius; ++j) {
									borderRadiusTmpIdx = borderRadiusProps.indexOf('border-radius',(borderRadiusProps.indexOf('border-radius')+1));
									rules[i].declarations.splice(borderRadiusTmpIdx, 1); 
									dCount-=1;	
								}
							}
						} //end of inherit check
					} 
				} //end of borderRadius








				


				//margin
				if (OPTIONS.shorten_margin || OPTIONS.shorten) {
					margin = rules[i].declarations.filter(function( obj ) {
					  return obj.property == 'margin-top' 
					  		|| obj.property == 'margin-right'
					  		|| obj.property == 'margin-bottom'
					  		|| obj.property == 'margin-left'
					  		|| obj.property == 'margin'
					  ;
					});

					//special - convert rem
					// if (OPTIONS.special_convert_rem && OPTIONS.special_convert_rem_margin) {

						// //for singular declaration
						// for (j = 0; j < dCount; ++j) {

						// 	if (rules[i].declarations !== undefined && rules[i].declarations[j].property == 'margin') {

						// 		marginTmpVal = rules[i].declarations[j].value.toLowerCase();

						// 		if (marginTmpVal.indexOf('px') != -1) {
						// 			marginTmpVal = marginTmpVal.substr(0, marginTmpVal.length-2)/OPTIONS.special_convert_rem_desired_html_px + 'rem';
						// 		}

						// 		rules[i].declarations[j] = {
						// 			'type': rules[i].declarations[j].type,
						// 			'property': rules[i].declarations[j].property,
						// 			'value': marginTmpVal,
						// 			'position': rules[i].declarations[j].position
						// 		};
						// 	}
						// }

						// //for combined declaration
						// if ((fontIndex = font.map(function(o) { return o.property; }).indexOf('font-size')) != -1) {
							
						// 	marginTmpVal = font[fontIndex].value.toLowerCase();

						// 	if (marginTmpVal.indexOf('px') != -1) {
						// 		marginTmpVal = marginTmpVal.substr(0, marginTmpVal.length-2)/OPTIONS.special_convert_rem_desired_html_px + 'rem';
						// 	}

						// 	font[fontIndex] = {
						// 		'type': font[fontIndex].type,
						// 		'property': font[fontIndex].property,
						// 		'value': marginTmpVal,
						// 		'position': font[fontIndex].position
						// 	};
						// }
					// }


					marginProps = margin.map(function(o) { return o.property; });
					if (
						(marginProps.indexOf('margin-top') != -1 
						&& marginProps.indexOf('margin-right') != -1
						&& marginProps.indexOf('margin-bottom') != -1
						&& marginProps.indexOf('margin-left') != -1)
						|| marginProps.indexOf('margin') != -1
					) {
						if (OPTIONS.verbose) { console.log(success('Process - Values - Margin : ' + (rules[i].selectors ? rules[i].selectors.join(', ') : ''))); }
						
						marginHasInherit = false;
						marginValues = margin.map(function(o) { 
							if (o.value.toLowerCase().indexOf('inherit') != -1) {
								marginHasInherit = true;
							}
							return o.value; 
						});
						
						if (marginHasInherit == false) {

							marginPropsOutput = ['margin-top', 'margin-right', 'margin-bottom', 'margin-left'];
							marginValuesOutput = [
								(marginValues[marginProps.indexOf('margin-top')]?marginValues[marginProps.indexOf('margin-top')]:''), 
								(marginValues[marginProps.indexOf('margin-right')]?marginValues[marginProps.indexOf('margin-right')]:''), 
								(marginValues[marginProps.indexOf('margin-bottom')]?marginValues[marginProps.indexOf('margin-bottom')]:''), 
								(marginValues[marginProps.indexOf('margin-left')]?marginValues[marginProps.indexOf('margin-left')]:''), 
							];

							//existing margin check
							marginTmpIdx = marginProps.indexOf('margin')
							if (marginTmpIdx != -1) {
								marginTmp = marginValues[marginTmpIdx];

								//fill missing attribute with existing margin
								if (marginProps.indexOf('margin-top') > marginTmpIdx) {
									marginValuesOutput[0] = marginValues[marginProps.indexOf('margin-top')];
								} else {
									marginValuesOutput[0] = getValueOfSquareProp(marginTmp, 'top');
								}
								if (marginProps.indexOf('margin-right') > marginTmpIdx) {
									marginValuesOutput[1] = marginValues[marginProps.indexOf('margin-right')];
								} else {
									marginValuesOutput[1] = getValueOfSquareProp(marginTmp, 'right');
								}
								if (marginProps.indexOf('margin-bottom') > marginTmpIdx) {
									marginValuesOutput[2] = marginValues[marginProps.indexOf('margin-bottom')];
								} else {
									marginValuesOutput[2] = getValueOfSquareProp(marginTmp, 'bottom');
								}
								if (marginProps.indexOf('margin-left') > marginTmpIdx) {
									marginValuesOutput[3] = marginValues[marginProps.indexOf('margin-left')];
								} else {
									marginValuesOutput[3] = getValueOfSquareProp(marginTmp, 'left');
								}
							}

							if (
								marginValuesOutput[0] == ''
								&& marginValuesOutput[1] == ''
								&& marginValuesOutput[2] == ''
								&& marginValuesOutput[3] == ''
							) {

							} else {

								marginProps = marginPropsOutput;
								marginValues = marginValuesOutput;
							}
							// console.log(marginProps)
							// console.log(marginValues)

							//check for !important
							marginHasImportant = false;
							for (k = 0, klen = marginValues.length; k < klen; ++k) {

								marginValues[k] = marginValues[k].toString().replace(/(!important)/g, function(capture){
									marginHasImportant = true;
									return '';
								});
							}

							if (marginHasImportant) {
									marginValues[marginValues.length-1] += ' !important';
							}

							//check for requirements
							marginLeftIdx = marginProps.indexOf('margin-left');
							marginRightIdx = marginProps.indexOf('margin-right');
							marginTopIdx = marginProps.indexOf('margin-top');
							marginBottomIdx = marginProps.indexOf('margin-bottom');

							//apply rules
							//1 value
							if (
								marginTopIdx != -1 && marginBottomIdx != -1
								&& marginLeftIdx != -1 && marginRightIdx != -1
								&& marginValues[marginTopIdx] == marginValues[marginBottomIdx]
								&& marginValues[marginTopIdx] == marginValues[marginRightIdx]
								&& marginValues[marginTopIdx] == marginValues[marginLeftIdx]
							) {
								marginProps = ['margin'];
								marginValues = [marginValues[marginTopIdx]];

							} else if ( //2
								marginTopIdx != -1 && marginBottomIdx != -1
								&& marginLeftIdx != -1 && marginRightIdx != -1
								&& marginValues[marginTopIdx] == marginValues[marginBottomIdx]
								&& marginValues[marginLeftIdx] == marginValues[marginRightIdx]
							) {
								marginTopBottomVal = marginValues[marginTopIdx];
								//remove Top + Bottom values
								marginValues.splice(marginTopIdx, 1);
								marginValues.splice(marginBottomIdx-1, 1);
								//add TopBottom value
								marginValues.splice(0,0,marginTopBottomVal);
								
								//remove Top + Bottom properties
								marginProps.splice(marginTopIdx, 1);
								marginProps.splice(marginBottomIdx-1, 1);
								//add TopBottom property - for alignment sake
								marginProps.splice(0,0,'marginTopBottom');


								marginRightLeftVal = marginValues[marginRightIdx];
								//remove Right + Left values
								marginValues.splice(marginRightIdx, 1);
								marginValues.splice(marginLeftIdx-2, 1);
								//add RightLeft value
								marginValues.splice(1,0,marginRightLeftVal);
								
								//remove Right + Left properties
								marginProps.splice(marginRightIdx, 1);
								marginProps.splice(marginLeftIdx-2, 1);
								//add RightLeft property - for alignment sake
								marginProps.splice(1,0,'marginRightLeft');


							} else if (	//3 values
								marginLeftIdx != -1 && marginRightIdx != -1
								&& marginTopIdx != -1 && marginBottomIdx != -1
								&& marginValues[marginLeftIdx] == marginValues[marginRightIdx]
							) {
								marginRightLeftVal = marginValues[marginRightIdx];

								//remove right + left values
								marginValues.splice(marginRightIdx, 1);
								marginValues.splice(marginLeftIdx-1, 1);
								//add rightleft value
								marginValues.splice(1,0,marginRightLeftVal);

								//remove right + left properties
								marginProps.splice(marginRightIdx, 1);
								marginProps.splice(marginLeftIdx-1, 1);
								//add rightleft property - for alignment sake
								marginProps.splice(1,0,'marginLeftRight');
							}

							// console.log(marginProps)
							// console.log(marginValues)
							//remove any spaces from empty values
							marginValues = marginValues.filter(Boolean);

							//add declaration
							marginTmpIdx = rules[i].declarations.length;
							for (j = 0; j < marginTmpIdx; ++j) {
								switch(rules[i].declarations[j].property) {
									case 'margin-top': 
									case 'margin-right': 
									case 'margin-bottom': 
									case 'margin-left': 
									case 'margin': 
										marginIndex = j;
										if (marginIndex < marginTmpIdx && marginIndex != -1) { marginTmpIdx = marginIndex; }
										break;
								}
							}
							rules[i].declarations.splice(marginTmpIdx, 0, {
								type: 'declaration',
								property: 'margin',
								value: marginValues.join(' ')
							})
							dCount+=1;
				    	summary.stats.summary.noMarginsShortened += 1;

				    	//remove originals
							marginIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('margin-top');
							if (marginIndex != -1) { rules[i].declarations.splice(marginIndex, 1); dCount-=1;	}
							marginIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('margin-right');
							if (marginIndex != -1) { rules[i].declarations.splice(marginIndex, 1); dCount-=1;	}
							marginIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('margin-bottom');
							if (marginIndex != -1) { rules[i].declarations.splice(marginIndex, 1); dCount-=1;	}
							marginIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('margin-left');
							if (marginIndex != -1) { rules[i].declarations.splice(marginIndex, 1); dCount-=1;	}

							//remove existing margins
							margin = rules[i].declarations.filter(function( obj ) { return obj.property });
							marginProps = margin.map(function(o) { return o.property; });
							noPreviousMargins = marginProps.filter(function(value){ return value === 'margin'; }).length;
							
							if (noPreviousMargins > 1) {
								for (j = 1; j < noPreviousMargins; ++j) {
									marginTmpIdx = marginProps.indexOf('margin',(marginProps.indexOf('margin')+1));
									
									rules[i].declarations.splice(marginTmpIdx, 1); 
									dCount-=1;	
								}
							}
						} //end of inherit check
					} 
				} //end of margin
				


				//padding
				if (OPTIONS.shorten_padding || OPTIONS.shorten) {
					padding = rules[i].declarations.filter(function( obj ) {
					  return obj.property == 'padding-top' 
					  		|| obj.property == 'padding-right'
					  		|| obj.property == 'padding-bottom'
					  		|| obj.property == 'padding-left'
					  		|| obj.property == 'padding'
					  ;
					});
					paddingProps = padding.map(function(o) { return o.property; });
					if (
						(paddingProps.indexOf('padding-top') != -1 
						&& paddingProps.indexOf('padding-right') != -1
						&& paddingProps.indexOf('padding-bottom') != -1
						&& paddingProps.indexOf('padding-left') != -1)
						|| paddingProps.indexOf('padding') != -1
					) {

						if (OPTIONS.verbose) { console.log(success('Process - Values - Padding : ' + (rules[i].selectors ? rules[i].selectors.join(', ') : ''))); }
						
						paddingHasInherit = false;
						paddingValues = padding.map(function(o) { 
							if (o.value.toLowerCase().indexOf('inherit') != -1) {
								paddingHasInherit = true;
							}
							return o.value; 
						});
						
						if (paddingHasInherit == false) {

							paddingPropsOutput = ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'];
							paddingValuesOutput = [
								(paddingValues[paddingProps.indexOf('padding-top')]?paddingValues[paddingProps.indexOf('padding-top')]:''), 
								(paddingValues[paddingProps.indexOf('padding-right')]?paddingValues[paddingProps.indexOf('padding-right')]:''), 
								(paddingValues[paddingProps.indexOf('padding-bottom')]?paddingValues[paddingProps.indexOf('padding-bottom')]:''), 
								(paddingValues[paddingProps.indexOf('padding-left')]?paddingValues[paddingProps.indexOf('padding-left')]:''), 
							];
							
							//existing padding check
							paddingTmpIdx = paddingProps.indexOf('padding')
							if (paddingTmpIdx != -1) {
								paddingTmp = paddingValues[paddingTmpIdx];

								//fill missing attribute with existing padding
								if (paddingProps.indexOf('padding-top') > paddingTmpIdx) {
									paddingValuesOutput[0] = paddingValues[paddingProps.indexOf('padding-top')];
								} else {
									paddingValuesOutput[0] = (paddingTmp2 = getValueOfSquareProp(paddingTmp, 'top')) ? paddingTmp2 : paddingValuesOutput[0];
								}
								if (paddingProps.indexOf('padding-right') > paddingTmpIdx) {
									paddingValuesOutput[1] = paddingValues[paddingProps.indexOf('padding-right')];
								} else {
									paddingValuesOutput[1] = (paddingTmp2 = getValueOfSquareProp(paddingTmp, 'right')) ? paddingTmp2 : paddingValuesOutput[1];
								}
								if (paddingProps.indexOf('padding-bottom') > paddingTmpIdx) {
									paddingValuesOutput[2] = paddingValues[paddingProps.indexOf('padding-bottom')];
								} else {
									paddingValuesOutput[2] = (paddingTmp2 = getValueOfSquareProp(paddingTmp, 'bottom')) ? paddingTmp2 : paddingValuesOutput[2];
								}
								if (paddingProps.indexOf('padding-left') > paddingTmpIdx) {
									paddingValuesOutput[3] = paddingValues[paddingProps.indexOf('padding-left')];
								} else {
									paddingValuesOutput[3] = (paddingTmp2 = getValueOfSquareProp(paddingTmp, 'left')) ? paddingTmp2 : paddingValuesOutput[3];
								}

								//fill property above padding
								// for (j = 0; j < paddingTmpIdx; ++j) {

								// 	switch(paddingProps[j]) {
								// 		case 'padding-top':
								// 			paddingValuesOutput[0] = getValueOfSquareProp(paddingTmp, 'top');
								// 			break;
								// 		case 'padding-right':
								// 			paddingValuesOutput[1] = getValueOfSquareProp(paddingTmp, 'right');
								// 			break;
								// 		case 'padding-bottom':
								// 			paddingValuesOutput[2] = getValueOfSquareProp(paddingTmp, 'bottom');
								// 			break;
								// 		case 'padding-left':
								// 			paddingValuesOutput[3] = getValueOfSquareProp(paddingTmp, 'left');
								// 			break;
								// 	}
								// }
							}

							if (
								paddingValuesOutput[0] == ''
								&& paddingValuesOutput[1] == ''
								&& paddingValuesOutput[2] == ''
								&& paddingValuesOutput[3] == ''
							) {

							} else {

								paddingProps = paddingPropsOutput;
								paddingValues = paddingValuesOutput;
							}

							//check for !important
							paddingHasImportant = false;
							for (k = 0, klen = paddingValues.length; k < klen; ++k) {

								paddingValues[k] = paddingValues[k].toString().replace(/(!important)/g, function(capture){
									paddingHasImportant = true;
									return '';
								});
							}

							if (paddingHasImportant) {
									paddingValues[paddingValues.length-1] += ' !important';
							}

							//check for requirements
							paddingLeftIdx = paddingProps.indexOf('padding-left');
							paddingRightIdx = paddingProps.indexOf('padding-right');
							paddingTopIdx = paddingProps.indexOf('padding-top');
							paddingBottomIdx = paddingProps.indexOf('padding-bottom');

							//apply rules
							//1 value
							if (
								paddingTopIdx != -1 && paddingBottomIdx != -1
								&& paddingLeftIdx != -1 && paddingRightIdx != -1
								&& paddingValues[paddingTopIdx] == paddingValues[paddingBottomIdx]
								&& paddingValues[paddingTopIdx] == paddingValues[paddingRightIdx]
								&& paddingValues[paddingTopIdx] == paddingValues[paddingLeftIdx]
							) {
								paddingProps = ['padding'];
								paddingValues = [paddingValues[paddingTopIdx]];

								paddingSingleMerge = true;

							} else if ( //2
								paddingTopIdx != -1 && paddingBottomIdx != -1
								&& paddingLeftIdx != -1 && paddingRightIdx != -1
								&& paddingValues[paddingTopIdx] == paddingValues[paddingBottomIdx]
								&& paddingValues[paddingLeftIdx] == paddingValues[paddingRightIdx]
							) {
								paddingTopBottomVal = paddingValues[paddingTopIdx];
								//remove Top + Bottom values
								paddingValues.splice(paddingTopIdx, 1);
								paddingValues.splice(paddingBottomIdx-1, 1);
								//add TopBottom value
								paddingValues.splice(0,0,paddingTopBottomVal);
								
								//remove Top + Bottom properties
								paddingProps.splice(paddingTopIdx, 1);
								paddingProps.splice(paddingBottomIdx-1, 1);
								//add TopBottom property - for alignment sake
								paddingProps.splice(0,0,'paddingTopBottom');


								paddingRightLeftVal = paddingValues[paddingRightIdx];
								//remove Right + Left values
								paddingValues.splice(paddingRightIdx, 1);
								paddingValues.splice(paddingLeftIdx-2, 1);
								//add RightLeft value
								paddingValues.splice(1,0,paddingRightLeftVal);
								
								//remove Right + Left properties
								paddingProps.splice(paddingRightIdx, 1);
								paddingProps.splice(paddingLeftIdx-2, 1);
								//add RightLeft property - for alignment sake
								paddingProps.splice(1,0,'paddingRightLeft');


							} else if (	//3 values
								paddingLeftIdx != -1 && paddingRightIdx != -1
								&& paddingTopIdx != -1 && paddingBottomIdx != -1
								&& paddingValues[paddingLeftIdx] == paddingValues[paddingRightIdx]
							) {
								paddingRightLeftVal = paddingValues[paddingRightIdx];

								//remove right + left values
								paddingValues.splice(paddingRightIdx, 1);
								paddingValues.splice(paddingLeftIdx-1, 1);
								//add rightleft value
								paddingValues.splice(1,0,paddingRightLeftVal);

								//remove right + left properties
								paddingProps.splice(paddingRightIdx, 1);
								paddingProps.splice(paddingLeftIdx-1, 1);
								//add rightleft property - for alignment sake
								paddingProps.splice(1,0,'paddingLeftRight');
							}


							//remove any spaces from empty values
							paddingValues = paddingValues.filter(Boolean);

							//add declaration
							paddingTmpIdx = rules[i].declarations.length;
							for (j = 0; j < paddingTmpIdx; ++j) {
								
								switch(rules[i].declarations[j].property) {
									case 'padding-top': 
									case 'padding-right': 
									case 'padding-bottom': 
									case 'padding-left': 
									case 'padding': 
										paddingIndex = j;
										if (paddingIndex < paddingTmpIdx && paddingIndex != -1) { paddingTmpIdx = paddingIndex; }
										break;
								}
							}
							rules[i].declarations.splice(paddingTmpIdx, 0, {
								type: 'declaration',
								property: 'padding',
								value: paddingValues.join(' ')
							})
							dCount+=1;
				    	summary.stats.summary.noPaddingsShortened += 1;

				    	//remove originals
							paddingIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('padding-top');
							if (paddingIndex != -1) { rules[i].declarations.splice(paddingIndex, 1); dCount-=1;	}
							paddingIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('padding-right');
							if (paddingIndex != -1) { rules[i].declarations.splice(paddingIndex, 1); dCount-=1;	}
							paddingIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('padding-bottom');
							if (paddingIndex != -1) { rules[i].declarations.splice(paddingIndex, 1); dCount-=1;	}
							paddingIndex = rules[i].declarations.map(function(e) { return e.property; }).indexOf('padding-left');
							if (paddingIndex != -1) { rules[i].declarations.splice(paddingIndex, 1); dCount-=1;	}
							
							//remove existing paddings
							padding = rules[i].declarations.filter(function( obj ) { return obj.property });
							paddingProps = padding.map(function(o) { return o.property; });
							noPreviousPaddings = paddingProps.filter(function(value){ return value === 'padding'; }).length;
							
							if (noPreviousPaddings > 1) {
								for (j = 1; j < noPreviousPaddings; ++j) {
									paddingTmpIdx = paddingProps.indexOf('padding',(paddingProps.indexOf('padding')+1));
									
									rules[i].declarations.splice(paddingTmpIdx, 1); 
									dCount-=1;	
								}
							}
						} //end of inherit check
					} 
				} //end of padding



				if (OPTIONS.shorten_zero || OPTIONS.shorten_hexcolor || OPTIONS.shorten) {

					//declarations
					for (l = 0; l < dCount; ++l) {
						
						//zero check
						if (
							(OPTIONS.shorten_zero || OPTIONS.shorten) 
							&& OPTIONS.zero_ignore_declaration.indexOf(rules[i].declarations[l].property) == -1
						) {
							tmpVal = rules[i].declarations[l].value;

							if (tmpVal !== undefined) {
								
								//leading zeros 000
								if (tmpVal.match(/[^#]\b0+[^1-9a-zA-Z.,;()\[\]\s\/\\!]/gm)) {
									tmpVal = tmpVal.replace(/\b0+[^1-9a-zA-Z.,;()\[\]\s\/\\!]/gm,''); //remove single duplicate 0
							    summary.stats.summary.noZerosShortened += 1;
									if (OPTIONS.verbose) { console.log(success('Process - Values - Zero : ' + (rules[i].selectors ? rules[i].selectors.join(', ') : ''))); }
								}
								
								//0px, 0em, etc.
								if (
									tmpVal.substr(0, 1) == '0'
									&& (OPTIONS.zero_units.indexOf(tmpVal.substr(1, tmpVal.length)) != -1)
								) {
									tmpVal = 0;

									if (OPTIONS.verbose) { console.log(success('Process - Values - Zero : ' + (rules[i].selectors ? rules[i].selectors.join(', ') : ''))); }
						    	summary.stats.summary.noZerosShortened += 1;
								}

								rules[i].declarations[l].value = tmpVal;
							}
						}


						//hex color
						/*
						applied to color, 
											 font, font-color,
											 background, background-color, 
											 border, border-color, 
											 outline-color, 
											 box-shadow, text-shadow
						*/
						if (OPTIONS.shorten_hexcolor || OPTIONS.shorten
							&& (
								rules[i].declarations[l].property == 'color'
								|| rules[i].declarations[l].property == 'font'
								|| rules[i].declarations[l].property == 'font-color'
								|| rules[i].declarations[l].property == 'background'
								|| rules[i].declarations[l].property == 'background-color'
								|| rules[i].declarations[l].property == 'outline-color'
								|| rules[i].declarations[l].property == 'box-shadow'
								|| rules[i].declarations[l].property == 'text-shadow'
								|| rules[i].declarations[l].property == 'border-color'
								|| rules[i].declarations[l].property == 'border-top-color'
								|| rules[i].declarations[l].property == 'border-right-color'
								|| rules[i].declarations[l].property == 'border-bottom-color'
								|| rules[i].declarations[l].property == 'border-left-color'
								|| rules[i].declarations[l].property == 'border'
								|| rules[i].declarations[l].property == 'border-top'
								|| rules[i].declarations[l].property == 'border-right'
								|| rules[i].declarations[l].property == 'border-bottom'
								|| rules[i].declarations[l].property == 'border-left'
							)
						) {
							tmpVal = ''+rules[i].declarations[l].value;
							if (tmpVal != 'undefined' && tmpVal.indexOf('Microsoft') == -1) {

								tmpVal = processColor(tmpVal, rules[i].selectors);
								rules[i].declarations[l].value = tmpVal;
								
							}
						} //end of options check

					} //end of loop declarations

				} //end of OPTIONS.shorten_zero || OPTIONS.shorten_hexcolor check

			} //end of undefined check

		} //end of loop rules

	}// end of processValues

	function processRules(rules) {


		if (rules !== undefined) {

			rCount = rules.length;

			for (i = 0; i < rCount; ++i) {

				////comments
				//checking declarations for comments
				if (rules[i] !== undefined && rules[i].declarations !== undefined) {
					declarations = rules[i].declarations;
					dCount = declarations.length;

					for (j = 0; j < dCount; ++j) {

						//check for empty properties
						if (rules[i].declarations[j].value == '') {
							summary.empty_declarations.push({
								'selectors': rules[i].selectors,
								'property': rules[i].declarations[j]
							});
						}

						//remove comments in declarations - for turning off comments
						if (OPTIONS.trim_comments || OPTIONS.trim) {
							if (declarations[j] !== undefined && declarations[j].type == 'comment') {
								if (OPTIONS.verbose) { console.log(info('Process - Rules - Remove Comment')); }
								rules[i].declarations.splice(j, 1);
								j-=1;
								dCount-=1;
							}
						}
					}
				}

				//remove comments in root - for turning off comments
				if (OPTIONS.trim_comments || OPTIONS.trim) {
					if (rules[i] !== undefined && rules[i].type == 'comment') {
						if (OPTIONS.verbose) { console.log(info('Process - Rules - Remove Comment')); }
						rules.splice(i, 1);
						i-=1;
						rCount-=1;
					}
				}
				////end of comments


				////rules
				//remove duplicate root rules
				for (j = i+1; j < rCount; ++j) {
					// console.log(j, rCount)
					//root rules
					//rule selector
					if (rules[i] !== undefined 
						// && rules[i].type == 'rule'
						&& rules[i].selectors !== undefined 
						&& rules[j] !== undefined && rules[j].selectors !== undefined) {

						//duplicate rule found
						if (rules[i].selectors.toString() == rules[j].selectors.toString()) {

							//remove previous comment in root
							if (OPTIONS.trim_removed_rules_previous_comment || OPTIONS.trim) {
								if (rules[i-1] !== undefined && rules[i-1].type == 'comment') {

									rules.splice(i-1, 1);
									i-=1;
									j-=1;
									rCount-=1;
								}
							}

							if (OPTIONS.verbose) { console.log(success('Process - Rules - Group Duplicate Rule : ' + (rules[j].selectors ? rules[j].selectors.join(', ') : '')));}

							//copy + reduce
							summary.duplicate_rules.push({
								'selectors': (rules[j].type == 'page') ? '@page' : rules[j].selectors,
								'position': rules[j].position
							});
							summary.stats.summary.noDuplicateRules += 1;
							rules[i].declarations = rules[i].declarations.concat(rules[j].declarations);
							rules.splice(j, 1);
							i-=1;
							j-=1;
							rCount-=1;
							

						}
					} //end of rule selector

					//media selector - it could affect evaluation sequence
					if (rules[i] !== undefined && rules[i].type == 'media' 
						&& rules[i].media !== undefined 
						&& rules[j] !== undefined && rules[j].media !== undefined
						&& OPTIONS.bypass_media_rules != true
					) {

						//duplicate rule found
						if (rules[i].media.toString() == rules[j].media.toString()) {

							//remove previous comment in root
							if (OPTIONS.trim_removed_rules_previous_comment || OPTIONS.trim) {
								if (rules[i-1] !== undefined && rules[i-1].type == 'comment') {

									rules.splice(i-1, 1);
									i-=1;
									j-=1;
									rCount-=1;
								}
							}

							if (OPTIONS.verbose) { console.log(info('Process - Rules - @media - Group Duplicate Rule : ' + (rules[j].selectors ? rules[j].selectors.join(', ') : ''))); }

							//copy + reduce
							summary.duplicate_rules.push({
								'selectors': '@media ' + rules[j].media,
								'position': rules[j].position
							});
							summary.stats.summary.noDuplicateRules += 1;
							rules[i].rules = rules[i].rules.concat(rules[j].rules);
							rules.splice(j, 1);
							i-=1;
							j-=1;
							rCount-=1;
						}
					} 
					//end of media selector

					//document selector
					if (rules[i] !== undefined && rules[i].type == 'document' 
						&& rules[i].document !== undefined 
						&& rules[j] !== undefined && rules[j].document !== undefined) {

						//duplicate rule found
						if (rules[i].document.toString() == rules[j].document.toString()) {

							//remove previous comment in root
							if (OPTIONS.trim_removed_rules_previous_comment || OPTIONS.trim) {
								if (rules[i-1] !== undefined && rules[i-1].type == 'comment') {

									rules.splice(i-1, 1);
									i-=1;
									j-=1;
									rCount-=1;
								}
							}

							if (OPTIONS.verbose) { console.log(success('Process - Rules - @document - Group Duplicate Rule : ' + (rules[j].selectors ? rules[j].selectors.join(', ') : ''))); }

							//copy + reduce
							summary.duplicate_rules.push({
								'selectors': '@document ' + rules[j].document,
								'position': rules[j].position
							});
							summary.stats.summary.noDuplicateRules += 1;
							rules[i].rules = rules[i].rules.concat(rules[j].rules);
							rules.splice(j, 1);
							i-=1;
							j-=1;
							rCount-=1;
							
						}
					} //end of document selector

					//supports selector
					if (rules[i] !== undefined && rules[i].type == 'supports' 
						&& rules[i].supports !== undefined 
						&& rules[j] !== undefined && rules[j].supports !== undefined) {

						//duplicate rule found
						if (rules[i].supports.toString() == rules[j].supports.toString()) {

							//remove previous comment in root
							if (OPTIONS.trim_removed_rules_previous_comment || OPTIONS.trim) {
								if (rules[i-1] !== undefined && rules[i-1].type == 'comment') {

									rules.splice(i-1, 1);
									i-=1;
									j-=1;
									rCount-=1;
								}
							}

							
							if (OPTIONS.verbose) { console.log(success('Process - Rules - @supports - Group Duplicate Rule : ' + (rules[j].supports ? rules[j].supports : ''))); }

							//copy + reduce
							summary.duplicate_rules.push({
								'selectors': '@supports ' + rules[j].supports,
								'position': rules[j].position
							});
							summary.stats.summary.noDuplicateRules += 1;
							rules[i].rules = rules[i].rules.concat(rules[j].rules);
							rules.splice(j, 1);
							i-=1;
							j-=1;
							rCount-=1;
							

						}
					} //end of supports selector



				} //end of j
				////end of rules


				////declarations
				//reduce root delcarations by property name and by duplicate values
				if (rules[i] !== undefined 
					&& (rules[i].type == 'rule' || (rules[i].type == 'page' && OPTIONS.bypass_page_rules == false))
				) {

					declarationsNameCounts = [];

					dCount = rules[i].declarations.length;

					//declarations duplicate check
					for (l = 0; l < dCount; ++l) {

						if (rules[i].declarations[l].type == 'declaration') {
							if (declarationsNameCounts[rules[i].declarations[l].property] !== undefined) {
								declarationsNameCounts[rules[i].declarations[l].property] += 1;
							} else {
								declarationsNameCounts[rules[i].declarations[l].property] = 1;
							}
						}
					} //end of declarations duplicate check


					//reduce according to values
					declarationsValueCounts = [];
					valKey = '';
					//detect duplicate values
					for (key in declarationsNameCounts) {

			      if (!reduceRulesListName.includes(key)) { //only properties not in list


							for (l = 0; l < dCount; ++l) {

								if (
									rules[i].declarations[l].type == 'declaration'
									&& rules[i].declarations[l].property == key
								) {
									hash = crypto.createHash('sha256');
									hash.update(rules[i].declarations[l].property + rules[i].declarations[l].value);
									
									valKey = hash.digest('hex');

									if (declarationsValueCounts[valKey] !== undefined) {
										declarationsValueCounts[valKey].id += ',' + l;
										declarationsValueCounts[valKey].count += 1;
									} else {
										declarationsValueCounts[valKey] = {
											id : l,
											count : 1
										}
									}
								}
							}
			      }
			    }


			    //remove duplicate declarations by duplicate values
			    declarationsValueCountsCount = Object.keys(declarationsValueCounts).length;

			    amountRemoved = 1;

					for (key in declarationsValueCounts) {
			      if (declarationsValueCounts.hasOwnProperty(key)) {


			      	if (declarationsValueCounts[key].count > 1) {
			      		duplicate_ids = declarationsValueCounts[key].id.split(',');

			      		amountRemoved = 1; //shift the ids by the amount removed
								for (l = 0; l < duplicate_ids.length-1; ++l) { // -1 to leave last behind

									//remove previous comment above declaration to be removed
									if (OPTIONS.trim_removed_rules_previous_comment || OPTIONS.trim) {

										if (rules[i].declarations[duplicate_ids[l]-1] !== undefined && rules[i].declarations[duplicate_ids[l]-1].type == 'comment') {

											rules[i].declarations.splice(duplicate_ids[l]-1, 1);
											dCount-=1;

											//adjust removal ids by amount already removed
											if (duplicate_ids[l] !== undefined) {
												duplicate_ids[l] -= amountRemoved; //shift the ids by the amount removed
											}
											amountRemoved += 1;
										}
									}

									if (OPTIONS.verbose) { console.log(success('Process - Declaration - Group Duplicate Declarations : ' + (rules[i].selectors ? rules[i].selectors.join(', ') : '') + ' - ' + (rules[i].declarations[l]!==undefined?rules[i].declarations[l].property:''))); }

									summary.duplicate_declarations.push(rules[i].declarations[duplicate_ids[l]]);
									summary.stats.summary.noDuplicateDeclarations += 1;
									rules[i].declarations.splice(duplicate_ids[l], 1);
									dCount-=1;

									//adjust removal ids by amount already removed
									if (duplicate_ids[l+1] !== undefined) {
										duplicate_ids[l+1] -= amountRemoved; //shift the ids by the amount removed
									}
									amountRemoved += 1;
								}

				      }
			      }
			    }
					//end of reduce according to values

					for (k = 0; k < reduceRulesListNameCount; ++k) {

						//declarations reduction
						for (key in declarationsNameCounts) {
				      if (declarationsNameCounts.hasOwnProperty(key)) {

								if (declarationsNameCounts[key] > 1) {

									for (l = 0; l < dCount; ++l) {
										if (rules[i].declarations[l].type == 'declaration') {

											if (
												rules[i].declarations[l].property == key 
												&& declarationsNameCounts[key] > 1 //leave behind 1
											) {

												//reduce according to list
												if (rules[i].declarations[l].property == reduceRulesListName[k]) { 

													//remove previous comment above declaration to be removed
													if (OPTIONS.trim_removed_rules_previous_comment || OPTIONS.trim) {
														if (rules[i].declarations[l-1] !== undefined && rules[i].declarations[l-1].type == 'comment') {

															rules[i].declarations.splice(l-1, 1);
															l-=1;
															dCount-=1;
														}
													}

													if (OPTIONS.verbose) { console.log(success('Process - Declaration - Group Duplicate Declarations : ' + (rules[i].selectors ? rules[i].selectors.join(', ') : '') + ' - ' + (rules[i].declarations[l]!==undefined?rules[i].declarations[l].property:''))); }

													summary.duplicate_declarations.push(rules[i].declarations[l]);
													summary.stats.summary.noDuplicateDeclarations += 1;
													rules[i].declarations.splice(l, 1);
													l-=1;
													dCount-=1;
													declarationsNameCounts[key] -= 1;
												}
											}
										}
									}
								}
							}
						}
					} //end of reduce root declarations by property name

				} //end of rule check



				//reduce root declarations by selector
				selectorPropertiesList = [];
				declarationsCounts = [];
				for (k = 0; k < reduceRulesListSelectorCount; ++k) {

					if (rules[i] !== undefined 
						&& rules[i].type == 'rule'
					) {

						if (rules[i].selectors !== undefined && rules[i].selectors.toString() === reduceRulesListSelector[k]) {
						
							dCount = rules[i].declarations.length;

							//detect declarations duplicates
							for (l = 0; l < dCount; ++l) {
								if (rules[i].declarations[l].type == 'declaration'
								) {
									if (declarationsCounts[rules[i].declarations[l].property] !== undefined) {
										declarationsCounts[rules[i].declarations[l].property] += 1;
									} else {
										declarationsCounts[rules[i].declarations[l].property] = 1;
									}
								}
							} //end of declarations duplicate check

							// declarations reduction
							for (key in declarationsCounts) {
					      if (declarationsCounts.hasOwnProperty(key)) {

									if (declarationsCounts[key] > 1) {

										for (l = 0; l < dCount; ++l) {
											if (rules[i].declarations[l].type == 'declaration') {

												selectorPropertiesList = reduceRulesListSelectorPName[reduceRulesListSelector[k]];
												
												if (selectorPropertiesList !== undefined) { //specific in selector

													if (rules[i].declarations[l].property == key 
														&& (selectorPropertiesList.indexOf(rules[i].declarations[l].property) != -1)
														&& declarationsCounts[key] > 1) { //leave behind 1

														//remove previous comment above declaration to be removed
														if (OPTIONS.trim_removed_rules_previous_comment || OPTIONS.trim) {
															if (rules[i].declarations[l-1] !== undefined && rules[i].declarations[l-1].type == 'comment') {

																rules[i].declarations.splice(l-1, 1);
																l-=1;
																dCount-=1;
															}
														}

														if (OPTIONS.verbose) { console.log(success('Process - Declaration - Group Duplicate Declarations : ' + (rules[i].selectors ? rules[i].selectors.join(', ') : '') + ' - ' + (rules[i].declarations[l]!==undefined?rules[i].declarations[l].property:''))); }
														summary.duplicate_declarations.push(rules[i].declarations[l]);
														summary.stats.summary.noDuplicateDeclarations += 1;
														rules[i].declarations.splice(l, 1);
														l-=1;
														dCount-=1;
														declarationsCounts[key] -= 1;
													}

												} else { //all in selector

													if (rules[i].declarations[l].property == key 
														&& declarationsCounts[key] > 1) { //leave behind 1

														//remove previous comment above declaration to be removed
														if (OPTIONS.trim_removed_rules_previous_comment || OPTIONS.trim) {
															if (rules[i].declarations[l-1] !== undefined && rules[i].declarations[l-1].type == 'comment') {

																rules[i].declarations.splice(l-1, 1);
																l-=1;
																dCount-=1;
															}
														}

														if (OPTIONS.verbose) { console.log(success('Process - Declaration - Group Duplicate Declarations : ' + (rules[i].selectors ? rules[i].selectors.join(', ') : '') + ' - ' + (rules[i].declarations[l]!==undefined?rules[i].declarations[l].property:''))); }
														summary.duplicate_declarations.push(rules[i].declarations[l]);
														summary.stats.summary.noDuplicateDeclarations += 1;
														rules[i].declarations.splice(l, 1);
														l-=1;
														dCount-=1;
														declarationsCounts[key] -= 1;
													}
												}
											}
										}
									}

					      }
					    } //end of declarations reduction

						} //end of if
					} //end of if				
				} //end of reduce root declarations by selector

				////end of declarations




				////empty nodes
				//remove empty @sign keyframes
				if (rules[i] != undefined && rules[i].keyframes !== undefined && rules[i].keyframes.length == 0) {

					//remove previous comment in root
					if (OPTIONS.trim_removed_rules_previous_comment || OPTIONS.trim) {
						if (rules[i-1] !== undefined && rules[i-1].type == 'comment') {
							if (OPTIONS.verbose) { console.log(info('Process - @keyframes - Remove comment : ' + (rules[i].keyframes ? rules[i].keyframes.join(', ') : ''))); }
							rules.splice(i-1, 1);
							i-=1;
							rCount-=1;
						}
					}
					
					if (OPTIONS.verbose) { console.log(info('Process - @keyframes - Remove Empty Rule : ' + (rules[i].keyframes ? rules[i].keyframes.join(', ') : ''))); }

					rules.splice(i, 1);
					i-=1;
					rCount-=1;
				}

				//remove empty @sign media
				if (rules[i] !== undefined && rules[i].type == 'media' 
					&& rules[i].rules.length == 0) {

					//remove previous comment in root
					if (OPTIONS.trim_removed_rules_previous_comment || OPTIONS.trim) {
						if (rules[i-1] !== undefined && rules[i-1].type == 'comment') {
							if (OPTIONS.verbose) { console.log(info('Process - @media - Remove comment : ' + (rules[i].media ? rules[i].media : ''))); }
							rules.splice(i-1, 1);
							i-=1;
							rCount-=1;
						}
					}
					if (OPTIONS.verbose) { console.log(info('Process - @media - Remove Empty Rule : ' + (rules[i].media ? rules[i].media : ''))); }
					rules.splice(i, 1);
					i-=1;
					rCount-=1;
				}

				//remove empty @sign document
				if (rules[i] !== undefined && rules[i].type == 'document' 
					&& rules[i].rules.length == 0) {

					//remove previous comment in root
					if (OPTIONS.trim_removed_rules_previous_comment || OPTIONS.trim) {
						if (rules[i-1] !== undefined && rules[i-1].type == 'comment') {
							if (OPTIONS.verbose) { console.log(info('Process - @document - Remove comment : ' + (rules[i].document ? rules[i].document : ''))); }
							rules.splice(i-1, 1);
							i-=1;
							rCount-=1;
						}
					}

					if (OPTIONS.verbose) { console.log(info('Process - @document - Remove Empty Rule : ' + (rules[i].document ? rules[i].document : ''))); }
					rules.splice(i, 1);
					i-=1;
					rCount-=1;
				}

				//remove empty @sign supports
				if (rules[i] !== undefined && rules[i].type == 'supports' 
					&& rules[i].rules.length == 0) {

					//remove previous comment in root
					if (OPTIONS.trim_removed_rules_previous_comment || OPTIONS.trim) {
						if (rules[i-1] !== undefined && rules[i-1].type == 'comment') {
							if (OPTIONS.verbose) { console.log(info('Process - @supports - Remove comment : ' + (rules[i].supports ? rules[i].supports : ''))); }
							rules.splice(i-1, 1);
							i-=1;
							rCount-=1;
						}
					}

					if (OPTIONS.verbose) { console.log(info('Process - @supports - Remove Empty Rule : ' + (rules[i].supports ? rules[i].supports : ''))); }
					rules.splice(i, 1);
					i-=1;
					rCount-=1;
				}
				////end of empty nodes



			} //end of i

		} //end of undefined
	} //end of processRules

	function processRulesReset() {

		declarationsNameCounts = null;
		declarationsValueCounts = null;
		valKey = null;
		key = null;
		declarationsValueCountsCount = null;
		amountRemoved = 1;
		duplicate_ids = null;
		selectorPropertiesList = null;
	}

	function processHTMLResults(rulesIn, selectors) {
		if (OPTIONS.verbose) { console.log(info('Process - HTML - Remove Unused Rules')); }

		//remove unused selectors
		var foundSelector = false;
		var foundInnocent = false;
		var tmpSelectors = '';
		var findSelector = null;
		for (i = 0, rulesCount = rulesIn.length; i < rulesCount; ++i) {

			if (rulesIn[i] !== undefined) {
				switch(rulesIn[i].type) {
					case 'rule': 
						for (j = 0, rulesCount2 = selectors.length; j < rulesCount2; ++j) {
							tmpSelectors = rulesIn[i].selectors;

							if (
								selectors[j].indexOf('[') != -1
								|| selectors[j].indexOf('*') != -1

							) {
								findSelector = new RegExp(RegExp.escape("^(." + selectors[j] + "|" + selectors[j] + ")$" , "gm"));
							} else {
								findSelector = new RegExp("^(." + selectors[j] + "|" + selectors[j] + ")$" , "gm");
							}
							
							if (tmpSelectors.join(",").match(findSelector)) {

								if (tmpSelectors.length > 1) {

									foundInnocent = false;

									//check for any "innocent" amongst the guilty group
									for (k = 0, rulesCount3 = tmpSelectors.length; k < rulesCount3; ++k) {

										if (selectors.indexOf(tmpSelectors[k]) == -1) {

											foundInnocent = true;
											break;
										}
									}

									if (!foundInnocent) { //remove only guilty

										//remove rule
										rulesIn.splice(i, 1);
										i-=1;
										rulesCount-=1;	
									}
								} else {

									//remove rule
									rulesIn.splice(i, 1);
									i-=1;
									rulesCount-=1;	
								}
								
								break;
							}

						}
						
						break;
					case 'document': 
					case 'supports': 
					case 'media': 

						for (j = 0, rulesCount2 = rulesIn[i].rules.length; j < rulesCount2; ++j) {

							if (rulesIn[i].rules[j] !== undefined ) {

								for (k = 0, rulesCount3 = selectors.length; k < rulesCount3; ++k) {

									tmpSelectors = rulesIn[i].rules[j].selectors;
									
									if (
										selectors[k].indexOf('[') != -1
										|| selectors[k].indexOf('*') != -1

									) {
										findSelector = new RegExp(RegExp.escape("^(." + selectors[k] + "|" + selectors[k] + ")$" , "gm"));
									} else {
										findSelector = new RegExp("^(." + selectors[k] + "|" + selectors[k] + ")$" , "gm");	
									}

									if (tmpSelectors.join(",").match(findSelector)) {

										if (tmpSelectors.length > 1) {

											foundInnocent = false;

											//check for any "innocent" amongst the guilty group
											for (l = 0, rulesCount4 = tmpSelectors.length; l < rulesCount4; ++l) {

												if (selectors.indexOf(tmpSelectors[l]) == -1) {

													foundInnocent = true;
													break;
												}
											}

											if (!foundInnocent) { //remove only guilty

												//remove rule
												rulesIn[i].rules.splice(j, 1);
												j-=1;
												rulesCount3-=1;
											}
										} else {

											//remove rule
											rulesIn[i].rules.splice(j, 1);
											j-=1;
											rulesCount3-=1;
											break;
										}
									}
								}
							}
							
						}
						break;
					case 'charset': 
						break;
					case 'page': 
						break;
				}
			}
		}

		if (OPTIONS.verbose) { console.log(info('Process - Rules - Base')); }
		processRules(rulesIn);



		//after
		stats.after.totalFileSizeKB = 0;
		stats.after.noNodes = 0;
		stats.after.noRules = 0;
		stats.after.noDeclarations = 0;
		stats.after.noComments = 0;
		stats.after.noCharset = 0;
		stats.after.noCustomMedia = 0;
		stats.after.noDocument = 0;
		stats.after.noFontFace = 0;
		stats.after.noHost = 0;
		stats.after.noImport = 0;
		stats.after.noKeyframes = 0;
		stats.after.noKeyframe = 0;
		stats.after.noMedia = 0;
		stats.after.noNamespace = 0;
		stats.after.noPage = 0;
		stats.after.noSupports = 0;


		stats.after.noNodes = rulesIn.length;
		for (i = 0; i < stats.after.noNodes; ++i) {

			if (rulesIn[i] !== undefined) {

				if (rulesIn[i].declarations !== undefined) {
					
					dCount = rulesIn[i].declarations.length;

					for (j = 0; j < dCount; ++j) {
						if (rulesIn[i].declarations[j].type == 'comment') {

							summary.stats.after.noComments += 1;
						}
					}
				}

				if (rulesIn[i].type == 'comment') {

					summary.stats.after.noComments += 1;
				}

				if (rulesIn[i].type == 'rule') {

					summary.stats.after.noRules += 1;

					summary.stats.after.noDeclarations += rulesIn[i].declarations.length;
				}

				switch(rulesIn[i].type) {
					case 'charset': summary.stats.after.noCharset += 1;
						break;
					case 'custom-media': summary.stats.after.noCustomMedia += 1;
						break;
					case 'document': summary.stats.after.noDocument += 1;
						break;
					case 'font-face': summary.stats.after.noFontFace += 1;
						break;
					case 'host': summary.stats.after.noHost += 1;
						break;
					case 'import': summary.stats.after.noImport += 1;
						break;
					case 'keyframes': summary.stats.after.noKeyframes += 1;
						break;
					case 'keyframe': summary.stats.after.noKeyframe += 1;
						break;
					case 'media': summary.stats.after.noMedia += 1;
						break;
					case 'namespace': summary.stats.after.noNamespace += 1;
						break;
					case 'page': summary.stats.after.noPage += 1;
						break;
					case 'supports': summary.stats.after.noSupports += 1;
						break;
				}

			}

		} //end of after count


		//calc reductions

		summary.stats.summary.noReductions.noNodes = summary.stats.before.noNodes - summary.stats.after.noNodes;
		summary.stats.summary.noReductions.noRules = summary.stats.before.noRules - summary.stats.after.noRules;
		summary.stats.summary.noReductions.noDeclarations = summary.stats.before.noDeclarations - summary.stats.after.noDeclarations;
		summary.stats.summary.noReductions.noComments = summary.stats.before.noComments - summary.stats.after.noComments;
		summary.stats.summary.noReductions.noCharset = summary.stats.before.noCharset - summary.stats.after.noCharset;
		summary.stats.summary.noReductions.noCustomMedia = summary.stats.before.noCustomMedia - summary.stats.after.noCustomMedia;
		summary.stats.summary.noReductions.noDocument = summary.stats.before.noDocument - summary.stats.after.noDocument;
		summary.stats.summary.noReductions.noFontFace = summary.stats.before.noFontFace - summary.stats.after.noFontFace;
		summary.stats.summary.noReductions.noHost = summary.stats.before.noHost - summary.stats.after.noHost;
		summary.stats.summary.noReductions.noImport = summary.stats.before.noImport - summary.stats.after.noImport;
		summary.stats.summary.noReductions.noKeyframes = summary.stats.before.noKeyframes - summary.stats.after.noKeyframes;
		summary.stats.summary.noReductions.noKeyframe = summary.stats.before.noKeyframe - summary.stats.after.noKeyframe;
		summary.stats.summary.noReductions.noMedia = summary.stats.before.noMedia - summary.stats.after.noMedia;
		summary.stats.summary.noReductions.noNamespace = summary.stats.before.noNamespace - summary.stats.after.noNamespace;
		summary.stats.summary.noReductions.noPage = summary.stats.before.noPage - summary.stats.after.noPage;
		summary.stats.summary.noReductions.noSupports = summary.stats.before.noSupports - summary.stats.after.noSupports;


		
		outputAST = {
			type: 'stylesheet',
			stylesheet: {
				rules: rulesIn
			}
		};
		outputCSS = css.stringify(outputAST);

		return outputCSS;
	} //end of processHTMLResults


	function completeOutput(outputCSS = '') {


		if (OPTIONS.css_output !== '') {
			// console.log(outputCSS)


			//write output
			try {
				if (OPTIONS.format_4095_rules_legacy_limit) {
					// console.log(summary.stats.after.noRules)
					var noOutputFilesNeeded = Math.ceil(summary.stats.after.noRules / 4095);
					// console.log(noOutputFilesNeeded)
					

					if (noOutputFilesNeeded == 1) {

						outputCSS = trimCSS(outputCSS);
						outputCSS = restoreHacks(outputCSS);
						write(OPTIONS.css_output, outputCSS);
						filesizeKB = getFilesizeInKiloBytes(OPTIONS.css_output);
					} else { //group 4095 rules

						try {
							var ast = css.parse(outputCSS, { source: fileLocation });
						} catch(err) {
							console.log(error("CSS Parser2 Error: probably have something funny in your CSS, change it then please try again."));
							console.log('Reason: ' + err.reason);
							console.log('Line: ' + err.line);
							console.log('Column: ' + err.column);
							console.log('Filename: ' + err.filename);
							process.exit(1);
						}

						var rulesGroups = [];
						var rulesGroupsLen = 0;
						var rules = ast.stylesheet.rules;
						var ruleslen = rules.length;
						var ruleCount = 0;
						var groupCount = 0;

						for (i = 0; i < ruleslen; ++i) {

							if (rulesGroups[groupCount] === undefined) {
								rulesGroups[groupCount] = [];
							}
							rulesGroups[groupCount].push(rules[i]);
							ruleCount += 1;

							if (ruleCount == 4095) {
								groupCount += 1;
							}
						}
						rulesGroupsLen = rulesGroups.length;
						filesizeKB = 0;
						outputFilename = '';
						for (i = 0; i < rulesGroupsLen; i++) {

							outputAST = {
								type: 'stylesheet',
								stylesheet: {
									rules: rulesGroups[i]
								}
							};
							outputCSS = css.stringify(outputAST);

							outputCSS = trimCSS(outputCSS);
							outputCSS = restoreHacks(outputCSS);
							outputFilename = OPTIONS.css_output.substr(0, OPTIONS.css_output.length-4) + '_' + i + '.css';
							write(outputFilename, outputCSS);

							filesizeKB += getFilesizeInKiloBytes(outputFilename);
						}
					}
					
				} else {
					outputCSS = trimCSS(outputCSS);
					outputCSS = restoreHacks(outputCSS);
					if (OPTIONS.css_output === null || OPTIONS.css_output === undefined || OPTIONS.css_output == '') {
						var size = kiloByteLength(outputCSS);
						filesizeKB = size/1000;
					} else {
						write(OPTIONS.css_output, outputCSS);
						filesizeKB = getFilesizeInKiloBytes(OPTIONS.css_output);
					}
				}
				
			} catch(e) {
				console.log(error("Output file error: Something went wrong while writing the file, check your folder permissions, config_css.json and please try again."));
				console.log(e);
				process.exit(1);
			}

		} else {
			outputCSS = trimCSS(outputCSS);
			outputCSS = restoreHacks(outputCSS);
			filesizeKB = kiloByteLength(outputCSS);
		}

		summary.stats.after.totalFileSizeKB += filesizeKB;
		summary.stats.summary.savingsKB = roundTo(summary.stats.before.totalFileSizeKB - summary.stats.after.totalFileSizeKB, 4);
		summary.stats.summary.savingsPercentage = roundTo(summary.stats.summary.savingsKB / summary.stats.before.totalFileSizeKB * 100, 2);

		//write report
		if (OPTIONS.generate_report) {

			try {
				var cssdata = JSON.stringify(summary, null, '\t');
				write(REPORT_DUPLICATE_CSS, JSON.stringify(summary, null, '\t'));
			} catch(e) {
				console.log(error("Report output file error: Something went wrong while writing the file, check your folder permissions, config_css.json and please try again."));
				console.log(e);
				process.exit(1);
			}
		}

		if (OPTIONS.verbose) {

			console.log(cool('Before: ' + summary.stats.before.totalFileSizeKB + 'KB'));
			console.log(cool('After: ' + summary.stats.after.totalFileSizeKB + 'KB'));
			console.log(cool('Saved: ' + summary.stats.summary.savingsKB + 'KB (' + summary.stats.summary.savingsPercentage + '%)'));

			console.timeEnd(logoRed("Purged " + timeLabel + " in "));
		}

		if (OPTIONS.css_output === null || OPTIONS.css_output === undefined || OPTIONS.css_output == '') {
			return outputCSS;
		} else {

			// console.log(OPTIONS.css_output);
			
		}
	}


	function processCSS(cssDataIn = null, optionsIn = null, callback = function(error, result){}) {

		
		
		var continueCSSProcess = function(){

			CPEVENTS.removeListener('CONFIG_READ_REDUCE_PROPS_END', continueCSSProcess);

			
			var cssData = dataCSSIn.join("");

			if (cssDataIn !== null && cssDataIn !== undefined) {
				cssData = cssDataIn;

				filesizeKB = kiloByteLength(cssDataIn);

				stats.before.totalFileSizeKB += filesizeKB;
			}

			if (optionsIn !== null && optionsIn !== undefined) {

				for (key in optionsIn) {

					OPTIONS[key] = optionsIn[key];	
					
				}

			}

			if (OPTIONS.verbose) { 

				timeLabel = Date();

				if (OPTIONS.css_output !== undefined && OPTIONS.css_output != '') {
					timeLabel = OPTIONS.css_output;
				}
				
				console.time(logoRed("Purged " + timeLabel + " in ")); 
			}

			if (OPTIONS.verbose) { console.log(info('Process - CSS')); }

			var duplicates = [];


			//remove non-standard commented lines
			cssData = cssData.replace(/([^:;,a-zA-Z0-9]|^)\/\/.*$/gm, function(match){

				stats.summary.noInlineCommentsTrimmed += 1;

				if (OPTIONS.trim_keep_non_standard_inline_comments && OPTIONS.trim_comments != true) {
					return '/*' + match.substr(3, match.length) + ' */';
				} else {
					return '';	
				}
				
			});


			///// hacks
			///**/
			cssData = cssData.replace(/\/\*\*\//gm, '_1token_hck');
			///*\**/
			cssData = cssData.replace(/\/\*\\\*\*\//gm, '_2token_hck');
			//(specialchar)property
			cssData = cssData.replace(/[\!\$\&\*\(\)\=\%\+\@\,\.\/\`\[\]\#\~\?\:\<\>\|\*\/]{1}([\-\_\.]?)([a-zA-Z0-9]+):((\s\S*?));/g, function(match){
				token3_chars.push(match.substr(0,match.length-1));
				return '_3token_hck_'+token3_chars.length+':';	
			});
			//(;
			cssData = cssData.replace(/(\(;)([\s\S]*?)(\})/g, function(match){
				token4_vals.push(match.substr(0,match.length));
				return '_4token_hck_'+token4_vals.length+':}';
			});
			//[;
			cssData = cssData.replace(/(\[;)([\s\S]*?)(\})/g, function(match){
				token5_vals.push(match.substr(0,match.length));
				return '_5token_hck_'+token5_vals.length+':}';
			});
			////end of hacks

			//tokens - replace side comments
			if (OPTIONS.trim_comments != true) {
				cssData = cssData.replace(/[;]([^\n][\s]*?)\/\*([\s\S]*?)\*\//gm, function(match){

					tokens_comments['_cssp_sc' + (Object.keys(tokens_comments).length+1)] = match.substr(1, match.length);
					return '; /*_cssp_sc' + Object.keys(tokens_comments).length + '*/'
				});
			}

			
			try {
				var ast = css.parse(cssData, { source: fileLocation });
			} catch(err) {
				console.log(error("CSS Parser Error: probably have something funny in your CSS, change it then please try again."));
				console.log('Reason: ' + err.reason);
				console.log('Line: ' + err.line);
				console.log('Column: ' + err.column);
				console.log('Filename: ' + err.filename);
				process.exit(1);
			}

			
			var rulesIn = ast.stylesheet.rules;
			var parsingErrorsIn = ast.stylesheet.parsingErrors;

			//stats
			var rulesTotalCount = rulesIn.length;
			var noParsingErrors = parsingErrorsIn.length;


			var fRules = rulesIn;
			var fRulesCount = fRules.length;

			var declarations = null;


			stats.before.noNodes = fRulesCount;

			summary.stats = stats;

			//before
			for (i = 0; i < fRulesCount; ++i) {

				if (fRules[i] !== undefined) {

					if (fRules[i].declarations !== undefined) {

						dCount = fRules[i].declarations.length;

						for (j = 0; j < dCount; ++j) {
							if (fRules[i].declarations[j].type == 'comment') {

								summary.stats.before.noComments += 1;
							}
						}
					}

					if (fRules[i].type == 'comment') {

						summary.stats.before.noComments += 1;
					}

					if (fRules[i].type == 'rule') {

						summary.stats.before.noRules += 1;

						summary.stats.before.noDeclarations += fRules[i].declarations.length;
					}

					switch(fRules[i].type) {
						case 'charset': summary.stats.before.noCharset += 1;
							break;
						case 'custom-media': summary.stats.before.noCustomMedia += 1;
							break;
						case 'document': summary.stats.before.noDocument += 1;
							break;
						case 'font-face': summary.stats.before.noFontFace += 1;
							break;
						case 'host': summary.stats.before.noHost += 1;
							break;
						case 'import': summary.stats.before.noImport += 1;
							break;
						case 'keyframes': summary.stats.before.noKeyframes += 1;
							break;
						case 'keyframe': summary.stats.before.noKeyframe += 1;
							break;
						case 'media': summary.stats.before.noMedia += 1;
							break;
						case 'namespace': summary.stats.before.noNamespace += 1;
							break;
						case 'page': summary.stats.before.noPage += 1;
							break;
						case 'supports': summary.stats.before.noSupports += 1;
							break;
					}

				}

			} //end of before count


			if (OPTIONS.verbose) { console.log(info('Process - Rules - Base')); }
			var declarationsNameCounts = [];
			var declarationsValueCounts = [];
			var valKey = '';
			var key = null;
			var declarationsValueCountsCount = null;
			var amountRemoved = 1;
			var duplicate_ids = null;
			var selectorPropertiesList = [];
			processRules(fRules);
			processRulesReset();

			for (g = 0; g < fRulesCount; ++g) {

				if (fRules[g] !== undefined) {
					// console.log(g, fRulesCount)
					//@media rules
					if (fRules[g] !== undefined 
						&& fRules[g].type == 'media'
					  // && OPTIONS.bypass_media_rules == false
					) {
						if (OPTIONS.verbose) { console.log(info('Process - Rules - @media ' + (fRules[g].media ? fRules[g].media : ''))); }
						processRules(fRules[g].rules);
						processRulesReset();
						processValues(fRules[g].rules);
					}

					//@document rules
					if (fRules[g] !== undefined 
						&& fRules[g].type == 'document'
						&& OPTIONS.bypass_document_rules == false
					) {
						if (OPTIONS.verbose) { console.log(info('Process - Rules - @document ' + (fRules[g].document ? fRules[g].document : ''))); }
						processRules(fRules[g].rules);
						processRulesReset();
						processValues(fRules[g].rules);
					}

					//@supports rules
					if (fRules[g] !== undefined 
						&& fRules[g].type == 'supports'
						&& OPTIONS.bypass_supports_rules == false
					) {
						
						if (OPTIONS.verbose) { console.log(info('Process - Rules - @supports ' + (fRules[g].supports ? fRules[g].supports : ''))); }
						processRules(fRules[g].rules);
						processRulesReset();
						processValues(fRules[g].rules);
					}

					
					////charset
					if (fRules[g] !== undefined 
						&& fRules[g].type == 'charset'
						&& OPTIONS.bypass_charset == false
					) {
						if (OPTIONS.verbose) { console.log(info('Process - Charset')); }

						charset = fRules[g].charset;
						cCount = fRules.length;

						for (h = g+1; h < cCount; ++h) {

							if (fRules[h] !== undefined) {
								charset2 = fRules[h].charset;

								if (charset == charset2) {

									//remove charset
									if (fRules[h] !== undefined && fRules[h].type == 'charset') {

										fRules.splice(h, 1);
										g-=1;
										h-=1;
										cCount-=1;
										fRulesCount-=1;
										
										//remove side comment
										if (
											fRules[h+1] !== undefined
											&& fRules[h+1].type == 'comment'
											&& fRules[h+1].comment.indexOf('_cssp_sc') != -1
										) {
											// console.log('hi')
											// console.log(fRules[h+1])
											fRules.splice((h+1), 1);
											g-=1;
											// h-=1;
											// cCount-=1;
											fRulesCount-=1;
										}
									}
								}
							}
						} // end of h

						if (
							charset.substr(0, 1) != '"'
							|| charset.substr(charset.length-1, charset.length) != '"'
						) {

							//remove charset
							if (fRules[g] !== undefined && fRules[g].type == 'charset') {

								fRules.splice(g, 1);
								g-=1;
								fRulesCount-=1;

								//remove side comment
								if (
									fRules[g+1] !== undefined
									&& fRules[g+1].type == 'comment'
									&& fRules[g+1].comment.indexOf('_cssp_sc') != -1
								) {

									fRules.splice((g+1), 1);
									g-=1;
									fRulesCount-=1;
								}
							}
						}

					}
					////end of charset


				} //end of undefined
			} //end of for loop

			//rems - html check
			if (OPTIONS.special_convert_rem) {
				var hasHTML = false;
				var htmlHasFontSize = false;
				var tmpRulesCount = fRules.length;
				for (i = 0; i < tmpRulesCount; ++i) {

					if (fRules[i] !== undefined 
						&& fRules[i].selectors !== undefined 
						&& fRules[i].selectors.toString().indexOf('html') != -1) {

						hasHTML = true;
						for (j = 0; j < fRules[i].declarations.length; ++j) {

							if (fRules[i].declarations !== undefined) {

								if (fRules[i].declarations[j].property == 'font-size') {
									htmlHasFontSize = true;
									break;
								}
							}
						}

						if (htmlHasFontSize == false) { //create font-size

							fRules[i].declarations.unshift({
								type: 'declaration',
								property: 'font-size',
								value: ((parseInt(OPTIONS.special_convert_rem_desired_html_px) / parseInt(OPTIONS.special_convert_rem_browser_default_px)) * 100) + "%"
							});
						}
					
						//move to top
						tmpVal = fRules[i];
						fRules.splice(i, 1);
						fRules.unshift(tmpVal);

						break;
					}

				} //end of for

				if (hasHTML == false) { //create html with font-size

					fRules.unshift({
						type: 'rule',
						selectors: ['html'],
						declarations: [{
							type: 'declaration',
							property: 'font-size',
							value: ((parseInt(OPTIONS.special_convert_rem_desired_html_px) / parseInt(OPTIONS.special_convert_rem_browser_default_px)) * 100) + "%"
						}]
					});
				}

			} // end of rems - html check
			
			processValues(fRules);



			////charset first check
			if (
				fRules[0] !== undefined
				&& fRules[1] !== undefined
				&& fRules[0].type == 'comment'
				&& fRules[1].type == 'charset'
				&& OPTIONS.bypass_charset == false
			) {

				fRules.splice(0, 1);
			}
			////end of charset first check



			








			//after
			stats.after.noNodes = fRules.length;
			for (i = 0; i < fRulesCount; ++i) {

				if (fRules[i] !== undefined) {

					if (fRules[i].declarations !== undefined) {
						
						dCount = fRules[i].declarations.length;

						for (j = 0; j < dCount; ++j) {
							if (fRules[i].declarations[j].type == 'comment') {

								summary.stats.after.noComments += 1;
							}
						}
					}

					if (fRules[i].type == 'comment') {

						summary.stats.after.noComments += 1;
					}

					if (fRules[i].type == 'rule') {

						summary.stats.after.noRules += 1;

						summary.stats.after.noDeclarations += fRules[i].declarations.length;
					}

					switch(fRules[i].type) {
						case 'charset': summary.stats.after.noCharset += 1;
							break;
						case 'custom-media': summary.stats.after.noCustomMedia += 1;
							break;
						case 'document': summary.stats.after.noDocument += 1;
							break;
						case 'font-face': summary.stats.after.noFontFace += 1;
							break;
						case 'host': summary.stats.after.noHost += 1;
							break;
						case 'import': summary.stats.after.noImport += 1;
							break;
						case 'keyframes': summary.stats.after.noKeyframes += 1;
							break;
						case 'keyframe': summary.stats.after.noKeyframe += 1;
							break;
						case 'media': summary.stats.after.noMedia += 1;
							break;
						case 'namespace': summary.stats.after.noNamespace += 1;
							break;
						case 'page': summary.stats.after.noPage += 1;
							break;
						case 'supports': summary.stats.after.noSupports += 1;
							break;
					}

				}

			} //end of after count


			//calc reductions

			summary.stats.summary.noReductions.noNodes = summary.stats.before.noNodes - summary.stats.after.noNodes;
			summary.stats.summary.noReductions.noRules = summary.stats.before.noRules - summary.stats.after.noRules;
			summary.stats.summary.noReductions.noDeclarations = summary.stats.before.noDeclarations - summary.stats.after.noDeclarations;
			summary.stats.summary.noReductions.noComments = summary.stats.before.noComments - summary.stats.after.noComments;
			summary.stats.summary.noReductions.noCharset = summary.stats.before.noCharset - summary.stats.after.noCharset;
			summary.stats.summary.noReductions.noCustomMedia = summary.stats.before.noCustomMedia - summary.stats.after.noCustomMedia;
			summary.stats.summary.noReductions.noDocument = summary.stats.before.noDocument - summary.stats.after.noDocument;
			summary.stats.summary.noReductions.noFontFace = summary.stats.before.noFontFace - summary.stats.after.noFontFace;
			summary.stats.summary.noReductions.noHost = summary.stats.before.noHost - summary.stats.after.noHost;
			summary.stats.summary.noReductions.noImport = summary.stats.before.noImport - summary.stats.after.noImport;
			summary.stats.summary.noReductions.noKeyframes = summary.stats.before.noKeyframes - summary.stats.after.noKeyframes;
			summary.stats.summary.noReductions.noKeyframe = summary.stats.before.noKeyframe - summary.stats.after.noKeyframe;
			summary.stats.summary.noReductions.noMedia = summary.stats.before.noMedia - summary.stats.after.noMedia;
			summary.stats.summary.noReductions.noNamespace = summary.stats.before.noNamespace - summary.stats.after.noNamespace;
			summary.stats.summary.noReductions.noPage = summary.stats.before.noPage - summary.stats.after.noPage;
			summary.stats.summary.noReductions.noSupports = summary.stats.before.noSupports - summary.stats.after.noSupports;


			//prepare output
			var outputAST = {
				type: 'stylesheet',
				stylesheet: {
					rules: fRules
				}
			};
			var outputCSS = css.stringify(outputAST);




			//Detect via JS



			//Detect via HTML
			if (OPTIONS.special_reduce_with_html && (OPTIONS.html !== undefined && OPTIONS.html !== '')) {

				if (OPTIONS.verbose) { console.log(info('Process - HTML')); }

				var ast = css.parse(outputCSS, { source: fileLocation });
				
				var rulesIn = ast.stylesheet.rules;

				var selectors = [], rulesCount2 = 0, rulesCount3 = 0, rulesCount4 = 0;
				var ignoreFound = false;
				for (i = 0, rulesCount = rulesIn.length; i < rulesCount; ++i) {

					if (rulesIn[i] !== undefined) {
						switch(rulesIn[i].type) {
							case 'rule': 

								ignoreFound = false;

								for (j = 0, rulesCount2 = OPTIONS.special_reduce_with_html_ignore_selectors.length; j < rulesCount2; ++j) {

									if (rulesIn[i].selectors && rulesIn[i].selectors.join(",").indexOf(OPTIONS.special_reduce_with_html_ignore_selectors[j]) != -1) {
										ignoreFound = true;
										break;
									}
								}

								if (ignoreFound == false) {
									for (j = 0, rulesCount2 = rulesIn[i].selectors.length; j < rulesCount2; ++j) {
										selectors.push(rulesIn[i].selectors[j]);			
									}
								}

								break;
							case 'media': 

								for (j = 0, rulesCount2 = rulesIn[i].rules.length; j < rulesCount2; ++j) {

									ignoreFound = false;

									for (k = 0, rulesCount3 = OPTIONS.special_reduce_with_html_ignore_selectors.length; k < rulesCount3; ++k) {

										if (rulesIn[i].rules[j].selectors && rulesIn[i].rules[j].selectors.join(",").indexOf(OPTIONS.special_reduce_with_html_ignore_selectors[k]) != -1) {
											ignoreFound = true;
											break;
										}
									}

									if (ignoreFound == false) {
									
										for (k = 0, rulesCount3 = rulesIn[i].rules[j].selectors.length; k < rulesCount3; ++k) {
											selectors.push(rulesIn[i].rules[j].selectors[k]);	
										}
									}
								}
								break;
							case 'document': 
								
								for (j = 0, rulesCount2 = rulesIn[i].rules.length; j < rulesCount2; ++j) {

									ignoreFound = false;

									for (k = 0, rulesCount3 = OPTIONS.special_reduce_with_html_ignore_selectors.length; k < rulesCount3; ++k) {

										if (rulesIn[i].rules[j].selectors && rulesIn[i].rules[j].selectors.join(",").indexOf(OPTIONS.special_reduce_with_html_ignore_selectors[k]) != -1) {
											ignoreFound = true;
											break;
										}
									}

									if (ignoreFound == false) {
									
										for (k = 0, rulesCount3 = rulesIn[i].rules[j].selectors.length; k < rulesCount3; ++k) {
											selectors.push(rulesIn[i].rules[j].selectors[k]);	
										}
									
									}
								}
								break;
							case 'supports': 
								
								for (j = 0, rulesCount2 = rulesIn[i].rules.length; j < rulesCount2; ++j) {

									ignoreFound = false;

									for (k = 0, rulesCount3 = OPTIONS.special_reduce_with_html_ignore_selectors.length; k < rulesCount3; ++k) {

										if (rulesIn[i].rules[j].selectors && rulesIn[i].rules[j].selectors.join(",").indexOf(OPTIONS.special_reduce_with_html_ignore_selectors[k]) != -1) {
											ignoreFound = true;
											break;
										}
									}

									if (ignoreFound == false) {
									
										for (k = 0, rulesCount3 = rulesIn[i].rules[j].selectors.length; k < rulesCount3; ++k) {
											selectors.push(rulesIn[i].rules[j].selectors[k]);	
										}
									
									}
								}
								break;
							case 'charset': 
								break;
						}
					}
				}

				//remove duplicates
				selectors = Array.from(new Set(selectors));

				//process selectors returned from processing HTML
				CPEVENTS.on('HTML_RESULTS_END', function(htmlResults) {

					summary.selectors_removed = htmlResults;

					outputCSS = processHTMLResults(rulesIn, selectors);

					callback(null, completeOutput(outputCSS));
				});

				processHTML(selectors);

			} else { //end of special_reduce_with_html
				callback(null, completeOutput(outputCSS));
			} //end of special_reduce_with_html

		};

		CPEVENTS.on('CONFIG_READ_REDUCE_PROPS_END', continueCSSProcess); //end of event

		if (cssDataIn == null) {
			CPEVENTS.emit('CONFIG_READ_REDUCE_PROPS_END');
		}

		if (!hasReadReduceDeclarations && optionsIn !== null && !fs.existsSync(OPTIONS.reduce_declarations_file_location)) {

			if (optionsIn !== null && (optionsIn['reduceConfig'] === undefined || optionsIn['reduceConfig'] === null)) {

				//default process settings
				var default_reduce_declarations_config = {
					"declaration_names" : [
						"font",
						"margin",
						"padding",
						"list-style",
						"outline",
						"border",
						"border-top",
						"border-right",
						"border-bottom",
						"border-left",
						"border-radius",
						"border-color",
						"border-top-color",
						"border-right-color",
						"border-bottom-color",
						"border-left-color",
						"color",
						"background-color",
						"font-color",
						"outline-color",
						"box-shadow",
						"text-shadow",
						"float",
						"font-family",
						"font-size",
						"font-weight",
						"font-style",
						"font-variant",
						"font-stretch"
					]
				};
				optionsIn['reduceConfig'] = default_reduce_declarations_config;
				readReduceDeclarations(optionsIn['reduceConfig']);
			}
		} else if(!hasReadReduceDeclarations) {
			
			readReduceDeclarations();
		}

	} //end of processCSS




	this.purgeCSS = function(cssDataIn, optionsIn, callback) {
		processCSS(cssDataIn, optionsIn, callback);
	}

	this.purgeCSSFiles = function(optionsIn, configFileLocationIn) {
		processCSSFiles(optionsIn, configFileLocationIn)
	}
} //end of CSSPurge

var purgeSessions = [];

var purgeTriage = {
	purgeCSS: function(cssDataIn, optionsIn, callback){

		//new session
		var cssPurge = new CSSPurge();
		purgeSessions.push(cssPurge);
		cssPurge.purgeCSS(cssDataIn, optionsIn, callback);
	},
	purgeCSSFiles: function(optionsIn, configFileLocationIn){

		//new session
		var cssPurge = new CSSPurge();
		purgeSessions.push(cssPurge);
		cssPurge.purgeCSSFiles(optionsIn, configFileLocationIn);
	}
}

module.exports = purgeTriage;

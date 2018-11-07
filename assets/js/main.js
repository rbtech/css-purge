
var gId = document.getElementById.bind(document);

var overviewTab = gId('overviewTab');
var featuresTab = gId('featuresTab');
var getStartedTab = gId('getStartedTab');
var helpTab = gId('helpTab');



var overviewTop = 0;
var usageTop = 0;
var globalTop = 0;
var localTop = 0;
var libraryTop = 0;
var reportTop = 0;
var configTop = 0;

function setTop() {

	overviewTop = $('#headerOverview').offset().top - 10; 
	usageTop = $('#headerUsage').offset().top-10; 
	globalTop = $('#headerGlobal').offset().top - 10; 
	localTop = $('#headerLocal').offset().top - 10;
	libraryTop = $('#headerLibrary').offset().top - 10;
	reportTop = $('#headerReport').offset().top - 10;
	configTop = $('#headerConfig').offset().top - 10;

}

$(function(){

	$('.underTheHoodLink').on('click', function(){

		$("#layoutHeader").animate({scrollTop:0}, 300);

		featuresTab.click();
	});

	$('.gettingStartedLink').on('click', function(){

		$("#layoutHeader").animate({scrollTop:0}, 300);

		getStartedTab.click();
	});

	$('.helpLink').on('click', function(){

		$("#layoutHeader").animate({scrollTop:0}, 300);

		helpTab.click();
	});



	//overview
	$('#menuBtn1, .footerOverview').on('click', function(){

		getStartedTab.click();

		setTimeout(function(){

			if (overviewTop == 0) { 
				setTop();
			}

			$("#layoutHeader").animate({scrollTop:overviewTop}, 300);

		},100);
	});




	//usage
	$('#menuBtn2, footerUsage').on('click', function(){

		getStartedTab.click(); 

		setTimeout(function(){

			if (usageTop == 0) { 
				setTop();
			}

			$("#layoutHeader").animate({scrollTop:usageTop}, 300);

		},100);
	});

	//global
	$('#submenuBtn1, .globalLink').on('click', function(){

		getStartedTab.click(); 

		if (globalTop == 0) { setTop();	}

		$("#layoutHeader").animate({scrollTop: globalTop}, 300);

	});
	//local
	$('#submenuBtn2, .localLink').on('click', function(){

		getStartedTab.click(); 

		if (localTop == 0) { setTop(); }

		$("#layoutHeader").animate({scrollTop:localTop}, 300);

	});
	//library
	$('#submenuBtn3, .libraryLink').on('click', function(){

		getStartedTab.click(); 

		if (libraryTop == 0) { setTop(); }

		$("#layoutHeader").animate({scrollTop:libraryTop}, 300);

	});



	//report
	$('#menuBtn3, .footerReport').on('click', function(){

		getStartedTab.click(); 

		setTimeout(function(){

			if (reportTop == 0) { setTop(); }

			$("#layoutHeader").animate({scrollTop:reportTop}, 300);

		},100);
	});


	//config
	$('#menuBtn4, .configHeaderLink, .footerConfig').on('click', function(){

		getStartedTab.click(); 

		setTimeout(function(){
			
			if (configTop == 0) { setTop(); }

			$("#layoutHeader").animate({scrollTop:configTop}, 300);

		},100);
	});

	var token = "EETIPcM4wPVlWpWFnY2SLw";

	if (document.domain.indexOf('npm') != -1) {
		token = "tZWUuWEjGuwxBevlNrkMvg";
	}

	$(".cs__footer a").attr("href", "https://codesponsor.io/?utm_source=widget&utm_medium=banner&utm_campaign=" + token);
	$.ajax({
	  url: "https://app.codesponsor.io/p/" + token + "/message.json",
	  method: "GET"
	}).done(function(results) {
	  console.log(results);
	  $(".cs__blurb").attr("href", results.link_href);
	  $(".cs__blurb strong").text(results.title);
	  $(".cs__blurb span").text(results.body);
	  $(".cs__pixel").attr("src", results.pixel_href);
	}).fail(function(args) {
	  $(".cs__blurb strong").text("CodeSponsor.io");
	  $(".cs__blurb span").text(" - get paid by adding one line of code to your README");
	});

});
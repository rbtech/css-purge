$(function(){

	document.getElementById('test1').style.display = 'block';
	var h1 = document.getElementsByTagName("h1");
	h1[0].style.color = 'red';

	$('#test1').hide();
	$('.test-1').hide();

	$('ul li.item.link-1').removeClass('active');
	$('ul li.item.link-2').addClass('active');

	console.log($('ul li.item.link-1').hasClass('active'));

	console.log($("p").css("background-color"));

	$("p").css({"background-color": "yellow", "font-size": "200%"});

	console.log($("p").css("background-color"));

	$("button").click(function(){
		
		h1[0].style.color = '';

		$("p").css({"background-color": ""});
    $("h1, h2, p").toggleClass("blue");
    $("ul li").toggleClass("active");
	});

	$( ".hello" ).clone().appendTo( ".goodbye" );
});

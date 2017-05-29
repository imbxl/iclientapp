var myApp = new Framework7({
	 swipePanel: 'left',
	 cache: false
});

var $$ = Dom7;

var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true
});

$$(document).on('deviceready', function() {
    //console.log("Device is ready!");
});

myApp.onPageInit('cuenta', function (page) {
	myApp.closePanel();
})

var mySwiper1 = myApp.swiper('.swiper-1', {
  pagination: '.swiper-1 .swiper-pagination',
  paginationHide: false,
  paginationClickable: true,
  nextButton: '.swiper-button-next',
  prevButton: '.swiper-button-prev',
});

myApp.onPageAfterAnimation('index', function (page){
	mainView.showToolbar(true);
})

$$(document).on('pageInit', function (e) {
    var page = e.detail.page;
	
	console.log(e);
	
    if (page.name === 'index') {
		mainView.showToolbar(true);
	}else{
		mainView.hideToolbar(true);
	}
	
	myApp.closePanel();
})
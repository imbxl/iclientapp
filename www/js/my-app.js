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

	/* PUSH NOTIFICATIONS */
        console.log('calling push init');
        var push = PushNotification.init({
            "android": {
            },
            "browser": {},
            "ios": {
                "sound": true,
                "vibration": true,
                "badge": true
            },
            "windows": {}
        });
        console.log('after init');

        push.on('registration', function(data) {
            console.log(data.registrationId);

            var oldRegId = localStorage.getItem('registrationId');
            if (oldRegId !== data.registrationId) {
                // Save new registration ID
                localStorage.setItem('registrationId', data.registrationId);
                // Post registrationId to your app server as the value has changed
            }
        });

        push.on('error', function(e) {
            console.log("push error = " + e.message);
        });

        push.on('notification', function(data) {
            console.log('notification event');
            navigator.notification.alert(
                data.message,         // message
                null,                 // callback
                data.title,           // title
                'Ok'                  // buttonName
            );
       });
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

function Escanear(){
	cordova.plugins.barcodeScanner.scan(
	  function (result) {
		  if(!result.cancelled){
		  	alert("Ticket enviado para analizar!");
		  }
	  },
	  function (error) {
		  alert("Error al leer el ticket");
	  },
	  {
		  preferFrontCamera : false, // iOS and Android
		  showFlipCameraButton : true, // iOS and Android
		  showTorchButton : false, // iOS and Android
		  torchOn: false, // Android, launch with the torch switched on (if available)
		  prompt : "Ponga el codigo QR dentro del marco", // Android
		  resultDisplayDuration: 0, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
		  formats : "QR_CODE", // default: all but PDF_417 and RSS_EXPANDED
		 // orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
		  disableAnimations : true, // iOS
		  disableSuccessBeep: true // iOS
	  }
   );
}
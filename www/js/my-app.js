var myApp = new Framework7({
	 swipePanel: 'left',
	 cache: false,
	 modalUsernamePlaceholder:'E-Mail',
	 modalPasswordPlaceholder:'Contraseña',
	 modalButtonOk:'Aceptar',
	 modalButtonCancel: 'Cancelar'
});

var $$ = Dom7;

var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true
});

$$(document).on('deviceready', function() {
	testLogin();//Make sure to get at least one GPS coordinate in the foreground before starting background services
});

myApp.onPageInit('cuenta', function (page) {
	myApp.closePanel();
})

myApp.onPageInit('registro', function (page) {
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

var XAP_init = false;
var Empresas = [];
$$(document).on('pageInit', function (e) {	
	if(!XAP_init){
		$$.getJSON('http://iclient.com.ar/datos.php?tipo=empresas', function (json) {
			var html = '<div class="row">';
			Empresas = [];
			$$.each(json, function (index, row) {
				Empresas.push(row);
				if(row.URL != '') html += '<div class="col-50 tablet-25" align="center"><img style="width:100%; max-width:100%;" src="http://iclient.com.ar/archivos/empresas/'+row.URL+'" data-rel="external" /></div>';
			});
			html += '</div>';
			//console.log(html);
			$$('.MarcasContainer').html(html);
		});
		var bgupdates = window.localStorage.getItem("bgupdates");
		if (bgupdates == null || bgupdates == '' || bgupdates != 'off') {
			//
		}
		XAP_init = true;
	}
	
    var page = e.detail.page;
	
	//console.log(e);
	
    if (page.name === 'index') {
		testLogin();
		mainView.showToolbar(true);
		var html = '<div class="row">';
		$$.each(Empresas, function (index, row) {
			if(row.URL != '') html += '<div class="col-50 tablet-25" align="center"><img style="width:100%; max-width:100%;" src="http://iclient.com.ar/archivos/empresas/'+row.URL+'" data-rel="external" /></div>';
		});
		html += '</div>';
		$$('.MarcasContainer').html(html);
	}else{
		mainView.hideToolbar(true);
	}
	
    if (page.name === 'cuenta') {
		$$.getJSON('http://iclient.com.ar/datos.php?tipo=cuenta', function (json) {
			console.log(json);
			$$('#Datos_Nombre').html(json['Nombre']);
			$$('#Datos_DNI').html(json['DNI']);
			$$('#Datos_Email').html(json['Email']);
			$$('#Datos_Puntos').html(parseInt(json['Puntos'])-parseInt(json['Canjes']));			
			$$('#Datos_Tel').val(json['Telefono']);
			$$('#Datos_Genero').val(json['Genero']);
			$$('#Datos_Provincia').val(json['Provincia']);
			if(json['Nacimiento'] != '0000-00-00') $$('#calendar-nacimiento-cuenta').val(json['Nacimiento']);			
			else $$('#calendar-nacimiento-cuenta').val('');	
			myApp.calendar({
				input: '#calendar-nacimiento-cuenta'
			});   
		});
	}
	
    if (page.name === 'canjear') {
		GetProductos();
	}
		
    if (page.name === 'historial') {
		GetHistorial();
	}
	myApp.closePanel();
})

function Registrarme() {
    //verificamos conexion y servidores
	$$.post( "http://iclient.com.ar/registro_usuario.php", {
			Nombre:document.getElementById('formreg_name').value,
			Genero:document.getElementById('formreg_genero').value,
			Provincia:document.getElementById('formreg_provincia').value,
			Nacimiento:document.getElementById('calendar-nacimiento').value,
			Tel:document.getElementById('formreg_tel').value,
			DNI:document.getElementById('formreg_dni').value,
			Email:document.getElementById('formreg_mail').value,
			Clave:document.getElementById('formreg_pass').value
		},
		function( data ) {
        	if (data == 'OK') {
				navigator.notification.alert('¡Se registró con exito en iClient!',function(){},'Registro');
				login(document.getElementById('formreg_mail').value, document.getElementById('formreg_pass').value);
			}else{
				navigator.notification.alert(data,function(){},'Registro');
			}
		}
	);
}
function GuardarDatos() {
	if(document.getElementById('Datos_Genero').value == ''){
		navigator.notification.alert("Debe ingresar su Género.",function(){},'Mis datos');
		return;
	}
	if(document.getElementById('calendar-nacimiento-cuenta').value == ''){
		navigator.notification.alert("Debe ingresar su Fecha de Nacimiento.",function(){},'Mis datos');
		return;
	}
	if(document.getElementById('Datos_Provincia').value == ''){
		navigator.notification.alert("Debe ingresar su Provincia.",function(){},'Mis datos');
		return;
	}
	if(document.getElementById('Datos_Tel').value == ''){
		navigator.notification.alert("Debe ingresar su Teléfono.",function(){},'Mis datos');
		return;
	}
	$$.post( "http://iclient.com.ar/datos.php?tipo=update_datos", {
			Genero:document.getElementById('Datos_Genero').value,
			Provincia:document.getElementById('Datos_Provincia').value,
			Nacimiento:document.getElementById('calendar-nacimiento-cuenta').value,
			Tel:document.getElementById('Datos_Tel').value
		},
		function( data ) {
			mainView.router.load({url:'index.html', reload: true});
		}
	);
}

var IniciadoSesion = false;
function login(strU, strP) {
    //verificamos conexion y servidores
	$$.post( "http://iclient.com.ar/login.php", {Email:strU, Clave:strP},
		function( data ) {
        	if (data == 'OK' || data == 'DATOS') {
				var estrU = CryptoJS.AES.encrypt(strU, "strU");
				var estrP = CryptoJS.AES.encrypt(strP, "strP");
				window.localStorage.setItem("estru", estrU);
				window.localStorage.setItem("estrp", estrP);
				IniciadoSesion = true;
				if(data == 'DATOS'){
					navigator.notification.alert('Se necesitan completar datos personales',function(){},'Mis datos');
					mainView.router.load({url:'cuenta.html', reload: true});
				}else{ mainView.router.load({url:'index.html'}); }
				ConfigPush();
			}else{
				MostrarModalLogin('Los datos no son correctos.<br/>');
			}
		}
	);
}
function LogOut() {
	window.localStorage.clear();
	IniciadoSesion = false;
	mainView.router.load({url:'index.html', reload: true});
}

var LoginModal;
function MostrarModalLogin(salida){
	myApp.modalLogin(salida+'Si no está registrado puede registrarse haciendo click <a href="registro.html" onclick="RegistroForm();">AQUÍ</a>', 'Iniciar sesión', function (username, password) {
		login(username, password);
	}, function(){ MostrarModalLogin(salida); });
}
function RegistroForm(){	
	myApp.calendar({
		input: '#calendar-nacimiento'
	});   
	myApp.closeModal(LoginModal);
}

function IngresarCodigo(){
	myApp.prompt('Ingrese el Código de su ticket', 'Ingresar Código', function (value) {		
		$$.get("http://iclient.com.ar/datos.php?tipo=code&code="+value, function (data) {
			if(data == 'OK'){
				navigator.notification.alert("¡Puntos agregados correctamente!",function(){},'Registro');
			}else{
				navigator.notification.alert(data,function(){},'Registro');
			}
		});
    });
}

function testLogin(){
	if(IniciadoSesion) return;
	var estru = window.localStorage.getItem("estru");
	var estrp = window.localStorage.getItem("estrp");
	if ((estru != null && estru != '') && (estrp != null && estrp != '')) {
		var dstru = CryptoJS.AES.decrypt(estru, "strU");
		var dstrp = CryptoJS.AES.decrypt(estrp, "strP");
		login(dstru.toString(CryptoJS.enc.Utf8), dstrp.toString(CryptoJS.enc.Utf8)); 		
	}else{
		MostrarModalLogin('');
	}
}
var push = false;
var PushRegID = "";
function ConfigPush(){
	try{
		 push = PushNotification.init({
			"android": {
				"senderID": "1089320506180"
			},
			"browser": {
				"pushServiceURL": 'https://fcm.googleapis.com/fcm/send',
				"applicationServerKey": "AIzaSyBTGxBJmnYhK3fc5OP6tY2ltnEI3TPlS9w"
			},
			"ios": {
				"senderID": "1089320506180",
				alert: "true",
				badge: true,
				sound: 'true'
			}
		});
		push.on('registration', function(data) {
			PushRegID=data.registrationId;
			var oldRegId = localStorage.getItem('registrationId');
			if (oldRegId !== data.registrationId) {
				// Save new registration ID
				localStorage.setItem('registrationId', data.registrationId);
				// Post registrationId to your app server as the value has changed
			}
			LocationConfigure();
			$$.post( "http://iclient.com.ar/datos.php?tipo=register", {id:data.registrationId});
		});
		push.on('error', function(e) { alert("push error = " + e.message); });
		push.on('notification', function(data) {
			navigator.notification.alert(
				data.message,         // message
				function(){
					mainView.router.load({url:'cuenta.html', reload: true});
				},                 // callback
				data.title,           // title
				'Ok'                  // buttonName
			);
	   });
	}
	catch(err) {
		console.log(err)
	}
}

function Escanear(){
	cordova.plugins.barcodeScanner.scan(
	  function (result) {
		  if(!result.cancelled){
			$$.get(result.text, function (data) {
				if(data == 'OK'){
					navigator.notification.alert("¡Puntos agregados correctamente!",function(){},'Registro');
				}else{
					navigator.notification.alert(data,function(){},'Registro');
				}
			});
		  }
	  },
	  function (error) {
			navigator.notification.alert("Error al leer el ticket",function(){},'Registro');
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

function FiltrarPorEmpresa(){
	var empresa = $$('#FiltroEmpresa').val();
	if(empresa == 'todas'){
		$$('.producto_item').show();
	}else{
		$$('.producto_item').hide();
		$$('.prod_empresa_'+empresa).show();
	}
}

function GetProductos(){
	$$.getJSON('http://iclient.com.ar/datos.php?tipo=productos', function (json) {
		//console.log(json);
		var html = '';
		$$.each(json, function (index, row) {
			html += '<div id="prod_'+row.id+'" class="producto_item prod_empresa_'+row.empresa_id+'">\
				<div class="card">\
                <div class="card-header">';
			if(row.URL != ''){
                    html += '<div class="avatar">\
                    	<img src="http://iclient.com.ar/archivos/productos/'+row.URL+'" alt="avatar">\
                    </div>';
			}
             html += '<div class="user flex-column">\
                        <div class="name">'+row.Titulo+'</div>\
                        <div class="time"><b>'+row.Puntos+'</b> puntos</div>\
                    </div>\
                </div>\
                <div class="card-content">\
                    <div class="text">'+row.Copete+'</div>\
                </div>\
                <div class="card-footer flex-row">\
                <a href="#" onclick="ProductoVerMas('+row.id+')" class="tool tool-border flex-rest-width link"><i class="f7-icons">eye</i> <span class="text">Ver más</span></a> \
                <a href="#" onclick="ProductoCanjear('+row.id+')" class="tool flex-rest-width link"><span class="f7-icons">navigation</span> <span class="text">Canjear</span></a></div>\
            	</div>\
            	<div class="descripcion_larga" style="display:none">'+row.Descripcion+'</div>\
			</div>';			
		}); 
		$$('.productos_lista').html(html);
		
		var empresas_html = '<option value="todas" selected>Todas</option>';
		$$.each(Empresas, function (index, row) {
			if($$('.prod_empresa_'+row.id).length > 0){
				empresas_html += '<option value="'+row.id+'">'+row.Nombre+'</option>';
			}
		});
		$$('#FiltroEmpresa').html(empresas_html);
	});
}
function ProductoVerMas(id){
	var html = $$('#prod_'+id).html();
	$$('.popup-producto .contenido').html(html);
	$$('.popup-producto .contenido .card-footer').remove();
	$$('.popup-producto .descripcion_larga').show();
	$$('.popup-producto .canjear').attr('onclick','ProductoCanjear('+id+')');
	myApp.popup('.popup-producto');
}
function ProductoCanjear(id){
	$$.getJSON('http://iclient.com.ar/datos.php?tipo=canje&id='+id, function (json) {
		if(json != 'OK'){
			navigator.notification.alert(json['msg'],function(){},'Iclient');
			return;
		}
		
		myApp.modal({
			title: 'Confirmar canje',
			text: '¿Esta seguro que desea canjear "'+$$('#prod_'+id+' .name').html()+'" por '+$$('#prod_'+id+' .time').html()+'.?',
			buttons: [
			  {
				text: 'No'
			  },
			  {
				text: 'Si',
				bold: true,
				onClick: function () {
				  $$.getJSON('http://iclient.com.ar/datos.php?tipo=do_canje&id='+id, function (json) {
					if(json != 'OK'){
						navigator.notification.alert(json['msg'],function(){},'Iclient');
						return;
					}
					navigator.notification.alert('Canje realizado correctamente',function(){},'Iclient');
					mainView.router.load({url:'historial.html', reload: true});
				  });
				}
			  },
			]
		  });
	});
}

function GetHistorial(){
	$$.getJSON('http://iclient.com.ar/datos.php?tipo=historial', function (json) {
		//console.log(json);
		var html = '';
		$$.each(json, function (index, row) {
			if(row.Usado == 'Y'){
				var CODE = 'Canje ya utilizado';
				var style = ' style="background-color: #DDD;"';	
			}else{
				var CODE = 'CODIGO: <b>'+row.Codigo+'</b>';
				var style = '';	
			}
			
			html += '<div id="histo_'+row.id+'">\
				<div class="card" '+style+'>\
                <div class="card-header">';
			if(row.URL != ''){
                    html += '<div class="avatar">\
                    	<img src="http://iclient.com.ar/archivos/productos/'+row.URL+'" alt="avatar">\
                    </div>';
			}
             html += '<div class="user flex-column">\
                        <div class="name">'+row.Titulo+'</div>\
                        <div class="time">'+CODE+'</div>\
                    </div>\
                </div>\
                <div class="card-content">\
                    <div class="text">'+row.Copete+'</div>\
                </div>\
                <div class="card-footer flex-row">\
                	<a href="#" onclick="HistorialVerMas('+row.id+')" class="tool tool-border flex-rest-width link"><i class="f7-icons">eye</i> <span class="text">Ver más</span></a> \
            	</div>\
            	</div>\
            	<div class="descripcion_larga" style="display:none">'+row.Descripcion+'</div>\
			</div>';			
		}); 
		$$('.historial_lista').html(html);
	});
}
function HistorialVerMas(id){
	var html = $$('#histo_'+id).html();
	$$('.popup-historial .contenido').html(html);
	$$('.popup-historial .contenido .card-footer').remove();
	$$('.popup-historial .descripcion_larga').show();
	myApp.popup('.popup-historial');
}



function LocationConfigure(){
	BackgroundGeolocation.configure({
    locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER,
    desiredAccuracy: BackgroundGeolocation.MEDIUM_ACCURACY,
    stationaryRadius: 50,
    distanceFilter: 50,
    notificationTitle: 'Iclient tracking',
    notificationText: 'Iclient en segundo plano',
    debug: false,
    interval: 60000,
    fastestInterval: 480000,
    url: 'http://iclient.com.ar/datos.php?tipo=location',
	stopOnTerminate: false,
	startOnBoot: true,
    // customize post properties
    postTemplate: {
      lat: '@latitude',
      lon: '@longitude',
      pushid: PushRegID
    }
  });
 
  BackgroundGeolocation.on('error', function(error) {
    console.log('[ERROR] BackgroundGeolocation error:', error.code, error.message);
  });
 
  BackgroundGeolocation.on('start', function() {
    console.log('[INFO] BackgroundGeolocation service has been started');
  });
 
  BackgroundGeolocation.on('stop', function() {
    console.log('[INFO] BackgroundGeolocation service has been stopped');
  });
 
  BackgroundGeolocation.on('authorization', function(status) {
    console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
    if (status !== BackgroundGeolocation.AUTHORIZED) {
      // we need to set delay or otherwise alert may not be shown
      setTimeout(function() {
        var showSettings = confirm('Esta aplicacion requiere permisos de ubicacion.');
        if (showSetting) {
          return BackgroundGeolocation.showAppSettings();
        }
      }, 1000);
    }
  });
 
  BackgroundGeolocation.on('background', function() {
    console.log('[INFO] App is in background');
  });
 
  BackgroundGeolocation.on('foreground', function() {
    console.log('[INFO] App is in foreground');
  });
 
  BackgroundGeolocation.checkStatus(function(status) {
    console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
    console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
    console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);
 
    // you don't need to check status before start (this is just the example)
    if (!status.isRunning) {
      BackgroundGeolocation.start(); //triggers start on start event
    }
  });
  
  BackgroundGeolocation.start();
}
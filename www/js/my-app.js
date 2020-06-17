var myApp = new Framework7({
	 pushState: false,
	 swipePanel: 'left',
	 cache: false,
	 modalUsernamePlaceholder:'E-Mail',
	 modalPasswordPlaceholder:'Contraseña',
	 modalButtonOk:'Aceptar',
	 modalButtonCancel: 'Cancelar',
	 modalTitle: 'iClient'
});

function TraduceAllTexts(){
	myApp.params.modalPasswordPlaceholder=traducir('Contraseña');
	myApp.params.modalButtonOk=traducir('Aceptar');
	myApp.params.modalButtonCancel=traducir('Cancelar');
    $$('lng, option, button').each(function(index, element){
        var html = $$(element).html();
        var attr = $$(element).attr('original-lng');
        if(typeof attr !== "undefined" && attr != "" && attr != null) html = attr;
        var traduccion = traducir(html);
        $$(element).html(traduccion);
        $$(element).attr('original-lng', html);
    });
    $$('input, textarea').each(function(index, element){
        var html = $$(element).attr('placeholder');
        var attr = $$(element).attr('original-ph-lng');
        if(typeof attr !== "undefined" && attr != "" && attr != null) html = attr;
        var traduccion = traducir(html);
        $$(element).attr('placeholder',traduccion);
        $$(element).attr('original-ph-lng', html);
    });
}

function showMessage(message, title, callbackOk){
	title = title || BXL_TITLE;
	myApp.alert(message, title, callbackOk);
}
function showConfirm(message, title, callbackOk, callbackCancel){
	title = title || BXL_TITLE;
	myApp.confirm(message, title, callbackOk, callbackCancel);
}

var monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto' , 'Septiembre' , 'Octubre', 'Noviembre', 'Diciembre'];
var dayNamesShort = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
var monthPickerTemplate = '<div class="picker-calendar-month-picker"><a href="#" class="link icon-only picker-calendar-prev-month"><i class="f7-icons">chevron_left</i></a><span class="current-month-value"></span><a href="#" class="link icon-only picker-calendar-next-month"><i class="f7-icons">chevron_right</i></a></div>';
var yearPickerTemplate = '<div class="picker-calendar-year-picker"><a href="#" class="link icon-only picker-calendar-prev-year"><i class="f7-icons">chevron_left</i></a><span class="current-year-value"></span><a href="#" class="link icon-only picker-calendar-next-year"><i class="f7-icons">chevron_right</i></a></div>';

var $$ = Dom7;

var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true
});

$$(document).on('deviceready', function() {
	document.addEventListener("backbutton", function (e) { 
		e.preventDefault();
        /*
		if (mainView.activePage.name === 'index' || mainView.activePage.name === 'control_lista') {
			showConfirm(traducir("Desea salir de la aplicación?"), traducir('Salir'),function(){  navigator.app.exitApp(); },function(){});
		} else {
			mainView.router.back();
		}*/
		mainView.router.back();
		return false;
	}, false ); 
	testLogin();//Make sure to get at least one GPS coordinate in the foreground before starting background services
	//$$('.tab-link').eq(0).trigger('click');
});

$$(document).on('page:back', function (e) {
	var name = $$('.page-on-left').attr('data-page');
	$$('.tab-link-active').removeClass('tab-link-active');
	$$('.tab-link.ln_'+name).addClass('tab-link-active');
	CreateTabBarSup();
});

function CreateTabBarSup(){
	if($$('.tab-link-active').length == 0){
		$$('.tab-sup').remove();
		return;
	}
	var left = $$('.tab-link-active').index();
	if($$('.tab-sup').length == 0){
		$$('.toolbar').append('<div class="tab-sup" style="left:0%; width:20%;"></div>');
	}
	$$('.tab-sup').css('left', (left*20)+"%");
}

$$(document).on('click', '.tab-link', function (e) {
    var url = $$(this).attr('href');
    var tiempo = 600;
    if(mainView.activePage.name == 'index'){
        tiempo = 10;
    }else{
        mainView.router.back({url:'index.html'});
        mainView.history = ['index.html'];
    }
    setTimeout(function(){
        //$$('.pages > div:first-child').remove();
        $$('.tab-link-active').removeClass('tab-link-active');
        $$(this).addClass('tab-link-active');
        CreateTabBarSup();
        if(url == 'index.html'){
            if(mainView.activePage.name != 'index') goToHome();
        }else{
            mainView.router.loadPage(url);
        }
    },tiempo);
});

function QRSelect(){	
	$$('.tab-link-active').removeClass('tab-link-active');
  var xxxx = myApp.modal({
    title:  traducir('Cargar saldo'),
    text: '',
    verticalButtons: true,
    buttons: [
      {
        text: 'Scanner QR',
        onClick: function() {
          Escanear();
        }
      },
      {
        text: traducir('Ingresar Código'),
        onClick: function() {
          IngresarCodigo();
        }
      },
      {
        text: traducir('Cerrar'),
        onClick: function() {
          myApp.closeModal(xxxx);
        }
      }
    ]
  })
}

var firstHome = true;
function goToHome(){
	$$('.page-on-left, .navbar-on-left').remove();
	if(firstHome){
		TraerSlider();
		MarcasYBanners();
		firstHome = false;
	}else{
		//mainView.history = ['index.html'];
		mainView.router.back({url:'index.html'});
		MarcasYBanners();
	}
}

myApp.onPageInit('cuenta', function (page) {
	myApp.closePanel();
})

myApp.onPageInit('registro', function (page) {
	myApp.closePanel();
})

myApp.onPageAfterAnimation('index', function (page){
	mainView.showToolbar(true);
	$$('.tab-sup').remove();
	$$('.tab-link-active').removeClass("tab-link-active");
})
var slides = '';
function TraerSlider(){		
	$$.getJSON('http://iclient.com.ar/datos.php?tipo=slider', function (json) {
		$$.each(json, function (index, row) {
			slides = slides+'<div class="swiper-slide"><img src="http://iclient.com.ar'+row.Foto+'" style="width:100%;" /></div>';
		});
		DeclararSlider();
	});
}
function DeclararSlider(){
	if(slides == '') return;
		var html = '<div class="swiper-container swiper-0">'+
							'<div class="swiper-pagination"></div>'+
							'<div class="swiper-wrapper">'+slides+
							'</div>'+
							'<div class="f7-icons swiper-button-prev">chevron_left</div>'+
							'<div class="f7-icons swiper-button-next">chevron_right</div>'+
						'</div>';
		$$('.SliderContainer').eq(0).html(html);
		mySwiper0 = myApp.swiper('.swiper-0', {
		  pagination: '.swiper-0 .swiper-pagination',
		  paginationHide: false,
		  width: $$(window).width(),
		  paginationClickable: true,
		  nextButton: '.swiper-button-next',
		  prevButton: '.swiper-button-prev',
		});
		var html = '<div class="swiper-container swiper-1">'+
							'<div class="swiper-pagination"></div>'+
							'<div class="swiper-wrapper">'+slides+
							'</div>'+
							'<div class="f7-icons swiper-button-prev">chevron_left</div>'+
							'<div class="f7-icons swiper-button-next">chevron_right</div>'+
						'</div>';
		$$('.SliderContainer').eq(1).html(html);
		mySwiper1 = myApp.swiper('.swiper-1', {
		  pagination: '.swiper-1 .swiper-pagination',
		  paginationHide: false,
		  width: $$(window).width(),
		  paginationClickable: true,
		  nextButton: '.swiper-button-next',
		  prevButton: '.swiper-button-prev',
		});
}
function MarcasYBanners(){	
		$$.getJSON('http://iclient.com.ar/datos.php?tipo=empresas', function (json) {
			var html = '<div class="row">';
			Empresas = [];
			$$.each(json, function (index, row) {
				Empresas.push(row);
				if(row.URL != '') html += '<div class="col-50 tablet-25" align="center"><a href="#" onclick="VerEmpresa('+row.id+');"><img style="width:100%; max-width:100%;" src="http://iclient.com.ar/archivos/empresas/'+row.URL+'" data-rel="external" /><span>'+row.Porcentaje+'%</span></a></div>';
			});
			html += '</div>';
			//console.log(html);
			$$('.MarcasContainer').html(html);
		});
		
		HeightBanners = 0;
		$$.getJSON('http://iclient.com.ar/datos.php?tipo=banners', function (json) {
			$$.each(json, function (index, row) {
				MostrarBanner(row.Tipo,row.URL,row.producto_id,row.imagesize[0],row.imagesize[1],row.Link);
			});
		});
		
		$$.getJSON('http://iclient.com.ar/datos.php?tipo=verificada', function (json) {
			if(json != 'OK'){
				if($$('.noverificada').lenght == 0){
					$$('.navbar').append('<div class="noverificada" style="font-size: 15px; background: #b50000; color: #FFFFFF; text-align: center; margin-top: 44px;">'+traducir('Debe verificar su E-Mail')+'</div>');
				}
			}else{
				$$('.noverificada').remove();
			}
		});
}

var loaderprincipal_timeout = false;
function MostrarLoaderPrincipal(){
    $$('#LoaderPrincipal').show();
    loaderprincipal_timeout = setTimeout(function(){
        $$( '#LoaderPrincipal' ).hide();
    }, 30000);
}
function OcultarLoaderPrincipal(){
    if(loaderprincipal_timeout) clearTimeout(loaderprincipal_timeout);
    $$( '#LoaderPrincipal' ).hide();
}

var mySwiper0;
var mySwiper1;
var XAP_init = false;
var Empresas = [];
$$(document).on('pageInit', function (e) {	
	if(!XAP_init){		
		TraerSlider();
		MarcasYBanners();
		
		var bgupdates = window.localStorage.getItem("bgupdates");
		if (bgupdates == null || bgupdates == '' || bgupdates != 'off') {
			//
		}
		XAP_init = true;
	}
	
    var page = e.detail.page;
	
	$$('.tab-link-active').removeClass('tab-link-active');
	$$('.tab-link.ln_'+page.name).addClass('tab-link-active');
	CreateTabBarSup();
	
	//console.log(e);
	
    if (page.name === 'index') {
		testLogin();
		mainView.showToolbar(true);
		DeclararSlider();
		var html = '<div class="row">';
		$$.each(Empresas, function (index, row) {
			if(row.URL != '') html += '<div class="col-50 tablet-25" align="center"><a href="#" onclick="VerEmpresa('+row.id+');"><img style="width:100%; max-width:100%;" src="http://iclient.com.ar/archivos/empresas/'+row.URL+'" data-rel="external" /><span>'+row.Porcentaje+'%</span></a></div>';
		});
		html += '</div>';
		$$('.MarcasContainer').html(html);
	}else{
		mainView.showToolbar(true);
		//mainView.hideToolbar(true);
	}
	
    if (page.name === 'cuenta') {
		$$.getJSON('http://iclient.com.ar/datos.php?tipo=cuenta', function (json) {
			//console.log(json);
			var saldo = (parseFloat(json['Puntos'])-parseFloat(json['Canjes']));
			$$('#Datos_Nombre').html(json['Nombre']);
			$$('#Datos_DNI').html(json['DNI']);
			$$('#Datos_Email').html(json['Email']);
			$$('#Datos_Puntos').html(DatosUser['Moneda']+' '+(saldo.toFixed(2)+''));
			$$('#Datos_Tel').val(json['Telefono']);
			$$('#Datos_Genero').val(json['Genero']);
            
			//$$('#Datos_Provincia').val();
            MostrarLoaderPrincipal();
            $$.getJSON( "http://iclient.com.ar/datos.php?tipo=paises",
                function( jsonx ) {
                    var html = "";
                    $$.each(jsonx, function (index, row) {
                        html += '<option value="'+row['id']+'" '+((json['Pais'] == row['id']) ? 'selected':'')+'>'+row['Nombre']+' ('+row['Moneda']+')</option>';
                    });
                    $$('#Datos_Pais').html(html);
                    $$.getJSON( "http://iclient.com.ar/datos.php?tipo=provincias&pais="+document.getElementById('Datos_Pais').value,
                        function( json2 ) {
                            var html = "";
                            $$.each(json2, function (index2, row2) {
                                html += '<option value="'+row2['id']+'" '+((json['Provincia'] == row2['id']) ? 'selected':'')+'>'+row2['Nombre']+'</option>';
                            });
                            $$('#Datos_Provincia').html(html);
                            OcultarLoaderPrincipal();
                            $$('#Datos_Pais').off('change').on('change', function (e) {
                                MostrarLoaderPrincipal();
                                $$.getJSON( "http://iclient.com.ar/datos.php?tipo=provincias&pais="+document.getElementById('Datos_Pais').value,
                                    function( json3 ) {
                                        var html = "";
                                        $$.each(json3, function (index3, row3) {
                                            html += '<option value="'+row3['id']+'">'+row3['Nombre']+'</option>';
                                        });
                                        $$('#Datos_Provincia').html(html);
                                        OcultarLoaderPrincipal();
                                    }
                                );
                            });
                        }
                    );
                }
            );
            
			if(json['Nacimiento'] != '0000-00-00') $$('#calendar-nacimiento-cuenta').val(json['Nacimiento']);			
			else $$('#calendar-nacimiento-cuenta').val('');	
			myApp.calendar({
				input: '#calendar-nacimiento-cuenta',
				closeOnSelect: true,
				monthNames: monthNames,
				dayNamesShort: dayNamesShort,
				monthPickerTemplate: monthPickerTemplate,
				yearPickerTemplate: yearPickerTemplate
			});   
		});
	}
	
    if (page.name === 'solicitar_canje') {	
		var estru = window.localStorage.getItem("estru");
		var estrp = window.localStorage.getItem("estrp");
		if ((estru != null && estru != '') && (estrp != null && estrp != '')) {
			var dstru = CryptoJS.AES.decrypt(estru, "strU");
			var dstrp = CryptoJS.AES.decrypt(estrp, "strP");
					
			$$.post('http://iclient.com.ar/datos.php?tipo=getProdsEmpresa', {
					user:dstru.toString(CryptoJS.enc.Utf8),
					pass:dstrp.toString(CryptoJS.enc.Utf8)
			}, function (json) {
				json = JSON.parse(json);
				console.log(json); 
				$$('#Dinero_Producto').html('');
				var primero = true;
				$$.each(json, function (index, row) {
					$$('#Dinero_Producto').append('<option value="'+row['id']+'">'+row['Titulo']+'</option>');
					if(primero){
						$$('#Dinero_Producto_Front .item-title').html(row['Titulo']);
						$$('#Dinero_Producto_Front .item-after').html(row['id']);
					}
					primero = false;
				});
			});
		}
	}
	
    if (page.name === 'canjear') {
		GetProductos();
	}
	
    if (page.name === 'generados') {
		GetGenerados();
	}
	
    if (page.name === 'canjeados') {
		GetHistorialEmpresa();
	}
	
    if (page.name === 'registroform') {
		RegistroForm();
	}
		
    if (page.name === 'historial') {
		GetHistorial();
	}
    TraduceAllTexts();
	myApp.closePanel();
})

function ValidarForm(){
	myApp.prompt(traducir('Ingrese el código de verificación'), 'iClient', function(value){	
		var estru = window.localStorage.getItem("estru");
		var estrp = window.localStorage.getItem("estrp");
		if ((estru != null && estru != '') && (estrp != null && estrp != '')) {
			var dstru = CryptoJS.AES.decrypt(estru, "strU");
			var dstrp = CryptoJS.AES.decrypt(estrp, "strP");
			$$.post( "http://iclient.com.ar/datos.php?tipo=validar", {
					codigo:value,
					user:dstru.toString(CryptoJS.enc.Utf8),
					pass:dstrp.toString(CryptoJS.enc.Utf8)
				},
				function( data ) {
					data = JSON.parse(data);
					if (data["result"] == "error")
					{
						showMessage(data["message"],function(){},traducir('Error al validar código'));
					}
					else
					{
						myApp.confirm(traducir('El código')+' "'+data["Codigo"]+'" '+traducir('esta disponible para el producto')+' "'+data["Titulo"]+'". '+traducir('¿Desea utilizarlo?'), 'iClient', function(){
							$$.post( "http://iclient.com.ar/datos.php?tipo=utilizar_canje", {
									codigo:value,
									user:dstru.toString(CryptoJS.enc.Utf8),
									pass:dstrp.toString(CryptoJS.enc.Utf8)
								},
								function( data2 ) {
									data2 = JSON.parse(data2);
									showMessage(data2["message"],function(){},traducir('Validar código'));
								}
							);						
						});
					}
					
				}
			);
		}	
	});
}

var HeightBanners = 0;
function CloseBanner(tipo, height){
	if(tipo == 'TOP'){
		HeightBanners = HeightBanners - height;
		$$('body').css('padding-top','0px');
		$$('.bannertop').remove();
	}
	if(tipo == 'BOTTOM'){
		HeightBanners = HeightBanners - height;
		$$('body').css('padding-bottom','0px');
		$$('.bannerbottom').remove();
	}
	$$('body').css('height',Math.round($$(window).height() - HeightBanners)+'px');
	mySwiper1.update();
}
function MostrarBanner(tipo,url,producto,width,height, linkexterno){
	if(tipo == 'TOP'){
		var resultheight = Math.round($$('body').width() * height / width) + 1;
		var top_html = '<img class="bannertop" src="http://iclient.com.ar/archivos/banners/'+url+'" style="position:absolute; top:0; left:0; width:100%;" />';
		if(producto != '0') top_html = '<a href="#" onclick="ForceProductView('+producto+','+linkexterno+')" >'+top_html+'</a>';
		$$('body').prepend(top_html+'<a class="bannertop" href="#" onclick="CloseBanner(\'TOP\','+resultheight+');" style="position:absolute; right:5px; top:5px; background-color:#333; border-radius:50%; width: 25px;text-align: center;color: #fff;"><i class="f7-icons">close</i></a>');
		$$('body').css('padding-top',Math.round($$('body').width() * height / width)+'px');
		HeightBanners += resultheight;
	}
	if(tipo == 'BOTTOM'){
		var resultheight = Math.round($$('body').width() * height / width) + 1;
		var bot_html = '<img class="bannerbottom" src="http://iclient.com.ar/archivos/banners/'+url+'" style="position:fixed; bottom:0; left:0; width:100%;" />';
		if(producto != '0') bot_html = '<a href="#" onclick="ForceProductView('+producto+','+linkexterno+')" >'+bot_html+'</a>';
		$$('body').prepend(bot_html+'<a class="bannerbottom" href="#" onclick="CloseBanner(\'BOTTOM\','+resultheight+');" style="position:absolute; right:5px; bottom:5px; background-color:#333; border-radius:50%; width: 25px;text-align: center;color: #fff;"><i class="f7-icons">close</i></a>');
		$$('body').css('padding-bottom',Math.round($$('body').width() * height / width)+'px');
		HeightBanners += resultheight;
	}
	if(tipo == 'POPUP'){
		var popup_html = '<div class="popup popup-banner" style="background-color:#000; background-image:url(\'http://iclient.com.ar/archivos/banners/'+url+'\'); background-repeat:no-repeat; background-position:center center">'+
				'<a href="#" class="close-popup" style="position:absolute; top:5px; right:5px; display:block; z-index:999999;">Cerrar</a>'+
			'<div class="close-popup content-block" style="height: 100%; margin: 0; cursor: pointer;" '+((producto != '0') ? 'onclick="ForceProductView('+producto+','+linkexterno+')"' : '')+'>'+
			'</div>'+
		'</div>';
		$$('body').append(popup_html);
		myApp.popup('.popup-banner');
	}
	if(tipo == 'MODAL'){
		var modal_html = '<div class="picker-modal picker-banner">'+
						'<div class="toolbar">'+
						 ' <div class="toolbar-inner">'+
							'<div class="left"></div>'+
							'<div class="right"><a href="#" class="close-picker">'+traducir('Cerrar')+'</a></div>'+
						 ' </div>'+
						'</div>'+
						'<div class="picker-modal-inner" style="text-align:center">'+
						 '<img '+((producto != '0') ? 'onclick="ForceProductView('+producto+','+linkexterno+')"' : '')+' src="http://iclient.com.ar/archivos/banners/'+url+'" style="max-width: 100%; max-height: 100%; cursor:pointer" />'+
						'</div>'+
					  '</div>';
		$$('body').append(modal_html);
		myApp.pickerModal('.picker-banner');
	}
	
	$$('body').css('height',Math.round($$(window).height() - HeightBanners)+'px');
}
function ForceProductView(prodid,linkexterno){	
	if(prodid == '-1'){
		var url = linkexterno;
		if(url.substr(0,7) != 'http://' && url.substr(0,8) != 'https://') url = 'http://'+url;
		window.open(url, '_system', 'location=yes');
	}else{
		mainView.router.load({url:'canjear.html', reload: true});
		GetProductos(prodid);
	}
}

function ValidateEmail(email){
 
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
 
  var input = document.createElement('input');
 
  input.type = 'email';
  input.value = email;
 
  return typeof input.checkValidity == 'function' ? input.checkValidity() : re.test(email);
 
}

function Registrarme() {
	if(document.getElementById('formreg_name').value.trim() == ''){
		showMessage(traducir('Debe completar su nombre'),function(){},'Registro');
		return;
	}
	if(document.getElementById('formreg_dni').value.trim() == ''){
		showMessage(traducir('Debe completar su DNI'),function(){},'Registro');
		return;
	}
	if(document.getElementById('formreg_tel').value.trim() == ''){
		showMessage(traducir('Debe completar su Teléfono'),function(){},'Registro');
		return;
	}
	if(document.getElementById('formreg_mail').value.trim() == ''){
		showMessage(traducir('Debe completar su E-mail'),function(){},'Registro');
		return;
	}
	if(!ValidateEmail(document.getElementById('formreg_mail').value.trim())){
		showMessage(traducir('Debe ingresar un E-mail válido'),function(){},'Registro');
		return;
	}
	if(document.getElementById('formreg_pass').value.trim() == ''){
		showMessage(traducir('Debe completar su Contraseña'),function(){},'Registro');
		return;
	}
	if(document.getElementById('calendar-nacimiento').value.trim() == ''){
		showMessage(traducir('Debe completar su Fecha de Nacimiento'),function(){},'Registro');
		return;
	}
	if(!$$('#formreg_check').is(':checked')){
		showMessage(traducir('Debe aceptar los términos y condiciones del servicio'),function(){},'Registro');
		return;
	}
    //verificamos conexion y servidores
	$$.post( "http://iclient.com.ar/registro_usuario.php", {
			Nombre:document.getElementById('formreg_name').value,
			Genero:document.getElementById('formreg_genero').value,
			Pais:document.getElementById('formreg_pais').value,
			Provincia:document.getElementById('formreg_provincia').value,
			Nacimiento:document.getElementById('calendar-nacimiento').value,
			Tel:document.getElementById('formreg_tel').value,
			DNI:document.getElementById('formreg_dni').value,
			Email:document.getElementById('formreg_mail').value,
			Clave:document.getElementById('formreg_pass').value
		},
		function( data ) {
        	if (data == 'OK') {
				var userxx = document.getElementById('formreg_mail').value;
				var passxx = document.getElementById('formreg_pass').value;
				document.getElementById('formreg_name').value = '';
				document.getElementById('calendar-nacimiento').value = '';
				document.getElementById('formreg_tel').value = '';
				document.getElementById('formreg_dni').value = '';
				document.getElementById('formreg_mail').value = '';
				document.getElementById('formreg_pass').value = '';
				showMessage(traducir('Registro exitoso. Le enviamos un e-mail para verificar su cuenta (no olvide revisar su carpeta de SPAM).'),function(){},traducir('Registro'));
                mainView.router.back({url:'index.html'});
                MarcasYBanners();
                MostrarModalLogin("");
				//login(userxx, passxx);
				//mainView.router.load({url:'index.html', reload: true});
				//goToHome();
			}else{
				showMessage(data,function(){},traducir('Registro'));
			}
		}
	);
}
function GuardarDatos() {
	if(document.getElementById('Datos_Genero').value == ''){
		showMessage(traducir("Debe ingresar su Género."),function(){},traducir('Mis datos'));
		return;
	}
	if(document.getElementById('calendar-nacimiento-cuenta').value == ''){
		showMessage(traducir("Debe ingresar su Fecha de Nacimiento."),function(){},traducir('Mis datos'));
		return;
	}
	if(document.getElementById('Datos_Provincia').value == ''){
		showMessage(traducir("Debe ingresar su Provincia."),function(){},traducir('Mis datos'));
		return;
	}
	if(document.getElementById('Datos_Tel').value == ''){
		showMessage(traducir("Debe ingresar su Teléfono."),function(){},traducir('Mis datos'));
		return;
	}
	$$.post( "http://iclient.com.ar/datos.php?tipo=update_datos", {
			Genero:document.getElementById('Datos_Genero').value,
			Pais:document.getElementById('Datos_Pais').value,
			Provincia:document.getElementById('Datos_Provincia').value,
			Nacimiento:document.getElementById('calendar-nacimiento-cuenta').value,
			Tel:document.getElementById('Datos_Tel').value
		},
		function( data ) {
			//mainView.router.load({url:'index.html', reload: true});        
            $$.getJSON("http://iclient.com.ar/datos.php?tipo=datosUser", function(json){
                DatosUser = json;
                TraduceAllTexts();
            });
			goToHome();
		}
	);
}

function CrearCargaDinero() {
	if(document.getElementById('Dinero_Monto').value == ''){
		showMessage(traducir("Debe ingresar un monto."),function(){},traducir('Error al solicitar dinero'));
		return;
	}
	if(document.getElementById('Dinero_DNI').value == ''){
		showMessage(traducir("Debe ingresar un DNI."),function(){},traducir('Error al solicitar dinero'));
		return;
	}
	
	var estru = window.localStorage.getItem("estru");
	var estrp = window.localStorage.getItem("estrp");
	if ((estru != null && estru != '') && (estrp != null && estrp != '')) {
		var dstru = CryptoJS.AES.decrypt(estru, "strU");
		var dstrp = CryptoJS.AES.decrypt(estrp, "strP");
		$$.post( "http://iclient.com.ar/datos.php?tipo=cargarSaldo", {
				action:'checkdni',
				monto:document.getElementById('Dinero_Monto').value,
				dni:document.getElementById('Dinero_DNI').value,
				user:dstru.toString(CryptoJS.enc.Utf8),
				pass:dstrp.toString(CryptoJS.enc.Utf8)
			},
			function( data ) {
				data = JSON.parse(data);
				if (data["result"] == "error")
				{
					showMessage(data["message"],function(){},traducir('Error al cargar saldo'));
				}
				else
				{
					showMessage('La carga de saldo se realizó correctamente.',function(){},traducir('Error al cargar saldo'));
					OcultarLoaderPrincipal();		
					$$('#Dinero_Monto').val("");
					$$('#Dinero_DNI').val("");
					$$('#Canje_DNI').val("");
				}
				
			}
		);
	}	
}

function CrearSolicitudDinero() {
	if(document.getElementById('Dinero_Monto').value == ''){
		showMessage(traducir("Debe ingresar un monto."),function(){},traducir('Error al solicitar dinero'));
		return;
	}
	if(document.getElementById('Dinero_DNI').value == ''){
		showMessage(traducir("Debe ingresar un DNI."),function(){},traducir('Error al solicitar dinero'));
		return;
	}
	
	var estru = window.localStorage.getItem("estru");
	var estrp = window.localStorage.getItem("estrp");
	if ((estru != null && estru != '') && (estrp != null && estrp != '')) {
		var dstru = CryptoJS.AES.decrypt(estru, "strU");
		var dstrp = CryptoJS.AES.decrypt(estrp, "strP");
		$$.post( "http://iclient.com.ar/datos.php?tipo=payment", {
				action:'checkdni',
				monto:document.getElementById('Dinero_Monto').value,
				dni:document.getElementById('Dinero_DNI').value,
				user:dstru.toString(CryptoJS.enc.Utf8),
				pass:dstrp.toString(CryptoJS.enc.Utf8)
			},
			function( data ) {
				data = JSON.parse(data);
				if (data["result"] == "error")
				{
					showMessage(data["message"],function(){},traducir('Error al solicitar dinero'));
				}
				else
				{
					EsperarResultadoCanje(data["id"]);
				}
				
			}
		);
	}	
}
function CrearSolicitudCanje() {
	if(document.getElementById('Dinero_Producto').value == ''){
		showMessage(traducir("Debe ingresar un producto."),function(){},traducir('Error al solicitar dinero'));
		return;
	}
	if(document.getElementById('Canje_DNI').value == ''){
		showMessage(traducir("Debe ingresar un DNI."),function(){},traducir('Error al solicitar dinero'));
		return;
	}
	
	var estru = window.localStorage.getItem("estru");
	var estrp = window.localStorage.getItem("estrp");
	if ((estru != null && estru != '') && (estrp != null && estrp != '')) {
		var dstru = CryptoJS.AES.decrypt(estru, "strU");
		var dstrp = CryptoJS.AES.decrypt(estrp, "strP");
		$$.post( "http://iclient.com.ar/datos.php?tipo=canjearEmpresa", {
				producto:document.getElementById('Dinero_Producto').value,
				dni:document.getElementById('Canje_DNI').value,
				user:dstru.toString(CryptoJS.enc.Utf8),
				pass:dstrp.toString(CryptoJS.enc.Utf8)
			},
			function( data ) {
				data = JSON.parse(data);
				if (data["result"] == "error")
				{
					showMessage(data["message"],function(){},traducir('Error al solicitar dinero'));
				}
				else
				{
					EsperarResultadoCanje(data["id"]);
				}
				
			}
		);
	}	
}

var TimeoutSolCanje = false;
var IntervalSolCanje = false;
var idSolCanje = 0;
function EsperarResultadoCanje(id){
	idSolCanje = id;
	MostrarLoaderPrincipal();
	IntervalSolCanje = setInterval(function(){						
		$$.post( "http://iclient.com.ar/datos.php?tipo=pedidoCanjeHecho", {
				id:idSolCanje
			},
			function( data ) {
				if(data === "Y"){
					showMessage(traducir("La transacción se realizó correctamente."),function(){},traducir('Solicitud de dinero ACEPTADA'));
					OcultarLoaderPrincipal();		
					$$('#Dinero_Monto').val("");
					$$('#Dinero_DNI').val("");
					$$('#Canje_DNI').val("");
					clearInterval(IntervalSolCanje);
					clearTimeout(TimeoutSolCanje);
				}
				if (data === "C"){
					showMessage(traducir("Error: El usuario canceló el canje."),function(){},traducir('Error al solicitar dinero'));
					OcultarLoaderPrincipal();		
					clearInterval(IntervalSolCanje);
					clearTimeout(TimeoutSolCanje);
				}						
			}
		);
		
	}, 5000);
	TimeoutSolCanje = setTimeout(function(){
		showMessage(traducir("Error: No se pudo canjear el producto, el usuario no confirmó el canje."),function(){},traducir('Error al solicitar dinero'));
		clearInterval(IntervalSolCanje);
		OcultarLoaderPrincipal();
	}, 300000);
}

function CrearCupon() {
	if(document.getElementById('Cupon_Monto').value == ''){
		showMessage(traducir("Debe ingresar un monto."),function(){},traducir('Crear Cupon'));
		return;
	}
	var estru = window.localStorage.getItem("estru");
	var estrp = window.localStorage.getItem("estrp");
	if ((estru != null && estru != '') && (estrp != null && estrp != '')) {
		var dstru = CryptoJS.AES.decrypt(estru, "strU");
		var dstrp = CryptoJS.AES.decrypt(estrp, "strP");
		$$.post( "http://iclient.com.ar/datos.php?tipo=generarQR", {
				uso:document.getElementById('Cupon_Uso').value,
				monto:document.getElementById('Cupon_Monto').value,
				control:document.getElementById('Cupon_Control').value,
				DNI:document.getElementById('Cupon_DNI').value,
				user:dstru.toString(CryptoJS.enc.Utf8),
				pass:dstrp.toString(CryptoJS.enc.Utf8)
			},
			function( data ) {
				data = JSON.parse(data);
				console.log(data);
				if(data.result == 'error'){
					showMessage(data.message,function(){},traducir('Crear Cupon'));
					return;
				}
				
				var popup_html = '<div class="popup popup-qr" style="background-color:#000; background-image:url(\''+data.url+'\'); background-repeat:no-repeat; background-position:center center">'+
						'<a href="#" onclick="mainView.router.back()" class="close-popup" style="position:absolute; top:5px; right:5px; display:block; z-index:999999;">'+traducir('Cerrar')+'</a>'+
					'<div class="content-block" style="height: 100%; margin: 0; cursor: pointer;" onclick="window.open(\''+data.url+'\', \'_system\', \'location=yes\');">'+
					'</div>'+
				'</div>';
				$$('body').append(popup_html);
				myApp.popup('.popup-qr');
				window.open(data.url, "_system", "location=yes");
			}
		);
	}
}

var IniciadoSesion = false;
var TipoUsuario = false;
var DatosUser = {};
function login(strU, strP) {
    //verificamos conexion y servidores
	$$.post( "http://iclient.com.ar/login.php", {Email:strU, Clave:strP},
		function( data ) {
            if(data == 'NOVERIFICADO'){
				MostrarModalLogin('Debe verificar su E-Mail, le enviamos un correo a su cuenta, no olvide revisar SPAM.<br/>');
				$$('.olvidehref').css('margin-top', '18px');
                return;
            }
        	if (data == 'OK' || data == 'DATOS' || data == 'EMPRESA' || data == 'PERSONA_EMPRESA') {
				var estrU = CryptoJS.AES.encrypt(strU, "strU");
				var estrP = CryptoJS.AES.encrypt(strP, "strP");
				window.localStorage.setItem("estru", estrU);
				window.localStorage.setItem("estrp", estrP);
				IniciadoSesion = true;
				if(data == 'DATOS'){
					showMessage(traducir('Se necesitan completar datos personales'),function(){},traducir('Mis datos'));
					mainView.router.load({url:'cuenta.html', reload: true});
				}else if(data == 'EMPRESA'){
					IniciadoSesion = true;
					//mainView.router.load({url:'index.html'}); 
					goToHome();
					$$('.only_user').hide();
					$$('.only_empresa').show();
					myApp.params.swipePanel = 'left';
					$$('body').removeClass('nosidebar');
				}else if(data == 'PERSONA_EMPRESA'){
					IniciadoSesion = true;
					//mainView.router.load({url:'index.html'}); 
					goToHome();
					$$('.only_user').show();
					$$('.only_empresa').show();
					myApp.params.swipePanel = 'left';
					$$('body').removeClass('nosidebar');
				}else{ 
					//mainView.router.load({url:'index.html'}); 
					goToHome();
					$$('.only_empresa').hide();
					$$('.only_user').show();
					myApp.params.swipePanel = false;
					$$('body').addClass('nosidebar');
				}
                if(IniciadoSesion){
                    $$.getJSON("http://iclient.com.ar/datos.php?tipo=datosUser", function(json){
                        DatosUser = json;
                        TraduceAllTexts();
                    });
                    var applaunchCount = window.localStorage.getItem('launchCount');
                    //applaunchCount = false;
                    if(applaunchCount){
                    }else{
					    $$('#Tour').show();
                    }
                }
				ConfigPush();
			}else{
				MostrarModalLogin('Los datos no son correctos.<br/>');
				$$('.olvidehref').css('margin-top', '18px');
			}
		}
	);
}
function Recuperar() {
	myApp.closeModal('.modal');
    myApp.prompt('Ingrese su E-Mail', function (value) {		
		$$.post( "http://iclient.com.ar/datos.php?tipo=recupera", {mail:value}, function (data) {
			myApp.closeModal('.modal');
    		myApp.alert('Se envió un mail a "' + value + '". Con un link para recuperar su contraseña.');
			MostrarModalLogin('');
		});
    },function(){ myApp.closeModal('.modal'); MostrarModalLogin('');});
}

function LogOut() {
	window.localStorage.clear();
	IniciadoSesion = false;
	//mainView.router.load({url:'index.html', reload: true});
	goToHome();
}

var LoginModal;
function MostrarModalLogin(salida){
	myApp.modalLogin(salida+'Si no está registrado puede registrarse haciendo click <a href="registro.html" onclick="RegistroForm();">AQUÍ</a>.<br/> <a href="index.html" onclick="Recuperar();" class="olvidehref">Olvide mi contraseña</a>', 'Iniciar sesión', function (username, password) {
		login(username, password);
	}, function(){ MostrarModalLogin(salida); });
}
function RegistroForm(){	
	myApp.calendar({
		input: '#calendar-nacimiento',
		closeOnSelect: true,
		monthNames: monthNames,
		dayNamesShort: dayNamesShort,
		monthPickerTemplate: monthPickerTemplate,
		yearPickerTemplate: yearPickerTemplate
	});   
	myApp.closeModal(LoginModal);
    myApp.params.swipePanel = false;    
	mainView.hideToolbar(true);
    
    
	MostrarLoaderPrincipal();
	$$.getJSON( "http://iclient.com.ar/datos.php?tipo=paises",
		function( json ) {
            var html = "";
            $$.each(json, function (index, row) {
                html += '<option value="'+row['id']+'">'+row['Nombre']+' ('+row['Moneda']+')</option>';
            });
            $$('#formreg_pais').html(html);
            $$.getJSON( "http://iclient.com.ar/datos.php?tipo=provincias&pais="+document.getElementById('formreg_pais').value,
                function( json2 ) {
                    var html = "";
                    $$.each(json2, function (index2, row2) {
                        html += '<option value="'+row2['id']+'">'+row2['Nombre']+'</option>';
                    });
                    $$('#formreg_provincia').html(html);
                    OcultarLoaderPrincipal();
                    $$('#formreg_pais').off('change').on('change', function (e) {
	                    MostrarLoaderPrincipal();
                        if(document.getElementById('formreg_pais').value == '2'){
                            forceLang = 'EN';
                        }else{
                            forceLang = 'ES';
                        }
                        TraduceAllTexts();
                        $$.getJSON( "http://iclient.com.ar/datos.php?tipo=provincias&pais="+document.getElementById('formreg_pais').value,
                            function( json3 ) {
                                var html = "";
                                $$.each(json3, function (index3, row3) {
                                    html += '<option value="'+row3['id']+'">'+row3['Nombre']+'</option>';
                                });
                                $$('#formreg_provincia').html(html);
                                OcultarLoaderPrincipal();
                            }
                        );
                    });
                }
            );
		}
	);
}

function IngresarCodigo(){
	myApp.prompt('Ingrese el Código de su ticket', 'Ingresar Código', function (value) {		
		$$.get("http://iclient.com.ar/datos.php?tipo=code&code="+value, function (data) {
			if(data == 'OK'){
				showMessage("¡Saldo agregado correctamente!",function(){},'Registro');
			}else{
				showMessage(data,function(){},'Registro');
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
				"senderID": "1089320506180",
				"forceShow": true
			},
			"browser": {
				"pushServiceURL": 'https://fcm.googleapis.com/fcm/send',
				"applicationServerKey": "AIzaSyBTGxBJmnYhK3fc5OP6tY2ltnEI3TPlS9w"
			},
			"ios": {
				"senderID": "1089320506180",
				alert: "true",
				badge: true,
				sound: 'true',
				"forceShow": true
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
			console.log('Callback PUSH');
			console.log(data);
			if(typeof data.additionalData !== 'undefined'){
				var tipo = '';
				var prodid = '';
				if(typeof data.additionalData.tipo !== 'undefined') tipo = data.additionalData.tipo;
				if(typeof data.additionalData['gcm.notification.tipo'] !== 'undefined') tipo = data.additionalData['gcm.notification.tipo'];
				if(typeof data.additionalData.prodid !== 'undefined') prodid = data.additionalData.prodid;
				if(typeof data.additionalData['gcm.notification.prodid'] !== 'undefined') prodid = data.additionalData['gcm.notification.prodid'];
				if(tipo == 'PUNTOS'){
					showMessage(
						data.message,         // message
						function(){
							mainView.router.load({url:'cuenta.html', reload: true});
						},                 // callback
						data.title,           // title
						'Ok'                  // buttonName
					);
				}
				if(tipo == 'PRODUCTO'){
					mainView.router.load({url:'canjear.html', reload: true});
					GetProductos(prodid);
				}
				if(tipo == 'EMPRESA'){
					VerEmpresa(prodid);
				}
				if(tipo == 'SECCION'){
					mainView.router.load({url:prodid, reload: true});
				}
				if(tipo == 'PEDIDO_CANJE'){
					myApp.confirm(data.message+'. ¿Desea realizar el canje?', "Canjear Saldo", function(){
						$$.get("http://iclient.com.ar/datos.php?tipo=pedidoCanjeCambio&id="+prodid+"&result=Y", function (data) { });
					}, function(){
						$$.get("http://iclient.com.ar/datos.php?tipo=pedidoCanjeCambio&id="+prodid+"&result=C", function (data) { });
					})
				}
				if(tipo == 'BANNER'){
					$$.getJSON('http://iclient.com.ar/datos.php?tipo=banner&id='+prodid, function (json) {
						$$.each(json, function (index, row) {
							MostrarBanner(row.Tipo,row.URL,row.producto_id,row.imagesize[0],row.imagesize[1],row.Link);
						});
					});
				}
				if(tipo == 'WEB'){
					var url = prodid;
					if(url.substr(0,7) != 'http://' && url.substr(0,8) != 'https://') url = 'http://'+url;
					window.open(url, '_system', 'location=yes');
				}
			}
	   });
	}
	catch(err) {
		console.log(err);
        LocationConfigure();
	}
}

function Escanear(){
	cordova.plugins.barcodeScanner.scan(
	  function (result) {
			$$('.tab-link-active').removeClass('tab-link-active');
			CreateTabBarSup();
		  if(!result.cancelled){
			$$.get(result.text, function (data) {
				if(data == 'OK'){
					showMessage("¡Saldo agregado correctamente!",function(){},'Registro');
				}else{
					showMessage(data,function(){},'Registro');
				}
			});
		  }
	  },
	  function (error) {
			showMessage("Error al leer el ticket",function(){},'Registro');
			$$('.tab-link-active').removeClass('tab-link-active');
			CreateTabBarSup();
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

function GetGenerados(id){
  	id = typeof id !== 'undefined' ? id : 0;
	$$.getJSON('http://iclient.com.ar/datos.php?tipo=cupones_generados', function (json) {
		//console.log(json);
		var html = '';
		$$.each(json, function (index, row) {
			html += '<div id="prod_'+row.id+'" class="producto_item">\
				<div class="card">\
                <div class="card-header">';
			if(row.URL != ''){
                    html += '<div class="avatar">\
                    	<img src="http://iclient.com.ar/archivos/qr/'+row.URL+'">\
                    </div>';
			}
             html += '<div class="user flex-column">\
                        <div class="name">'+row.AlfaNumerico+'</div>\
                        <div class="time" style="font-size: 0.8em;">Saldo: <b>$'+row.Puntos+'</b> | Monto: <b>$'+row.Monto+'</b> | Costo: <b>$'+row.Costo+'</b> | Nº Control: <b>'+row.Control+'</b></div>\
                    </div>\
                </div>\
                <div class="card-content">\
                    <div class="text">'+row.Usuario+'</div>\
                </div>\
			</div>';			
		}); 
		$$('.generados_lista').html(html);
	});
}
function GetProductos(id){
  	id = typeof id !== 'undefined' ? id : 0;
	MostrarLoaderPrincipal();
	$$.getJSON('http://iclient.com.ar/datos.php?tipo=productos', function (json) {
		//console.log(json);
		var html = '';
		$$.each(json, function (index, row) {
			html += '<div id="prod_'+row.id+'" class="producto_item prod_empresa_'+row.empresa_id+'">\
				<div class="card">\
                <div class="card-header">';
			if(row.URL != ''){
                    html += '<div class="avatar">\
                    	<img src="'+row.URL+'" alt="avatar">\
                    </div>';
			}
             html += '<div class="user flex-column">\
                        <div class="name">'+row.Titulo+'</div>\
                        <div class="time"><b>'+DatosUser['Moneda']+' '+row.Puntos+'</b></div>\
                    </div>\
                </div>\
                <div class="card-content">\
                    <div class="text">'+row.Copete+'</div>\
                </div>\
                <div class="card-footer flex-row">\
                <a href="#" onclick="ProductoVerMas('+row.id+')" class="tool tool-border flex-rest-width link"><span class="text">Ver más</span></a> \
                <a href="#" onclick="ProductoCanjear('+row.id+')" class="tool flex-rest-width link"><span class="text">Canjear</span></a></div>\
            	</div>\
            	<div class="descripcion_larga" style="display:none">'+row.Descripcion+'</div>\
			</div>';			
		}); 
		$$('.productos_lista').html(html);
	    OcultarLoaderPrincipal();
		
		var empresas_html = '<option value="todas" selected>Todas</option>';
		$$.each(Empresas, function (index, row) {
			if($$('.prod_empresa_'+row.id).length > 0){
				empresas_html += '<option value="'+row.id+'">'+row.Nombre+'</option>';
			}
		});
		$$('#FiltroEmpresa').html(empresas_html);
		if(id != 0){
			ProductoVerMas(id);
		}
	});
}
function VerEmpresa(id){
	$$.getJSON('http://iclient.com.ar/datos.php?tipo=verempresa&id='+id, function (datos) {
		$$('.popup-empresa .name').html(datos.Nombre);
		var text = '<div class="list-block"><ul>';
		if(datos.Direccion != ''){
			text += '<li class="item-content"><div class="item-media"><i class="f7-icons">home</i></div><div class="item-inner"><div class="item-title" style="font-size: 14px; white-space: normal;">'+datos.Direccion+'</div></div></li>';
		}
		if(datos.Telefono != ''){
			var tel = datos.Telefono.replace(' ','');
			var tel = datos.Telefono.replace('-','');
			text += '<li class="item-content"><div class="item-media"><i class="f7-icons">phone</i></div><div class="item-inner"><a href="tel:'+tel+'" class="item-title external" style="font-size: 14px; white-space: normal;">'+datos.Telefono+'</a></div></li>';
		}
		if(datos.Horario != ''){
			text += '<li class="item-content"><div class="item-media"><i class="f7-icons">time</i></div><div class="item-inner"><div class="item-title" style="font-size: 14px; white-space: normal;">'+datos.Horario+'</div></div></li>';
		}
		if(datos.Email != ''){
			text += '<li class="item-content"><div class="item-media"><i class="f7-icons">email</i></div><div class="item-inner"><a href="mailto:'+datos.Email+'" class="item-title external" style="font-size: 14px; white-space: normal;">'+datos.Email+'</a></div></li>';
		}
		if(datos.Web != ''){
			var url = datos.Web;
			if(url.substr(0,7) != 'http://' && url.substr(0,8) != 'https://') url = 'http://'+url;
			text += '<li class="item-content"><div class="item-media"><i class="f7-icons">world</i></div><div class="item-inner"><a href="'+url+'" class="item-title external" style="font-size: 14px; white-space: normal;" target="_blank">'+datos.Web+'</a></div></li>';
		}
		text += '</ul></div>';
		$$('.popup-empresa .text').html(text);
		if(datos.Lat == ''){
			$$('.popup-empresa .map').html('');
		}else{
			$$('.popup-empresa .map').html('<iframe src="https://maps.google.com/maps?q='+datos.Lat+','+datos.Long+'&hl=en&z=14&amp;output=embed" width="100%" height="70%" frameborder="0" style="border:0" allowfullscreen></iframe>');
		}
		$$('.popup-empresa img').attr('src','http://iclient.com.ar/archivos/empresas/'+datos.URL);
		
		$$('#CT_EMP_ID').val(id);
		$$('#CT_EMP_Asunto').val('');
		$$('#CT_EMP_Mensaje').val('');
			
		myApp.popup('.popup-empresa');
	});
}
function EnviarContactoEmpresa(){	
	$$.post( "http://iclient.com.ar/contacto-empresa.php", {
			id:$$('#CT_EMP_ID').val(),
			Asunto:$$('#CT_EMP_Asunto').val(),
			Mensaje:$$('#CT_EMP_Mensaje').val()
		},
		function( data ) {
			//$$('#CT_EMP_ID').val('');
			$$('#CT_EMP_Asunto').val('');
			$$('#CT_EMP_Mensaje').val('');
        	if (data == 'OK') {
				showMessage('Mensaje enviado correctamente',function(){},'Contacto');
			}else{
				showMessage(data,function(){},'Contacto');
			}
		}
	);
}
function EnviarContacto(){	
	$$.post( "http://iclient.com.ar/contacto.php", {
			Tipo:'SOPORTE',
			Nombre:$$('#CT_SOP_Nombre').val(),
			Mail:$$('#CT_SOP_Mail').val(),
			Asunto:$$('#CT_SOP_Asunto').val(),
			Mensaje:$$('#CT_SOP_Mensaje').val()
		},
		function( data ) {
			$$('#CT_SOP_Nombre').val('');
			$$('#CT_SOP_Mail').val('');
			$$('#CT_SOP_Asunto').val('');
			$$('#CT_SOP_Mensaje').val('');
        	if (data == 'OK') {
				showMessage('Mensaje enviado correctamente',function(){},'Contacto');
			}else{
				showMessage(data,function(){},'Contacto');
			}
		}
	);
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
			showMessage(json['msg'],function(){},'iClient');
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
						showMessage(json['msg'],function(){},'iClient');
						return;
					}
					showMessage('Canje realizado correctamente',function(){},'iClient');
					mainView.router.load({url:'historial.html', reload: true});
				  });
				}
			  },
			]
		  });
	});
}

function UsarCupon(id, code){
	showConfirm("¿Está seguro que desea usar el cupón \""+code+"\"?", 'Usar Cupón',function(){
		$$.getJSON('http://iclient.com.ar/datos.php?tipo=usarCupon&id='+id, function (json) {
			if(json != 'OK'){
				showMessage(json['msg'],function(){},'iClient');
			}else{
				showMessage('El cupón se usó correctamente.',function(){},'iClient');
				$$('.historial_lista').html('<div class="preloader loader loading"></div>');
				GetHistorialEmpresa();
			}
		});
	},function(){});
}
function DesUsarCupon(id, code){
	showConfirm("¿Está seguro que desea reactivar el cupón \""+code+"\"?", 'Usar Cupón',function(){
		$$.getJSON('http://iclient.com.ar/datos.php?tipo=desUsarCupon&id='+id, function (json) {
			if(json != 'OK'){
				showMessage(json['msg'],function(){},'iClient');
			}else{
				showMessage('El cupón se reactivó correctamente.',function(){},'iClient');
				$$('.historial_lista').html('<div class="preloader loader loading"></div>');
				GetHistorialEmpresa();
			}
		});
	},function(){});
}
function GetHistorialEmpresa(){
	$$.getJSON('http://iclient.com.ar/datos.php?tipo=historialEmpresa', function (json) {
		//console.log(json);
		var html = '';
		$$.each(json, function (index, row) {
			if(row.Usado == 'Y'){
				var CODE = 'Canje ya utilizado ("'+row.Codigo+'") el '+row.Fecha;
				var style = ' style="background-color: #EEE;"';	
				var boton = '<a href="#" onclick="DesUsarCupon('+row.id+',\''+row.Codigo+'\')" class="tool tool-border flex-rest-width link red"><span class="text">Deshacer</span></a>';	
			}else{
				var CODE = 'CODIGO: <b>'+row.Codigo+'</b>';
				var style = '';	
				var boton = '<a href="#" onclick="UsarCupon('+row.id+',\''+row.Codigo+'\')" class="tool tool-border flex-rest-width link green"><span class="text">Usar cupón</span></a>';	
			}
            var CONBOTON = true;
			if(row.Titulo == 'Pago con iClient' || row.Titulo == 'Carga de Saldo'){
				var CODE = 'Fecha: '+row.Fecha;
                CONBOTON = false;
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
                </div>';
            if(CONBOTON){
                html += '<div class="card-footer flex-row">'+boton+'</div>\
            	</div>';
            }
             html += '<div class="descripcion_larga" style="display:none">'+row.Descripcion+'</div>\
			</div>';			
		}); 
		$$('.historial_lista').html(html);
	});
}


function GetHistorial(){
	$$.getJSON('http://iclient.com.ar/datos.php?tipo=historial', function (json) {
		//console.log(json);
		var html = '';
		$$.each(json, function (index, row) {
			if(row.Usado == 'Y'){
				var CODE = traducir('Canje ya utilizado el ')+row.Fecha;
				var style = ' style="background-color: #EEE;"';	
			}else{
				var CODE = traducir('CODIGO')+': <b>'+row.Codigo+'</b>';
				var style = '';	
			}
            var CONBOTON = true;
			if(row.Titulo == 'Pago con iClient' || row.Titulo == 'Carga de Saldo'){
				var CODE = traducir('Fecha')+': '+row.Fecha;
                CONBOTON = false;
            }
            
			row.Titulo = traducir(row.Titulo);
                
			html += '<div id="histo_'+row.id+'">\
				<div class="card" '+style+'>\
                <div class="card-header">';
			if(row.URL != ''){
                    html += '<div class="avatar">\
                    	<img src="'+row.URL+'" alt="avatar">\
                    </div>';
			}
             html += '<div class="user flex-column">\
                        <div class="name">'+row.Titulo+'</div>\
                        <div class="time">'+CODE+'</div>\
                    </div>\
                </div>\
                <div class="card-content">\
                    <div class="text">'+row.Copete+'</div>\
                </div>';
            if(CONBOTON){
                html += '<div class="card-footer flex-row">\
                	<a href="#" onclick="HistorialVerMas('+row.id+')" class="tool tool-border flex-rest-width link"><span class="text">'+traducir('Ver más')+'</span></a> \
            	</div>';
               }
             html += '</div>\
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

var LocationInterval = false;
function LocationConfigure(){
    if(LocationInterval) clearInterval(LocationInterval);
    LocationAccion();
    setInterval(LocationAccion, 40000);
}
function LocationAccion(){
    console.log('Location...');
    navigator.geolocation.getCurrentPosition(function(position){
        console.log(position);
        $$.post( "http://iclient.com.ar/datos.php?tipo=location", {
                lat:position.coords.latitude,
                lon:position.coords.longitude,
                pushid:PushRegID
            }
        );
    }, function(error){ console.log(error); });
}
/*
function LocationConfigure(){
	BackgroundGeolocation.configure({
    locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER,
    desiredAccuracy: BackgroundGeolocation.MEDIUM_ACCURACY,
    stationaryRadius: 50,
    distanceFilter: 50,
    notificationTitle: 'Iclient tracking',
    notificationText: 'Iclient en segundo plano',
    debug: false,
    notificationsEnabled: false,
    interval: 60000,
    fastestInterval: 120000,
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
}*/
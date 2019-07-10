var langs = {};
langs['EN'] = {
    "Canjes realizados" : "Exchanges made",
    "Cerrar Sesión" : "Logout",
    "Contacto" : "Contact",
    "Guardar" : "Save",
    "Tu Saldo" : "Your balance",
    "Mi cuenta" : "My account",
    "Volver" : "Back",
    "Nombre" : "Name",
    "DNI" : "Document",
    "Género" : "Gender",
    "Nacimiento" : "Birthdate",
    "País" : "Country",
    "Provincia" : "State",
    "Teléfono" : "Phone",
    "Menú Empresas" : "Company Menu",
    "Crear Cupon" : "Create a Coupon",
    "Cupones generados" : "Generated Coupons",
    "Canjes realizados a mi" : "Exchanges made to me",
    "Solicitar dinero" : "Request Money",
    "Solicitar canje" : "Request Exchange",
    "Cargar saldo" : "Top Up account balance",
    "Validar código" : "Validate Code",
    "Locales Adheridos" : "Stores attached",
    "Espere" : "Wait",
    "Aceptar" : "OK",
    "Cancelar" : "Cancel",
    "Contraseña" : "Password",
    "Enviar mensaje" : "Send Message",
    "Canjear" : "Do Exchange",
    "Ingresar Código" : "Enter Code"
};
function traducir(string){
    var lang = DatosUser['Ididoma'] || 'ES';
    if(lang != 'ES' && langs[lang].indexOf(string) > -1){
        return langs[lang][string];
    }
    return string;
}
var langs = {};
langs['EN'] = {
    "Canjes realizados" : "Exchanges made",
    "Cerrar Sesión" : "Logout",
    "Contacto" : "Contact",
    "Guardar" : "Save",
    "Creá tu cuenta" : "Create an account",
    "Si aún no te has registrado" : "If you haven't register yet",
    "Iniciar Sesión" : "Login",
    "Ingresá con tu E-mail" : "Login with Email",
    "Ingresá con SMS" : "Login with SMS",
    "Tu Saldo" : "Your balance",
    "Mi cuenta" : "My account",
    "Ingresa tu número de teléfono" : "Enter your phone number",
    "Volver" : "Back",
    "Nombre" : "Name",
    "Empresa" : "Company",
    "DNI" : "ID",
    "Todas" : "All",
    "Siguiente" : "Next",
    "Género" : "Gender",
    "Masculino" : "Male",
    "Acepto los" : "I accept the",
    "Términos y Condiciones" : "terms and conditions",
    "Femenino" : "Female",
    "Nacimiento" : "Birthdate",
    "Teléfono Celular" : "Phone Number",
    "País" : "Country",
    "Provincia" : "State",
    "Teléfono" : "Phone",
    "Menú Empresas" : "Company Menu",
    "Nombre y Apellido" : "Full Name",
    "Crear Cupon" : "Create a Coupon",
    "Cupones generados" : "Generated Coupons",
    "Canjes realizados a mi" : "Exchanges made to me",
    "Solicitar dinero" : "Request Money",
    "Solicitar canje" : "Request Exchange",
    "Cargar saldo" : "Balance charge",
    "Validar código" : "Validate Code",
    "Locales Adheridos" : "Stores attached",
    "Fecha de nacimiento": "Birthdate",
    "Ingrese sus datos": "Enter your information",
    "Espere" : "Wait",
    "Monto" : "Amount",
    "DNI del Usuario" : "User Document",
    "Confirmar" : "Confirm",
    "Aceptar" : "OK",
    "Cancelar" : "Cancel",
    "Las contraseñas deben coincidir" : "Passwords must match",
    "Confirmación con SMS" : "SMS Confirmation",
    "Debe aceptar los términos y condiciones del servicio" : "You must accept the terms and conditions of the service",
    "Registro con SMS" : "Register with SMS",
    "Salir" : "Exit",
    "Debe verificar su E-Mail" : "You have to verify your E-Mail",
    "Contraseña" : "Password",
    "Confirmar Contraseña" : "Confirm Password",
    "Registro" : "Register",
    "Registrarse" : "Register",
    "Registrarme" : "Register",
    "o registrate con" : "or register with",
    "Cerrar" : "Close",
    "Ingrese el código de verificación" : "Enter the verification code",
    "Enviar mensaje" : "Send Message",
    "Canjear" : "Do Exchange",
    "Tienda iClient" : "iClient Store",
    "Ingresar Código" : "Enter Code",
    "Error al validar código" : "Error validating the code",
    "El código" : "The code",
    "esta disponible para el producto" : "is avaliable for the product:",
    "¿Desea utilizarlo?" : "Do you want to use it?",
    "Desea salir de la aplicación?" : "Do you want to exit the app?",
    "Debe completar su nombre" : "You have to enter your name",
    "Debe completar su DNI" : "You have to enter your document",
    "Debe completar su Teléfono" : "You have to enter your phone",
    "Debe completar su E-mail" : "You have to enter your email",
    "Debe ingresar un E-mail válido" : "You have to enter a valid email",
    "Debe completar su Contraseña" : "You have to enter a password",
    "Debe completar su Fecha de Nacimiento" : "You have to enter your birthdate",
    "Registro exitoso. Le enviamos un e-mail para verificar su cuenta (no olvide revisar su carpeta de SPAM)." : "Successful registration. We send you an email to verify your account (do not forget to check your SPAM folder).",
    "Mis datos" : "My account",
    "Debe ingresar su Género." : "You have to enter your gender",
    "Debe ingresar su Fecha de Nacimiento." : "You have to enter your birthdate",
    "Debe ingresar su Provincia." : "You have to enter your state",
    "Debe ingresar su Teléfono." : "You have to enter your phone",
    "Debe ingresar un monto." : "You have to enter a amount",
    "Debe ingresar un DNI." : "You have to enter a document",
    "Error al solicitar dinero" : "Error requesting money",
    "Error al cargar saldo" : "Error charging your account balance",
    "La transacción se realizó correctamente." : "The transaction was successful.",
    "Solicitud de dinero ACEPTADA" : "money request ACCEPTED",
    "Error: El usuario canceló el canje." : "Error: The user has cancelled the exchange",
    "Error: No se pudo canjear el producto, el usuario no confirmó el canje." : "Error: The user has cancelled the exchange",
    "Se necesitan completar datos personales" : "Personal fields needed",
    "Ver más" : "Read more",
    "Fecha" : "Date",
    "CODIGO" : "CODE",
    "Canje ya utilizado el " : "Exchange already used on",
    "Pago con iClient" : "iClient Payment",
    "Pago PENDIENTE" : "PENDING Payment",
    "Canje PENDIENTE" : "PENDING Exchange",
    "Carga de Saldo" : "Balance charge"
};
var forceLang = false;
function traducir(string){
    var lang = DatosUser['Idioma'] || 'ES';
    if(forceLang !== false) lang = forceLang;
    if(lang != 'ES' && typeof langs[lang] !== "undefined" && typeof langs[lang][string] !== "undefined"){
        return langs[lang][string];
    }
    return string;
}
var langs = {};
langs['EN'] = {
    "Canjes realizados" : "Canjes realizados"
};
function traducir(string, lang){
    var lang = lang || 'ES';
    if(lang != 'ES' && langs[lang].indexOf(string) > -1){
        return langs[lang][string];
    }
    return string;
}
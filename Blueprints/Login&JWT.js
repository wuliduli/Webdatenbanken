var login = (function () {
    "use strict";
    
    // Application object.
    var login = {};


    //************************************************
    // PRIVATE login variables
        
    var var1;



    //************************************************
    // PRIVATE FUNCTIONS
    
		// code here
	
    
    //************************************************
    // login variables

	login.response = {};
    login.Anmeldedaten = {
        Email: "",
        Passwort: "",
    };
    login.AnmeldedatenJSON = JSON.stringify(login.Anmeldedaten);
   
    login.finishedWithError = false;
    login.error = {};
	// JWT variables
    login.JWT = {};

    //************************************************
    // login functions

	// init object 



    // post login data with ajax and get JWT

	login.createLogin = function () {

        xhttp.open("POST", "auth/login", true);
        if (xhttp.readystate === 4 && xhttp.status === 200) {success_func()}
        else if (xhttp.status !== 200) {error_func()}
        xhttp.send(login.AnmeldedatenJSON);
        function success_func () {
            login.finishedWithError = false;
            login.response = {
                status: xhttp.status,
                textStatus: xhttp.statusText,
            };
            println(login.response);
            login.takeJWT();
        };
        function error_func () {
            login.finishedWithError = true;
            login.response = {
                status: xhttp.status,
                textStatus: xhttp.statusText,
            };
            println(login.response);
    };
    return login;
}
    login.takeJWT = function () {
        var JWT = JSON.parse(xhttp.responseText);
        println(JWT);
    }
();})

/* 
1.LoginDaten in JSON-Format setzen
2.AJAX-Request an den Login-Endpunkt der API senden
    if Response 200 -> take cookie
3.JWT aus der Antwort extrahieren
4.JWT für nachfolgende API-Anfragen speichern(JSON)
 * 
*/ 
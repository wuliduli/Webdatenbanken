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

   
    login.finishedWithError = false;
    login.error = {};
	// JWT variables
    login.JWT = {};


    //************************************************
    // login functions

	// init object 



    // post login data with ajax and get JWT

	login.createLogin = function (inputData) {
// Validierung der Eingabedaten
    if (!inputData || !inputData.email || !inputData.password) {
      login.finishedWithError = true;
      login.error = {
        status: 0,
        textStatus: "Invalid Input",
        message: "Email and password are required."// Das habe ich einfach hier erstmal als Orientierung gestellt.
      };
      return;
    }
        // Anmeldedaten in JSON-Format setzen
        login.Anmeldedaten.Email = inputData.email;
        login.Anmeldedaten.Passwort = inputData.password;


        var payloadJSON = JSON.stringify(login.Anmeldedaten);
        
        //POST Request mit AJAX senden und Antwort verarbeiten
        var xhttp = new XMLHttpRequest();

        xhttp.open("POST", "auth/login", true);
        xhttp.setRequestHeader("Content-Type", "application/json");

        if (xhttp.readyState === 4 && xhttp.status === 200) {success_func()}
        else if (xhttp.status !== 200) {error_func()}
        xhttp.send(payloadJSON);

        // Success-Funktion definieren
        function success_func () {
            login.finishedWithError = false;
            login.response = {
                status: xhttp.status,
                textStatus: xhttp.statusText,
            };
            println(login.response);
            login.takeJWT();
        };
        //Error-Funktion definieren
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
    login.takeJWT = function (responseData) {
        var responseData = JSON.parse(responseData);
        login.JWT = responseData.token; // Hier wird angenommen, dass das JWT im Feld "token" der Antwort enthalten ist. Je nach API kann dies variieren.
        println(login.JWT);
    }

return login;
}());

/* 
1.LoginDaten in JSON-Format setzen
2.AJAX-Request an den Login-Endpunkt der API senden
    if Response 200 -> take cookie
3.JWT aus der Antwort extrahieren
4.JWT für nachfolgende API-Anfragen speichern(JSON)
 * 
*/ 
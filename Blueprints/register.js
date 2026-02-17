var register = (function () {
    var xhttp;
    
    var register = {};
    register.Registrierungsdaten = {
        Email: "",
        Passwort: "",
        Vorname: "",
        Nachname: ""
    };

    register.finishedWithError = false;
    register.response = {};
    
    register.createRegister = function (inputData) {
        //Eingabedaten in Objekt speichern und in JSON umwandeln
        register.Registrierungsdaten.Email = inputData.email;
        register.Registrierungsdaten.Passwort = inputData.password;
        register.Registrierungsdaten.Vorname = inputData.firstName;
        register.Registrierungsdaten.Nachname = inputData.lastName;

        var RegistrierungsdatenJSON = JSON.stringify(register.Registrierungsdaten);
        //POST Request mit AJAX senden und Antwort verarbeiten

        xhttp = new XMLHttpRequest();

        xhttp.open("POST", "auth/register", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState === 4) {
                if (xhttp.status === 201 || xhttp.status === 200) {
                    register.finishedWithError = false;
                    register.response = {
                        status: xhttp.status,
                        textStatus: xhttp.statusText
                    };
                    console.log("Registrierung erfolgreich:", register.response);
                    register.getResponse();
                } else {
                    register.finishedWithError = true;
                    register.response = {
                        status: xhttp.status,
                        textStatus: xhttp.statusText
                    };
                    console.log("Registrierung fehlgeschlagen:", register.response);
                }
            }
        };
        xhttp.send(RegistrierungsdatenJSON);
    };
    
    register.getResponse = function () {
        var responseData = JSON.parse(xhttp.responseText);
        register.userId = responseData.userId || responseData.id || null;
        console.log("Neuer User-ID:", register.userId);
    };
    
    return register;
}());

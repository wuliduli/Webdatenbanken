var register = (function () {
    var xhttp
    
    var register = {};
    register.Registrierungsdaten = {
        Email: "",
        Passwort: "",
        Vorname: "",
        Nachname: ""
    };
    register.RegistrierungsdatenJSON = JSON.stringify(register.Registrierungsdaten);
    register.finishedWithError = false;
    register.response = {};
    register.userId = null;
    
    register.createRegister = function () {
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
                    register.takeResponse();
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
        xhttp.send(register.RegistrierungsdatenJSON);
    };
    
    register.takeResponse = function () {
        var responseData = JSON.parse(xhttp.responseText);
        register.userId = responseData.userId || responseData.id || null;
        console.log("Neuer User-ID:", register.userId);
    };
    
    return register;
}());

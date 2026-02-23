var getNutzerKonto = (function () {
    "use strict";

    var xhttp;

    // Prinzip: JWT Token aus sessionStorage lesen, GET Request an /users senden
    // und Nutzerdaten aus der Antwort verarbeiten
    var getNutzerKonto = {};

    getNutzerKonto.finishedWithError = false;
    getNutzerKonto.response = {};
    getNutzerKonto.nutzerDaten = {
        UID: "",
        first_name: "",
        last_name: "",
        email: "",
        active: "",
        verified: "",
        num_failed_logins: ""
    };

    // Nutzerkonto-Daten vom Server abrufen
    getNutzerKonto.fetchKonto = function () {

        var token = sessionStorage.getItem("JWTToken");
        if (!token) {
            getNutzerKonto.finishedWithError = true;
            getNutzerKonto.response = {
                status: 0,
                textStatus: "No Token",
                message: "No JWT token found in session storage."
            };
            console.log("Kein Token vorhanden:", getNutzerKonto.response);
            return getNutzerKonto;
        }

        xhttp = new XMLHttpRequest();
        xhttp.open("GET", "users", true);

        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.setRequestHeader("Authorization", "Bearer " + token);

        xhttp.onreadystatechange = function () {
            if (xhttp.readyState === 4) {
                if (xhttp.status === 200) {
                    getNutzerKonto.finishedWithError = false;
                    getNutzerKonto.response = {
                        status: xhttp.status,
                        textStatus: xhttp.statusText
                    };
                    console.log("Nutzerkonto erfolgreich abgerufen:", getNutzerKonto.response);
                    getNutzerKonto.getResponse();
                } else {
                    getNutzerKonto.finishedWithError = true;
                    getNutzerKonto.response = {
                        status: xhttp.status,
                        textStatus: xhttp.statusText
                    };
                    console.log("Nutzerkonto abrufen fehlgeschlagen:", getNutzerKonto.response);
                }
            }
        };
        xhttp.send();
    };

    // Antwort verarbeiten und Nutzerdaten speichern
    getNutzerKonto.getResponse = function () {
        var responseData = JSON.parse(xhttp.responseText);
        var userData = responseData.users;

        getNutzerKonto.nutzerDaten.UID = userData.UID;
        getNutzerKonto.nutzerDaten.first_name = userData.first_name;
        getNutzerKonto.nutzerDaten.last_name = userData.last_name;
        getNutzerKonto.nutzerDaten.email = userData.email;
        getNutzerKonto.nutzerDaten.active = userData.active;
        getNutzerKonto.nutzerDaten.verified = userData.verified;
        getNutzerKonto.nutzerDaten.num_failed_logins = userData.num_failed_logins;

        console.log("Nutzerdaten:", getNutzerKonto.nutzerDaten);
    };

    return getNutzerKonto;
}());

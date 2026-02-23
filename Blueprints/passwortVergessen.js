var passwortVergessen = (function () {
    var xhttp;

    var passwortVergessen = {};

    passwortVergessen.finishedWithError = false;
    passwortVergessen.response = {};

    passwortVergessen.requestReset = function (email) {
        var requestData = JSON.stringify({ email: email });

        xhttp = new XMLHttpRequest();

        xhttp.open("GET", "auth/forgot", true);
        xhttp.setRequestHeader("Content-Type", "application/json");

        xhttp.onreadystatechange = function () {
            if (xhttp.readyState === 4) {
                if (xhttp.status === 200) {
                    passwortVergessen.finishedWithError = false;
                    passwortVergessen.response = {
                        status: xhttp.status,
                        textStatus: xhttp.statusText
                    };
                    console.log("Reset-Anfrage erfolgreich:", passwortVergessen.response);
                } else {
                    passwortVergessen.finishedWithError = true;
                    passwortVergessen.response = {
                        status: xhttp.status,
                        textStatus: xhttp.statusText
                    };
                    console.log("Reset-Anfrage fehlgeschlagen:", passwortVergessen.response);
                }
            }
        };
        xhttp.send(requestData);
    };

    passwortVergessen.setNewPassword = function (newPassword, resetToken) {
        var requestData = JSON.stringify({ newPassword: newPassword, resetToken: resetToken });

        xhttp = new XMLHttpRequest();

        xhttp.open("PATCH", "auth/forgot", true);
        xhttp.setRequestHeader("Content-Type", "application/json");

        xhttp.onreadystatechange = function () {
            if (xhttp.readyState === 4) {
                if (xhttp.status === 200) {
                    passwortVergessen.finishedWithError = false;
                    passwortVergessen.response = {
                        status: xhttp.status,
                        textStatus: xhttp.statusText
                    };
                    console.log("Passwort erfolgreich geaendert:", passwortVergessen.response);
                } else {
                    passwortVergessen.finishedWithError = true;
                    passwortVergessen.response = {
                        status: xhttp.status,
                        textStatus: xhttp.statusText
                    };
                    console.log("Passwort aendern fehlgeschlagen:", passwortVergessen.response);
                }
            }
        };
        xhttp.send(requestData);
    };

    return passwortVergessen;
}());

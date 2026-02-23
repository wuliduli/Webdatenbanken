var tokenCheck = (function () {
    "use strict";

    // Prinzip: Senden & Antwort (expected code), success & fail validation
    // variablen
    var tokenCheck = {};

    tokenCheck.response = {};
    var token = null;


    // server kommunikation
    tokenCheck.sendToken = function () {

        token = sessionStorage.getItem("JWTToken");
        if (!token) {
            tokenCheck.finishedWithError = true;
            tokenCheck.response = {
                status: 0,
                textStatus: "No Token",
                message: "No JWT token found in session storage."
            };
            return tokenCheck;
        } else {
            var xhttp = new XMLHttpRequest();
            xhttp.open("POST", "auth/validation", true);

            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.setRequestHeader("Authorization", "Bearer " + token);

            xhttp.onreadystatechange = function () {
                if (xhttp.readyState === 4) {
                    if (xhttp.status === 200) {
                        tokenCheck.finishedWithError = false;
                        tokenCheck.response = {
                            status: xhttp.status,
                            textStatus: xhttp.statusText,
                        };
                        console.log(tokenCheck.response);
                    } else {
                        tokenCheck.finishedWithError = true;
                        tokenCheck.response = {
                            status: xhttp.status,
                            textStatus: xhttp.statusText,
                        };
                        console.log("Token abgelaufen oder fehlerhaft");
                    }
                }
            };
            xhttp.send(token);
            return tokenCheck;
        }

    }

}());

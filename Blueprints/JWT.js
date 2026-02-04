import {JWT} from "tokenCheck&JWT.js";
var tokenCheck = (function () {
  "use strict";

// Prinzip: Senden & Antwort (expected code), success & fail validation
// variablen
var tokenCheck = {};

tokenCheck.response = {};
token = JWT

// server kommunikation
tokenCheck.sendToken = function () {
        xhttp.open("POST", "auth/validation", true);
        if (xhttp.readystate === 4 && xhttp.status === 200) {success_func()}
        else if (xhttp.status !== 200) {error_func()}
        xhttp.send(token);
        function success_func () {
            tokenCheck.finishedWithError = false;
            tokenCheck.response = {
                status: xhttp.status,
                textStatus: xhttp.statusText,
            };
            println(tokenCheck.response);
            
        };
        function error_func () {
            tokenCheck.finishedWithError = true;
            tokenCheck.response = {
                status: xhttp.status,
                textStatus: xhttp.statusText,
            };
            println("Token abgelaufen oder fehlerhaft");
            
    };
    return tokenCheck;
}

})

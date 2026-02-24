$(document).ready(function () {

  //************************************************
  // PRIVATE variables and constants

  var token = sessionStorage.getItem('JWTToken');
  var session = {};

  const baseUrl = "https://dev.wappprojects.de/wiws23i/api";
  const apiEndpointUsers = "/users";
  const fullPathUsers = baseUrl + apiEndpointUsers;
  const modulVersion = "0.12";

  session.init = function () {
    console.log(`App-Module-Version: V${modulVersion}`);
    // user.data = [];
    // user.finishedWithError = false;
    // user.error = {};

    // Login Funktion
    $("#loginForm").on("submit", function (event) {
      event.preventDefault();
      const email = $("#email").val();
      const password = $("#password").val();

      if (email !== "" && password !== "") {
        // save the data back to the actualObject and data object

        session.tmpObj = {
          email: email,
          password: password
        };

        // JSON-Daten vorbereiten
        const paramData = {
          email: session.tmpObj.email,
          password: session.tmpObj.password,
        };

        // console.log("paramData:");
        console.log(paramData);

        // AJAX-Aufruf zum Login
        $.ajax({
          url: fullPathUsers + "/login", // Die ID wird in die URL eingebettet
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify(paramData),
          success: function (data) {
            if (data.code == 201 && data.message == "Login authorized") {
              // LoginData Handler (sessionStorage - Data lost on Session/BrowserSession End)
              sessionStorage.setItem('loggedIn', true);
              sessionStorage.setItem('CurrentUserID', data.data.UID);
              sessionStorage.setItem('JWTToken', data.data.token);
              window.location.href = 'timeEntries.html';
            } else {
              alert("Die eingegebenen Logindaten sind nicht korrekt");
              sessionStorage.removeItem('loggedIn');
              sessionStorage.removeItem('CurrentUserID');
              sessionStorage.removeItem('JWTToken');
            }
          },
          error: function (error) {
            if (error && (error.hasOwnProperty('responseText'))) console.error(error.responseText);
            alert("Die eingegebenen Logindaten sind nicht korrekt");
            sessionStorage.removeItem('loggedIn');
            sessionStorage.removeItem('CurrentUserID');
            sessionStorage.removeItem('JWTToken');
          },
        });
      }
      else {
        alert("Bitte geben Sie Logindaten ein")
      }
    });

    //Logout
    $(document).on("click", ".logout-btn", function () {
      console.log('Logout Button geklickt!');
      const loggedIn = sessionStorage.getItem('loggedIn');
      if (loggedIn != null) {
        sessionStorage.removeItem('loggedIn');
        sessionStorage.removeItem('CurrentUserID');
        sessionStorage.removeItem('JWTToken');
        window.location.href = 'index.html'
      }
      else {
        alert("Es ist kein Nutzer eingeloggt")
      }
    });

    //register
    $("#registrationForm").on("submit", function (event) {
      event.preventDefault();
      // get values for new user just entered in modal

      console.log("user saved values");
      if ($("#regPassword").val() == $("#confirmPassword").val()) {

        const firstname = $("#firstname").val();
        const lastname = $("#lastname").val();
        const email = $("#regEmail").val();
        const notes = $("#notes").val();
        const password = $("#regPassword").val();
        const mandtime = $("#mandtime").val();

        const paramData = {
          firstname: firstname,
          lastname: lastname,
          email: email,
          notes: notes,
          password: password,
          mandtime: mandtime,
        };

        console.log(paramData);

        $.ajax({
          url: fullPathUsers,
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify(paramData),
          success: function (data) {
            console.log(data);
            $('#registrationModal').modal("hide");
            alert(
              `Sie haben sich erfolgreich registriert`
            );

          },
          error: function (error) {
            alert(
              "Registrierung fehlgeschlagen"
            );
            console.error(error);
          },
        });
      }
      else {
        alert("Ihr Passwort stimmt nicht überein")
      }

    });
  }

  if(!sessionStorage.getItem('loggedIn')){
    session.init();
  } else {
    window.location.href = 'timeEntries.html';
  }


});

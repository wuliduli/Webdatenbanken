/* ------------------------------------------------ */
/*   user.js - code for user object module          */
/*                                                  */
/*   (C) 2025 Wappfactory - Michael Kreinbihl       */
/*                                                  */
/* ------------------------------------------------ */
/* jshint -W117 */

var user = (function () {
  "use strict";

  // Application object.
  var user = {};
  var token = null;

  //************************************************
  // PRIVATE member variables and constants

  const baseUrl = "https://dev.wappprojects.de/wiws23i/api";
  const apiEndpointUsers = "/users";
  const fullPathUsers = baseUrl + apiEndpointUsers;
  const modulVersion = "0.80";

  //************************************************
  // PRIVATE FUNCTIONS

  //************************************************
  // member variables

  user.data = [];
  user.finishedWithError = false;
  user.error = {};
  user.fullPathUsers = fullPathUsers;
  user.tmpObj = null;
  user.tmpObjIndex = -1;

  //************************************************
  // member functions

  // init object

  user.init = function () {
    console.log(`User-Module-Version: V${modulVersion}`);

    // init object here
    user.data = [];
    user.finishedWithError = false;
    user.error = {};

    if(!sessionStorage.getItem('loggedIn')){
      window.location.href = 'index.html';
      return false;
    }

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

    // Bearbeiten-Button-Handler (Beispiel)
    $(document).on("click", ".user-edit-btn", function () {
      const UID = $(this).data("id");
      // console.log("id: " + id);

      user.tmpObjIndex = user.searchIndex(UID, user.data);
      user.tmpObj = user.data[user.tmpObjIndex];

      user.render.editModalFillValues(UID);
      user.render.editModalShow();
    });


  //************************************************

  // Benutzer speichern
  // $("#saveUserButton").click(function () {
  $("#newForm").on("submit", function (event) {
    event.preventDefault();
    // get values for new user just entered in modal

    console.log("user saved values");

    user.render.newUserGetValues();

    const paramData = {
      firstname: user.tmpObj.firstname,
      lastname: user.tmpObj.lastname,
      email: user.tmpObj.email,
      notes: user.tmpObj.notes,
      active: user.tmpObj.active,
      mandtime: user.tmpObj.mandtime,
      verified: user.tmpObj.verified,
    };

    console.log(paramData);
    token = sessionStorage.getItem('JWTToken');

    $.ajax({
      url: baseUrl + apiEndpointUsers,
      type: "POST",
      headers: {
        Authorization: 'Bearer ' + token
      },
      contentType: "application/json",
      data: JSON.stringify(paramData),
      success: function (data) {
        user.render.newUserModalHide();
        console.log(data);
        alert(
          `Ein neuer Benutzer mit der ID ${data.UID} wurde erfolgreich erstellt.`
        );
        // reload and render table newly to see if data is saved in database correctly
        user.getUserWithAjax(user.render.listView);
      },
      error: function (error) {
        alert(
          "Nutzer konnte nicht erstellt werden, es ist ein Fehler am Server aufgetreten!",
          "Fehler beim Erstellen des Benutzers"
        );
        console.error(error);
      },
    });
  });



  //************************************************

  // Speichern der Änderungen
  $("#editForm").on("submit", function (event) {
    event.preventDefault();
    user.render.editModalGetValues();

    // JSON-Daten vorbereiten
    const UID = user.tmpObj.UID;
    const paramData = {
      firstname: user.tmpObj.firstname,
      lastname: user.tmpObj.lastname,
      email: user.tmpObj.email,
      notes: user.tmpObj.notes,
      active: user.tmpObj.active,
      mandtime: user.tmpObj.mandtime,
      verified: user.tmpObj.verified,
      created_at: user.tmpObj.created_at,
    };

    // console.log("paramData:");
    // console.log(paramData);

    token = sessionStorage.getItem('JWTToken');
    // AJAX-Aufruf zum Bearbeiten
    $.ajax({
      url: user.fullPathUsers + "/" + UID, // Die ID wird in die URL eingebettet
      type: "PUT",
      headers: {
        Authorization: 'Bearer ' + token
      },
      contentType: "application/json",
      data: JSON.stringify(paramData),
      success: function (data) {
        user.render.editModalHide();
        console.log(data);
        alert(`Der Benutzer mit ID ${UID} wurde erfolgreich aktualisiert.`);
        // reload and render table newly to see if data is saved in database correctly
        user.getUserWithAjax(user.render.listView);
      },
      error: function (error) {
        console.error(error.responseText);
        alert("Fehler beim Aktualisieren des Benutzers.");
      },
    });
  });

  //************************************************

  // Löschen-Button-Handler (Beispiel)
  $(document).on("click", ".user-delete-btn", function () {
    const UID = $(this).data("id");
    if (confirm(`Benutzer mit ID ${UID} wirklich löschen?`)) {
      token = sessionStorage.getItem('JWTToken');
      $.ajax({
        url: `${user.fullPathUsers}/${UID}`,
        headers: {
          Authorization: 'Bearer ' + token
        },
        type: "DELETE",
        success: function () {
          alert(`Der Benutzer mit ID ${UID} wurde erfolgreich gelöscht.`);
          // reload and render table newly to see if data is saved in database correctly
          user.getUserWithAjax(user.render.listView);
        },
        error: function () {
          alert(`Fehler beim Löschen des Benutzers mit ID ${UID}.`);
        },
      });
    }
  });

  //************************************************

  $(document).on("click", ".user-new-btn", function () {
    user.render.newUserModalShow();
  });
};

//************************************************
//End Init
//************************************************



// search array item with key id = keyValue
// return obj
user.searchObj = function (keyValue, myArray) {
  for (let i = 0; i < myArray.length; i++) {
    if (myArray[i].UID === keyValue) {
      return myArray[i];
    }
  }
};

//************************************************

// search array item with key id = keyValue
// return index
user.searchIndex = function (keyValue, myArray) {
  for (let i = 0; i < myArray.length; i++) {
    if (myArray[i].UID === keyValue) {
      return i;
    }
  }
};

//************************************************

// get json data with ajax

user.getUserWithAjax = function (do_next_func) {
  var token = sessionStorage.getItem('JWTToken');
  function success_func(result) {
    if (result !== null) {
      user.data = result;
    } else {
      user.data = [];
    }

    do_next_func();
  }

  function error_func(xhr, status, error) {
    console.log("XHR", xhr);
    user.data = [];
    user.finishedWithError = true;
    user.error.status = status;
    user.error.code = xhr.status;
    user.error.message = error;

    do_next_func();
  }

  // user.init();

  // console.log("PATH: " + user.fullPathUsers);

  $.ajax({
    method: "GET",
    url: user.fullPathUsers,
    headers: {
      Authorization: 'Bearer ' + token
    },
    success: success_func,
    error: error_func,
  });
};

//************************************************

user.render = {
  listView: function () {
    // do rendering
    var jsonObj, htmlHeader, textItems, htmlText;
    const $tbody = $("#users-tbody");

    console.log(user);

    if (!user.finishedWithError) {
      // get saved data
      jsonObj = user.data;

      $tbody.empty(); // Tabelle leeren, bevor sie befüllt wird

      // Benutzer hinzufügen
      user.data.forEach(function (user) {
        const row = `
          <tr>
              <td>${user.UID}</td>
              <td>${user.firstname}</td>
              <td>${user.lastname}</td>
              <td>${user.email}</td>
              <td>${user.notes}</td>
              <td>${user.active}</td>
              <td>${user.mandtime}</td>
              <td>${user.verified}</td>
              <td>${user.created_at}</td>
              <td>
                  <button class="btn btn-sm btn-warning user-edit-btn" data-id="${user.UID}">Bearbeiten</button>
                  <button class="btn btn-sm btn-danger user-delete-btn" data-id="${user.UID}">Löschen</button>
              </td>
          </tr>
          `;
        $tbody.append(row);
      });
    } else {
      //ERROR function tbd
    }
  },

  newUserModalShow: function () {
    $("#newUserModal").modal("show");
  },

  newUserModalHide: function () {
    $("#newUserModal").modal("hide");
  },

  newUserGetValues: function () {
    const firstname = $("#newFirstname").val();
    const lastname = $("#newLastname").val();
    const email = $("#newEmail").val();
    const notes = $("#newNotes").val();
    const mandtime = $("#newMandtime").val();
    const active = $("#newActive").val();
    const verified = $("#newVerified").val();

    user.tmpObj = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      notes: notes,
      mandtime: mandtime,
      active: active,
      verified: verified
    };
  },

  editModalShow: function () {
    // Modal anzeigen
    $("#editModal").modal("show");
  },

  editModalHide: function () {
    // Modal ausblenden
    $("#editModal").modal("hide");
  },

  editModalFillValues: function (UID) {
    const firstname = user.tmpObj.firstname;
    const lastname = user.tmpObj.lastname;
    const email = user.tmpObj.email;
    const notes = user.tmpObj.notes;
    const mandtime = user.tmpObj.mandtime;
    const active = user.tmpObj.active;
    const verified = user.tmpObj.verified;
    const created_at = user.tmpObj.created_at;

    // Werte in das Modal einfügen
    $("#editUID").val(UID);
    $("#editFirstname").val(firstname);
    $("#editLastname").val(lastname);
    $("#editEmail").val(email);
    $("#editNotes").val(notes);
    $("#editMandtime").val(mandtime);
    $("#editActive").val(active);
    $("#editVerified").val(verified);
    $("#editCreatedAt").val(created_at);

  },
  editModalGetValues: function () {
    const UID = $("#editUID").val();
    const firstname = $("#editFirstname").val();
    const lastname = $("#editLastname").val();
    const email = $("#editEmail").val();
    const notes = $("#editNotes").val();
    const mandtime = $("#editMandtime").val();
    const active = $("#editActive").val();
    const verified = $("#editVerified").val();
    const created_at = $("#editCreatedAt").val();

    // save the data back to the actualObject and data object

    user.tmpObj = {
      UID: UID,
      firstname: firstname,
      lastname: lastname,
      email: email,
      notes: notes,
      mandtime: mandtime,
      active: active,
      verified: verified,
      created_at: created_at
    };

    user.data[user.tmpObjIndex] = user.tmpObj;

  },
};


//************************************************


return user;
}) ();

/*
 * Sometimes it it a good idea to do the init right here
 * after module is loaded, if so => remove comment chars //
 */

user.init();
user.getUserWithAjax(user.render.listView);

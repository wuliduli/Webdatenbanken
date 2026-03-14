
$(document).ready(function () {
  "use strict";

  if (
    typeof m_data_get === "undefined" ||
    typeof m_data_render === "undefined" ||
    typeof m_data_render.render === "undefined"
  ) {
    console.warn("main.js: required modules are missing");
    return;
  }

  m_data_get.ensureState();

  function searchIndexByKey(keyName, keyValue, myArray) {
    for (let i = 0; i < myArray.length; i++) {
      if (myArray[i][keyName] === keyValue) {
        return i;
      }
    }
    return -1;
  }

  function logout() {
    const loggedIn = sessionStorage.getItem("loggedIn");
    if (loggedIn !== null) {
      sessionStorage.removeItem("loggedIn");
      sessionStorage.removeItem("CurrentUserID");
      sessionStorage.removeItem("JWTToken");
      window.location.href = "index.html";
    } else {
      alert("Es ist kein Nutzer eingeloggt");
    }
  }

  function requireLogin() {
    if (!sessionStorage.getItem("loggedIn")) {
      window.location.href = "index.html";
      return false;
    }
    return true;
  }

  function initLoginPage() {
    if (sessionStorage.getItem("loggedIn")) {
      window.location.href = "timeEntries.html";
      return;
    }

    $("#loginForm").on("submit", function (event) {
      event.preventDefault();
      const email = $("#email").val();
      const password = $("#password").val();

      if (email === "" || password === "") {
        alert("Bitte geben Sie Logindaten ein");
        return;
      }

      m_data_get.login(
        {
          email: email,
          password: password,
        },
        function (err, data) {
          if (!err && data && data.code === 201 && data.message === "Login authorized") {
            sessionStorage.setItem("loggedIn", true);
            sessionStorage.setItem("CurrentUserID", data.data.UID);
            sessionStorage.setItem("JWTToken", data.data.token);
            window.location.href = "timeEntries.html";
            return;
          }
          console.log(eventsData);
          alert("Die eingegebenen Logindaten sind nicht korrekt");
          sessionStorage.removeItem("loggedIn");
          sessionStorage.removeItem("CurrentUserID");
          sessionStorage.removeItem("JWTToken");
        }
      );
    });

    $("#registrationForm").on("submit", function (event) {
      event.preventDefault();

      if ($("#regPassword").val() !== $("#confirmPassword").val()) {
        alert("Ihr Passwort stimmt nicht überein");
        return;
      }

      const paramData = {
        first_name: $("#firstname").val(),
        last_name: $("#lastname").val(),
        email: $("#regEmail").val(),
        password: $("#regPassword").val(),
      };

      m_data_get.register(paramData, function (err) {
        if (!err) {
          $("#registrationModal").modal("hide");
          alert("Sie haben sich erfolgreich registriert");
          return;
        }
        alert("Registrierung fehlgeschlagen");
      });
    });
  }

  function callFirstAvailable(methodNames, args) {
    let i;
    for (i = 0; i < methodNames.length; i++) {
      if (typeof m_data_get[methodNames[i]] === "function") {
        m_data_get[methodNames[i]].apply(m_data_get, args);
        return true;
      }
    }
    return false;
  }

  /* Event Einbuchungsseite -> anstatt getEvents() wird getSignedInFromUser() aufgerufen, um nur die Events zu bekommen, bei denen der Nutzer angemeldet ist. Dropdowns werden aber weiterhin mit allen Events gefüllt, damit der Nutzer auch Events beitreten kann, bei denen er noch nicht angemeldet ist.
  */
  function initEventsPage() {
    if (!requireLogin()) {
      return;
    }
    $(document).on("click", "#event-join-btn", function () {
      const selectedId = $("#event-join-dp").val();
      const selectedName = $("#event-join-dp option:selected").text();
      if (!selectedId) {
        alert("Bitte wählen Sie ein Event aus!");
        return;
      }
      console.log("Event beitreten:", selectedId);
      m_data_get.joinEvent(selectedId, function (err) {
        if (!err) {
          alert("Erfolgreich dem Event beigetreten!");
          m_data_get.getSignedInFromUser(sessionStorage.getItem("CurrentUserID"), m_data_render.render.listView_event);
          m_data_get.getSignedInFromUser(sessionStorage.getItem("CurrentUserID"), m_data_render.render.populateEventDropdownsLeave);
          m_data_get.getEvents(m_data_render.render.populateEventDropdownsJoin);
        } else {
          alert("Fehler beim Beitreten des Events!");
        }
      });
    });

    $(document).on("click", "#event-leave-btn", function () {
      const selectedId = $("#event-leave-dp").val();
      const selectedName = $("#event-leave-dp option:selected").text();

      if (!selectedId) {
        alert("Bitte wählen Sie ein Event aus!");
        return;
      }

      // const leaveNotes = modal.find("#leave-notes").val();
      const leaveNotes = $("#leave-notes").val();
      // TODO: Klären, ob leaveNotes immer gesetzt sein muss
      // if (!leaveNotes) {
      //   alert("Bitte geben Sie einen Grund für das Verlassen des Events an.");
      //   return;
      // }

      var leave_json = {
        EID: selectedId,
        notes: leaveNotes,
        UID: sessionStorage.getItem("CurrentUserID"),
      }
      console.log("Event verlassen:", leave_json);

      m_data_get.leaveEvent(leave_json, function (err) {
        if (!err) {
          alert("Erfolgreich dem Event verlassen!");
          m_data_get.getSignedInFromUser(sessionStorage.getItem("CurrentUserID"), m_data_render.render.listView_event);
          m_data_get.getSignedInFromUser(sessionStorage.getItem("CurrentUserID"), m_data_render.render.populateEventDropdownsLeave);
          m_data_get.getEvents(m_data_render.render.populateEventDropdownsJoin);
        } else {
          alert("Fehler beim Verlassen des Events!");
        }
      });
    });

    //m_data_get.getEvents(m_data_render.render.listView_event);
    m_data_get.getSignedInFromUser(sessionStorage.getItem("CurrentUserID"), m_data_render.render.listView_event);
    m_data_get.getSignedInFromUser(sessionStorage.getItem("CurrentUserID"), m_data_render.render.populateEventDropdownsLeave);
    m_data_get.getEvents(m_data_render.render.populateEventDropdownsJoin);
  }

  function initUsersPage() {
    if (!requireLogin()) {
      return;
    }

    $(document).on("click", ".user-edit-btn", function () {
      const UID = $(this).data("id");
      user.tmpObjIndex = searchIndexByKey("UID", UID, user.data);
      user.tmpObj = user.data[user.tmpObjIndex];
      m_data_render.render.editModalFillValues_user(UID);
      m_data_render.render.editModalShow_user();
    });

    $("#newForm").on("submit", function (event) {
      event.preventDefault();

      m_data_render.render.newUserGetValues_user();
      const paramData = {
        first_name: user.tmpObj.first_name,
        last_name: user.tmpObj.last_name,
        email: user.tmpObj.email,
        notes: user.tmpObj.notes,
        active: user.tmpObj.active,
        mandtime: user.tmpObj.mandtime,
        verified: user.tmpObj.verified,
      };

      m_data_get.createUser(paramData, function (err, data) {
        if (!err) {
          m_data_render.render.newUserModalHide_user();
          alert("Ein neuer Benutzer mit der ID " + data.UID + " wurde erfolgreich erstellt.");
          m_data_get.getUsers(m_data_render.render.listView_user);
          return;
        }
        alert("Nutzer konnte nicht erstellt werden, es ist ein Fehler am Server aufgetreten!");
      });
    });

    $("#editForm").on("submit", function (event) {
      if (!$("#editUID").length) {
        return;
      }

      event.preventDefault();

      m_data_render.render.editModalGetValues_user();
      const UID = user.tmpObj.UID;
      const paramData = {
        first_name: user.tmpObj.first_name,
        last_name: user.tmpObj.last_name,
        email: user.tmpObj.email,
        notes: user.tmpObj.notes,
        active: user.tmpObj.active,
        mandtime: user.tmpObj.mandtime,
        verified: user.tmpObj.verified,
        created_at: user.tmpObj.created_at,
      };

      m_data_get.updateUser(UID, paramData, function (err) {
        if (!err) {
          m_data_render.render.editModalHide_user();
          alert("Der Benutzer mit ID " + UID + " wurde erfolgreich aktualisiert.");
          m_data_get.getUsers(m_data_render.render.listView_user);
          return;
        }
        alert("Fehler beim Aktualisieren des Benutzers.");
      });
    });

    $(document).on("click", ".user-delete-btn", function () {
      const UID = $(this).data("id");
      // TODO: FB2 zu implemenntieren, dann löschen
      if (!confirm("Benutzer mit ID " + UID + " wirklich löschen?")) {
        return;
      }

      m_data_get.deleteUser(UID, function (err) {
        if (!err) {
          alert("Der Benutzer mit ID " + UID + " wurde erfolgreich gelöscht.");
          m_data_get.getUsers(m_data_render.render.listView_user);
          return;
        }
        alert("Fehler beim Löschen des Benutzers mit ID " + UID + ".");
      });
    });

    $(document).on("click", ".user-new-btn", function () {
      m_data_render.render.newUserModalShow_user();
    });

    m_data_get.getUsers(m_data_render.render.listView_user);
  }

  /////////////////////////// EVENT MANAGER ///////////////////
  function initEventManagerPage(){
    if (!requireLogin()) {
      return;
    }

    $(document).on("click", "#btn-createEventConfirm", function () {
      const eventName = $("#txt-createEventName").val();
      const eventStart = $("#txt-createEventStart").val();
      const eventEnd = $("#txt-createEventEnd").val();
      if (!eventName || !eventStart || !eventEnd) {
        alert("Bitte füllen Sie Name, Start und Ende aus.");
        return;
      }
      const startDate = new Date(eventStart);
      const endDate = new Date(eventEnd);
      if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
        alert("Ungültiges Start- oder Enddatum.");
        return;
      }
      if (endDate <= startDate) {
        alert("Event-Ende muss nach dem Start liegen.");
        return;
      }
      let create_json = {
        name: eventName,
        start: eventStart,
        end: eventEnd
      }
      m_data_get.createEvent(create_json, function(err){
        if (!err) {
          console.log("Event erfolgreich erstellt");
          console.log(create_json);
          alert("Event erfolgreich erstellt.");
          m_data_get.getEvents(m_data_render.render.listView_manager);
        }
      })
      $("#txt-createEventName").val('');
      $("#txt-createEventStart").val('');
      $("#txt-createEventEnd").val('');
    });


//Edit Event-Button klickt, Modal mit Event-Daten füllen
 //Debug: Event-ID wird in data-id Attribut des Buttons gespeichert, damit sie im Bestätigungs-Button verfügbar ist. Daten werden über getEventData() abgerufen und dann in Modal eingefügt - von Andy
    $(document).on("click", ".btn-ManEdit", function () {
        const EID = $(this).data("id");
        $("#btn-confirmEdit").data("id", EID);
        console.log("Event bearbeiten:", EID);
        m_data_get.getEventData(EID, m_data_render.render.populateEditEventModal);
    });
    //Bestätigungs-Button im Edit Modal klickt, Event mit neuen Daten bearbeiten - von Andy
    $(document).on("click", "#btn-confirmEdit", function () {
        const EID = $(this).data("id");
        const eventName = $("#editEventName").val();
        const eventStart = $("#editEventStart").val();
        const eventEnd = $("#editEventEnd").val();
        if (!eventName || !eventStart || !eventEnd) {
          alert("Bitte füllen Sie Name, Start und Ende aus.");
          return;
        }
        const startDate = new Date(eventStart);
        const endDate = new Date(eventEnd);
        if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
          alert("Ungültiges Start- oder Enddatum.");
          return;
        }
        if (endDate <= startDate) {
          alert("Event-Ende muss nach dem Start liegen.");
          return;
        }
        let edit_json = {
            name: eventName,
            start: eventStart,
            end: eventEnd
        }
        console.log("Event bearbeiten:", EID, edit_json);
        m_data_get.editEvent(EID, edit_json, function(err){
            if (!err) {
                console.log("Event erfolgreich bearbeitet");
            alert("Event wurde aktualisiert.");
                m_data_get.getEvents(m_data_render.render.listView_manager);
            }
        })
    });

 //Delete-Button klickt, Modal mit Event-ID für Bestätigung füllen
   // Debug (Event-ID wird in data-id Attribut des Buttons gespeichert, damit sie im Bestätigungs-Button verfügbar ist) - von Andy
    $(document).on("click", ".btn-ManDelete", function () {
      const UID = $(this).data("id");
      $("#btn-ManDeleteConfirm").data("id", UID);}  
    );


    $(document).on("click", "#btn-ManDeleteConfirm", function () {
      const UID = $(this).data("id");
      console.log("Event löschen:", UID);
       m_data_get.deleteEvent(UID, function(err){
        if (!err){
          alert("Event erfolgreich gelöscht")
          m_data_get.getEvents(m_data_render.render.listView_manager);
        } else{
          alert("Error beim löschen des Events")
        }
      })
    });
    
    m_data_get.getEvents(m_data_render.render.listView_manager);
  }

  $(document).on("click", ".logout-btn", function () {
    logout();
  });

  if ($("#loginForm").length) {
    initLoginPage();
    return;
  }
  if ($("#events-tbody").length) {
    initEventsPage();
    return;
  }
  if ($("#users-tbody").length) {
    initUsersPage();
    return
  }
  if ($("#eventmanager-tbody").length) {
    initEventManagerPage();
    return
  }

});
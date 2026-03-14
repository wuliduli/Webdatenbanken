
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
        firstname: $("#firstname").val(),
        lastname: $("#lastname").val(),
        email: $("#regEmail").val(),
        notes: $("#notes").val(),
        password: $("#regPassword").val(),
        mandtime: $("#mandtime").val(),
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

  function initEventsPage() {
    if (!requireLogin()) {
      return;
    }
    $(document).on("click", "#event-join-btn", function () {
      const selectedId = $("#event-join-dp").val();
      if (!selectedId) {
        alert("Bitte wählen Sie ein Event aus!");
        return;
      }
      console.log("Event beitreten:", selectedId);
      m_data_get.joinEvent(selectedId, function (err) {
        if (!err) {
          alert("Erfolgreich dem Event beigetreten!");
          m_data_get.getEvents(m_data_render.render.listView_event);
        } else {
          alert("Fehler beim Beitreten des Events!");
        }
      });
    });

    $(document).on("click", "#event-leave-btn", function () {
      const selectedId = $("#event-leave-dp").val();

      if (!selectedId) {
        alert("Bitte wählen Sie ein Event aus!");
        return;
      }

      const leaveNotes = $("#leave-notes").val();
      // TODO: Klären, ob leaveNotes immer gesetzt sein muss
      if (!leaveNotes) {
        alert("Bitte geben Sie einen Grund für das Verlassen des Events an.");
        return;
      }

      var leave_json = {
        EID: selectedId,
        notes: leaveNotes
      }
      console.log("Event verlassen:", leave_json);

      m_data_get.leaveEvent(leave_json, function (err) {
        if (!err) {
          alert("Erfolgreich dem Event verlassen!");
          m_data_get.getEvents(m_data_render.render.listView_event);
        } else {
          alert("Fehler beim Verlassen des Events!");
        }
      });
    });

    m_data_get.getEvents(m_data_render.render.listView_event);
    m_data_get.getEventsForDropdown(m_data_render.render.populateEventDropdowns);
  }

  function initTimeEntriesPage() {
    if (!requireLogin()) {
      return;
    }

    $(document).on("click", "#einstechenBtn", function () {
      const datetime = new Date();
      const paramData = {
        timestamp: datetime,
        tnotes: "/",
        action: "COME",
        tracked_by: sessionStorage.getItem("CurrentUserID"),
        created_at: datetime,
      };

      m_data_get.createTimeEntry(paramData, function (err) {
        if (!err) {
          document.getElementById("einstechenBtn").disabled = true;
          document.getElementById("ausstechenBtn").disabled = false;
          alert("Ein neuer Zeiteintrag (Einstechen) wurde erfolgreich angelegt.");
          m_data_get.getTimeEntries(m_data_render.render.listView_timeEntry);
          return;
        }
        alert("Zeiteintrag konnte nicht gesetzt werden, es ist ein Fehler am Server aufgetreten!");
      });
    });

    $(document).on("click", "#ausstechenBtn", function () {
      const datetime = new Date();
      const paramData = {
        timestamp: datetime,
        tnotes: "/",
        action: "GO",
        tracked_by: sessionStorage.getItem("CurrentUserID"),
        created_at: datetime,
      };

      m_data_get.createTimeEntry(paramData, function (err) {
        if (!err) {
          document.getElementById("ausstechenBtn").disabled = true;
          document.getElementById("einstechenBtn").disabled = false;
          alert("Ein neuer Zeiteintrag (Ausstechen) wurde erfolgreich angelegt.");
          m_data_get.getTimeEntries(m_data_render.render.listView_timeEntry);
          return;
        }
        alert("Zeiteintrag konnte nicht gesetzt werden, es ist ein Fehler am Server aufgetreten!");
      });
    });

    $(document).on("click", ".time-entry-edit-btn", function () {
      const TID = $(this).data("id");
      timeEntry.tmpObjIndex = searchIndexByKey("TID", TID, timeEntry.data);
      timeEntry.tmpObj = timeEntry.data[timeEntry.tmpObjIndex];

      m_data_render.render.editModalFillValues_timeEntry(TID);
      m_data_render.render.editModalShow_timeEntry();
    });

    $("#editForm").on("submit", function (event) {
      if (!$("#editTID").length) {
        return;
      }

      event.preventDefault();

      m_data_render.render.editTimeEntryGetValues_timeEntry();
      const TID = timeEntry.tmpObj.TID;
      const paramData = {
        TID: timeEntry.tmpObj.TID,
        timestamp: timeEntry.tmpObj.timestamp,
        tnotes: timeEntry.tmpObj.tnotes,
      };

      m_data_get.updateTimeEntry(TID, paramData, function (err) {
        if (!err) {
          m_data_render.render.editModalHide_timeEntry();
          m_data_get.getTimeEntries(m_data_render.render.listView_timeEntry);
          return;
        }
        alert("Fehler beim Ändern des Zeiteintrags!");
      });
    });

    $(document).on("click", ".time-entry-delete-btn", function () {
      const TID = $(this).data("id");
      if (!confirm("Zeitstempel mit TID " + TID + " wirklich löschen?")) {
        return;
      }

      m_data_get.deleteTimeEntry(TID, function (err) {
        if (!err) {
          alert("Der Zeitstempel mit TID " + TID + " wurde erfolgreich gelöscht.");
          m_data_get.getTimeEntries(m_data_render.render.listView_timeEntry);
          return;
        }
        alert("Fehler beim Löschen des Zeitstempels mit TID " + TID + ".");
      });
    });

    m_data_get.getTimeEntries(m_data_render.render.listView_timeEntry);
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
        firstname: user.tmpObj.firstname,
        lastname: user.tmpObj.lastname,
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
        firstname: user.tmpObj.firstname,
        lastname: user.tmpObj.lastname,
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

  $(document).on("click", ".logout-btn", function () {
    logout();
  });

  if ($("#loginForm").length) {
    initLoginPage();
    return;
  }
  // if ($("#timeEntries-tbody").length) {
  //   initTimeEntriesPage();
  //   return;
  // }
  if ($("#events-tbody").length) {
    initEventsPage();
    return;
  }
  if ($("#users-tbody").length) {
    initUsersPage();
  }
});

/* ------------------------------------------------ */
/*   m_data_get.js - code for js object module      */
/*                   GETTING DATA                   */
/*                                                  */
/*   (C) 2021 Wappfactory - Michael Kreinbihl       */
/*                                                  */
/* ------------------------------------------------ */
/*                                                              */
/* Aenderungen (02.03.2026):                                    */
/*                                                              */
/* 1. Zwei neue URL-Pfade angelegt, damit wir die Event-        */
/*    und SignIn-Endpunkte auf dem Server ansprechen koennen:    */
/*    - apiEndpointEvents = "/events"                           */
/*      -> ergibt z.B. "https://dev.wappprojects.de/.../events" */
/*    - apiEndpointSignIn = "/signIn"                           */
/*      -> ergibt z.B. "https://dev.wappprojects.de/.../signIn" */
/*    Beide wurden auch in das m_data_get.api-Objekt             */
/*    eingetragen, damit andere Module darauf zugreifen          */
/*    koennen (genau wie es schon fuer "users" und              */
/*    "timeEntry" gemacht wurde).                                */
/*                                                              */
/* 2. In der Funktion ensureState() wurde ein neuer Block        */
/*    fuer "eventsData" ergaenzt. ensureState() sorgt dafuer,   */
/*    dass die globalen Variablen (window.eventsData usw.)      */
/*    immer existieren, bevor wir sie benutzen. Konkret:        */
/*    - window.eventsData wird als leeres Objekt {} angelegt,   */
/*      falls es noch nicht existiert.                           */
/*    - eventsData.data wird als leeres Array [] angelegt,      */
/*      falls es noch kein Array ist (hier werden spaeter       */
/*      die Event-Objekte vom Server gespeichert).              */
/*    - eventsData.finishedWithError wird auf false gesetzt     */
/*      (kein Fehler zu Beginn).                                */
/*    - eventsData.error wird als leeres Objekt {} angelegt     */
/*      (hier werden spaeter Fehlerinfos gespeichert, falls     */
/*      ein AJAX-Aufruf fehlschlaegt).                          */
/*                                                              */
/* 3. getEvents(do_next_func) - Holt ALLE Events vom Server:   */
/*    - Schickt einen AJAX GET-Request an die URL "/events".    */
/*    - Bei Erfolg: Speichert die empfangene Event-Liste        */
/*      in eventsData.data (globale Variable).                  */
/*    - Bei Fehler: Setzt eventsData.data auf ein leeres        */
/*      Array und speichert den Fehler in eventsData.error.     */
/*    - Am Ende wird do_next_func() aufgerufen. Das ist die     */
/*      Render-Funktion (z.B. listView_event), die dann die     */
/*      Tabelle auf der HTML-Seite mit den Daten befuellt.      */
/*    - Das Muster ist exakt gleich wie bei getUsers().          */
/*                                                              */
/* 4. getEventsForDropdown(do_next_func) - Holt die gleichen    */
/*    Events nochmal, aber fuer die Dropdown-Menues:            */
/*    - Technisch identisch mit getEvents() (gleicher GET-      */
/*      Request an "/events").                                  */
/*    - Der Unterschied liegt nur darin, WELCHE Render-         */
/*      Funktion als do_next_func uebergeben wird:              */
/*      -> Bei getEvents wird listView_event() uebergeben       */
/*         (befuellt die Event-Tabelle).                        */
/*      -> Bei getEventsForDropdown wird                        */
/*         populateEventDropdowns() uebergeben (befuellt die    */
/*         Dropdown-Auswahllisten zum Beitreten/Verlassen).     */
/*                                                              */
/* 5. joinEvent(EID, onDone) - Meldet den aktuellen Benutzer    */
/*    bei einem Event an:                                       */
/*    - Schickt einen AJAX POST-Request an "/signIn".           */
/*    - Im Body (die Daten, die an den Server geschickt         */
/*      werden) stehen:                                         */
/*      -> EID: Die ID des Events, dem man beitreten will       */
/*      -> UID: Die ID des eingeloggten Benutzers (wird aus     */
/*         dem sessionStorage gelesen, wo sie beim Login         */
/*         gespeichert wurde)                                   */
/*      -> sign_in_time: Der aktuelle Zeitpunkt als ISO-String  */
/*         (z.B. "2026-03-02T14:30:00.000Z")                   */
/*    - Bei Erfolg: Ruft onDone(null, data) auf                 */
/*      -> null = kein Fehler, data = Antwort vom Server        */
/*    - Bei Fehler: Ruft onDone({xhr, status, error}) auf       */
/*      -> Das Objekt enthaelt die Fehlerdetails                */
/*    - In main.js (Zeile 134) wird diese Funktion so           */
/*      aufgerufen: joinEvent(selectedId, function(err) {...})  */
/*                                                              */
/* 6. leaveEvent(leave_json, onDone) - Meldet den aktuellen     */
/*    Benutzer von einem Event ab:                              */
/*    - Schickt einen AJAX PUT-Request an "/signIn".            */
/*      (PUT statt POST, weil ein bestehender SignIn-Eintrag    */
/*      auf dem Server aktualisiert/ergaenzt wird.)             */
/*    - leave_json ist ein Objekt mit zwei Feldern:             */
/*      -> leave_json.EID: Die Event-ID                         */
/*      -> leave_json.notes: Der Grund fuer das Verlassen       */
/*         (wird vom Benutzer in ein Textfeld eingegeben)       */
/*    - Im Body werden geschickt:                               */
/*      -> EID und notes aus leave_json                         */
/*      -> UID: Eingeloggter Benutzer (aus sessionStorage)      */
/*      -> sign_out_time: Aktueller Zeitpunkt als ISO-String    */
/*    - onDone-Callback funktioniert gleich wie bei joinEvent.  */
/*    - In main.js (Zeile 165) wird diese Funktion so           */
/*      aufgerufen: leaveEvent({EID: id, notes: text},          */
/*      function(err) {...})                                    */
/*                                                              */
/* 7. Am Dateiende steht ein TODO-Block mit Aufgaben, die       */
/*    noch im Backend (PHP-Server) erledigt werden muessen,     */
/*    damit die oben genannten AJAX-Aufrufe auch tatsaechlich   */
/*    funktionieren. Ohne diese Backend-Arbeit geben die        */
/*    Aufrufe 404-Fehler zurueck.                               */
/*                                                              */
/* ---------------------------------------------------------------- */
/* jshint -W117 */

var m_data_get = (function () {
  "use strict";

  var m_data_get = {};

  const baseUrl = "https://dev.wappprojects.de/wiws23i/api";
  const apiEndpointUsers = "/users";
  const apiEndpointTimeEntry = "/timeEntry";
  const apiEndpointEvents = "/events";
  const apiEndpointSignIn = "/signIn";
  const fullPathUsers = baseUrl + apiEndpointUsers;
  const fullPathTimeEntry = baseUrl + apiEndpointTimeEntry;
  const fullPathEvents = baseUrl + apiEndpointEvents;
  const fullPathSignIn = baseUrl + apiEndpointSignIn;

  m_data_get.api = {
    baseUrl: baseUrl,
    users: fullPathUsers,
    timeEntry: fullPathTimeEntry,
    events: fullPathEvents,
    signIn: fullPathSignIn,
  };

  m_data_get.ensureState = function () {
    if (typeof window.user === "undefined") {
      window.user = {};
    }

    if (typeof window.timeEntry === "undefined") {
      window.timeEntry = {};
    }

    if (typeof window.eventsData === "undefined") {
      window.eventsData = {};
    }

    if (!Array.isArray(user.data)) {
      user.data = [];
    }
    if (!Array.isArray(timeEntry.data)) {
      timeEntry.data = [];
    }
    if (!Array.isArray(eventsData.data)) {
      eventsData.data = [];
    }

    eventsData.finishedWithError = false;
    eventsData.error = eventsData.error || {};

    user.finishedWithError = false;
    user.error = user.error || {};
    user.tmpObj = user.tmpObj || null;
    user.tmpObjIndex = typeof user.tmpObjIndex === "number" ? user.tmpObjIndex : -1;

    timeEntry.finishedWithError = false;
    timeEntry.error = timeEntry.error || {};
    timeEntry.tmpObj = timeEntry.tmpObj || null;
    timeEntry.tmpObjIndex = typeof timeEntry.tmpObjIndex === "number" ? timeEntry.tmpObjIndex : -1;
  };

  function _authHeaders() {
    var token = sessionStorage.getItem("JWTToken");
    if (!token) {
      return {};
    }
    return { Authorization: "Bearer " + token };
  }

  m_data_get.login = function (paramData, onDone) {
    $.ajax({
      url: fullPathUsers + "/login",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(paramData),
      success: function (data) {
        onDone(null, data);
      },
      error: function (xhr, status, error) {
        onDone({
          xhr: xhr,
          status: status,
          error: error,
        });
      },
    });
  };

  m_data_get.register = function (paramData, onDone) {
    $.ajax({
      url: fullPathUsers,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(paramData),
      success: function (data) {
        onDone(null, data);
      },
      error: function (xhr, status, error) {
        onDone({
          xhr: xhr,
          status: status,
          error: error,
        });
      },
    });
  };

  m_data_get.getUsers = function (do_next_func) {
    m_data_get.ensureState();

    $.ajax({
      method: "GET",
      url: fullPathUsers,
      headers: _authHeaders(),
      success: function (result) {
        user.data = result !== null ? result : [];
        user.finishedWithError = false;
        if (typeof do_next_func === "function") {
          do_next_func();
        }
      },
      error: function (xhr, status, error) {
        user.data = [];
        user.finishedWithError = true;
        user.error.status = status;
        user.error.code = xhr.status;
        user.error.message = error;
        if (typeof do_next_func === "function") {
          do_next_func();
        }
      },
    });
  };

  m_data_get.createUser = function (paramData, onDone) {
    $.ajax({
      url: fullPathUsers,
      type: "POST",
      headers: _authHeaders(),
      contentType: "application/json",
      data: JSON.stringify(paramData),
      success: function (data) {
        onDone(null, data);
      },
      error: function (xhr, status, error) {
        onDone({
          xhr: xhr,
          status: status,
          error: error,
        });
      },
    });
  };

  m_data_get.updateUser = function (UID, paramData, onDone) {
    $.ajax({
      url: fullPathUsers + "/" + UID,
      type: "PUT",
      headers: _authHeaders(),
      contentType: "application/json",
      data: JSON.stringify(paramData),
      success: function (data) {
        onDone(null, data);
      },
      error: function (xhr, status, error) {
        onDone({
          xhr: xhr,
          status: status,
          error: error,
        });
      },
    });
  };

  m_data_get.deleteUser = function (UID, onDone) {
    $.ajax({
      url: fullPathUsers + "/" + UID,
      type: "DELETE",
      headers: _authHeaders(),
      success: function (data) {
        onDone(null, data);
      },
      error: function (xhr, status, error) {
        onDone({
          xhr: xhr,
          status: status,
          error: error,
        });
      },
    });
  };
  // getEvents: Schickt einen GET-Request an den Server (URL: /events),
  // um alle vorhandenen Events als JSON-Array zu laden.
  // Das Ergebnis wird in der globalen Variable window.eventsData.data gespeichert.
  // Nach dem Laden (egal ob Erfolg oder Fehler) wird die uebergebene Funktion
  // do_next_func() aufgerufen - das ist normalerweise die Render-Funktion
  // listView_event(), die dann die HTML-Tabelle mit den Events befuellt.
  // Das Muster ist exakt gleich aufgebaut wie getUsers() weiter oben.
  m_data_get.getEvents = function (do_next_func) {
    m_data_get.ensureState();

    $.ajax({
      method: "GET",
      url: fullPathEvents,
      headers: _authHeaders(),
      success: function (result) {
        eventsData.data = result !== null ? result : [];
        eventsData.finishedWithError = false;
        if (typeof do_next_func === "function") {
          do_next_func();
        }
      },
      error: function (xhr, status, error) {
        eventsData.data = [];
        eventsData.finishedWithError = true;
        eventsData.error.status = status;
        eventsData.error.code = xhr.status;
        eventsData.error.message = error;
        if (typeof do_next_func === "function") {
          do_next_func();
        }
      },
    });
  };

  // getEventsForDropdown: Technisch der gleiche GET-Request an /events wie oben.
  // Der einzige Unterschied: Die Funktion, die danach aufgerufen wird
  // (do_next_func), ist hier populateEventDropdowns() statt listView_event().
  // populateEventDropdowns() befuellt die <select>-Dropdown-Menues auf der
  // Event-Seite, damit der Benutzer ein Event zum Beitreten oder Verlassen
  // auswaehlen kann.
  m_data_get.getEventsForDropdown = function (do_next_func) {
    m_data_get.ensureState();

    $.ajax({
      method: "GET",
      url: fullPathEvents,
      headers: _authHeaders(),
      success: function (result) {
        eventsData.data = result !== null ? result : [];
        eventsData.finishedWithError = false;
        if (typeof do_next_func === "function") {
          do_next_func();
        }
      },
      error: function (xhr, status, error) {
        eventsData.data = [];
        eventsData.finishedWithError = true;
        eventsData.error.status = status;
        eventsData.error.code = xhr.status;
        eventsData.error.message = error;
        if (typeof do_next_func === "function") {
          do_next_func();
        }
      },
    });
  };

  // joinEvent: Meldet den eingeloggten Benutzer bei einem bestimmten Event an.
  //
  // Parameter:
  //   - EID: Die ID des Events, dem der Benutzer beitreten moechte
  //          (wird in main.js aus dem Dropdown-Menue ausgelesen).
  //   - onDone: Eine Callback-Funktion, die nach dem AJAX-Aufruf aufgerufen wird.
  //          Bei Erfolg: onDone(null, data) -> null heisst "kein Fehler".
  //          Bei Fehler: onDone({xhr, status, error}) -> Objekt mit Fehlerinfos.
  //
  // Was passiert:
  //   1. Es wird ein POST-Request an die URL "/signIn" geschickt.
  //      POST bedeutet: Wir wollen einen NEUEN Eintrag auf dem Server anlegen
  //      (naemlich: "Benutzer X ist dem Event Y beigetreten").
  //   2. Im Body (den Daten, die mitgeschickt werden) steht:
  //      - EID: Welches Event
  //      - UID: Welcher Benutzer (wird aus dem sessionStorage geholt,
  //        dort wurde die ID beim Login gespeichert)
  //      - sign_in_time: Wann der Benutzer beigetreten ist (aktueller Zeitpunkt)
  //   3. _authHeaders() fuegt den JWT-Token als "Authorization: Bearer ..."
  //      Header hinzu, damit der Server weiss, dass wir eingeloggt sind.
  //   4. JSON.stringify() wandelt das JavaScript-Objekt in einen JSON-String um,
  //      weil der Server JSON erwartet (contentType: "application/json").
  m_data_get.joinEvent = function (EID, onDone) {
    $.ajax({
      url: fullPathSignIn,
      type: "POST",
      headers: _authHeaders(),
      contentType: "application/json",
      data: JSON.stringify({
        EID: EID,
        UID: sessionStorage.getItem("CurrentUserID"),
        sign_in_time: new Date().toISOString(),
      }),
      success: function (data) {
        onDone(null, data);
      },
      error: function (xhr, status, error) {
        onDone({
          xhr: xhr,
          status: status,
          error: error,
        });
      },
    });
  };

  // leaveEvent: Meldet den eingeloggten Benutzer von einem Event ab.
  //
  // Parameter:
  //   - leave_json: Ein Objekt mit zwei Feldern:
  //       -> leave_json.EID: Die ID des Events, das verlassen werden soll
  //       -> leave_json.notes: Ein Text mit dem Grund fuer das Verlassen
  //          (wird vom Benutzer in ein Textfeld auf der Seite eingegeben)
  //     Dieses Objekt wird in main.js (Zeile 159-162) zusammengebaut:
  //     var leave_json = { EID: selectedId, notes: leaveNotes }
  //   - onDone: Callback-Funktion (gleich wie bei joinEvent oben).
  //
  // Was passiert:
  //   1. Es wird ein PUT-Request an die URL "/signIn" geschickt.
  //      PUT (statt POST) bedeutet: Wir wollen einen BESTEHENDEN Eintrag
  //      auf dem Server aendern (naemlich: den SignIn-Eintrag ergaenzen
  //      mit dem Zeitpunkt des Verlassens und dem Grund).
  //   2. Im Body werden mitgeschickt:
  //      - EID: Welches Event (aus leave_json.EID)
  //      - UID: Welcher Benutzer (aus sessionStorage)
  //      - notes: Warum der Benutzer das Event verlaesst (aus leave_json.notes)
  //      - sign_out_time: Wann der Benutzer das Event verlassen hat
  //        (aktueller Zeitpunkt als ISO-String, z.B. "2026-03-02T14:30:00.000Z")
  //   3. _authHeaders() und JSON.stringify() funktionieren gleich wie
  //      bei joinEvent oben beschrieben.
  m_data_get.leaveEvent = function (leave_json, onDone) {
    $.ajax({
      url: fullPathSignIn,
      type: "PUT",
      headers: _authHeaders(),
      contentType: "application/json",
      data: JSON.stringify({
        EID: leave_json.EID,
        UID: sessionStorage.getItem("CurrentUserID"),
        notes: leave_json.notes,
        sign_out_time: new Date().toISOString(),
      }),
      success: function (data) {
        onDone(null, data);
      },
      error: function (xhr, status, error) {
        onDone({
          xhr: xhr,
          status: status,
          error: error,
        });
      },
    });
  };
  m_data_get.getTimeEntries = function (do_next_func) {
    m_data_get.ensureState();

    $.ajax({
      method: "GET",
      url: fullPathTimeEntry,
      headers: _authHeaders(),
      success: function (result) {
        timeEntry.data = result !== null ? result : [];
        timeEntry.finishedWithError = false;
        if (typeof do_next_func === "function") {
          do_next_func();
        }
      },
      error: function (xhr, status, error) {
        timeEntry.data = [];
        timeEntry.finishedWithError = true;
        timeEntry.error.status = status;
        timeEntry.error.code = xhr.status;
        timeEntry.error.message = error;
        if (typeof do_next_func === "function") {
          do_next_func();
        }
      },
    });
  };

  m_data_get.createTimeEntry = function (paramData, onDone) {
    $.ajax({
      url: fullPathTimeEntry,
      type: "POST",
      headers: _authHeaders(),
      contentType: "application/json",
      data: JSON.stringify(paramData),
      success: function (data) {
        onDone(null, data);
      },
      error: function (xhr, status, error) {
        onDone({
          xhr: xhr,
          status: status,
          error: error,
        });
      },
    });
  };

  m_data_get.updateTimeEntry = function (TID, paramData, onDone) {
    $.ajax({
      url: fullPathTimeEntry + "/" + TID,
      type: "PUT",
      headers: _authHeaders(),
      contentType: "application/json",
      data: JSON.stringify(paramData),
      success: function (data) {
        onDone(null, data);
      },
      error: function (xhr, status, error) {
        onDone({
          xhr: xhr,
          status: status,
          error: error,
        });
      },
    });
  };

  m_data_get.deleteTimeEntry = function (TID, onDone) {
    $.ajax({
      url: fullPathTimeEntry + "/" + TID,
      type: "DELETE",
      headers: _authHeaders(),
      success: function (data) {
        onDone(null, data);
      },
      error: function (xhr, status, error) {
        onDone({
          xhr: xhr,
          status: status,
          error: error,
        });
      },
    });
  };

  return m_data_get;
})();

/* 
 * Sometimes it it a good idea to do the init right here
 * after module is loaded, if so => remove comment chars //
*/ 

// m_data_get.init();

/*
 * TODO Backend-Aufgaben (offen):
 *
 * Damit die neuen Funktionen (getEvents, joinEvent, leaveEvent) tatsaechlich
 * funktionieren, muessen folgende Dinge im PHP-Backend noch gemacht werden.
 * Ohne diese Aenderungen gibt der Server 404-Fehler ("Seite nicht gefunden")
 * zurueck, weil die URLs /events und /signIn noch nicht existieren.
 *
 * 1. SignInController.php erstellen:
 *    - Eine neue PHP-Datei im Controller-Ordner anlegen.
 *    - Darin zwei Methoden schreiben:
 *      a) Eine Methode fuer POST /signIn -> legt einen neuen SignIn-Eintrag
 *         in der Datenbank an (Benutzer tritt Event bei).
 *      b) Eine Methode fuer PUT /signIn -> aktualisiert einen bestehenden
 *         SignIn-Eintrag (Benutzer verlaesst Event, sign_out_time + notes).
 *
 * 2. routes.php anpassen:
 *    - Die Datei routes.php entscheidet, welche URL zu welchem Controller fuehrt.
 *    - Folgende Routen muessen dort eingetragen werden:
 *      a) GET /events       -> EventController (gibt alle Events zurueck)
 *      b) POST /signIn      -> SignInController (neuer Beitritt)
 *      c) PUT /signIn       -> SignInController (Event verlassen)
 *
 * 3. EventController.php pruefen:
 *    - Sicherstellen, dass der EventController eine GET-Methode hat,
 *      die alle Events aus der Datenbank liest und als JSON zurueckgibt.
 *    - Das zurueckgegebene JSON muss ein Array aus Event-Objekten sein,
 *      z.B.: [{ "EID": 1, "name": "Event A", "start": "...", ... }, ...]
 */

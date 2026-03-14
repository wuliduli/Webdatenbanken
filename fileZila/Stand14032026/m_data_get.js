/* ------------------------------------------------ */
/*   m_data_get.js - code for js object module      */
/*                   GETTING DATA                   */
/*                                                  */
/*   (C) 2021 Wappfactory - Michael Kreinbihl       */
/*                                                  */
/*   NOTE: Proposed Changes:                        */
/*   - [DEPRECATED] TimeEntries is no longer used.  */
/*   - [NEW] Add /signin endpoint for join/leave.
TEst 1   */
/* ------------------------------------------------ */
/* jshint -W117 */

var m_data_get = (function () {
  "use strict";

  var m_data_get = {};

  const baseUrl = "https://dev.wappprojects.de/wiws23i/api";
  const apiEndpointUsers = "/users";
  const apiEndpointTimeEntry = "/timeEntry"; // [PROPOSED DELETE]: TimeEntries no longer used
  const fullPathUsers = baseUrl + apiEndpointUsers;
  const fullPathTimeEntry = baseUrl + apiEndpointTimeEntry; // [PROPOSED DELETE]: TimeEntries no longer used

  /* [PROPOSED INSERT]:*/ 
  const apiEndpointSignIn = "/signin";
  const apiEndpointEvents = "/events";
  const fullPathSignIn = baseUrl + apiEndpointSignIn;
  const fullPathEvents = baseUrl + apiEndpointEvents;
 

  m_data_get.api = {
    baseUrl: baseUrl,
    users: fullPathUsers,
    timeEntry: fullPathTimeEntry, // [PROPOSED DELETE]
    /* [PROPOSED INSERT]:*/
    signin: fullPathSignIn,
    events: fullPathEvents,

  };

  m_data_get.ensureState = function () {
    if (typeof window.user === "undefined") {
      window.user = {};
    }

    if (typeof window.timeEntry === "undefined") { // [PROPOSED DELETE]
      window.timeEntry = {};
    }

    if (typeof window.eventsData === "undefined") {
      window.eventsData = {};
    }

    if (!Array.isArray(user.data)) {
      user.data = [];
    }
    if (!Array.isArray(timeEntry.data)) { // [PROPOSED DELETE]
      timeEntry.data = [];
    }
    if (!Array.isArray(eventsData.data)) {
      eventsData.data = [];
    }

    user.finishedWithError = false;
    user.error = user.error || {};
    user.tmpObj = user.tmpObj || null;
    user.tmpObjIndex = typeof user.tmpObjIndex === "number" ? user.tmpObjIndex : -1;

    timeEntry.finishedWithError = false; // [PROPOSED DELETE]
    timeEntry.error = timeEntry.error || {};
    timeEntry.tmpObj = timeEntry.tmpObj || null;
    timeEntry.tmpObjIndex = typeof timeEntry.tmpObjIndex === "number" ? timeEntry.tmpObjIndex : -1;
  
    eventsData.finishedWithError = false;
    eventsData.error = eventsData.error || {};
    eventsData.tmpObj = eventsData.tmpObj || null;
    eventsData.tmpObjIndex = typeof eventsData.tmpObjIndex === "number" ? eventsData.tmpObjIndex : -1;
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


  m_data_get.getEvents = function(do_next_func) {
    // [PROPOSED DELETE]: Hardcoded mock data
    
    eventsData.data = [
      {
        EID: "E1",
        name: "Test Event A",
        start: "2026-03-01 09:00",
        end: "2026-03-01 17:00",
        registered: 5,
        left: 0,
        notes: "Testdatensatz A"
      },
      {
        EID: "E2",
        name: "Test Event B",
        start: "2026-04-15 10:00",
        end: "2026-04-15 14:00",
        registered: 3,
        left: 1,
        notes: "Testdatensatz B"
      }
    ];
    eventsData.finishedWithError = false;
    console.log(eventsData);
    do_next_func();
    

    /* [PROPOSED UPDATE]: Fetch all events from API */
    /* [PROPOSED AJAX]:
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
    */
    do_next_func();
  };
  
  m_data_get.getEventData = function(EID, do_next_func) {
    // [PROPOSED DELETE]: Hardcoded mock data
    
    eventsData.data = { 
      EID: EID,
      name: "Test Event A",
      start: "2026-03-01 09:00",
      end: "2026-03-01 17:00"
    };
    eventsData.finishedWithError = false;
    console.log(eventsData);
    do_next_func();
    

    /* [PROPOSED UPDATE]: Fetch single event data by ID from API */
    /* [PROPOSED AJAX]:
    m_data_get.ensureState();
    $.ajax({
      method: "GET",
      url: fullPathEvents + "/" + EID,
      headers: _authHeaders(),
      success: function (result) {
        eventsData.data = result !== null ? result : {};
        eventsData.finishedWithError = false;
        if (typeof do_next_func === "function") {
          do_next_func();
        }
      },
      error: function (xhr, status, error) {
        eventsData.data = {};
        eventsData.finishedWithError = true;
        eventsData.error.status = status;
        eventsData.error.code = xhr.status;
        eventsData.error.message = error;
        if (typeof do_next_func === "function") {
          do_next_func();
        }
      },
    });
    */
    do_next_func();
  };

  /* [PROPOSED UPDATE]: Fetch events specifically formatted for use in UI dropdowns */
  m_data_get.getEventsForDropdown = function(do_next_func) {
    // Platzhalter
    /* [PROPOSED AJAX]:
    $.ajax({
      method: "GET",
      url: baseUrl + "/events/dropdown",
      headers: _authHeaders(),
      success: function (data) {
        if (typeof do_next_func === "function") do_next_func(null, data);
      },
      error: function (xhr, status, error) {
        if (typeof do_next_func === "function") do_next_func({xhr: xhr, status: status, error: error});
      }
    });
    */
    do_next_func();
  };

  /* [PROPOSED UPDATE]: Register the current user for a specific event by its ID (SignInController) */
  m_data_get.joinEvent = function(EID, do_next_func) {
    // Platzhalter
    /* [PROPOSED AJAX]:
    $.ajax({
      url: baseUrl + "/signin",
      type: "POST",
      headers: _authHeaders(),
      contentType: "application/json",
      data: JSON.stringify({ eventId: EID }),
      success: function (data) {
        if (typeof do_next_func === "function") do_next_func(null, data);
      },
      error: function (xhr, status, error) {
        if (typeof do_next_func === "function") do_next_func({xhr: xhr, status: status, error: error});
      }
    });
    */
    do_next_func();
  };

  /* [PROPOSED UPDATE]: Unregister the current user from a specific event (SignInController) */
  m_data_get.leaveEvent = function(leave_json, do_next_func) {
    // Platzhalter
    // leave_json = {EID: selectedId, notes: leaveNotes}
    /* [PROPOSED AJAX]:
    $.ajax({
      url: baseUrl + "/signin",
      type: "DELETE",
      headers: _authHeaders(),
      contentType: "application/json",
      data: JSON.stringify(leave_json),
      success: function (data) {
        if (typeof do_next_func === "function") do_next_func(null, data);
      },
      error: function (xhr, status, error) {
        if (typeof do_next_func === "function") do_next_func({xhr: xhr, status: status, error: error});
      }
    });
    */
    do_next_func();
  };

  /* [PROPOSED UPDATE]: Create a new event record (EventController) */
  m_data_get.createEvent = function(create_json, do_next_func) {
    // Platzhalter
    // create_json = {name: String, start: UnixTimeStamp, end: UnixTimeStamp}
    /* [PROPOSED AJAX]:*/
    $.ajax({
      url: baseUrl + "/events",
      type: "POST",
      headers: _authHeaders(),
      contentType: "application/json",
      data: JSON.stringify(create_json),
      success: function (data) {
        if (typeof do_next_func === "function") do_next_func(null, data);
      },
      error: function (xhr, status, error) {
        if (typeof do_next_func === "function") do_next_func({xhr: xhr, status: status, error: error});
      }
    });
    
    do_next_func();
  }

  /* [PROPOSED UPDATE]: Permanently remove an event record (EventController) */
  m_data_get.deleteEvent = function(EID, do_next_func) {
    // Platzhalter
    /* [PROPOSED AJAX]:
    $.ajax({
      url: baseUrl + "/events/" + EID,
      type: "DELETE",
      headers: _authHeaders(),
      success: function (data) {
        if (typeof do_next_func === "function") do_next_func(null, data);
      },
      error: function (xhr, status, error) {
        if (typeof do_next_func === "function") do_next_func({xhr: xhr, status: status, error: error});
      }
    });
    */
    do_next_func();
  }

  /* [PROPOSED UPDATE]: Update the details of an existing event record (EventController) */
  m_data_get.editEvent = function(EID, edit_json, do_next_func) {
    // Platzhalter
    // edit_json = {name: String, start: UnixTimeStamp, end: UnixTimeStamp}
    /* [PROPOSED AJAX]:
    $.ajax({
      url: baseUrl + "/events/" + EID,
      type: "PUT",
      headers: _authHeaders(),
      contentType: "application/json",
      data: JSON.stringify(edit_json),
      success: function (data) {
        if (typeof do_next_func === "function") do_next_func(null, data);
      },
      error: function (xhr, status, error) {
        if (typeof do_next_func === "function") do_next_func({xhr: xhr, status: status, error: error});
      }
    });
    */
    do_next_func();
  }

  /* [PROPOSED DELETE]: TimeEntry functions no longer used */
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

  /* [PROPOSED DELETE]: TimeEntry functions no longer used */
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

  /* [PROPOSED DELETE]: TimeEntry functions no longer used */
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

  /* [PROPOSED DELETE]: TimeEntry functions no longer used */
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

/* ------------------------------------------------ */
/*   m_data_get.js - code for js object module      */
/*                   GETTING DATA                   */
/*                                                  */
/*   (C) 2021 Wappfactory - Michael Kreinbihl       */
/*                                                  */
/* ------------------------------------------------ */
/* jshint -W117 */

var m_data_get = (function () {
  "use strict";

  var m_data_get = {};

  const baseUrl = "https://dev.wappprojects.de/wiws23i/api";
  const apiEndpointUsers = "/users";
  const apiEndpointTimeEntry = "/timeEntry";
  const fullPathUsers = baseUrl + apiEndpointUsers;
  const fullPathTimeEntry = baseUrl + apiEndpointTimeEntry;

  m_data_get.api = {
    baseUrl: baseUrl,
    users: fullPathUsers,
    timeEntry: fullPathTimeEntry,
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
  m_data_get.getEvents = function(do_next_func) {
    // Platzhalter
    do_next_func();
  };
  m_data_get.getEventsForDropdown = function(do_next_func) {
    // Platzhalter
    do_next_func();
  };
  m_data_get.joinEvent = function(EID, do_next_func) {
    // Platzhalter
    do_next_func();
  };
  m_data_get.leaveEvent = function(leave_json, do_next_func) {
    // Platzhalter
    // leave_json = {EID: selectedId, notes: leaveNotes}
    do_next_func();
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

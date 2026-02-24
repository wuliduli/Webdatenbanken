/* ------------------------------------------------     */
/*   timestamp.js - code for timestamp object module    */
/* ------------------------------------------------     */

var timeEntry = (function () {
  "use strict";

  // Application object.
  var timeEntry = {};
  var token = null;

  //************************************************
  // PRIVATE member variables and constants

  const baseUrl = "https://dev.wappprojects.de/wiws23i/api";
  const apiEndpointTimeEntry = "/timeEntry";
  const fullPathTimeEntry = baseUrl + apiEndpointTimeEntry;
  const modulVersion = "0.80"; // Mudulversion relevant?

  //************************************************
  // member variables

  timeEntry.data = [];
  timeEntry.finishedWithError = false;
  timeEntry.error = {};
  timeEntry.fullPathTimeEntry = fullPathTimeEntry;
  timeEntry.tmpObj = null;
  timeEntry.tmpObjIndex = -1;

  //************************************************
  // member functions

  // init object

  timeEntry.init = function () {
    // init object data
    timeEntry.data = [];
    timeEntry.finishedWithError = false;
    timeEntry.error = {};
    timeEntry.tmpObj = [];
    const einstechenBtn = document.getElementById("einstechenBtn");
    const ausstechenBtn = document.getElementById("ausstechenBtn");


    if(!sessionStorage.getItem('loggedIn')){
      window.location.href = 'index.html';
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


    //Button Einstechen
    $(document).on("click", "#einstechenBtn", function () {
      var datetime = new Date();
      console.log(datetime);
      //var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ3YXBwZmFjdG9yeSIsImF1ZCI6ImRlLndhcHBwcm9qZWN0cy5kZXYiLCJleHAiOjE3NDMyODkxOTksImlhdCI6MTc0MDQ3MjY2NCwiZW1haWwiOiJ0ZXN0QHdhcHBwcm9qZWN0cy5kZSIsInN1YiI6InhsYWctc2Rqay1za2R0In0.rXkyDtDcNO-W_KJCxxaY4M1rHfXh7mYbbr5dOfOAY3U';
      const paramData = {
        timestamp: datetime,
        tnotes: "/",
        action: "COME",
        tracked_by: sessionStorage.getItem("CurrentUserID"),
        created_at: datetime,
      };

      token = sessionStorage.getItem('JWTToken');

      $.ajax({
        url: baseUrl + apiEndpointTimeEntry,
        type: "POST",
        contentType: "application/json",
        headers: {
          Authorization: 'Bearer ' + token
        },
        data: JSON.stringify(paramData),
        success: function (data) {
          console.log("DATA: " + data);
          einstechenBtn.disabled = true;
          ausstechenBtn.disabled = false;
          alert(
            `Ein neuer Zeiteintrag (Einstechen) um ${paramData.timestamp} wurde erfolgreich angelegt.`
          );
          // reload and render table newly to see if data is saved in database correctly
          timeEntry.getTimeEntryWithAjax(timeEntry.render.listView);
        },
        error: function (error) {
          alert(
            "Zeiteintrag konnte nicht gesetzt werden, es ist ein Fehler am Server aufgetreten!",
            "Fehler beim Setzen des Zeiteintrags."
          );
          console.error(error);
        },
      });
    }),
      //Button Ausstechen
      $(document).on("click", "#ausstechenBtn", function () {
        var datetime = new Date();
        console.log(datetime);
        const paramData = {
          timestamp: datetime,
          tnotes: "/",
          action: "GO",
          tracked_by: sessionStorage.getItem("CurrentUserID"),
          created_at: datetime,
        };

        token = sessionStorage.getItem('JWTToken');

        $.ajax({
          url: baseUrl + apiEndpointTimeEntry,
          type: "POST",
          headers: {
            Authorization: 'Bearer ' + token
          },
          contentType: "application/json",
          data: JSON.stringify(paramData),
          success: function (data) {
            console.log(data);
            ausstechenBtn.disabled = true;
            einstechenBtn.disabled = false;
            alert(
              `Ein neuer Zeiteintrag (Ausstechen) um ${paramData.timestamp} wurde erfolgreich angelegt.`
            );
            // reload and render table newly to see if data is saved in database correctly
            timeEntry.getTimeEntryWithAjax(timeEntry.render.listView);
          },
          error: function (error) {
            alert(
              "Zeiteintrag konnte nicht gesetzt werden, es ist ein Fehler am Server aufgetreten!",
              "Fehler beim Setzen des Zeiteintrags."
            );
            console.error(error);
          },
        });
      }),
      // Bearbeiten-Button-Handler
      $(document).on("click", ".time-entry-edit-btn", function () {
        const TID = $(this).data("id");
        // console.log("id: " + id);

        timeEntry.tmpObjIndex = timeEntry.searchIndex(TID, timeEntry.data);

        timeEntry.tmpObj = timeEntry.data[timeEntry.tmpObjIndex];

        // console.log("Actual timeEntry Obj: ");
        // console.log(timeEntry.tmpObj);
        /*
                const timestamp = timeEntry.tmpObj.timestamp;
                const tnotes = timeEntry.tmpObj.tnotes;
                const tracked_by = timeEntry.tmpObj.tracked_by;
                const created_at = timeEntry.tmpObj.created_at;
        */
        // alert(`ID: ${id} | Name: ${name}| Email: ${email}`);

        timeEntry.render.editModalFillValues(TID);
        timeEntry.render.editModalShow();
      });

    //Edit Form
    $("#editForm").on("submit", function (event) {
      event.preventDefault();
      // get values for new user just entered in modal
      const TID = timeEntry.tmpObj.TID;
      console.log("TimeEntry Data Saved");

      timeEntry.render.editTimeEntryGetValues();

      const paramData = {
        TID: timeEntry.tmpObj.TID,
        timestamp: timeEntry.tmpObj.timestamp,
        tnotes: timeEntry.tmpObj.tnotes,
      };

      console.log(paramData);

      token = sessionStorage.getItem('JWTToken');

      $.ajax({
        url: baseUrl + apiEndpointTimeEntry + "/" + TID,
        type: "PUT",
        headers: {
          Authorization: 'Bearer ' + token
        },
        contentType: "application/json",
        data: JSON.stringify(paramData),
        success: function (data) {
          //timeEntry.render.newtimeEntryModalHide();
          console.log(data);
          timeEntry.render.editModalHide();
          // reload and render table newly to see if data is saved in database correctly
          timeEntry.getTimeEntryWithAjax(timeEntry.render.listView);
        },
        error: function (error) {
          alert("Fehler beim Ändern des Zeiteintrags!");
          console.error(error);
        },
      });
    }),
      // Button Löschen
      $(document).on("click", ".time-entry-delete-btn", function () {
        const TID = $(this).data("id");
        token = sessionStorage.getItem('JWTToken');
        if (confirm(`Zeitstempel mit TID ${TID} wirklich löschen?`)) {
          $.ajax({
            url: `${timeEntry.fullPathTimeEntry}/${TID}`,
            type: "DELETE",
            headers: {
              Authorization: 'Bearer ' + token
            },
            success: function () {
              alert(
                `Der Zeitstempel mit TID ${TID} wurde erfolgreich gelöscht.`
              );
              // reload and render table newly to see if data is saved in database correctly
              timeEntry.getTimeEntryWithAjax(timeEntry.render.listView);
            },
            error: function () {
              alert(`Fehler beim Löschen des Zeitstempels mit TID ${TID}.`);
            },
          });
        }
      });
  };

  //************************************************

  // search array item with key id = keyValue
  // return index
  timeEntry.searchIndex = function (keyValue, myArray) {
    for (let i = 0; i < myArray.length; i++) {
      if (myArray[i].TID === keyValue) {
        return i;
      }
    }
  };

  //************************************************

  timeEntry.getTimeEntryWithAjax = function (do_next_func) {
    token = sessionStorage.getItem('JWTToken');
    function success_func(result) {
      if (result !== null) {
        timeEntry.data = result;
      } else {
        timeEntry.data = [];
      }

      do_next_func();
    }

    function error_func(xhr, status, error) {
      console.log("XHR", xhr);
      timeEntry.data = [];
      timeEntry.finishedWithError = true;
      timeEntry.error.status = status;
      timeEntry.error.code = xhr.status;
      timeEntry.error.message = error;

      do_next_func();
    }

    // timeEntry.init();

    // console.log("PATH: " + timeEntry.fullPathTimeEntry);

    $.ajax({
      method: "GET",
      url: timeEntry.fullPathTimeEntry,
      headers: {
        Authorization: 'Bearer ' + token
      },
      success: success_func,
      error: error_func,
    });
  };

  timeEntry.render = {
    listView: function () {
      var jsonObj, htmlHeader, textItems, htmlText;
      const $tbody = $("#timeEntries-tbody");
      if (!timeEntry.finishedWithError) {
        // get saved data
        jsonObj = timeEntry.data;
        $tbody.empty();

        timeEntry.data.forEach(function (timeEntry) {
          const row = `
                        <tr>
                            <td>${timeEntry.TID}</td>
                            <td>${timeEntry.timestamp}</td>
                            <td>${timeEntry.tnotes}</td>
                            <td>${timeEntry.action}</td>
                            <td>${timeEntry.tracked_by}</td>
                            <td>${timeEntry.created_at}</td>
                            <td>
                                <button class="btn btn-sm btn-warning time-entry-edit-btn" data-id="${timeEntry.TID}">Bearbeiten</button>
                                <button class="btn btn-sm btn-danger time-entry-delete-btn" data-id="${timeEntry.TID}">Löschen</button>
                            </td>
                        </tr>
                    `;
          if (timeEntry.tracked_by == sessionStorage.getItem("CurrentUserID")) {
            $tbody.append(row);
            if (timeEntry.action == "GO") {
              document.getElementById("einstechenBtn").disabled = false;
              document.getElementById("ausstechenBtn").disabled = true;
            } else {
              document.getElementById("einstechenBtn").disabled = true;
              document.getElementById("ausstechenBtn").disabled = false;

            }
          }
        }

        );
      } else {
        //ERROR function tbd
      }
    },

    editModalShow: function () {
      // Modal anzeigen
      $('#editModal').modal("show");

    },

    editModalHide: function () {
      // Modal ausblenden
      $("#editModal").modal("hide");
    },

    editModalFillValues: function (TID) {
      const timestamp = timeEntry.tmpObj.timestamp;
      const tnotes = timeEntry.tmpObj.tnotes;
      // const action = timeEntry.tmpObj.action;
      const tracked_by = timeEntry.tmpObj.tracked_by;
      const created_at = timeEntry.tmpObj.created_at;

      // Werte in das Modal einfügen
      $("#editTID").val(TID);
      $("#editTimestamp").val(timestamp);
      $("#edittnote").val(tnotes);
      $("#editTrackedBy").val(tracked_by);
      $("#editCreatedAt").val(created_at);
    },

    editTimeEntryGetValues: function () {
      const timestamp = $("#editTimestamp").val();
      const tnotes = $("#edittnote").val();
      const active = $("#active").val();
      const tracked_by = $("#editTrackedBy").val();
      const created_at = $("#editCreatedAt").val();

      timeEntry.tmpObj = {
        timestamp: timestamp,
        tnotes: tnotes,
        active: active,
        tracked_by: tracked_by,
        created_at: created_at,
      };
    },
  };

  return timeEntry;
})();

/*
 * init after module is loaded, if so => remove comment chars //
 */

timeEntry.init();
timeEntry.getTimeEntryWithAjax(timeEntry.render.listView);

/* ------------------------------------------------ */
/*   m_get_render.js - code for js object module    */
/*                     RENDERING DATA               */
/*                                                  */
/*   (C) 2021 Wappfactory - Michael Kreinbihl       */
/*                                                  */
/* ------------------------------------------------ */
/* jshint -W117 */

var m_data_render = (function () {
    "use strict";
    
    // Application object.
    var m_data_render = {};

    //************************************************
    // PRIVATE member variables
        
    var var1;
    
    //************************************************
    // PRIVATE FUNCTIONS
    
	function _myPrivFunc (param) {
		// code here
	}
    
    //************************************************
    // member variables

	

    //************************************************
    // member functions

	// init object 

	m_data_render.init = function () {
		// init object here
	};


    // get json data with ajax

    m_data_render.render = {
        listView_timeEntry: function () {
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

        editModalShow_timeEntry: function () {
            // Modal anzeigen
            $('#editModal').modal("show");
        },

        editModalHide_timeEntry: function () {
            // Modal ausblenden
            $("#editModal").modal("hide");
        },

        editModalFillValues_timeEntry: function (TID) {
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

        editTimeEntryGetValues_timeEntry: function () {
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
        listView_user: function () {
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

        newUserModalShow_user: function () {
            $("#newUserModal").modal("show");
        },

        newUserModalHide_user: function () {
            $("#newUserModal").modal("hide");
        },

        newUserGetValues_user: function () {
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

        editModalShow_user: function () {
            // Modal anzeigen
            $("#editModal").modal("show");
        },

        editModalHide_user: function () {
            // Modal ausblenden
            $("#editModal").modal("hide");
        },

        editModalFillValues_user: function (UID) {
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
        editModalGetValues_user: function () {
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


    return m_data_render;

})();

/* 
 * Sometimes it it a good idea to do the init right here
 * after module is loaded, if so => remove comment chars //
*/ 

// m_data_render.init();

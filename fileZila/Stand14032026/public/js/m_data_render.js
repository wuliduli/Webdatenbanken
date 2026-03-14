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
        listView_event: function () {
            console.log(eventsData);
            const $tbody = $("#events-tbody");
            if (!eventsData.finishedWithError) {
                $tbody.empty();
                eventsData.data.forEach(function (eventItem) {
                    const row = `
                        <tr>
                        // Debug von Andy: registered -> sign_in_time, left  -> sign_out_time
                            <td>${eventItem.EID}</td>
                            <td>${eventItem.name}</td>
                            <td>${eventItem.start}</td>
                            <td>${eventItem.end}</td>
                            <td>${eventItem.sign_in_time}</td>
                            <td>${eventItem.sign_out_time}</td>
                            <td>${eventItem.notes}</td>
                        </tr>
                    `;
                    $tbody.append(row);
                });
            } 
            eventsData = {};
        },

        // Creates the Eventmanager View
        listView_manager: function (){
            console.log(eventsData);
            const $tbody = $("#eventmanager-tbody");
            if (!eventsData.finishedWithError) {
                $tbody.empty();
                eventsData.data.forEach(function (eventsData) {
                    const row = `
                        <tr>
                            <td>${eventsData.EID}</td>
                            <td>${eventsData.name}</td>
                            <td>${eventsData.start}</td>
                            <td>${eventsData.end}</td>
                            <td class="text-center">
                                <button type="button" data-id = "${eventsData.EID}" class="btn btn-primary btn-sm me-1 editEventBtn btn-ManEdit" data-bs-toggle="modal" data-bs-target="#editEventModal">Bearbeiten</button>
                                <button type="button" data-id = "${eventsData.EID}" class="btn btn-danger btn-sm deleteEventBtn btn-ManDelete" data-bs-toggle="modal" data-bs-target="#deleteEventModal">Löschen</button>
                            </td>
                        </tr>
                    `;
                    $tbody.append(row);
                });
            }
            eventsData = {};
        },

        populateEditEventModal: function () {
            $("#editEventName").val(eventsData.data.name);
            $("#editEventStart").val(eventsData.data.start);
            $("#editEventEnd").val(eventsData.data.end);
            $("#btn-confirmEdit").data("id", eventsData.data.EID);
        },
        populateEventDropdownsJoin: function () {
            var $join = $("#event-join-dp");

            function clearAndDefault($el) {
                $el.empty();
                $el.append('<option selected disabled>Event wählen...</option>');
            }

            clearAndDefault($join);

            eventsData.data.forEach(function (ev) {
                $join.append(`<option value="${ev.EID}">${ev.name}</option>`);
            });
            eventsData = {};
        },
        populateEventDropdownsLeave: function () {
            var $leave = $("#event-leave-dp");

            function clearAndDefault($el) {
                $el.empty();
                $el.append('<option selected disabled>Event wählen...</option>');
            }

            clearAndDefault($leave);

            eventsData.data.forEach(function (ev) {
                $leave.append(`<option value="${ev.EID}">${ev.name}</option>`);
            });
            eventsData = {};
        },
        listView_user: function () {
            // do rendering
            var jsonObj, htmlHeader, textItems, htmlText;
            const $tbody = $("#users-tbody");

            console.log(user);

            if (!user.finishedWithError) {

            $tbody.empty(); // Tabelle leeren, bevor sie befüllt wird

            // alle Benutzer in Tabelle hinzufügen
            user.data.forEach(function (user) {
                const row = `
                <tr>
                    <td>${user.UID}</td>
                    <td>${user.first_name}</td>
                    <td>${user.last_name}</td>
                    <td>${user.email}</td>
                    <td>${user.active}</td>
                    <td>${user.verified}</td>
                    <td>${user.create_at}</td>
                    <td class="text-center">
                        <button class="btn btn-sm me-1 btn-primary user-edit-btn" data-id="${user.UID}">Bearbeiten</button>
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
            const first_name = $("#newFirstname").val();
            const last_name = $("#newLastname").val();
            const email = $("#newEmail").val();
            const notes = $("#newNotes").val();
            const mandtime = $("#newMandtime").val();
            const active = $("#newActive").val();
            const verified = $("#newVerified").val();

            user.tmpObj = {
            first_name: first_name,
            last_name: last_name,
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
            console.log(user.tmpObj);
            const first_name = user.tmpObj.first_name;
            const last_name = user.tmpObj.last_name;
            const email = user.tmpObj.email;
            const active = user.tmpObj.active;
            const verified = user.tmpObj.verified;
            const created_at = user.tmpObj.created_at;

            // Werte in das Modal einfügen
            $("#editUID").val(UID);
            $("#editFirstname").val(first_name);
            $("#editLastname").val(last_name);
            $("#editEmail").val(email);
            $("#editActive").val(active);
            $("#editVerified").val(verified);
            $("#editCreatedAt").val(created_at);

        },
        editModalGetValues_user: function () {
            const UID = $("#editUID").val();
            const first_name = $("#editFirstname").val();
            const last_name = $("#editLastname").val();
            const email = $("#editEmail").val();
            const active = $("#editActive").val();
            const verified = $("#editVerified").val();
            const created_at = $("#editCreatedAt").val();

            // save the data back to the actualObject and data object

            user.tmpObj = {
            UID: UID,
            first_name: first_name,
            last_name: last_name,
            email: email,
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
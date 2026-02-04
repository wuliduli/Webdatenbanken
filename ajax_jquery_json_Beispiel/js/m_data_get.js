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
    
    // Application object.
    var m_data_get = {};

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

	m_data_get.data = null;
    m_data_get.finishedWithError = false;
    m_data_get.error = {};
	

    //************************************************
    // member functions

	// init object 

	m_data_get.init = function () {
		// init object here
	};


    // get json data with ajax

	m_data_get.getDataWithAjax = function (do_next_func) {


        function success_func (result) {
           if (result !== null) {
                m_data_get.data = result;
            } else {
                m_data_get.data = {};
            }

            do_next_func();

        };

        function error_func (xhr, status, error) {
            console.log("XHR", xhr);
            m_data_get.data = {};
            m_data_get.finishedWithError = true;
            m_data_get.error.status = status;
            m_data_get.error.code = xhr.status;
            m_data_get.error.message = error;

            do_next_func();
        };

        $.ajax({
            method: "GET",
            url: "data/ajax_info.json",
            success: success_func,
            error: error_func
        });
    };

    return m_data_get;
})();

/* 
 * Sometimes it it a good idea to do the init right here
 * after module is loaded, if so => remove comment chars //
*/ 

// m_data_get.init();

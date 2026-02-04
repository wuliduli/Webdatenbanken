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

	m_data_render.render = function () {

        // do rendering
        var jsonObj, htmlHeader, textItems, htmlText;

        console.log(m_data_get);
        if (!m_data_get.finishedWithError) {

            // get saved data
            jsonObj = m_data_get.data;

            // build header html from json header input
            htmlHeader = "<h3>" + jsonObj.header + "</h3>";

            // start html with opening tag for unorderd list
            htmlText = "<ul>";
            textItems = jsonObj.text;
            console.log("Text: " + JSON.stringify(jsonObj));
            
            // get text items in a loop from json items array 
            textItems.forEach(function (item){
                htmlText += "<li>" + item.item + "</li>"; 
                console.log("Item: " + item.item);
            });

            // end html with closing tag for unorderd list
            htmlText += "</ul>";

            console.log(htmlText);

            // Now that we have build html let's render into the DOM            
            $("#ajax-header").html(htmlHeader);
            $("#ajax-items").html(htmlText);
        } else {
            var alertHeading = "Error " + m_data_get.error.code;
            var alertText = m_data_get.error.message;

            alert(alertHeading + ": " + alertText);
        }
    };


    return m_data_render;

})();

/* 
 * Sometimes it it a good idea to do the init right here
 * after module is loaded, if so => remove comment chars //
*/ 

// m_data_render.init();

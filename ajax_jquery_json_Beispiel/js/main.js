
// Main JS File with document ready   

$(document).ready(function(){

  var renderFunc = m_data_render.render;

  // button functions 
  $("#btn1").click(function(){

    console.log("#btn1 clicked.");

    /* ATTN: AJAX calls are async!!! 
     * Data will be available after AJAX has finished getting data!
     *
     * This will not work:
     * m_data_get.getDataWithAjax();
     * m_data_render.render();
    */

    // This will do the async stuff
    m_data_get.getDataWithAjax(renderFunc);

  });

  $("#btn2").click(function(){

    console.log("#btn2 clicked.");
    $("#ajax-header").html("<h3>Let AJAX say what it is!</h3>");
    $("#ajax-items").html("");

  });


});

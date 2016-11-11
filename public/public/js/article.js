(function() {
    "use strict";
    var apiUrl = "https://labyrinth-backend.herokuapp.com/articles/";
    var newArticle;

    function getallArticles() {
        $.ajax({
            url: apiUrl,
            type: 'GET',
            dataType: 'JSON',
            success: function(data) {
                if (data) {
                    displayArticles(data);
                } else {
                    console.log("Articles not Found");
                }
            },
            error: function(request, status, error) {
                console.log(error, status, request);
            }
        });
    }

    $(document).ready(getallArticles);
})(); 
(function() {
    "use strict";
    var apiUrl = "https://labyrinth-backend.herokuapp.com/articles/frontpage/";
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
                    console.log("Articles not found");
                }
            },
            error: function(request, status, error) {
                console.log(error, status, request);
            }
        });
    }

    $(document).ready(getallArticles);
})(); 
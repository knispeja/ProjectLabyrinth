(function() {
    "use strict";
    var apiUrl = "http://localhost:3000/articles/";
    var newArticle;

    function getallArticles() {
        console.log("ran get all Articles");
        $.ajax({
            url: apiUrl,
            type: 'GET',
            dataType: 'JSON',
            success: function(data) {
                if (data) {
                    console.log(data);
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
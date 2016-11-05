(function () {
    "use strict";
    var apiUrl = "https://localhost:3000/articles";

    function createArticle(article) {
        $.ajax({
            url: apiUrl,
            type: "POST",
            data: article,
            dataType: 'JSON',
            success: function (data) {
                if (data) {
                    window.location.href = "./homePage.html";
                } else {
                    console.log("Article could not be created");
                }
            },
            error: function (request, status, error) {
                console.log(error, status, request);
            }
        });
    }

}); 
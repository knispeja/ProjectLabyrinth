(function () {
    "use strict";
    var apiUrl = "https://localhost:3000/articles/";
    var newArticle;

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

    function getArticle(article) {
        $.ajax({
            url: apiUrl + article._id,
            type: 'GET',
            dataType: 'JSON',
            success: function (data) {
                if (data) {
                    newArticle = data;
                } else {
                    console.log("Cannot find article.");
                }
            },
            error: function(request, status, error) {
                console.log(error, status, request);
            }
        });
    }

    function createArticleOnPage(article) {
        $(".articleSpace").append(
            "<div class=\"article\">" +
            "<h1>" + article.title + "</h1>" +
            "<img class=\"mazePic\" src=\"" +
            article.image + "\" alt=\"Picture goes here\">" +
            "<p>" + article.text + "</p>" +
            "<a href=\"articleView.html\"><div id=\"articleReadMore\">Read More!</div></a></div>"
        );
    }

    $('#submit').click(function() {
        var article = {
            title: $("#articleTitle").val(),
            image: $("#imageUploaded")[0].files(0),
            text: $("#description").val(),
            dateTime: new Date()
        }
        createArticle(article);
        createArticleOnPage(article);
        window.location.href = "./homePage.html";
    });

})(); 
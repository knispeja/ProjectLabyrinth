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

    function getArticle(article) {
        $.ajax({
            url: apiUrl + article._id,
            type: 'GET',
            dataType: 'JSON',
            success: function(data) {
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

    // use this for setting the article up in the articleView page
    function setArticleView(article) {
        document.getElementById("articleTitle").textContent = article.title;
        document.getElementById("articleDesc").textContent = article.text;
        //still need to figure out how to insert images
        $("#articlePic").attr("src", "data:image/jpg;base64," /*+ something here?*/);
    }

    $(document).ready(getallArticles);
})(); 
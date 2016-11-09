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

    function displayArticles(allOfThem) {
        allOfThem.forEach(function(article) {
            console.log(article);
            createArticleOnPage(article);
        });
    }

    // use this for putting articles on the homePage and archivePages
    function createArticleOnPage(article) {
        $(".articleSpace").append(
            "<div class=\"article\">" +
            "<h1>" + article.title + "</h1>" +
            "<img class=\"mazePic\" src=\"" +
            article.image + "\" alt=\"Picture goes here\">" +
            "<p>" + article.text.substring(0, 50) + "...</p>" +
            "<a href=\"articleView.html\"><div id=\"articleReadMore\">Read More!</div></a></div>"
        );
    }

    // use this for setting the article up in the articleView page
    function setArticleView(article) {
        document.getElementById("articleTitle").textContent = article.title;
        document.getElementById("articleDesc").textContent = article.text;
        //still need to figure out how to insert images
        $("#articlePic").attr("src", "data:image/jpg;base64," /*+ something here?*/);
    }

    // results will be an array of objects that we will display on the search results page
    // assuming results are already filtered
    function showSearchResults(results) {
        results.forEach(function(result) {
            $("$searchResults").append(
                "<span class=\"result\">" +
                "<a href=\"articleView.html\">" +
                // still need to figure out image stuff here
                "<img class=\"mazePic\" src=\"" + result.image +
                "\" alt=\"Picture goes here\">" +
                "</a></span>"
            );
        });
    }

    $(document).ready(getallArticles);
})(); 
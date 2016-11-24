(function(){
    "use strict";
    var apiUrl = "https://labyrinth-backend.herokuapp.com/articles/";

    function getArticle(articleID) {
        $.ajax({
            url: apiUrl + articleID,
            type: 'GET',
            dataType: 'JSON',
            success: function(data) {
                if (data) {
                    setArticleView(data);
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
        $("#articlePic").attr("src", article.image);
    }

    function loadArticle(){
        getArticle(window.location.search.substr(1));
    }
    $(document).ready(loadArticle);
})()
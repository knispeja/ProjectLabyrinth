(function(){
    "use strict";
    var apiUrl = "http://localhost:3000/articles/";

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
        var query = window.location.search.substr(1);
        getArticle(query);
    }
    $(document).ready(loadArticle);
})()
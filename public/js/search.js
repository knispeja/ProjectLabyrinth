(function () {

    var apiUrl = "http://localhost:3000/search/";

    function search(query) {
        $.ajax({
            url: apiUrl,
            type: 'POST',
            data: {query: query},
            dataType: 'JSON',
            success: function (data) {
                if (data) {
                    displayMazes(data.mazes);
                    showArticles(data.articles);
                    return false;
                } else {
                    console.log("Maze not Found");
                }
            },
            error: function (request, status, error) {
                console.log(error, status, request);
            }
        });
    }

    // results will be an array of objects that we will display on the search results page
    // assuming results are already filtered
    function showArticles(articles) {
        articles.forEach(function(article) {
            $("#articleResults").append(
                "<span class=\"result\">" +
                "<a href=\"articleView.html\">" +
                // still need to figure out image stuff here
                "<img class=\"articlePic\" src=\"" + article.image +
                "\" alt=\"Picture goes here\">" +
                "</a></span>"
            );
        });
    }

    // URL formatted like "http://normal/url?QUERY" where QUERY is the search query
    function getSearchQuery() {
        return decodeURI(window.location.search.substr(1));
    }

    var query = getSearchQuery();
    document.title = "Search for: \"" + query + "\"";
    search(query);
})();
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
                    showArticleSearchResults(data.articles);
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

    // URL formatted like "http://normal/url?QUERY" where QUERY is the search query
    function getSearchQuery() {
        var url = decodeURI(location.href); 
        return url.substring(url.indexOf("?") + 1);
    }

    var query = getSearchQuery();
    document.title = "Search for: \"" + query + "\"";
    search(query);
})();
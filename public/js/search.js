(function () {

    var apiUrl = "http://localhost:3000/mazes/";

    function search(query) {
        $.ajax({
            url: apiUrl + maze._id,
            type: 'PUT',
            data: maze,
            dataType: 'JSON',
            success: function (data) {
                if (data) {
                    window.location.href = './index.html';
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
        var url = location.href; 
        return url.substring(url.indexOf("?") + 1);
    }

    var query = getSearchQuery();
    document.title = "Search for: \"" + query + "\"";
    search(query);
})();
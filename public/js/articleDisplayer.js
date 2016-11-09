function displayArticles(allOfThem) {
    allOfThem.forEach(function(article) {
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
        "<a href=\"articleView.html?" + article._id + 
        "\"><div id=\"articleReadMore\">Read More!</div></a></div>"
    );
}
(function(){
    "use strict";
    var apiUrl ="https://localhost:3000/users";
    var user;
    
    function createUser() {
        $.ajax({
            url: apiUrl,
            type: 'POST',
            data: user,
            success: function(data) {
                
            }
        })
    }
})();
document.write('\
<div class="headerArea">\
	<img id="logo" src="images/smollogo.png" alt="Project Labyrinth">\
		<div id="navbar">\
			<a href ="archivePage.html"><div class="nav" id="articles">Archived Articles</div></a>\
			<div class="nav" id="userMazes">User Mazes</div>\
			<div class="nav" id="mazeGenerator">Maze Generator</div>\
			<a href ="login.html"><div class="nav" id="login">Login</div></a>\
			<div class="nav" id="search">\
				<form>\
					Search: <input type="text" id="searchBox" value="">\
				</form>\
			</div>\
		</div>\
       <div class="coloredStripe"></div>\
	</div>\
');
// Note: We should add something below here which changes the text and effect of the Login button
// if the user is signed in
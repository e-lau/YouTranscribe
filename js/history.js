$(document).ready(function() {
	console.log('userid: ' + g_username + " | " + localStorage.getItem('userid'));
    parse.loadUser();
});
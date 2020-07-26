//const devices = [];
//devices.push({ user: "Mary", name: "Mary's iPhone" });
//devices.push({ user: "Alex", name: "Alex's Surface Pro" });
//devices.push({ user: "Mary", name: "Mary's MacBook" });

$('#navbar').load('navbar.html');
$('#footer').load('footer.html');

const devices = JSON.parse(localStorage.getItem('devices')) || [];
const users = JSON.parse(localStorage.getItem('users')) || [];

devices.forEach(function(device) {
	$('#devices tbody').append(`
		<tr>
			<td>${device.user}</td>
			<td>${device.name}</td>
		</tr>`
	);
});


$('#add-device').on('click', function() {
	const user = $('#user').val();
	const name = $('#name').val();
	devices.push({ user , name });
	localStorage.setItem('devices', JSON.stringify(devices));
	location.href = '/';
});


$('#register').on('click', function() {
	const username = $('#username').val();
	const password = $('#password').val();
	const confirmpassword = $('#confirmpassword').val();
	
	const userexists = users.find(user => users.name === username);

	if(userexists){
		alert("user already exists");
		location.reload();
	}else {
		if(password === confirmpassword){
			users.push({name: username, password});
			localStorage.setItem('users', JSON.stringify(users));
			alert("User added");
			location.href = '/login';
		}else{
			alert("Password did not match");
			location.reload();
		}
	}
	
});

$('#login').on('click', function(){
	const username = $('#username').val();
	const password = $('#password').val();
	const users = JSON.parse(localStorage.getItem('users')) || [];
	var passwordMatch = false;
	const exists = users.find(user => user.name === username);

	if(exists){
		user.find( user => {
			if(user.username===username && user.password === password){
				passwordMatch =true;
			}
		});

		if(passwordMatch){
			localStorage.setItem('isAuthenticated', true);
			location.href = '/';
		}else{
			alert("Incorrect Password");
		}
	}else{
		alert("User does not exist");
	}
	
	
});

$('#send-command').on('click', function() {
	const command = $('#comand').val();
	console.log(`command is: ${command}`);
});

const logout = () => {
	localStorage.removeItem('isAuthenticated');
	location.href = '/login';
   }
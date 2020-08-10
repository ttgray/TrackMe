//const devices = [];
//devices.push({ user: "Mary", name: "Mary's iPhone" });
//devices.push({ user: "Alex", name: "Alex's Surface Pro" });
//devices.push({ user: "Mary", name: "Mary's MacBook" });

$('#navbar').load('navbar.html');
$('#footer').load('footer.html');
//const API_URL = 'http://localhost:5000/api';
const API_URL = 'https://trackme-one.vercel.app/api';

//const devices = JSON.parse(localStorage.getItem('devices')) || [];
const response = $.get(`${API_URL}/devices`) .then(response => {
	response.forEach(device => {
		$('#devices tbody').append(`
			<tr>
				<td>${device.user}</td>
				<td>${device.name}</td>
			</tr>`
		);
	});
})
.catch(error => {
	console.error(`Error: ${error}`);
});

const users = JSON.parse(localStorage.getItem('users')) || [];

//devices.forEach(function(device) {
//	$('#devices tbody').append(`
//		<tr>
//			<td>${device.user}</td>
//			<td>${device.name}</td>
//		</tr>`
//	);
//});


//$('#add-device').on('click', function() {
//	const user = $('#user').val();
//	const name = $('#name').val();
//	devices.push({ user , name });
//	localStorage.setItem('devices', JSON.stringify(devices));
//	location.href = '/';
//});

$('#add-device').on('click', () => {
	const name = $('#name').val();
	const user = $('#user').val();
	const sensorData = [];

	const body = {
		name,
		user,
		sensorData
	};
	$.post(`${API_URL}/devices`, body) .then(response => {
		location.href = '/';
	})
	.catch(error => {
		console.error(`Error: ${error}`);
	});
});


$('#register').on('click', function() {
	const username = $('#username').val();
	const passwordin = $('#passwordin').val();
	const confirmpassword = $('#confirmpassword').val();
	
	const userexists = users.find(user => user.name === username);

	if(userexists){
		alert("user already exists");
		location.reload();
	}else {
		if(passwordin === confirmpassword){
			users.push({name: username, passwordin});
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
	//const users = JSON.parse(localStorage.getItem('users')) || [];
	var passwordMatch = false;
	//const exists = users.find(user => user.name === username);
	const existingAccount = users.find(user => (user.name === username));
	const correctPassword = users.find(user => (user.name === username) && (user.passwordin === password));

	if(existingAccount && correctPassword){
		passwordMatch = true;
	}else if(existingAccount){
		alert("Incorrect Password");
	}else{
		alert("Incorrect Username");
	}
	
	if(passwordMatch){
		localStorage.setItem('isAuthenticated', true);
		location.href = '/';
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
import { useEffect, useState } from 'react';
import './App.css';
import Background from './assets/Background.png';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { Homepage } from './pages/Homepage';

function App() {
	const bg = {
		backgroundImage: `url(${Background})`,
	};

	const [register, setRegister] = useState(false);
	const [loggedIn, setLoggedIn] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) setLoggedIn(!loggedIn);
	}, []);

	return (
		<div
			style={bg}
			className='grid bg-fixed bg-cover'>
			{loggedIn ? (
				//logged in - homepage
				<Homepage />
			) : !register ? (
				//initial landing page
				<LoginPage setRegister={setRegister} />
			) : (
				//displayed when user clicks on sign up
				<RegisterPage />
			)}
		</div>
	);
}

export default App;

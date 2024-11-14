import { Box } from '@mui/material';
import LoginBtn from '../../assets/Login_button.png';
import { StyledTextField } from '../Login/StyledTextField';
import { useEffect, useState } from 'react';
import { PasswordTextField } from './PasswordTextField';
import axios from 'axios';

interface RegisterForm {
	username: string;
	password: string;
}

export const LoginForm = () => {
	const [formData, setFormData] = useState<RegisterForm>({
		username: '',
		password: '',
	});
	const [formError, setFormError] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	const handleSubmit = async (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
		event.preventDefault();

		if (!formData.username || !formData.password) {
			setFormError('Ensure to fill in all fields.');
			return;
		}

		try {
			let url = '';
			if (import.meta.env.DEV) {
				url = 'http://localhost:3000/api/user';
			} else {
				url = 'https://therapy-box-project.onrender.com/api/user';
			}
			const response = await axios.post(url, formData);

			if (response.status === 200) {
				const token = response.data.token as string;
				const username = response.data.username as string;
				const picture = response.data.picture as string;
				localStorage.setItem('token', token);

				const user = localStorage.getItem(`user-${username}`);

				if (user) {
					const userData = JSON.parse(user);

					localStorage.setItem(
						`user-${username}`,
						JSON.stringify({
							username: username,
							picture: picture,
							tasks: userData.tasks,
							gallery: userData.gallery,
							location: userData.location,
							weather: userData.weather,
							weatherLastUpdated: userData.weatherLastUpdated,
						}),
					);
					localStorage.setItem('currentUser', username);

					window.location.href = '';
				} else {
					localStorage.setItem(
						`user-${username}`,
						JSON.stringify({
							username: username,
							picture: picture,
							tasks: [],
							gallery: [],
							location: {},
							weather: {},
							weatherLastUpdated: '',
						}),
					);
					localStorage.setItem('currentUser', username);

					window.location.href = '';
				}
			}
		} catch (error: any) {
			console.log(error);
			setFormError(error.response.data);
		}
	};

	useEffect(() => {
		if (formData.username && formData.password) setFormError('');
	}, [formData]);

	return (
		<Box
			onSubmit={(e) => {
				e.preventDefault();
			}}
			component='form'
			noValidate
			autoComplete='off'
			className='grid gap-48 m-10'>
			<div className='grid gap-10'>
				<div className='grid lg:flex justify-evenly w-[75%] m-auto gap-3'>
					<StyledTextField
						text='Username'
						setFormData={setFormData}
						formData={formData}
					/>

					<PasswordTextField
						label='Password'
						name='password'
						setFormData={setFormData}
						formData={formData}
						setShowPassword={setShowPassword}
						showPassword={showPassword}
					/>
				</div>

				{formError ? <p className='text-center text-white'>{formError}</p> : ''}
			</div>

			<div className='grid justify-center gap-2 text-center'>
				<button className='m-auto'>
					<img
						className='h-[60px]'
						src={LoginBtn}
						alt='Login button'
						onClick={(event) => handleSubmit(event)}
					/>
				</button>
			</div>
		</Box>
	);
};

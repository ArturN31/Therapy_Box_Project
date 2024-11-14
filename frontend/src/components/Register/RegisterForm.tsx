import { Box } from '@mui/material';
import { FileDropzone } from './FileDropzone';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RegisterBtn from '../../assets/Register_button.png';
import { StyledTextField } from './StyledTextField';
import { PasswordTextField } from './PasswordTextField';

interface RegisterForm {
	username: string;
	email: string;
	password: string;
	cnfPassword: string;
	picture?: string;
}

export const RegisterForm = () => {
	const [formData, setFormData] = useState<RegisterForm>({
		username: '',
		email: '',
		password: '',
		cnfPassword: '',
		picture: undefined,
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
	const [formError, setFormError] = useState('');

	const validateForm = () => {
		setFormError('');

		//any field not filled in
		if (!formData.username || !formData.email || !formData.password || !formData.cnfPassword) {
			setFormError('Ensure to fill in all fields.');
			return false;
		}

		//not matching passwords
		if (formData.password !== formData.cnfPassword) {
			setFormError('Passwords do not match.');
			return false;
		}

		return true;
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const valid = validateForm();

		if (valid) {
			//fields filled in and passwords match
			let url = '';
			if (import.meta.env.DEV) {
				url = 'http://localhost:3000/api/users';
			} else {
				//update with deployed server url
				//url = '';
			}

			axios
				.post(url, formData)
				.then(() => {
					window.location.href = '';
				})
				.catch((error: any) => {
					if (error.response.data.message) {
						setFormError(error.response.data.message);
					}
					console.log(error);
				});
		}
	};

	useEffect(() => {
		if (formData.password !== formData.cnfPassword) setFormError('Passwords do not match');
		else setFormError('');
	}, [formData]);

	return (
		<Box
			onSubmit={(event) => handleSubmit(event)}
			component='form'
			autoComplete='off'
			noValidate
			className='grid gap-16 m-10'>
			<div className='grid lg:flex justify-evenly w-[75%] m-auto gap-3'>
				{['Username', 'Email'].map((el) => {
					return (
						<StyledTextField
							key={el}
							text={el}
							setFormData={setFormData}
							formData={formData}
						/>
					);
				})}
			</div>

			<div className='grid lg:flex justify-evenly w-[75%] m-auto gap-3'>
				<PasswordTextField
					label='Password'
					name='password'
					setFormData={setFormData}
					formData={formData}
					setShowPassword={setShowPassword}
					showPassword={showPassword}
				/>

				<PasswordTextField
					label='Confirm Password'
					name='cnfPassword'
					setFormData={setFormData}
					formData={formData}
					setShowPassword={setShowPasswordConfirm}
					showPassword={showPasswordConfirm}
				/>
			</div>
			{formError ? <p className='text-center text-white'>{formError}</p> : ''}

			<div className='grid lg:flex justify-evenly w-[75%] m-auto text-center'>
				<FileDropzone setFormData={setFormData} />
			</div>

			<div className='grid justify-center gap-2 text-center'>
				<button className='m-auto'>
					<img
						className='h-[60px]'
						src={RegisterBtn}
						alt='Register button'
					/>
				</button>
			</div>
		</Box>
	);
};

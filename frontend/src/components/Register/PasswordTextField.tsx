import { FilledInput, FormControl, IconButton, InputAdornment, InputLabel } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import React from 'react';

interface RegisterForm {
	username: string;
	email: string;
	password: string;
	cnfPassword: string;
	picture?: string;
}

export const PasswordTextField = ({
	label,
	name,
	setFormData,
	formData,
	setShowPassword,
	showPassword,
}: {
	label: string;
	name: string;
	setFormData: React.Dispatch<React.SetStateAction<RegisterForm>>;
	formData: RegisterForm;
	setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
	showPassword: boolean;
}) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	return (
		<FormControl
			className='w-72'
			sx={{
				'& .MuiFormLabel-root': {
					color: '#fff',
					fontSize: '20px',
				},
				'& .MuiInputBase-root': {
					color: '#fff',
					backgroundColor: 'unset',
					'&:before': {
						borderColor: '#fff',
						backgroundColor: 'unset',
					},
					'&:after': {
						borderColor: '#fff',
					},
				},
			}}
			variant='standard'>
			<InputLabel htmlFor='filled-adornment-password'>{label}</InputLabel>
			<FilledInput
				onChange={(event) => handleChange(event)}
				name={name}
				type={showPassword ? 'text' : 'password'}
				endAdornment={
					<InputAdornment position='end'>
						<IconButton
							aria-label={showPassword ? 'hide the password' : 'display the password'}
							onClick={handleClickShowPassword}
							onMouseDown={handleMouseDownPassword}
							onMouseUp={handleMouseUpPassword}
							edge='end'>
							{showPassword ? <VisibilityOff /> : <Visibility />}
						</IconButton>
					</InputAdornment>
				}
			/>
		</FormControl>
	);
};

import { TextField } from '@mui/material';

interface LoginForm {
	username: string;
	password: string;
}

export const StyledTextField = ({
	text,
	setFormData,
	formData,
}: {
	text: string;
	setFormData: React.Dispatch<React.SetStateAction<LoginForm>>;
	formData: LoginForm;
}) => {
	const style = {
		'& .MuiInput-root': {
			color: '#fff',
			fontFamily: 'Arial',
			fontSize: '20px',
			'&:before': {
				borderColor: '#fff',
			},
			'&:after': {
				borderColor: '#fff',
			},
			'&:hover': {
				borderColor: '#fff',
			},
		},
		// Label
		'& .MuiInputLabel-standard': {
			color: '#fff',
			fontSize: '20px',
			'&:before': {
				color: '#fff',
			},
		},
		'& .MuiFormLabel-root': {
			color: '#fff',
		},
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<TextField
			key={text}
			className='w-72'
			sx={style}
			label={text}
			variant='standard'
			name={text.toLocaleLowerCase()}
			onChange={(event) => handleChange(event)}
		/>
	);
};

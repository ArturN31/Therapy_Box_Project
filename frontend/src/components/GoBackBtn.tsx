import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const GoBackBtn = () => {
	return (
		<IconButton
			size='large'
			aria-label='delete'
			sx={{
				margin: '1rem',
				backgroundColor: '#333',
				'&:hover': {
					backgroundColor: '#333',
					opacity: '70%',
				},
			}}
			onClick={() => {
				window.location.href = '';
			}}>
			<ArrowBackIcon
				fontSize='inherit'
				sx={{ color: '#fff' }}
			/>
		</IconButton>
	);
};

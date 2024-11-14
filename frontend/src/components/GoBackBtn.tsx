import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const GoBackBtn = () => {
	return (
		<IconButton
			size='large'
			aria-label='delete'
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

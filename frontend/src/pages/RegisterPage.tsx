import { RegisterForm } from '../components/Register/RegisterForm';
import { GoBackBtn } from '../components/GoBackBtn';

export const RegisterPage = () => {
	return (
		<div className='h-[100vh]'>
			<GoBackBtn />
			<h1 className='p-10 text-center text-white text-7xl md:text-8xl'>Hackathon</h1>

			<RegisterForm />
		</div>
	);
};

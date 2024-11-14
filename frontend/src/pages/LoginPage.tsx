import { LoginForm } from '../components/Login/LoginForm';

export const LoginPage = ({ setRegister }: { setRegister: React.Dispatch<React.SetStateAction<boolean>> }) => {
	return (
		<div className='h-[100vh]'>
			<h1 className='p-10 text-center text-white text-7xl md:text-8xl'>Hackathon</h1>

			<LoginForm />

			<p className='absolute inset-x-0 text-3xl text-center text-white bottom-10'>
				New to the hackathon?&nbsp;
				<a
					className='text-yellow hover:cursor-pointer hover:opacity-70'
					onClick={() => setRegister(true)}>
					Sign up
				</a>
			</p>
		</div>
	);
};

import { WeatherCardContent } from '../components/Cards/WeatherCardContent';
import { NewsCardContent } from '../components/Cards/NewsCardContent';
import { SportCardContent } from '../components/Cards/SportCardContent';
import { PhotosCardContent } from '../components/Cards/PhotosCardContent';
import { TasksCardContent } from '../components/Cards/TasksCardContent';
import { ClothesCardContent } from '../components/Cards/ClothesCardContent';
import { TasksPage } from './TasksPage';
import { PhotosPage } from './PhotosPage';
import { NewsPage } from './NewsPage';
import { SportsPage } from './SportsPage';
import { useEffect, useRef, useState } from 'react';

export const Homepage = () => {
	const [display, setDisplay] = useState('Homepage');
	const [username, setUsername] = useState('');
	const [picture, setPicture] = useState('');
	const [width, setWidth] = useState(0);
	const imageRef = useRef(null);

	useEffect(() => {
		const currentUser = localStorage.getItem('currentUser');

		if (currentUser) {
			const userData = localStorage.getItem(`user-${currentUser}`);

			if (userData) {
				const user = JSON.parse(userData);
				setUsername(user.username);
				setPicture(user.picture);
			}
		}
	}, []);

	useEffect(() => {
		const image = new Image();
		image.src = picture;

		image.onload = () => {
			setWidth(image.width);
		};
	}, [picture]);

	const handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('currentUser');
		window.location.href = '';
	};

	const Logout = () => {
		return (
			<button
				className='absolute right-0 p-2 mx-3 text-xl underline text-yellow hover:text-white underline-offset-8'
				onClick={() => handleLogout()}>
				Logout
			</button>
		);
	};

	const WelcomeMessage = () => {
		return (
			<div className='grid items-center justify-center gap-5 pt-5 xl:gap-0 xl:justify-normal xl:flex'>
				{picture ? (
					<div className='grid m-auto xl:mx-20'>
						<img
							ref={imageRef}
							src={picture}
							alt={`${username}'s profile picture`}
							className='border border-black rounded-md w-[200px]'
						/>
					</div>
				) : (
					''
				)}
				<p className='w-full text-5xl text-center text-white xl:text-7xl'>Good day {username}</p>
				{picture ? (
					<p
						className='grid justify-start mx-0 xl:mx-20'
						style={{ width: width }}></p>
				) : (
					''
				)}
			</div>
		);
	};

	const Card = ({ title, children, click }: { title: string; children: JSX.Element; click: any }) => {
		let style;

		if (title === 'News' || title === 'Sport' || title === 'Photos' || title === 'Tasks') {
			style = 'hover:cursor-pointer hover:bg-[#E0BF00]';
		}

		return (
			<div className='flex flex-col w-full border-4 rounded-md border-yellow'>
				<p
					className={`p-2 text-xl bg-yellow ${style}`}
					onClick={() => {
						click();
					}}>
					{title}
				</p>
				<div className='bg-[#C4D5EF] h-full grid items-center rounded-b-sm'>{children}</div>
			</div>
		);
	};

	const handleDisplay = (display: string) => {
		setDisplay(display);
	};

	const CardGrid = () => {
		return (
			<div className='grid gap-5 pb-5 mx-5 text-center xl:mx-20'>
				<div className='grid grid-cols-1 gap-5 xl:grid-cols-3'>
					{[
						{ title: 'Weather', children: <WeatherCardContent />, click: () => ({}) },
						{
							title: 'News',
							children: <NewsCardContent />,
							click: () => {
								handleDisplay('News');
							},
						},
						{
							title: 'Sport',
							children: <SportCardContent />,
							click: () => {
								handleDisplay('Sport');
							},
						},
						{
							title: 'Photos',
							children: <PhotosCardContent />,
							click: () => {
								handleDisplay('Photos');
							},
						},
						{
							title: 'Tasks',
							children: <TasksCardContent />,
							click: () => {
								handleDisplay('Tasks');
							},
						},
						{ title: 'Clothes', children: <ClothesCardContent />, click: () => ({}) },
					].map((el) => {
						return (
							<Card
								key={el.title}
								title={el.title}
								children={el.children}
								click={el.click}
							/>
						);
					})}
				</div>
			</div>
		);
	};

	const Output = () => {
		switch (display) {
			case 'Homepage':
				return (
					<div className='min-h-[100vh]'>
						<div className='grid gap-5'>
							<Logout />

							<WelcomeMessage />

							<CardGrid />
						</div>
					</div>
				);
			case 'News':
				return (
					<div className='min-h-[100vh] pb-10'>
						<NewsPage />
					</div>
				);
			case 'Sport':
				return (
					<div className='min-h-[100vh] pb-10'>
						<SportsPage />
					</div>
				);
			case 'Photos':
				return (
					<div className='min-h-[100vh] pb-10'>
						<PhotosPage />
					</div>
				);
			case 'Tasks':
				return (
					<div className='min-h-[100vh] pb-10'>
						<TasksPage />
					</div>
				);
		}
	};

	return <Output />;
};

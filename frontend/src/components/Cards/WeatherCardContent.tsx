import { SetStateAction, useEffect, useState } from 'react';
import SunIcon from '../../assets/Sun_icon.png';
import RainIcon from '../../assets/Rain_icon.png';
import CloudsIcon from '../../assets/Clouds_icon.png';
import axios from 'axios';

interface Weather {
	location: string;
	temperature: number;
	weather: string;
}

export const WeatherCardContent = () => {
	const [coords, setCoords] = useState({ latitude: '', longitude: '' });
	const [error, setError] = useState('');
	const [weather, setWeather] = useState<Weather>({ location: '', temperature: 0, weather: '' });
	const currentUser = localStorage.getItem('currentUser');
	const user = localStorage.getItem(`user-${currentUser}`);

	const handleCoordsStorage = (location: { latitude: any; longitude: any }) => {
		if (user) {
			let userData = JSON.parse(user);
			userData.location = location;
			localStorage.setItem(`user-${currentUser}`, JSON.stringify(userData));
		}
	};

	const locationSuccess = (position: { coords: { latitude: any; longitude: any } }) => {
		const latitude = position.coords.latitude;
		const longitude = position.coords.longitude;
		const location = { latitude: latitude, longitude: longitude };
		setCoords(location);
		handleCoordsStorage(location);
	};

	const locationError = (error: { message: SetStateAction<string> }) => {
		setError(error.message);
	};

	useEffect(() => {
		//get user coords on component load
		if (user) {
			let userData = JSON.parse(user);
			if (!userData.location.longitude) {
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
				} else {
					setError('Geolocation is not supported by this browser.');
				}
			} else {
				setCoords(userData.location);
			}
		}
	}, []);

	const getWeather = async () => {
		if (user) {
			let userData = JSON.parse(user);
			const storedWeather = userData.weather;
			const lastUpdated = userData.weatherLastUpdated;

			if (!storedWeather.location || needsDailyRefresh(lastUpdated)) {
				let url = '';
				if (import.meta.env.DEV) {
					url = 'http://localhost:3000/api/weather';
				} else {
					//update with deployed server url
					url = 'https://therapy-box-project.onrender.com/';
				}

				try {
					const response = await axios.post(url, coords);
					userData.weather = response.data;
					userData.weatherLastUpdated = new Date().toISOString();
					localStorage.setItem(`user-${currentUser}`, JSON.stringify(userData));
					setWeather(response.data);
				} catch (error) {
					console.error('Error fetching weather:', error);
					setError('Error fetching weather.');
				}
			} else {
				setWeather(storedWeather);
			}
		}
	};

	const needsDailyRefresh = (lastUpdated: string | null) => {
		if (!lastUpdated) return true;

		const oneDay = 24 * 60 * 60 * 1000;
		const lastUpdateDate = new Date(lastUpdated).getTime();
		const now = new Date().getTime();

		return now - lastUpdateDate >= oneDay;
	};

	useEffect(() => {
		if (coords && coords.latitude && coords.longitude) {
			getWeather();
		}
	}, [coords]);

	const GetIcon = () => {
		return weather.weather === 'Sun' ? (
			<img
				className='w-10'
				src={SunIcon}
				alt=''
			/>
		) : weather.weather === 'Clouds' ? (
			<img
				className='w-10'
				src={CloudsIcon}
				alt=''
			/>
		) : weather.weather === 'Rain' ? (
			<img
				className='w-10'
				src={RainIcon}
				alt=''
			/>
		) : (
			''
		);
	};

	return coords ? (
		<div className='grid gap-5 p-5'>
			<div className='flex items-center justify-center gap-5'>
				<GetIcon />
				<p className='text-3xl'>{weather.temperature}&deg;C</p>
			</div>
			<p className='text-3xl'>{weather.location}</p>
		</div>
	) : (
		<p>{error}</p>
	);
};

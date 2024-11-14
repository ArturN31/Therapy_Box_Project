import { TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { GoBackBtn } from '../components/GoBackBtn';

export const SportsPage = () => {
	const [input, setInput] = useState('');
	const [footballMatches, setFootballMatches] = useState([]);
	const [wonMatches, setWonMatches] = useState([]);
	const [error, setError] = useState('');

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
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setInput(e.target.value);
	};

	useEffect(() => {
		getFootballMatches();
	}, []);

	const getFootballMatches = async () => {
		try {
			const storedMatches = localStorage.getItem('footballMatches');

			if (!storedMatches) {
				let url = '';
				if (import.meta.env.DEV) {
					url = 'http://localhost:3000/api/sport';
				} else {
					url = 'https://therapy-box-project.onrender.com/api/sport';
				}

				const response = await axios.get(url);
				if (response.status === 200) {
					setFootballMatches(response.data);
					localStorage.setItem('footballMatches', JSON.stringify(response.data));
				} else {
					setError('Failed to fetch football matches data.');
				}
			} else {
				setFootballMatches(JSON.parse(storedMatches));
			}
		} catch (error) {
			setError('Error fetching ');
		}
	};

	useEffect(() => {
		const filteredMatches = footballMatches.filter((match) => {
			return match['HomeTeam'] === input;
		});

		const wonMatchesForInputtedTeam = filteredMatches.filter((match) => {
			if (match['HomeTeam'] === input) {
				return match['FTHG'] > match['FTAG'];
			} else {
				return match['FTAG'] > match['FTHG'];
			}
		});

		setWonMatches(wonMatchesForInputtedTeam);
	}, [input]);

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div>
			<GoBackBtn />
			<div className='grid justify-center gap-3'>
				<TextField
					className='w-72'
					sx={style}
					label='Enter Team Name'
					variant='standard'
					name={input.toLocaleLowerCase()}
					onChange={(event) => handleChange(event)}
				/>

				{wonMatches.length > 0 ? <p className='font-semibold text-center'>Matches won:</p> : ''}

				{wonMatches.map((match) => {
					return (
						<div>
							<div className='text-center border border-black rounded-md bg-[#55555580] flex'>
								<p className='grid basis-[40%]'>
									<span className='text-[#0f0] font-semibold bg-[#333] rounded-tl-md border-b border-black'>
										{match['HomeTeam']}
									</span>
									<span className='text-white'>{match['FTHG']}</span>
								</p>
								<p className='basis-[20%] bg-[#333] grid text-white items-center border-r border-l border-black'>vs</p>
								<p className='grid basis-[40%]'>
									<span className='text-[#f00] font-semibold bg-[#333] rounded-tr-md border-b border-black'>
										{match['AwayTeam']}
									</span>
									<span className='text-white'>{match['FTAG']}</span>
								</p>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

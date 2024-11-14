import axios from 'axios';
import { useEffect, useState } from 'react';

interface MatchData {
	HomeTeamName: string;
	HomeTeamGoals: string;
	AwayTeamName: string;
	AwayTeamGoals: string;
	TeamWon: string;
	ScoreLine: string;
}

export const SportCardContent = () => {
	const [footballMatches, setFootballMatches] = useState([]);
	const [randomMatch, setRandomMatch] = useState();
	const [matchData, setMatchData] = useState<MatchData>();
	const [error, setError] = useState('');

	const getFootballMatches = async () => {
		try {
			const storedMatches = localStorage.getItem('footballMatches');

			let url = '';
			if (import.meta.env.DEV) {
				url = 'http://localhost:3000/api/sport';
			} else {
				url = 'https://therapy-box-project.onrender.com/api/sport';
			}

			if (!storedMatches) {
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

	const getRandomFootballMatch = () => {
		if (footballMatches.length === 0) return null;
		const randomIndex = Math.floor(Math.random() * footballMatches.length);
		const randomMatch = footballMatches[randomIndex];
		setRandomMatch(randomMatch);
	};

	useEffect(() => {
		getFootballMatches();
	}, []);

	useEffect(() => {
		getRandomFootballMatch();
	}, [footballMatches]);

	useEffect(() => {
		if (randomMatch) {
			const homeTeamName = randomMatch['HomeTeam'];
			const homeTeamGoals = randomMatch['FTHG'];

			const awayTeamName = randomMatch['AwayTeam'];
			const awayTeamGoals = randomMatch['FTAG'];

			if (homeTeamName && homeTeamGoals && awayTeamName && awayTeamGoals) {
				let winner;
				let scoreLine;

				//determine match result
				if (homeTeamGoals > awayTeamGoals) {
					winner = homeTeamName;
					scoreLine = `${homeTeamName} ${homeTeamGoals} - ${awayTeamName} ${awayTeamGoals}`;
				} else if (awayTeamGoals > homeTeamGoals) {
					winner = awayTeamName;
					scoreLine = `${awayTeamName} ${awayTeamGoals} - ${homeTeamName} ${homeTeamGoals}`;
				} else {
					winner = 'Draw';
					scoreLine = `${homeTeamName} ${homeTeamGoals} - ${awayTeamName} ${awayTeamGoals}`;
				}

				setMatchData({
					HomeTeamName: homeTeamName,
					HomeTeamGoals: homeTeamGoals,
					AwayTeamName: awayTeamName,
					AwayTeamGoals: awayTeamGoals,
					TeamWon: winner,
					ScoreLine: scoreLine,
				});
			}
		}
	}, [randomMatch]);

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<>
			<div>
				<p className='text-2xl font-semibold'>
					<span>Football match </span>
					<br />
					<span>
						{matchData?.HomeTeamName} vs {matchData?.AwayTeamName}
					</span>
				</p>
			</div>
			<div className='text-center border border-black rounded-md bg-[#aabbcc70] flex place-self-center'>
				<p className='grid basis-[40%] w-[200px]'>
					<span className='px-3 py-1 text-2xl border-b border-black bg-[#333] text-white rounded-tl-[4px]'>
						{matchData?.HomeTeamName}
					</span>
					<span
						className={`px-3 py-1  text-xl rounded-bl-[4px] ${
							matchData?.HomeTeamName === matchData?.TeamWon
								? 'bg-[#0d0]'
								: matchData?.TeamWon !== 'Draw'
								? 'bg-[#f00]'
								: ''
						}`}>
						{matchData?.HomeTeamGoals}
					</span>
				</p>
				<p className='basis-[20%] bg-[#333333] grid items-center text-white border-r border-l border-black'>vs</p>
				<p className='grid basis-[40%]'>
					<span className='px-3 py-1  text-2xl rounded-tr-[4px] border-b border-black bg-[#333] text-white'>
						{matchData?.AwayTeamName}
					</span>
					<span
						className={`px-3 py-1  text-xl rounded-br-[4px] ${
							matchData?.AwayTeamName === matchData?.TeamWon
								? 'bg-[#0d0]'
								: matchData?.TeamWon !== 'Draw'
								? 'bg-[#f00]'
								: ''
						}`}>
						{matchData?.AwayTeamGoals}
					</span>
				</p>
			</div>
		</>
	);
};

import { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

interface Item {
	id: string;
	date: string;
	clothe: string;
}

export const ClothesCardContent = () => {
	const [clothes, setClothes] = useState([]);
	const [error, setError] = useState('');

	const getClothes = async () => {
		const storedClothes = localStorage.getItem('clothes');
		const lastUpdated = localStorage.getItem('clothesLastUpdated');

		if (!storedClothes || needsDailyRefresh(lastUpdated)) {
			let url = '';
			if (import.meta.env.DEV) {
				url = 'http://localhost:3000/api/clothes';
			} else {
				//update with deployed server url
				//url = '';
			}

			try {
				const response = await axios.get(url);

				if (response.status === 200) {
					setClothes(response.data);
					localStorage.setItem('clothes', JSON.stringify(response.data));
					localStorage.setItem('clothesLastUpdated', new Date().toISOString());
				} else {
					setError('Could not retrieve clothes');
				}
			} catch (error) {
				setError('Error fetching clothes');
			}
		} else {
			setClothes(JSON.parse(storedClothes));
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
		getClothes();
	}, []);

	const groupItemsByClothe = (items: Item[]) => {
		const groupedData: Record<string, number> = items.reduce((acc: Record<string, number>, item) => {
			const clotheType = item.clothe;
			acc[clotheType] = (acc[clotheType] || 0) + 1;
			return acc;
		}, {});

		return Object.entries(groupedData).map(([name, value]) => ({
			name: name,
			value,
		}));
	};

	const PieChartWithCustomizedLabel = () => {
		const COLORS = [
			//jumper
			'#8B4513', //dark brown

			//hoodie
			'#008080', //teal

			//jacket
			'#00008B', //dark blue

			//sweater
			'#FFA07A', //light salmon

			//blazer
			'#000000', //black

			//raincoat
			'#1E90FF', //dodger blue
		];

		const RADIAN = Math.PI / 180;
		const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
			const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
			const x = cx + radius * Math.cos(-midAngle * RADIAN);
			const y = cy + radius * Math.sin(-midAngle * RADIAN);

			return (
				<text
					x={x}
					y={y}
					fill='white'
					textAnchor={'middle'}
					dominantBaseline='central'>
					{`${(percent * 100).toFixed(0)}%`}
				</text>
			);
		};

		return (
			<PieChart
				width={300}
				height={300}>
				<Pie
					data={groupItemsByClothe(clothes)}
					cx={150}
					cy={150}
					fill='#8884d8'
					dataKey='value'
					labelLine={false}
					label={renderCustomizedLabel}>
					{groupItemsByClothe(clothes).map((_entry, index) => (
						<Cell
							key={`cell-${index}`}
							fill={COLORS[index % COLORS.length]}
						/>
					))}
				</Pie>
				<Tooltip />
			</PieChart>
		);
	};

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div className='grid items-center m-auto '>
			<PieChartWithCustomizedLabel />
		</div>
	);
};

import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import axios from 'axios';
import { UniqueConstraintError } from 'sequelize';
const parseString = require('xml2js').parseString;
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { Sequelize, Model, DataTypes } = require('sequelize');
const fs = require('fs');
const { parse } = require('csv-parse');

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const jwt_secret = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

//create Sequelize instance
const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: './database.sqlite',
});

//define User model
class User extends Model {}
User.init(
	{
		username: {
			type: DataTypes.STRING,
			unique: true,
		},
		email: DataTypes.STRING,
		password: DataTypes.STRING,
		picture: DataTypes.STRING,
	},
	{ sequelize, modelName: 'user' },
);

//sync models with database
sequelize.sync();

//register
app.post('/api/users', async (req: Request, res: Response) => {
	const { username, email, password, picture }: { username: string; email: string; password: string; picture: string } =
		req.body;

	if (!username || !email || !password) {
		res.status(400).json({ message: 'The payload is missing required fields.' });
		return;
	}

	const salt = await bcrypt.genSalt();
	const hashedPassword = await bcrypt.hash(password, salt);

	try {
		await User.create({ username, email, password: hashedPassword, picture: picture });
		res.status(201).json({ message: 'New account has been created.' });
	} catch (error) {
		if (error instanceof UniqueConstraintError) {
			console.error(error);
			res.status(409).json({ message: 'Username already used.' });
			return;
		}

		console.error(error);
		res.status(500).json('We could not add the user to the database.');
	}
});

//login and provide token
app.post('/api/user', async (req: Request, res: Response) => {
	const { username, password }: { username: string; password: string } = req.body;

	try {
		const user = await User.findOne({ where: { username } });

		if (!user) {
			res.status(401).json('Invalid username or account does not exist.');
			return;
		}

		const usernameMatched = username === user.dataValues.username;
		const passwordMatched = await bcrypt.compare(password, user.dataValues.password);

		if (usernameMatched && !passwordMatched) {
			res.status(401).json('Incorrect password.');
			return;
		}

		const token = jwt.sign({ id: user.dataValues.id, username: user.dataValues.username }, jwt_secret);
		const picture = user.dataValues.picture;
		res.status(200).json({ token: token, username: username, picture: picture });
	} catch (error) {
		console.error(error);
		res.status(500).json('Internal server error.');
	}
});

app.post('/api/weather', async (req: Request, res: Response) => {
	const { latitude, longitude } = req.body;
	const api_key = process.env.OPEN_WEATHER_API_KEY;

	if (latitude && longitude) {
		try {
			const api_url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${api_key}`;
			const response = await axios.get(api_url);
			res.status(200).json({
				location: response.data.name,
				temperature: response.data.main.temp,
				weather: response.data.weather[0].main,
			});
		} catch (error) {
			console.error('Error fetching weather', error);
			res.status(500).send('Error fetching weather');
		}
	} else {
		console.error('Missing users location coordinates');
		res.status(400).send('Missing users location coordinates');
	}
});

app.get('/api/news', async (req: Request, res: Response) => {
	try {
		const response = await axios.get('https://feeds.bbci.co.uk/news/rss.xml');

		parseString(response.data, (err: any, result: any) => {
			if (err) {
				console.error('Error parsing XML:', err);
				return res.status(500).send('Error fetching news feed');
			}

			const newsData = result.rss.channel[0].item;
			res.status(200).json(newsData);
		});
	} catch (error) {
		console.error('Error fetching news feed:', error);
		res.status(500).send('Error fetching news feed');
	}
});

interface DynamicObject {
	[key: string]: any;
}

app.get('/api/sport', async (req: Request, res: Response) => {
	try {
		const readCSV: { [key: string]: string | number }[] = [];

		await fs
			.createReadStream('./assets/sport.csv')
			.pipe(parse({ delimiter: ',', from_line: 1 }))
			.on('data', function (row: any) {
				readCSV.push(row);
			})
			.on('end', function () {
				const headers = readCSV[0] as unknown as string[];
				const fields = readCSV.splice(1, readCSV.length) as unknown as string[][];

				//Output sample:
				// [
				// 	{ Div: 'I1', Date: '19/08/17', HomeTeam: 'Juventus', AwayTeam: 'Cagliari', FTHG: '3' },
				// 	{ Div: 'E0', Date: '20/08/17', HomeTeam: 'Manchester United', AwayTeam: 'Arsenal', FTHG: '1' },
				// ];
				const result = fields.map((row) => {
					const obj: DynamicObject = {};
					headers.forEach((header, index) => {
						obj[header] = row[index];
					});
					return obj;
				});

				res.status(200).json(result);
			})
			.on('error', function (error: any) {
				console.error('Error parsing CSV:', error);
				res.status(500).send('Error parsing CSV');
			});
	} catch (error) {
		console.error('Error reading the csv file', error);
		res.status(500).send('Error reading the csv file');
	}
});

app.get('/api/clothes', async (req: Request, res: Response) => {
	try {
		const response = await axios.get('https://tboxapps.therapy-box.co.uk/hackathon/clothing-api.php?username=swapnil');
		const clothes = response.data.payload;
		res.status(200).json(clothes);
	} catch (error) {
		console.error('Error fetching clothes', error);
		res.status(500).send('Error fetching clothes');
	}
});

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});

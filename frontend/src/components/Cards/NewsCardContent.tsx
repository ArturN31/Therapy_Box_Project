import { useEffect, useState } from 'react';
import axios from 'axios';

export const NewsCardContent = () => {
	const [news, setNews] = useState([]);
	const [article, setArticle] = useState();
	const [image, setImage] = useState('');
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [error, setError] = useState('');

	const getNews = async () => {
		try {
			const storedNews = localStorage.getItem('news');

			let url = '';
			if (import.meta.env.DEV) {
				url = 'http://localhost:3000/api/news';
			} else {
				url = 'https://therapy-box-project.onrender.com/api/news';
			}

			if (!storedNews) {
				const response = await axios.get(url);
				if (response.status === 200) {
					setNews(response.data);
					localStorage.setItem('news', JSON.stringify(response.data));
				} else {
					setError('Failed to fetch news articles');
				}
			} else {
				setNews(JSON.parse(storedNews));
			}
		} catch (error) {
			setError('Error fetching news articles');
		}
	};

	const getRandomArticle = () => {
		if (news.length === 0) return null;
		const randomIndex = Math.floor(Math.random() * news.length);
		const randomArticle = news[randomIndex];
		setArticle(randomArticle);
	};

	useEffect(() => {
		getNews();
	}, []);

	useEffect(() => {
		getRandomArticle();
	}, [news]);

	useEffect(() => {
		if (article) {
			const articleImage = article['media:thumbnail'][0]['$']['url'];
			const articleTitle = article['title'][0];
			const articleDescription = article['description'];

			setImage(articleImage);
			setTitle(articleTitle);
			setDescription(articleDescription);
		}
	}, [article]);

	useEffect(() => {
		if (title !== '' && image !== '' && description !== '') {
			localStorage.setItem('currentArticle', JSON.stringify({ image: image, title: title, description: description }));
		}
	}, [title, image, description]);

	if (error) {
		return <div>Error: {error}</div>;
	}

	return article ? (
		<div className='p-5'>
			<p className='text-2xl font-semibold'>{title}</p>
			<p>{description}</p>
		</div>
	) : (
		''
	);
};

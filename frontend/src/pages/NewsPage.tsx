import { useEffect, useState } from 'react';
import { GoBackBtn } from '../components/GoBackBtn';

interface Article {
	image: string;
	title: string;
	description: string;
}
export const NewsPage = () => {
	const [article, setArticle] = useState<Article>();

	useEffect(() => {
		const articleStringified = localStorage.getItem('currentArticle');
		if (articleStringified) {
			const articleParsed = JSON.parse(articleStringified);
			setArticle(articleParsed);
		}
	}, []);

	return article ? (
		<>
			<GoBackBtn />
			<div className='grid gap-5 p-5'>
				<div className='grid grid-cols-1 text-center md:grid-cols-12'>
					<p className='col-span-2 p-4 text-6xl text-white md:p-0'>News</p>
					<img
						className='col-span-8 m-auto w-[400px] border-4 border-yellow rounded-md'
						src={article.image}
						alt='Article image'
					/>
					<p className='col-span-2'></p>
				</div>
				<div className='w-full md:w-[75%] text-center m-auto text-white'>
					<p className='pb-5 text-2xl font-semibold'>{article.title}</p>
					<p>{article.description}</p>
				</div>
			</div>
		</>
	) : (
		''
	);
};

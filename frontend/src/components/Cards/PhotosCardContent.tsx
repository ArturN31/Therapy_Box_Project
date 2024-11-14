import { IconButton } from '@mui/material';
import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';

export const PhotosCardContent = () => {
	const [gallery, setGallery] = useState<Array<{ id: string; src: string }>>(() => {
		const currentUser = localStorage.getItem('currentUser');
		if (currentUser) {
			const user = localStorage.getItem(`user-${currentUser}`);
			if (user) {
				const userData = JSON.parse(user);
				const savedGallery = userData.gallery;
				return savedGallery ? savedGallery : [];
			}
		}
	});

	const handleGalleryStorage = (newGallery: { id: string; src: string }[]) => {
		const currentUser = localStorage.getItem('currentUser');
		if (currentUser) {
			const user = localStorage.getItem(`user-${currentUser}`);
			if (user) {
				let userData = JSON.parse(user);
				userData.gallery = newGallery;
				localStorage.setItem(`user-${currentUser}`, JSON.stringify(userData));
			}
		}
	};

	const handleImageRemoval = (id: string, index: number) => {
		let cnf = confirm(`Are you sure you want to remove this image?\n${index + 1}`);
		if (cnf) {
			const newGallery = gallery.filter((img) => img.id !== id);
			setGallery(newGallery);
			handleGalleryStorage(newGallery);
		}
	};

	const Gallery = () => {
		return gallery.length > 0 ? (
			<div className='grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-2'>
				{gallery?.slice(0, 4).map((image, index) => (
					<div
						key={image.id}
						className='relative border border-yellow bg-[#333] m-auto'>
						<p className='absolute top-[8px] left-[8px] w-6 h-6 text-center rounded-full bg-white opacity-80'>
							{index + 1}
						</p>
						<img
							key={image.id}
							className='w-[75%] m-auto'
							src={image.src}
							alt={`User uploaded image ${index}`}
						/>
						<IconButton
							sx={{
								position: 'absolute',
								top: '8px',
								right: '8px',
								backgroundColor: 'rgba(255, 255, 255, 0.8)',
								'&:hover': {
									backgroundColor: 'rgba(255, 255, 255, 1)',
								},
							}}
							size='large'
							aria-label='delete'
							onClick={() => handleImageRemoval(image.id, index)}>
							<DeleteIcon fontSize='inherit' />
						</IconButton>
					</div>
				))}
			</div>
		) : (
			<p>There are no images stored.</p>
		);
	};

	return <Gallery />;
};

import { useEffect, useState } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';
import PlusBtn from '../assets/Plus_button.png';
import { Image } from 'image-js';
import { GoBackBtn } from '../components/GoBackBtn';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export const PhotosPage = () => {
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
	const { acceptedFiles, getRootProps, getInputProps } = useDropzone({ maxFiles: 1 });

	const processImage = (img: FileWithPath) => {
		const reader = new FileReader();
		reader.readAsArrayBuffer(img);
		reader.onload = async () => {
			const imageData = new Uint8Array(reader.result as ArrayBuffer);
			const image = await Image.load(imageData);
			const resizedImage = image.resize({ width: 280, height: 280 });
			const dataUrl = await resizedImage.toDataURL();
			const newImage = { id: Date.now().toString(), src: dataUrl };
			const newGallery = [...gallery, newImage];
			setGallery(newGallery);
			handleGalleryStorage(newGallery);
		};
	};

	useEffect(() => {
		if (acceptedFiles.length > 0 && acceptedFiles[0].type.includes('image')) {
			processImage(acceptedFiles[0]);
		}
	}, [acceptedFiles]);

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
		return gallery?.map((image, index) => (
			<div
				key={image.id}
				style={{ boxShadow: '0px 2px 6px -2px #000' }}
				className='relative border-4 rounded-md border-yellow'>
				<p className='absolute top-[8px] left-[8px] w-6 h-6 text-center rounded-full bg-white opacity-80'>
					{index + 1}
				</p>
				<img
					key={image.id}
					style={{ flexBasis: '30%' }}
					className='rounded-sm'
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
		));
	};

	return (
		<div>
			<GoBackBtn />

			<h1 className='p-10 text-center text-white text-8xl'>Photos</h1>

			<div className='flex flex-wrap items-center justify-center m-auto gap-12 max-w-[1000px]'>
				{/* Dropzone */}
				<section
					className='grid items-center border-4 border-yellow rounded-md bg-white w-[288px] h-[288px]'
					style={{ boxShadow: '0px 2px 6px -2px #000' }}>
					<div {...getRootProps({ className: 'dropzone relative w-full' })}>
						<input {...getInputProps()} />
						<img
							className='w-[50%] m-auto rounded-sm'
							src={PlusBtn}
							alt='Add task'
						/>
					</div>
					<p className='p-2 text-center'>
						Let's keep things simple!
						<br /> Please upload one image at a time.
					</p>
				</section>

				<Gallery />
			</div>
		</div>
	);
};

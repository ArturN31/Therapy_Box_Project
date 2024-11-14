import { FileWithPath, useDropzone } from 'react-dropzone';
import AddPictureBG from '../../assets/Add_picture.png';
import { useEffect, useState } from 'react';
import { Image } from 'image-js';

interface RegisterForm {
	username: string;
	email: string;
	password: string;
	cnfPassword: string;
	picture?: string;
}

export const FileDropzone = ({ setFormData }: { setFormData: React.Dispatch<React.SetStateAction<RegisterForm>> }) => {
	const { acceptedFiles, getRootProps, getInputProps } = useDropzone({ maxFiles: 1 });
	const [image, setImage] = useState('');
	const [dropzoneError, setDropzoneError] = useState('');

	const processImage = (img: FileWithPath) => {
		const reader = new FileReader();
		reader.readAsArrayBuffer(img);
		reader.onload = async () => {
			const imageData = new Uint8Array(reader.result as ArrayBuffer);
			const image = await Image.load(imageData);
			const resizedImage = image.resize({ width: 280, height: 280 });
			const dataUrl = await resizedImage.toDataURL();

			setFormData((prevFormData) => ({
				...prevFormData,
				picture: dataUrl,
			}));
		};
	};

	useEffect(() => {
		if (acceptedFiles.length > 0 && acceptedFiles[0].type.includes('image')) {
			setDropzoneError('');
			processImage(acceptedFiles[0]);
			setImage(URL.createObjectURL(acceptedFiles[0]));
		} else {
			setDropzoneError('You can only upload images.');
		}
	}, [acceptedFiles, setFormData]);

	return (
		<section className='container w-fit'>
			<div {...getRootProps({ className: 'dropzone relative hover:cursor-pointer hover:opacity-70' })}>
				<input {...getInputProps()} />
				{image ? (
					<img
						className='m-auto max-w-[400px] max-h-[200px] border border-black'
						src={image}
						alt='Image added by a user'
					/>
				) : (
					<img
						className='m-auto max-w-[500px]'
						src={AddPictureBG}
						width={400}
						height={200}
						alt='File dropzone'
					/>
				)}

				<div className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-white text-xl'>
					<p>Add picture</p>
				</div>
			</div>
			{dropzoneError ? <p className='p-2 text-white'>{dropzoneError}</p> : ''}
		</section>
	);
};

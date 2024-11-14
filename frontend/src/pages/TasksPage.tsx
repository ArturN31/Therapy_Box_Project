import { Box, Checkbox, IconButton, TextField } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import PlusBtn from '../assets/Plus_button_small.png';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { GoBackBtn } from '../components/GoBackBtn';

interface Task {
	value: string;
	completed: boolean;
	[index: string]: string | boolean;
}

export const TasksPage = () => {
	const [tasks, setTasks] = useState<Task[]>();

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

	useEffect(() => {
		const currentUser = localStorage.getItem('currentUser');

		if (currentUser) {
			const userData = localStorage.getItem(`user-${currentUser}`);

			if (userData) {
				const user = JSON.parse(userData);
				setTasks(user.tasks);
			}
		}
	}, []);

	const handleTaskStorage = async (updatedTasks: Task[]) => {
		const currentUser = localStorage.getItem('currentUser');
		if (currentUser) {
			const user = localStorage.getItem(`user-${currentUser}`);
			if (user) {
				let userData = JSON.parse(user);
				userData.tasks = updatedTasks;
				localStorage.setItem(`user-${currentUser}`, JSON.stringify(userData));
			}
		}
	};

	const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
		if (tasks) {
			const updatedTasks = [...tasks];
			updatedTasks[index].value = event.target.value;
			setTasks(updatedTasks);
			handleTaskStorage(updatedTasks);
		}
	};

	const addTextField = () => {
		setTasks((prevTasks) => {
			const newTasks = [...(prevTasks || []), { value: '', completed: false }];
			handleTaskStorage(newTasks);
			return newTasks;
		});
	};

	const removeTextField = (index: number) => {
		const cnf = confirm(`Are you sure you want to remove the task?\n${index + 1}. ${tasks?.[index]?.value}`);
		if (cnf) {
			const updatedTasks = [...(tasks || [])];
			updatedTasks.splice(index, 1);
			setTasks(updatedTasks);
			handleTaskStorage(updatedTasks);
		}
	};

	const markCompleted = (index: number) => {
		const updatedTasks = [...(tasks || [])];
		updatedTasks[index].completed = !updatedTasks[index].completed;
		setTasks(updatedTasks);
		handleTaskStorage(updatedTasks);
	};

	return (
		<div>
			<GoBackBtn />

			<h1 className='p-10 text-white text-8xl'>Tasks</h1>

			<Box
				onSubmit={(e) => {
					e.preventDefault();
				}}
				component='form'
				noValidate
				autoComplete='off'
				className='grid justify-center'>
				{tasks?.map((task, index) => (
					<div key={index}>
						<TextField
							key={index}
							className='w-[50vw] 2xl:w-[30vw]'
							sx={style}
							value={task.value}
							variant='standard'
							name={`task-${index}`}
							onChange={(event) => handleChange(event, index)}
						/>
						<Checkbox
							size='large'
							color='success'
							aria-label='completed'
							checked={task.completed}
							icon={<CheckBoxOutlineBlankIcon />}
							checkedIcon={<CheckBoxIcon />}
							onChange={() => markCompleted(index)}
						/>
						<IconButton
							size='large'
							aria-label='delete'
							onClick={() => {
								removeTextField(index);
							}}>
							<DeleteIcon fontSize='inherit' />
						</IconButton>
					</div>
				))}
				<button
					onClick={() => {
						addTextField();
					}}>
					<img
						className='w-10'
						src={PlusBtn}
						alt='Add task'
					/>
				</button>
			</Box>
		</div>
	);
};

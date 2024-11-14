import { Checkbox, IconButton, TextField } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

interface Task {
	value: string;
	completed: boolean;
	[index: string]: string | boolean;
}

export const TasksCardContent = () => {
	const [tasks, setTasks] = useState<Task[]>();

	const style = {
		'& .MuiInput-root': {
			color: '#000',
			fontFamily: 'Arial',
			fontSize: '20px',
			width: '100%',
			'&:before': {
				borderColor: '#000',
			},
			'&:after': {
				borderColor: '#000',
			},
			'&:hover': {
				borderColor: '#000',
			},
		},
		// Label
		'& .MuiInputLabel-standard': {
			color: '#fff',
			fontSize: '20px',
			'&:before': {
				color: '#000',
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

	return tasks && tasks.length > 0 ? (
		tasks?.slice(0, 3).map((task, index) => (
			<div
				className='flex p-5'
				key={index}>
				<TextField
					key={index}
					sx={style}
					className='w-full'
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
		))
	) : (
		<p>There are no tasks stored.</p>
	);
};

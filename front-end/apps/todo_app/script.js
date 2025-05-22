const taskInput = document.getElementById('new-task');
const addButton = document.getElementById('add-button');
const todoList = document.getElementById('todo-list');
const notice = document.getElementById('notice');

const API_URL = 'http://127.0.0.1:5000/todos'

async function fetchTodos(){
	try{
		const response = await fetch(API_URL);
		const todos = await response.json();
		renderTodos(todos);
		notice.innerText = '';
	} catch (error){
		console.error('Error fetching todos:', error);
		notice.innerText = 'Error connecting to server';
	}
}

function renderTodos(todos){
	todoList.innerHTML = '';
	todos.forEach(todo => {
		const listItem = document.createElement('li');
		listItem.innerHTML = `<span class="task-text ${todo.completed ? 'completed' : ''}" data-todo-id="${todo.id}">${todo.task}</span>
		<div class="actions">
			<button class="complete-button">${todo.completed ? 'Undo' : 'Complete'}</button>
			<button class="delete-button">Delete</button>
		</div>
		`;
		const completeButton = listItem.querySelector('.complete-button');
		const deleteButton = listItem.querySelector('.delete-button');
		const taskTextSpan = listItem.querySelector('.task-text');

		completeButton.addEventListener('click', () =>toggleComplete(todo.id, !todo.completed));
		deleteButton.addEventListener('click', () => deleteTodo(todo.id));
		taskTextSpan.addEventListener('click', () => editTodo(todo));

		todoList.appendChild(listItem);
	});
}

async function addTodo(){
	const task = taskInput.value.trim();
	if (task){
		try{
			const response = await fetch (API_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({task}),
			});
			const newTodo = await response.json();
			fetchTodos();
			taskInput.value = '';
		} catch (error) {
			console.error('Error adding todo:', error);
			notice.innerText = 'Error connecting to server';
		}
	}
}

async function toggleComplete(todoId, completed){
	try{
		await fetch (`${API_URL}/${todoId}`, {
			method: 'PUT',
			headers: {
				'Content-Type' : 'application/json',
			},
			body: JSON.stringify({completed}),
		});
	} catch (error) {
		console.error('Error updating todo:', error);
		notice.innerText = 'Error connecting to server';
	}
	fetchTodos();
}

async function deleteTodo(todoId) {
	try {
		await fetch(`${API_URL}/${todoId}`, {
			method: 'DELETE',
		});
		fetchTodos();
	} catch (error) {
		console.error('Error deleting todo:', error);
		notice.innerText = 'Error connecting to server';
	}
}

function editTodo(todo) {
	const taskSpan = document.querySelector(`.task-text[data-todo-id="${todo.id}"]`);
	const currentText = taskSpan.textContent;
	const inputField = document.createElement('input');
	inputField.type = 'text';
	inputField.value = currentText;
	taskSpan.relaceWith(inputField);
	inputField.focus();

	inputField.addEventListener('blur', async () => {
		const newText = inputField.value.trim();
		if (newText && newText !== currentText) {
			try {
				await fetch(`${API_URL}/${todo.id}`, {
					method: 'PUT',
					headers: {
						'Content-Type' : 'application/json',
					},
					body: JSON.stringify({task: newText}),
				});
				fetchTodos();
			} catch (error) {
				console.error('Error updating todo:', error);
				notice.innerText = 'Error connecting to server';
			}
		}
		else {
			taskSpan.textContent = currentText;
			inputField.replaceWith(taskSpan);
			}
		});

	inputField.addEventListener('keypress', async (event) => {
		if (event.key === 'Enter') {
			inputField.blur();
			}
		});
	}

addButton.addEventListener('click', addTodo);
taskInput.addEventListener('keypress', function(event) {
	if (event.key === 'Enter') {
		addTodo();
	}
});

fetchTodos();
		


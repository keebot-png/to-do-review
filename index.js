const addLocal = (listToStore) => {
    localStorage.setItem('taskList', JSON.stringify(listToStore));
  };
  
  const loadLocal = () => {
    const listToLoad = JSON.parse(localStorage.getItem('taskList'));
    if (listToLoad === null) {
      return [];
    }
    return listToLoad;
  };
  
  export { addLocal, loadLocal };

  class TaskNames {
    constructor(index, description, completed = false) {
      this.index = index;
      this.description = description;
      this.completed = completed;
    }
  }
  
  export default TaskNames;

  import TaskNames from './taskNames.js';

export default class ToDoList {
  constructor() {
    this.list = [];
  }

    addNewTask = (index = null, description = null, completed = null) => {
      if (description) {
        const newTaskIndex = index || this.list.length + 1;
        const newTaskIsCompleted = completed || false;
        const newTask = new TaskNames(newTaskIndex, description, newTaskIsCompleted);
        this.list.push(newTask);
        return newTask;
      }
      return null;
    }

    updateTask = (index, completed) => {
      this.list[index - 1].completed = completed;
    }

    updatedTaskDescription = (index, description) => {
      this.list[index - 1].description = description;
    }

    removeTask = (todo) => {
      this.list = this.list.filter((item) => item !== todo);
      this.list.forEach((task, indexOfTask) => {
        task.index = indexOfTask + 1;
      });
    }

    deleteCompleteItems = () => {
      this.list = this.list.filter((item) => item.completed !== true);
      this.list.forEach((task, indexOfTask) => {
        task.index = indexOfTask + 1;
      });
    }
}

import { addLocal } from './store.js';

const toDoAppend = document.querySelector('.list');
const parser = new DOMParser();

const addToDo = (todo, todoList) => {
  const string = `
    <li class="border-bottom">
      <div class="list-item">
        <input type="checkbox" ${todo.completed ? 'checked' : ''} id=${todo.index}>
        <div class="todo-li">
          ${todo.description}
        </div>
        <div>
          <input type="text" class="edit-todo hidden" value=${todo.description}>
        </div>
      </div>
      <i class="fa-solid fa-ellipsis menu"></i>
      <ul class="task-menu hidden">
          <li>
            <i class="fa-solid fa-pen edit"></i>
          </li>
          <li>
            <i class="fa-solid fa-trash delete"></i>
          </li>
          <li>
            <i class="fa-solid fa-xmark close"></i>
          </li>
        </ul>
    </li>
  `;

  const todoElement = parser.parseFromString(string, 'text/html').body.firstChild;

  /* function to display menu */

  const taskMenuBtn = todoElement.querySelector('.menu');
  const taskMenu = todoElement.querySelector('.task-menu');
  taskMenuBtn.addEventListener('click', (e) => {
    e.preventDefault();
    taskMenu.classList.remove('hidden');
  });

  /* function to close menu */

  const closeButton = todoElement.querySelector('.close');
  closeButton.addEventListener('click', (e) => {
    e.preventDefault();
    taskMenu.classList.add('hidden');
  });

  /* function to delete task */
  const deleteButton = todoElement.querySelector('.delete');
  deleteButton.addEventListener('click', (e) => {
    e.preventDefault();
    todoList.removeTask(todo);
    todoElement.remove();
    addLocal(todoList.list);
  });

  /* functiom to edit task */
  const toDoEl = todoElement.querySelector('.todo-li');
  const editToDo = todoElement.querySelector('.edit-todo');
  const editBtn = todoElement.querySelector('.edit');
  editBtn.addEventListener('click', (e) => {
    e.preventDefault();
    toDoEl.classList.add('hidden');
    editToDo.classList.remove('hidden');
    taskMenu.classList.add('hidden');
    editToDo.focus();
  });

  editToDo.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      todoList.updatedTaskDescription(todo.index, editToDo.value);
      toDoEl.innerHTML = editToDo.value;
      toDoEl.classList.remove('hidden');
      editToDo.classList.add('hidden');
      addLocal(todoList.list);
    }
  });

  const todoCompleted = todoElement.querySelector('input[type="checkbox"]');
  if (todo.completed) {
    todoElement.style.textDecoration = 'line-through';
    todoElement.style.color = '#545862a3';
  } else {
    todoElement.style.textDecoration = 'none';
    todoElement.style.color = 'inherit';
  }

  todoCompleted.addEventListener('change', (e) => {
    if (e.target.checked) {
      todoList.updateTask(todo.index, true);
      todoElement.style.textDecoration = 'line-through';
      todoElement.style.color = '#545862a3';
    } else {
      todoList.updateTask(todo.index, false);
      todoElement.style.textDecoration = 'none';
      todoElement.style.color = 'inherit';
    }

    addLocal(todoList.list);
  });
  toDoAppend.append(todoElement);
};

export { addToDo, toDoAppend };

/* eslint-disable */
import _ from 'lodash';
import './style.css';
import ToDoList from './modules/todo.js';
import { addToDo, toDoAppend } from './modules/userInter.js';
import { addLocal, loadLocal } from './modules/store.js';

const submitButton = document.querySelector('.submit-btn');
const addingInput = document.querySelector('.add-todo');
const clearButton = document.querySelector('.clear-btn');

const toDoList = new ToDoList();
const dataFromLocalStorage = loadLocal();

dataFromLocalStorage.forEach((toDoObject) => {
  const pushedLocalTask = toDoList.addNewTask(
    toDoObject.index, toDoObject.description, toDoObject.isCompleted,
  );
  addToDo(pushedLocalTask, toDoList);
});

submitButton.addEventListener('click', (e) => {
  e.preventDefault();
  const inputValue = addingInput.value;
  const pushedTask = toDoList.addNewTask(null, inputValue, false);
  addingInput.value = '';
  addToDo(pushedTask, toDoList);
  addLocal(toDoList.list);
});

clearButton.addEventListener('click', (e) => {
  e.preventDefault();
  toDoList.deleteCompleteItems();
  toDoAppend.innerHTML = '';
  toDoList.list.forEach((task) => {
    addToDo(task, toDoList);
  });
  addLocal(toDoList.list);
});

// script.js
const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function renderTasks() {
    taskList.innerHTML = "";
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === "all") return true;
        if (currentFilter === "completed") return task.completed;
        if (currentFilter === "pending") return !task.completed;
    });

    filteredTasks.forEach((task, index) => {
        const taskItem = document.createElement("li");
        taskItem.classList.add("task-item");
        if (task.completed) taskItem.classList.add("completed");

        taskItem.innerHTML = `
            <div>
                <strong>${task.title}</strong>
                <p>${task.description}</p>
            </div>
            <div class="task-actions">
                <button class="complete-btn">${task.completed ? "Undo" : "Complete"}</button>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        taskItem.querySelector(".complete-btn").addEventListener("click", () => toggleComplete(index));
        taskItem.querySelector(".edit-btn").addEventListener("click", () => editTask(index));
        taskItem.querySelector(".delete-btn").addEventListener("click", () => deleteTask(index));

        taskList.appendChild(taskItem);
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();

    if (title) {
        tasks.push({ title, description, completed: false });
        taskTitle.value = "";
        taskDescription.value = "";
        renderTasks();
    }
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
}

function editTask(index) {
    const newTitle = prompt("Edit Task Title", tasks[index].title);
    const newDescription = prompt("Edit Task Description", tasks[index].description);

    if (newTitle !== null) tasks[index].title = newTitle;
    if (newDescription !== null) tasks[index].description = newDescription;

    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

function filterTasks(filter) {
    currentFilter = filter;
    filterButtons.forEach(btn => btn.classList.remove("active"));
    document.querySelector(`[data-filter="${filter}"]`).classList.add("active");
    renderTasks();
}

addTaskBtn.addEventListener("click", addTask);
filterButtons.forEach(btn =>
    btn.addEventListener("click", () => filterTasks(btn.dataset.filter))
);

// Initial render
renderTasks();



let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Select DOM elements
const taskInput = document.getElementById("task");
const categorySelect = document.querySelectorAll("select")[0];
const deadlineInput = document.querySelector('input[type="date"]');
const statusSelect = document.querySelectorAll("select")[1];
const addTaskButton = document.querySelector("button");

const filterStatusSelect = document.querySelectorAll("select")[2];
const filterCategorySelect = document.querySelectorAll("select")[3];
const taskList = document.getElementById("task-list");

// ===== Functions =====

// Save tasks to local storage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add a task
function addTask() {
  const taskName = taskInput.value.trim();
  const category = categorySelect.value;
  const deadline = deadlineInput.value;
  const status = statusSelect.value;

  if (!taskName || category === "Categories" || !deadline || status === "Status") {
    alert("Please fill out all fields.");
    return;
  }

  const newTask = {
    id: Date.now(),
    name: taskName,
    category,
    deadline,
    status,
  };

  tasks.push(newTask);
  saveTasks();
  displayTasks();

  // how to clear input fields
  taskInput.value = "";
  categorySelect.selectedIndex = 0;
  deadlineInput.value = "";
  statusSelect.selectedIndex = 0;
}

// Update task status
function updateTaskStatus(id, newStatus) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.status = newStatus;
    saveTasks();
    displayTasks();
  }
}

// Check overdue tasks
function isOverdue(deadline) {
  const today = new Date().toISOString().split("T")[0];
  return deadline < today;
}

// Filter tasks
function filterTasks() {
  const filterStatus = filterStatusSelect.value;
  const filterCategory = filterCategorySelect.value;

  let filtered = tasks;

  if (filterStatus !== "Filter by Status") {
    filtered = filtered.filter(task => task.status === filterStatus);
  }

  if (filterCategory !== "Filter by Categories") {
    filtered = filtered.filter(task => task.category === filterCategory);
  }

  displayTasks(filtered);
}

// Display tasks in the list
function displayTasks(filteredTasks = tasks) {
  taskList.innerHTML = "";

  if (filteredTasks.length === 0) {
    taskList.innerHTML = "<li>No tasks found.</li>";
    return;
  }

  filteredTasks.forEach(task => {
    const li = document.createElement("li");

    li.innerHTML = `
      <strong>${task.name}</strong> 
      [${task.category}] - 
      Due: ${task.deadline} - 
      Status: 
      <select>
        <option value="pending" ${task.status === "pending" ? "selected" : ""}>Pending</option>
        <option value="inprogress" ${task.status === "inprogress" ? "selected" : ""}>In Progress</option>
        <option value="completed" ${task.status === "completed" ? "selected" : ""}>Completed</option>
      </select>
      ${isOverdue(task.deadline) && task.status !== "completed" ? "<span style='color:red'> (Overdue)</span>" : ""}
    `;

    // Attach event listener for status update
    const statusDropdown = li.querySelector("select");
    statusDropdown.addEventListener("change", (e) => {
      updateTaskStatus(task.id, e.target.value);
    });

    taskList.appendChild(li);
  });
}

// ===== addEventListener =====
addTaskButton.addEventListener("click", addTask);
filterStatusSelect.addEventListener("change", filterTasks);
filterCategorySelect.addEventListener("change", filterTasks);

// ===== Intl Display =====
displayTasks();


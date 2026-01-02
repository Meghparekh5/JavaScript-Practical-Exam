let tasks = JSON.parse(localStorage.getItem("tasks")) || []
let editId = null

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks))
}

function addTask() {
    const title = document.getElementById("title").value
    const category = document.getElementById("category").value
    const dueDate = document.getElementById("dueDate").value

    if (title === "" || dueDate === "") {
        alert("Please enter task name and date")
        return
    }

    if (editId) {
        tasks = tasks.map(t => {
            if (t.id === editId) {
                return {
                    id: editId,
                    title,
                    category,
                    dueDate,
                    status: t.status
                }
            }
            return t
        })
        editId = null
        document.querySelector(".form-box button").innerText = "Add Task"
    } else {
        tasks.push({
            id: Date.now(),
            title,
            category,
            dueDate,
            status: "pending"
        })
    }

    saveTasks()
    clearForm()
    renderTasks()
}

function clearForm() {
    document.getElementById("title").value = ""
    document.getElementById("category").value = ""
    document.getElementById("dueDate").value = ""
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id)
    saveTasks()
    renderTasks()
}

function toggleComplete(id) {
    tasks = tasks.map(t => {
        if (t.id === id) {
            t.status = t.status === "pending" ? "completed" : "pending"
        }
        return t
    })
    saveTasks()
    renderTasks()
}

function editTask(id) {
    const task = tasks.find(t => t.id === id)
    document.getElementById("title").value = task.title
    document.getElementById("category").value = task.category
    document.getElementById("dueDate").value = task.dueDate
    editId = id
    document.querySelector(".form-box button").innerText = "Update Task"
}

function renderTasks() {
    const list = document.getElementById("taskList")
    list.innerHTML = ""

    const search = document.getElementById("search").value.toLowerCase()
    const filter = document.getElementById("filter").value

    const today = new Date().toISOString().split("T")[0]

    tasks.filter(t => {
        if (filter === "completed" && t.status !== "completed") return false
        if (filter === "pending" && t.status !== "pending") return false
        if (filter === "overdue" && !(t.status === "pending" && t.dueDate < today)) return false
        return t.title.toLowerCase().includes(search) || t.category.toLowerCase().includes(search)
    }).forEach(t => {
        const card = document.createElement("div")
        card.className = "task-card"
        if (t.status === "completed") card.classList.add("completed")
        if (t.status === "pending" && t.dueDate < today) card.classList.add("overdue")

        card.innerHTML = `
            <div>
                <strong>${t.title}</strong>
                <small>Category: ${t.category}</small>
                <small>Due: ${t.dueDate}</small>
            </div>
            <div class="buttons">
                <button class="complete-btn" onclick="toggleComplete(${t.id})">Completed</button>
                <button class="complete-btn" onclick="editTask(${t.id})">Edit</button>
                <button class="delete-btn" onclick="deleteTask(${t.id})">Delete</button>
            </div>
        `
        list.appendChild(card)
    })

    updateDashboard()
}

function updateDashboard() {
    const total = tasks.length
    const completed = tasks.filter(t => t.status === "completed").length
    const pending = tasks.filter(t => t.status === "pending").length
    const overdue = tasks.filter(t => t.status === "pending" && t.dueDate < new Date().toISOString().split("T")[0]).length
    const progress = total ? Math.round((completed / total) * 100) : 0

    document.getElementById("dashboard").innerHTML = `
        <h3>Dashboard Summary</h3>
        <p>Total Tasks: ${total}</p>
        <p>Completed: ${completed}</p>
        <p>Pending: ${pending}</p>
        <p>Overdue: ${overdue}</p>
        <p>Progress: ${progress}%</p>
    `
}

renderTasks()

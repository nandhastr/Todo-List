// Mendapatkan elemen yang dibutuhkan
const currentDate = document.getElementById("current-date");
const currentTime = document.getElementById("current-time");
const todoList = document.getElementById("todo");
const doneList = document.getElementById("done");

// Menampilkan tanggal dan waktu saat ini
function updateTime() {
    const now = new Date();
    currentDate.textContent = now.toLocaleDateString();
    currentTime.textContent = now.toLocaleTimeString();
}
setInterval(updateTime, 1000);

// Menambahkan tugas
function addTask() {
    const priority = document.getElementById("priority").value;
    const task = document.getElementById("task").value;

    if (!priority || priority === "") {
        alert("Prioritas tidak boleh kosong!");
        return;
    }

    if (!task || task.trim() === "") {
        alert("Tugas tidak boleh kosong!");
        return;
    }

    const newTask = {
        priority,
        task,
        date: new Date().toLocaleString(),
        done: false
    };

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    renderTasks();
    document.getElementById("priority").value = ""; 
    document.getElementById("task").value = ""; 
}

// memindahkan tugas ke daftar Done
function checkTask(checkbox) {
    const row = checkbox.parentElement.parentElement;
    const taskIndex = row.getAttribute("data-index");
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const task = tasks[taskIndex];
    task.done = checkbox.checked;

    if (checkbox.checked) {
        task.date = new Date().toLocaleString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    }

    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

// Fungsi untuk menghapus tugas
function deleteTask(button) {
    const row = button.parentElement.parentElement;
    const taskIndex = row.getAttribute("data-index");
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.splice(taskIndex, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

// simpn tugas ke LocalStorage
function renderTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const todoList = document.getElementById("todo");
    const doneList = document.getElementById("done");

    todoList.innerHTML = "";
    doneList.innerHTML = "";

    tasks.forEach((task, index) => {
        const row = document.createElement("tr");
        row.setAttribute("data-index", index);
        row.innerHTML = `
            <td><input type="checkbox" onchange="checkTask(this)" ${task.done ? "checked disabled" : ""}></td>
            <td>${task.priority}</td>
            <td>${task.task}</td>
            <td>${task.date}</td>
            <td><button id="btn-hapus" onclick="deleteTask(this)">Hapus</button></td>
        `;

        if (task.done) {
            doneList.appendChild(row);
        } else {
            todoList.appendChild(row);
        }
    });
}

// Panggil fungsi tugas saat halaman dimuat
document.addEventListener("DOMContentLoaded", renderTasks);

function deleteTask(button) {
    const row = button.parentElement.parentElement;
    if (row) {
        const confirmation = confirm("Apakah Anda yakin ingin menghapus tugas ini?");
        if (confirmation) {
            row.remove(); 
            localStorage.removeItem("tasks");
            alert("Tugas telah dihapus.");
        }
    }
}

function deleteAllTasks() {
    const confirmation = confirm("Apakah Anda yakin ingin menghapus semua tugas?");
    if (confirmation) {
        todoList.innerHTML = "";
        doneList.innerHTML = "";
        localStorage.removeItem("tasks");
        alert("Semua tugas telah dihapus.");
    }
}


updateTime();

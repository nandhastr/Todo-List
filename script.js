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
    const date = document.getElementById("date").value;

    if (!priority || priority === "") {
        alert("Prioritas tidak boleh kosong!");
        return;
    }

    if (!task || task.trim() === "") {
        alert("Tugas tidak boleh kosong!");
        return;
    }
    if (!date || date.trim() === "") {
        alert("Tanggal tidak boleh kosong!");
        return
    }

    const newTask = {
        priority,
        task,
        date,
        dateSubmit: new Date().toLocaleString(),
        done: false
    };

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    renderTasks();
    
    document.getElementById("priority").value = ""; 
    document.getElementById("task").value = ""; 
    document.getElementById("date").value = ""; 
}

// memindahkan tugas ke daftar Done
function checkTask(checkbox) {
    const row = checkbox.parentElement.parentElement;
    const taskIndex = row.getAttribute("data-index");
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const task = tasks[taskIndex];
    task.done = checkbox.checked;

    if (checkbox.checked) {
        task.dateSubmit = new Date().toLocaleString("id-ID", {
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
            <td>${task.dateSubmit}</td>
            <td id="done-date">${task.date}</td>
            <td><button id="btn-hapus" onclick="deleteTask(this)">Hapus</button></td>
        `;

       
        todoList.appendChild(row);
        
        if (task.done) {
            row.style.color = "#16C47F";
            const doneRow = row.cloneNode(true);
            doneList.appendChild(doneRow);
            row.classList.add("lineThrough");
            row.style.color = "";

            const doneDate = doneRow.querySelector("#done-date");
            doneDate.textContent = new Date().toLocaleDateString();

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

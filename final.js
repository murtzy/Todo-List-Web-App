window.addEventListener("load", () => {
  const taskListSection = document.querySelector("#task-list-section");
  const taskForm = document.querySelector("#task-form");
  const taskInput = document.querySelector("#task-input");

  // = buatan AI: Fungsi untuk menyimpan task ke Local Storage 
  const saveTasksToLocalStorage = () => {
    const tasks = document.querySelectorAll(".task-list");
    const tasksArray = [];
    tasks.forEach((task) => {
      const taskContent = task.querySelector(".task-content").value;
      const taskCategory = task.querySelector(".category .selected").innerText;
      const isCompleted = task.querySelector("input[type='checkbox']").checked;
      tasksArray.push({ content: taskContent, category: taskCategory, completed: isCompleted });
    });
    localStorage.setItem("tasks", JSON.stringify(tasksArray));
  };
  // =                                                          

  // = buatan AI: Fungsi untuk memuat task dari Local Storage
  const loadTasksFromLocalStorage = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    if (tasks) {
      tasks.forEach((task) => {
        addTaskToDOM(task.content, task.category, task.completed);
      });
    }
  };
  // =                                                       

  // = buatan AI: Fungsi untuk menambahkan task ke DOM 
  const addTaskToDOM = (isiTask, category = "category", isCompleted = false) => {
  // =                                                 

    // todo : buat list task
    const taskList = document.createElement("div");
    taskList.classList.add("task-list");

    // todo : no id task list
    let sumTaskList = document.querySelectorAll(".task-list").length + 1;
    const numTask = () => sumTaskList++;
    let idTask = numTask();

    taskList.setAttribute("data-user-id", idTask);

    // todo : buat checklist task
    const checklist = document.createElement("div");
    checklist.classList.add("check");

    const labelCheck = document.createElement("label");
    labelCheck.classList.add("check-control");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "toggle";
    checkbox.checked = isCompleted; // = buatan AI: Set checkbox sesuai dengan status task

    labelCheck.appendChild(checkbox);
    checklist.appendChild(labelCheck);
    taskList.appendChild(checklist);

    // todo : buat isi task
    const content = document.createElement("div");
    content.classList.add("content");

    const textTask = document.createElement("input");
    textTask.classList.add("task-content");
    textTask.type = "text";
    textTask.value = isiTask;
    textTask.setAttribute("readonly", "readonly");

    // = buatan AI: Jika task sudah selesai, tambahkan efek garis dan nonaktifkan task 
    if (isCompleted) {
      textTask.classList.add("line-through");
      textTask.style.opacity = "0.5";
      textTask.setAttribute("disabled", "disabled");
    }
    // =                                                                           

    content.appendChild(textTask);
    taskList.appendChild(content);

    // todo : buat action task
    const actionTask = document.createElement("div");
    actionTask.classList.add("action");

    // ? edit
    const editButton = document.createElement("button");
    editButton.classList.add("edit");

    const spanIconEdit = document.createElement("span");
    spanIconEdit.classList.add("material-symbols-outlined");
    spanIconEdit.innerText = "edit";

    editButton.appendChild(spanIconEdit);
    actionTask.appendChild(editButton);

    // ? delete
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete");

    const spanIconDelete = document.createElement("span");
    spanIconDelete.classList.add("material-symbols-outlined");
    spanIconDelete.innerText = "delete";

    deleteButton.appendChild(spanIconDelete);
    actionTask.appendChild(deleteButton);

    // ? category
    const categoryTask = document.createElement("button");
    categoryTask.classList.add("category");

    const spanIconCategory = document.createElement("span");
    spanIconCategory.classList.add("material-symbols-outlined");
    spanIconCategory.classList.add("selected");
    spanIconCategory.innerText = category;

    const categroyMenu = document.createElement("ul");
    categroyMenu.classList.add("menu");

    const categoryItem = [
      "apartment",
      "palette",
      "sports_esports",
      "ink_pen",
      "shopping_cart",
    ];
    categoryItem.forEach((item) => {
      const createLi = document.createElement("li");
      createLi.classList.add("material-symbols-outlined");
      createLi.textContent = item;
      categroyMenu.appendChild(createLi);

      createLi.addEventListener("click", () => {
        spanIconCategory.innerText = item;
        saveTasksToLocalStorage(); // = buatan AI: Update Local Storage setelah kategori diubah
      });
    });

    categoryTask.appendChild(spanIconCategory);
    categoryTask.appendChild(categroyMenu);
    actionTask.appendChild(categoryTask);

    taskList.appendChild(actionTask);

    // todo : tambahkan di html
    taskListSection.appendChild(taskList);

    checkbox.addEventListener("change", (e) => {
      if (checkbox.checked) {
        textTask.classList.add("line-through");
        textTask.style.opacity = "0.5";
        textTask.setAttribute("disabled", "disabled");
      } else {
        textTask.classList.remove("line-through");
        textTask.style.opacity = "1";
        textTask.removeAttribute("disabled");
      }
      saveTasksToLocalStorage(); // = buatan AI: Update Local Storage setelah diubah
    });

    // todo : edit button
    // ? custom error
    taskList.addEventListener("click", (e) => {
      if (
        e.target.innerText === "edit" ||
        e.target.className === "task-content" ||
        e.target.className === "task-content task-empty"
      ) {
        textTask.removeAttribute("readonly");
        textTask.focus();
        spanIconEdit.innerText = "save";
        taskList.classList.add("drop-shadow");
      } else if (textTask.value === "") {
        textTask.value = "belum terisi";
        textTask.classList.add("task-empty");
        textTask.setAttribute("readonly", "readonly");
        spanIconEdit.innerText = "edit";
        taskList.classList.remove("drop-shadow");
      } else {
        textTask.setAttribute("readonly", "readonly");
        spanIconEdit.innerText = "edit";
        taskList.classList.remove("drop-shadow");
      }
      saveTasksToLocalStorage(); // = buatan AI: Update Local Storage setelah diubah
    });
    // ? ketika diklik di luar task-list, mk auto ngesave
    document.addEventListener("click", (e) => {
      if (!taskList.contains(e.target)) {
        textTask.setAttribute("readonly", "readonly");
        spanIconEdit.innerText = "edit";
        taskList.classList.remove("drop-shadow");
      }

      if (textTask.value === "") {
        textTask.value = "belum diisi";
        textTask.classList.add("task-empty");
        textTask.setAttribute("readonly", "readonly");
        spanIconEdit.innerText = "edit";
        taskList.classList.remove("drop-shadow");
      }
      saveTasksToLocalStorage(); // = buatan AI: Update Local Storage setelah diubah
    });

    // todo : delete button
    taskList.addEventListener("click", (e) => {
      if (e.target.innerText === "delete") {
        taskList.remove();
        saveTasksToLocalStorage(); // = buatan AI: Update Local Storage setelah dihapus
      }
    });

    // Simpan ke Local Storage setelah task ditambahkan
    saveTasksToLocalStorage();
  };

  // Muat task dari Local Storage saat halaman dimuat
  loadTasksFromLocalStorage();

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const isiTask = taskInput.value;
    if (!isiTask) return; // Cegah task kosong

    addTaskToDOM(isiTask);
    taskInput.value = ""; // Kosongkan input setelah ditambahkan
  });
});

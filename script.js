let taskName = document.getElementById('task-name');
let addTask = document.getElementById('add-task');
let taskList = document.getElementById('task-list')
let errorBox = document.getElementById("error-message")
let clearButton = document.getElementById("clear-list")
let taskCount = document.getElementById("task-count")
let checkCount = document.getElementById("checked-count")
let taskArray = []


function saveTask() { // Adiciona a tarefa ao Local Storage
    localStorage.setItem("tasks", JSON.stringify(taskArray))
}

function increaseCount() { // Soma "1" ao contador de tarefas
    taskCount.innerText = parseFloat(taskCount.innerText) + 1

}

function decreaseCount() { // Subtrai "1" do contador de tarefas
    taskCount.innerText = parseFloat(taskCount.innerText) - 1

}

function createBox(taskName) { // Cria a "div" com "li" para inserir no HTML
    let task = document.createElement("li")
    let checkButton = document.createElement("button")
    checkButton.classList.add("check-button")
    let removeButton = document.createElement("button")
    removeButton.classList.add("remove-button")
    let taskBox = document.createElement("div")
    taskBox.classList.add("task-box")
    task.innerText = taskName.name
    if (taskName.check) {
        taskBox.classList.add("checked")
        checkButton.setAttribute("aria-label", "Marcar tarefa como concluída")
        removeButton.setAttribute("aria-label", "Remover tarefa")
    }



    taskBox.appendChild(task)
    taskBox.appendChild(checkButton)
    taskBox.appendChild(removeButton)
    taskList.appendChild(taskBox)
    removeButton.addEventListener("click", removeTask)
    checkButton.addEventListener("click", checkTask)

}

function createTask(taskName) { // Cria as tarefas após a validação

    const taskObject = { name: taskName, check: false }
    taskArray.push(taskObject)
    createBox(taskObject)
    increaseCount()
    saveTask()

}

function getTasks() { // Exibe a lista na tela após a atualização da página
    const tasksData = localStorage.getItem("tasks")
    clearUI()
    taskArray = tasksData ? JSON.parse(tasksData) : []
    taskArray.forEach(tasks => createBox(tasks))

    taskCount.innerText = taskArray.length
    checkCount.innerText = taskArray.filter(task => task.check).length
}

function removeError() { // Remove o código de erro
    errorBox.lastElementChild.remove()
}

function showError(errorCode) { // Exibe um código de erro dependendo do erro
    let errorMessage = document.createElement("p")
    if (errorCode == 1) {
        errorMessage.innerText = "Nome de tarefa inválido!"
    } else if (errorCode == 2) {
        errorMessage.innerText = "Tarefa já existe!"
    } else if (errorCode === 3) {
        errorMessage.innerText = "Não existem tarefas para serem apagadas."
    }

    errorMessage.classList.add("error")
    errorBox.appendChild(errorMessage)
    setTimeout(removeError, 1500)
}

function verifyIfExists(taskName) { // Verifica se a tarefa já existe
    const cleanName = taskName.toLowerCase()
    return taskArray.some(task => task.name.toLowerCase() === cleanName)
}

function verifyInput(event) { // Verifica se o nome da tarefa já existe ou tem no mínimo três letras.
    event.preventDefault()
    if (taskName.value.trim().length < 3) {
        showError(1)
        taskName.value = ""
    } else if (verifyIfExists(taskName.value.trim())) {
        showError(2)

    } else {
        createTask(taskName.value.trim())
    }
    taskName.value = ""
}

function removeTask() { // Remove a tarefa da lista.

    let taskToRemove = this.parentNode.querySelector('li').innerText
    const verifyCheck = taskArray.find(task => task.name == taskToRemove)
    if (verifyCheck.check) {
        decreaseCheckCount()
    }
    this.parentNode.remove()
    removeFromStorage(taskToRemove)
    decreaseCount()

}

function removeFromStorage(name) { // Remove a tarefa do LocalStorage
    let tasks = JSON.parse(localStorage.getItem("tasks"))
    tasks = tasks.filter(task => task.name !== name)
    localStorage.setItem("tasks", JSON.stringify(tasks))
    taskArray = taskArray.filter(task => task.name !== name)
}

function checkTask() { // Marca a tarefa como concluida.
    this.parentNode.classList.toggle("checked")
    const thisTask = this.parentNode.querySelector('li').innerText
    const exactTask = taskArray.find(task => thisTask === task.name)
    if (exactTask.check) {
        decreaseCheckCount()
    } else {
        increaseCheckCount()
    }
    if (exactTask) {
        exactTask.check = !exactTask.check
        saveTask()
    }

}

function clearList() { // Limpa a lista de tarefas
    if (taskArray.length === 0) {
        showError(3)
    }
    clearUI()
    taskArray = []
    localStorage.removeItem("tasks")
    taskCount.innerText = 0
    checkCount.innerText = 0

}

function clearUI() {
    taskList.innerHTML = ""
}

function increaseCheckCount() { // Aumenta o contador de tarefas concluídas
    checkCount.innerText = Number(checkCount.innerText) + 1
}

function decreaseCheckCount() { // Abaixa o contador de tarefas concluídas
    checkCount.innerText = Number(checkCount.innerText) - 1
}

clearButton.addEventListener("click", clearList)
addTask.addEventListener("click", verifyInput)

getTasks()












class Section {
    #id;
    name = '';

    constructor (name, id) {
        this.name = name; // Название раздела
        this.setID(id);
    }
    setID (param) {
        if (param) this.#id = param;
        else this.#id = CreateID();
    }
    getID () {
        return this.#id
    }
    getData () {
        let sectionData = `${this.name}|${this.#id}&`
        return sectionData
    }
}

class Task {
    #id;
    sectionID; // ID раздела, в котором должно находиться задание
    text = ''; // Описание задания
    difficult = ''; // Сложность задания
    deadline = ''; // Время, к которому нужно выполнить задание
    section = ''; // Раздел, в котором находится задание
    active = false; // Выполняется ли это задание сейчас
    complete = false; // Выполнено ли это задание
    startTime = Date.now(); // Время создания задания
    finishTime = ''; // Время завершения задания

    constructor (sectionID, text, difficult, deadline, active, startTime, finishTime, id) {
        this.setID(id);
        this.sectionID = sectionID;
        this.text = text;
        this.difficult = difficult;
        this.deadline = deadline;
        this.setActive(active);
        this.setStartTime(startTime);
        this.setFinishTime(finishTime);
    }
    setID (id) {
        if (id) this.#id = id;
        else this.#id = CreateID();
    }
    getID () {
        return this.#id
    }
    setActive (param) {
        if (param) this.active = param;
    }
    setStartTime (param) {
        if (param) this.startTime = param;
    }
    setFinishTime (param) {
        if (param) this.finishTime = param;
    }
    getData () {
        let taskData = `${this.sectionID}|${this.text}|${this.difficult}|${this.deadline}|${this.active}|${this.startTime}|${this.finishTime}|${this.#id}&`
        return taskData
    }
}

// Создает случайный ID
function CreateID () {
    let id = Math.random().toString(16).slice(2);
    return id;
}

let formCreateSection = document.getElementById('formCreateSection'); // Форма создания раздела заданий
let formEditSection = document.getElementById('formEditSection'); // Форма изменения названия раздела

let formCreateTask = document.getElementById('formCreateTask'); // Форма создания задания
let taskText = document.getElementById('taskText'); // Инпут ввода описания задания
let taskDiff = document.getElementById('taskDiff'); // Инпут ввода сложности
taskDiff.addEventListener('input', LengthValidate);
let taskTime = document.getElementById('taskTime'); // Инпут ввода дедлайна задания

let formEditTask = document.getElementById('formEditTask'); // Форма изменения свойств задания
let editTaskText = document.getElementById('editTaskText'); // Инпут ввода нового описания задания
let editTaskDiff = document.getElementById('editTaskDiff'); // Инпут ввода новой сложности задания
editTaskDiff.addEventListener('input', LengthValidate);
let editTaskTime = document.getElementById('editTaskTime'); // Инпут ввода нового дедлайна задания

let formTaskMenu = document.getElementById('formTaskMenu'); // Форма создания задания
let tasksSections = document.querySelector('.tasks__sections'); // Сюда будут добавлятся разделы заданий
let taskMenu = document.querySelector('.taskMenu'); // Меню действий над выбранным заданием
let thisTasksList; // Лист, в который будут добавляться задания
let newSectionName; // Заголовок с названием изменяемого раздела
let prevInputValue = ''; // Переменная для валидации инпутов сложности задания
let sectionArr = new Array();
let taskArr = new Array();
let currentDateTime = Date.now(); // Текущие дата и время. Используется для удаления заданий, помеченных как выполненные

let forms = document.querySelectorAll('.form'); // Все формы заметок
forms.forEach(element => element.addEventListener('click', CloseForm));

let createSectionButton = document.querySelector('.tasks__createSectionButton'); // Кнопка создания раздела
createSectionButton.addEventListener('click', OpenCreateSectionWindow);

let createTaskButtons = document.querySelectorAll('.addTaskButton'); // Кнопки добавления задания в каждом разделе
createTaskButtons.forEach(element => element.addEventListener('click', OpenCreateTaskWindow));

let formCreateSectionButton = document.getElementById('formCreateSectionButton'); // Кнопка в форме для создания раздела
formCreateSectionButton.addEventListener('click', CreateSection);

let formEditSectionButton = document.getElementById('formEditSectionButton'); // Кнопка в форме для редактирования названия раздела
formEditSectionButton.addEventListener('click', EditSection);

let formCreateTaskButton = document.getElementById('formCreateTaskButton'); // Кнопка в форме для создания задания 
formCreateTaskButton.addEventListener('click', CreateTask);

let completeTaskButton = document.querySelector('#completeTaskButton'); // Кнопка, изменяющая статус задания на выполненное
completeTaskButton.addEventListener('click', CompleteTask);

let cancelCompleteTaskButton = document.querySelector('#cancelCompleteTaskButton'); // Кнопка, изменяющая статус задания на невыполненное
cancelCompleteTaskButton.addEventListener('click', CancelCompleteTask);

let editTaskButton = document.querySelector('#editTaskButton'); // Кнопка открывающая окно редактирования задания
editTaskButton.addEventListener('click', OpenEditTaskWindow);

let deleteTaskButton = document.querySelector('#deleteTaskButton'); // Кнопка удаления задания
deleteTaskButton.addEventListener('click', DeleteTask);

let confirmEditTaskButton = document.querySelector('#confirmEditTaskButton'); // Кнопка подтверждения изменения задания
confirmEditTaskButton.addEventListener('click', EditTask);

if (localStorage.getItem('sectionsData')) InitTasks();


// Получает данные о заданиях из LocalStorage и вызывает функции их генерации
function InitTasks () {
    if (localStorage.getItem('sectionsData')) {
        let sectionsData = localStorage.getItem('sectionsData').slice(0, -1).split('&');
        sectionsData.forEach(sectionData => BuildSection(sectionData));
    }
    if (localStorage.getItem('tasksData')) {
        let tasksData = localStorage.getItem('tasksData').slice(0, -1).split('&');
        tasksData.forEach(taskData => BuildTask(taskData));
    }
}

// Генерация раздела заданий по указанным параметрам
function BuildSection (sectionData) {
    let sectionParams = sectionData.split('|');
    sectionArr.push(new Section(sectionParams[0], sectionParams[1]));

    tasksSections.insertAdjacentHTML('beforeend', ` \
        <div class="tasks__section" id="${sectionParams[1]}"> \
            <div class="tasks__sectionHeader">${sectionParams[0]}</div> \
            <div class="tasks__sectionControls"> \
                <div class="addTaskButton sectionButton">+</div> \
                <div class="editSectionButton sectionButton">/</div> \
                <div class="deleteSectionButton sectionButton">&times;</div> \
            </div> \
            <ul class="tasks__list"></ul> \
        </div> `);
    
    tasksSections.lastElementChild.querySelector('.addTaskButton').addEventListener('click', OpenCreateTaskWindow);
    tasksSections.lastElementChild.querySelector('.editSectionButton').addEventListener('click', OpenEditSectionWindow);
    tasksSections.lastElementChild.querySelector('.deleteSectionButton').addEventListener('click', DeleteSection);
}

// Генерация задания по указанным параметрам
function BuildTask (taskData) {
    let taskParams = taskData.split('|');
    
    // Если задание было помечено как выполненное больше 18 часов назад, не создаем его
    if (taskParams[6] != '') {
        if (currentDateTime - parseInt(taskParams[6]) > 3600000 * 18) {
            return;
        }
    }

    let difficult = '';
    let deadline = '';
    let thisTasksList = document.getElementById(taskParams[0]).querySelector('.tasks__list');
    taskArr.push(new Task(taskParams[0], taskParams[1], taskParams[2], taskParams[3], taskParams[4], taskParams[5], taskParams[6], taskParams[7]));

    // Если у задания есть доп параметры, оборачиваем их в скобки для красивого визуального отображения
    if (taskParams[2]) difficult = `(${taskParams[2]})`;
    if (taskParams[3]) deadline = `(${taskParams[3]})`;

    thisTasksList.insertAdjacentHTML('beforeend', ` \
    <li class="tasks__object" id="${taskParams[7]}">${taskParams[1]} <span>${difficult}</span> <span>${deadline}</span></li>`);
    let thisTask = thisTasksList.lastElementChild;

    if (taskParams[2] > 6) thisTask.classList.add('hardTask');
    if (taskParams[4] == 'true') thisTask.classList.add('activeTask');
    if (taskParams[6] != '') thisTask.classList.add('completedTask');
    thisTask.addEventListener('click', ActiveHandler);
    thisTask.addEventListener('contextmenu', OpenTaskMenu);
}



// Открывает форму создания раздела
function OpenCreateSectionWindow (e) {
    formCreateSection.classList.toggle('activeForm');

    let formContent = formCreateSection.querySelector('.form__content');
    formContent.style.top = e.pageY + 20 + 'px';
    if (e.pageX + (formContent.offsetWidth / 2) < window.screen.availWidth) {
        formContent.style.left = e.pageX - (formContent.offsetWidth / 2) + 'px';
    }
    else formContent.style.left = window.screen.availWidth - formContent.offsetWidth - 5 + 'px';

    document.getElementById('sectionName').select();
}
// Создает новый раздел заданий
function CreateSection (e) {
    let sectionName = document.getElementById('sectionName');
    if (sectionName.value != '') {
        BuildSection(new Section(sectionName.value).getData().slice(0, -1));
        SaveSectionsData();
        sectionName.value = '';
        e.target.closest('form').classList.toggle('activeForm');  
    }
}
// Открывает форму изменения названия раздела
function OpenEditSectionWindow (e) {
    formEditSection.classList.toggle('activeForm');
    newSectionName = this.parentNode.parentNode.querySelector('.tasks__sectionHeader');

    let formContent = formEditSection.querySelector('.form__content');
    formContent.style.top = e.pageY + 20 + 'px';
    if (e.pageX + (formContent.offsetWidth / 2) < window.screen.availWidth) {
        formContent.style.left = e.pageX - (formContent.offsetWidth / 2) + 'px';
    }
    else formContent.style.left = window.screen.availWidth - formContent.offsetWidth - 5 + 'px';


    document.getElementById('newSectionName').select();
}
// Редактирует выбранный раздел заданий
function EditSection (e) {
    let sectionName = document.getElementById('newSectionName');
    newSectionName.innerText = sectionName.value;
    ChangeSectionElem(newSectionName.parentNode.id, sectionName.value);
    sectionName.value = '';

    e.target.closest('form').classList.toggle('activeForm');
}
// Удаляет выбранный раздел заданий
function DeleteSection () {
    DeleteSectionElem(this.parentNode.parentNode.id);
    this.parentNode.parentNode.remove();
}



// Открывает форму создания задания
function OpenCreateTaskWindow (e) {
    formCreateTask.classList.toggle('activeForm');
    thisTasksList = this.parentNode.nextElementSibling;

    let formContent = formCreateTask.querySelector('.form__content');
    formContent.style.top = e.pageY + 20 + 'px';
    if (e.pageX + (formContent.offsetWidth / 2) < window.screen.availWidth) {
        formContent.style.left = e.pageX - (formContent.offsetWidth / 2) + 'px';
    }
    else formContent.style.left = window.screen.availWidth - formContent.offsetWidth - 5 + 'px';

    document.getElementById('taskText').select();
}
// Создает задание в выбранной форме
function CreateTask (e) {
    if (taskText.value != '') {
        let thisSectionID = thisTasksList.parentNode.id;
        
        BuildTask(new Task(thisSectionID, taskText.value, taskDiff.value, taskTime.value).getData().slice(0, -1));
        SaveTasksData();

        taskText.value = '';
        taskDiff.value = '';
        taskTime.value = '';
        e.target.closest('form').classList.toggle('activeForm');
    }
}
// Изменяет статус задания (активное/неактивное)
function ActiveHandler (mode, id) {
    // Если надо убрать класс у определенного задания
    if (mode == 'false') {
        if (document.getElementById(id).classList.contains('activeTask')) {
            document.getElementById(id).classList.remove('activeTask');
            ChangeTaskElem('active', id, 'false');
        }
    }
    // Добавляет/убирает класс при клике на задание
    else {
        this.classList.toggle('activeTask');

        if (this.classList.contains('activeTask')) ChangeTaskElem('active', this.id, 'true');
        else ChangeTaskElem('active', this.id, 'false');
    }
}
// Открывает меню действий над заданием
function OpenTaskMenu (e) {
    this.classList.add('chosenTask');
    e.preventDefault();
    formTaskMenu.classList.toggle('activeForm');

    // Отображает кнопку выполнения задания, если задание не помечено как выполненное
    if (this.classList.contains('completedTask')) {
        completeTaskButton.style.display = 'none';
        cancelCompleteTaskButton.style.display = 'inline';
    }
    // Отображает кнопку отмены выполнения задания, если задание помечено как выполненное
    else {
        completeTaskButton.style.display = 'inline';
        cancelCompleteTaskButton.style.display = 'none';
    }

    taskMenu.style.top = e.pageY - taskMenu.offsetHeight + 'px';
    taskMenu.style.left = e.pageX - (taskMenu.offsetWidth / 2) + 'px';
}
// Помечает задание как выполненное
function CompleteTask () {
    let chosenTask = document.querySelector('.chosenTask');

    ChangeTaskElem('complete', chosenTask.id, Date.now());
    chosenTask.classList.add('completedTask');

    ActiveHandler('false', chosenTask.id);

    formTaskMenu.classList.remove('activeForm');
    chosenTask.classList.remove('chosenTask');
}
// Помечает задание как невыполненное
function CancelCompleteTask () {
    let chosenTask = document.querySelector('.chosenTask');

    ChangeTaskElem('complete', chosenTask.id, '');
    chosenTask.classList.remove('completedTask');

    formTaskMenu.classList.remove('activeForm');
    chosenTask.classList.remove('chosenTask');
}
// Открывает окно редактирования задания
function OpenEditTaskWindow (e) {
    // Заполняем инпуты окна редактирования данными об изменяемом задании
    let thisTask = document.querySelector('.chosenTask');
    taskArr.forEach(task => {
        if (task.getID() == thisTask.id) {
            editTaskText.value = task.text;
            editTaskDiff.value = task.difficult;
            prevInputValue = task.difficult;
            editTaskTime.value = task.deadline;
            return;
        }
    })

    formTaskMenu.classList.remove('activeForm');
    formEditTask.classList.add('activeForm');

    let formContent = formEditTask.querySelector('.form__content');
    formContent.style.top = e.pageY + 23 + 'px';

    // Если форма не будет вылезать за экран слева или справа
    if (e.pageX > formContent.offsetWidth / 2 && e.pageX + (formContent.offsetWidth / 2) < window.screen.availWidth) {
        formContent.style.left = e.pageX - (formContent.offsetWidth / 2) + 'px';
    }
    else {
        // Если форма вылезает за экран слева
        if (e.pageX < formContent.offsetWidth / 2) formContent.style.left = 20 + 'px';
        // Если форма вылезает за экран справа
        else formContent.style.left = window.screen.availWidth - formContent.offsetWidth - 20 + 'px';
    }

    editTaskText.select();
}
// Редактирует задание
function EditTask (e) {
    if (editTaskText.value == '') return;
    let thisTask = document.querySelector('.chosenTask');

    ChangeTaskElem('edit', document.querySelector('.chosenTask').id, editTaskText.value, editTaskDiff.value, editTaskTime.value);
        
    if (editTaskDiff.value > 6) thisTask.classList.add('hardTask');
    else thisTask.classList.remove('hardTask');

    let difficult = '';
    let deadline = '';
    if (editTaskDiff.value) difficult = `(${editTaskDiff.value})`;
    if (editTaskTime.value) deadline = `(${editTaskTime.value})`;
    
    thisTask.innerHTML = `${editTaskText.value} <span>${difficult}</span> <span>${deadline}</span>`

    editTaskText.value = ''; editTaskDiff.value = ''; editTaskTime.value = '';
    thisTask.classList.remove('chosenTask');
    e.target.closest('form').classList.toggle('activeForm');
}
// Удаляет задание
function DeleteTask () {
    DeleteTaskElem(document.querySelector('.chosenTask').id);
    document.querySelector('.chosenTask').remove();
    formTaskMenu.classList.remove('activeForm');
}



// Записывает данные о разделах в LocalStorage
function SaveSectionsData () {
    let sectionsData = '';
    sectionArr.forEach(section => {
        sectionsData += section.getData();
    })
    localStorage.setItem('sectionsData', sectionsData);
}

// Записывает данные о заданиях в LocalStorage
function SaveTasksData () {
    let tasksData = '';
    taskArr.forEach(task => {
        tasksData += task.getData();
    })
    localStorage.setItem('tasksData', tasksData);
}

// Закрывает форму если кликнуть мимо ее контента
function CloseForm (e) {
    if (e.target.tagName == 'FORM') {
        if (document.querySelector('.chosenTask')) {
            document.querySelector('.chosenTask').classList.remove('chosenTask');
        }
        this.classList.toggle('activeForm');
    }
}

// Обработка клавиш 
document.addEventListener('keydown', KeyHandler);
function KeyHandler (e) {
    // Вводит данные из формы нажатием кнопки Enter
    if (e.key == 'Enter') {
        let activeForm = document.querySelector('.activeForm');

        if (activeForm == document.getElementById('formCreateSection')) {
            CreateSection(e);
            e.preventDefault();
        }
        if (activeForm == document.getElementById('formEditSection')) {
            EditSection(e);
            e.preventDefault();
        }
        if (activeForm == document.getElementById('formCreateTask')) {
            CreateTask(e);
            e.preventDefault();
        }
        if (activeForm == document.getElementById('formEditTask')) {
            EditTask(e);
            e.preventDefault();
        }
    }
}

// Изменение данных о разделе с указанным id
function ChangeSectionElem (id, name) {
    sectionArr.forEach(section => {
        if (section.getID() == id) {
            section.name = name;
            SaveSectionsData();
            return
        }
    })
}

// Изменение данных о задании с указанным id
function ChangeTaskElem (mode, id, param1, param2, param3) {
    taskArr.forEach(task => {
        if (task.getID() == id) {
            if (mode == 'edit') {
                task.text = param1;
                task.difficult = param2;
                task.deadline = param3;
            }
            if (mode == 'active') task.active = param1;
            if (mode == 'complete') task.finishTime = param1;

            SaveTasksData();
            return
        }
    })
}

// Удаление данных об удаленном разделе
function DeleteSectionElem (id) {
    for(let i = 0; i < sectionArr.length; i++) {
        if (sectionArr[i].getID() == id) {
            sectionArr.splice(i, 1);
            SaveSectionsData();

            // Удаляет данные о вложенных в удаленный раздел заданиях
            for (let i = 0; i < taskArr.length; i++) {
                if (taskArr[i].sectionID == id) {
                    DeleteTaskElem(taskArr[i].getID());
                    i--;
                }
            }
            return
        }
    }
}

// Удаление данных об удаленном задании
function DeleteTaskElem (id) {
    for(let i = 0; i < taskArr.length; i++) {
        if (taskArr[i].getID() == id) {
            taskArr.splice(i, 1);
            SaveTasksData();
            return;
        }
    }
}

// Проверка инпута на соответствие диапазону значений
function LengthValidate() {
    if (!this.value || this.value.slice(-1) != '.' && this.value > 0 && this.value < 11) {
        if (!this.value) {
            prevInputValue = '';
            return;
        }
        prevInputValue = this.value;
        return;
    }
    else this.value = prevInputValue;
}
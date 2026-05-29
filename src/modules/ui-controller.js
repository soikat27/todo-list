import AppController from "./app-controller.js";
import { parseISO, format } from "date-fns";
import ChecklistItem from "./checklist-item.js";

const uiController = (() => {

    function updateDisplay() {
        displayProjects();
        // update display associates concerning current project
        updateCurrentProjectUI();
        // display all todos
        displayTodos();
    }
    
    function displayProjects() {
        const projectList = document.querySelector("ul.project-list");
        projectList.innerHTML = "";

        AppController.getAllProjects().forEach(project => {
            const html = `
                <li>
                    <button type="button" class="project-item ${(AppController.getCurrentProject().id === project.id) ? "project-item--active" : ""}" data-id="${project.id}">
                            <span class="project-item__name">${project.title}</span>
                    </button>
                </li>
            `;

            projectList.insertAdjacentHTML("beforeend", html);
        });
    }

    function updateCurrentProjectUI() {
        // update current project title
        const curProjectTitle = document.querySelector(".main-header__title");
        curProjectTitle.textContent = AppController.getCurrentProject().title;

        // update delete button
        const isDefaultProject = AppController.getCurrentProject() === AppController.getDefaultProject();
        const deleteBtn = document.querySelector(".btn--danger");
        deleteBtn.classList.toggle("hidden", isDefaultProject);

        // update "update-project" button
        const updateBtn = document.querySelector(".btn-icon--update-project");
        updateBtn.classList.toggle("hidden", isDefaultProject);

        // show empty state if currentProject-todo list is empty
        const isEmptyTodo = AppController.getCurrentProject().todoList.length === 0;
        const emptyState = document.querySelector(".empty-state");
        emptyState.classList.toggle("hidden", !isEmptyTodo);
    }

    function displayTodos() {
        const todoList = document.querySelector(".todo-list");
        todoList.innerHTML = "";

        AppController.getCurrentProject().getAllTodos().forEach(todo => {
            const html = `
                <details class="todo-card ${(todo.completed) ? "todo-card--completed" : ""}" data-id="${todo.id}">
                    <summary class="todo-card__summary">
                        <span class="todo-card__check"></span>
                        <span class="todo-card__content">
                            <span class="todo-card__title">${todo.title}</span>
                            <span class="todo-card__meta">
                                Due <time datetime="${todo.dueDate}">${format(parseISO(todo.dueDate), "MMM d, yyyy")}</time>
                            </span>
                        </span>
                        <span class="todo-card__priority todo-card__priority--${todo.priority}">${todo.priority}</span>
                    </summary>

                    <div class="todo-card__details">
                        <section class="todo-card__section">
                            <h3 class="todo-card__section-title">Description</h3>
                            <p class="todo-card__text">
                                ${todo.description}
                            </p>
                        </section>
                    </div>
                </details>
            `;
            todoList.insertAdjacentHTML("beforeend", html);
 
            const cardDetails = document.querySelector(`details[data-id="${todo.id}"] .todo-card__details`);
            // add notes (if any)
            if (todo.notes) {
                const html = `
                    <section class="todo-card__section">
                        <h3 class="todo-card__section-title">Notes</h3>
                        <p class="todo-card__text">
                            ${todo.notes}
                        </p>
                    </section>
                `;
                cardDetails.insertAdjacentHTML("beforeend", html);
            }

            // add checkList (if any)
            if (todo.checklist.length > 0) {
                // add skeletal body
                const html = `
                    <section class="todo-checklist">
                        <h3 class="todo-card__section-title">Checklist</h3>
                        <ul class="todo-checklist__list">
                                
                        </ul>
                    </section>
                `;
                cardDetails.insertAdjacentHTML("beforeend", html);

                // add checklist-items
                const checklistDiv = document.querySelector(`details[data-id="${todo.id}"] .todo-checklist__list`);
                todo.checklist.forEach(checkList => {
                    const html = `
                        <li class="todo-checklist__item">
                            <span class="todo-checklist__dot"></span>
                            ${checkList.title}
                        </li>
                    `;
                    checklistDiv.insertAdjacentHTML("beforeend", html);
                });
            }
            
            // add actions buttons
            const actionBtnHtml = `
                <div class="todo-card__actions">
                    <button type="button" class="btn btn--secondary btn-edit">Edit todo</button>
                    <button type="button" class="btn btn--danger btn-delete-todo">Delete todo</button>
                </div>
            `;
            cardDetails.insertAdjacentHTML("beforeend", actionBtnHtml);
        });
    }

    function selectProject(event) {
        const project = event.target.closest(".project-item");
        if (project) {
            const projectId = project.dataset.id;
            AppController.selectProject(projectId);
            updateDisplay();
        }
    }

    function addProject(event) {
        event.preventDefault();

        const projectTitle = document.getElementById("project-title").value;
        AppController.createProject(projectTitle);
        updateDisplay();
        
        document.querySelector(".add-project-modal").close();
        document.querySelector(".add-project-modal__form").reset();
    }

    function deleteProject(event) {
        event.preventDefault();

        const project = AppController.getCurrentProject();
        AppController.deleteProject(project.id);
        updateDisplay();

        document.querySelector(".delete-project-modal").close();
    }

    function updateProject(event) {
        event.preventDefault();

        const updatedTitle = document.getElementById("updated-project-title").value;
        const projectId = AppController.getCurrentProject().id;
        AppController.updateProject(projectId, updatedTitle);
        updateDisplay();

        document.querySelector(".update-project-modal").close();
        document.querySelector(".update-project-modal__form").reset();
    }

    function addTodo(event) {
        event.preventDefault();

        const title       = document.getElementById("todo-title").value;
        const description = document.getElementById("todo-description").value;
        const dueDate     = document.getElementById("todo-due-date").value;
        const priority    = document.getElementById("todo-priority").value;
        const notes       = document.getElementById("todo-notes").value;
        const checklistTitles = document.getElementById("todo-checklist").value.split("\n").map(item => item.trim()).filter(item => item !== "");
        const checklist = [];
        checklistTitles.forEach(title => {
            const checklistItem = new ChecklistItem(title);
            checklist.push(checklistItem);
        });

        AppController.addTodo(title, description, dueDate, priority, notes, checklist);
        updateDisplay();

        document.querySelector(".add-todo-modal").close();
        document.querySelector(".add-todo-modal__form").reset();
    }

    function collapseTodoCard(event) {
        const todoItem = event.target.closest("details");
        if (!todoItem || todoItem.open)
            return;

        document.querySelectorAll("details").forEach(card => {
            card.open = false;
        });
    }

    function updateTodo(event) {
        event.preventDefault();

        const title       = document.getElementById("updated-todo-title").value;
        const description = document.getElementById("updated-todo-description").value;
        const dueDate     = document.getElementById("updated-todo-due-date").value;
        const priority    = document.getElementById("updated-todo-priority").value;
        const notes       = document.getElementById("updated-todo-notes").value;
        const checklistTitles = document.getElementById("updated-todo-checklist").value.split("\n").map(item => item.trim()).filter(item => item !== "");
        const checklist = [];
        checklistTitles.forEach(title => {
            const checklistItem = new ChecklistItem(title);
            checklist.push(checklistItem);
        });

        const todoId = event.currentTarget.dataset.todoId;
        AppController.updateTodo(todoId, title, description, dueDate, priority, notes, checklist);
        updateDisplay();

        document.querySelector(".update-todo-modal").close();
        document.querySelector(".update-todo-modal__form").reset();
    }

    function showUpdateTodoDialog(event) {
        const updateBtn = event.target.closest(".btn-edit");
        if (updateBtn) {
            const todoId = event.target.closest(".todo-card").dataset.id;
            const todo = AppController.getCurrentProject().getTodo(todoId);
            // store the id temporarily in update modal form
            document.querySelector(".update-todo-modal__form").dataset.todoId = todoId;

            document.getElementById("updated-todo-title").value = todo.title;
            document.getElementById("updated-todo-description").value = todo.description;
            document.getElementById("updated-todo-due-date").value = todo.dueDate;
            document.getElementById("updated-todo-priority").value = todo.priority;
            document.getElementById("updated-todo-notes").value = todo.notes;
            const checklistTitles = [];
            todo.checklist.forEach(checklistItem => {
                checklistTitles.push(checklistItem.title);
            });
            document.getElementById("updated-todo-checklist").value = checklistTitles.join("\n");

            const updateTodoDialog = document.querySelector(".update-todo-modal");
            updateTodoDialog.showModal();   
        }
    }

    function deleteTodo(event) {
        event.preventDefault();

        const todoId = event.currentTarget.dataset.todoId;
        AppController.removeTodo(todoId);
        updateDisplay();

        document.querySelector(".delete-todo-modal").close();
    }

    function toggleTodoCompleted(event) {
        const todoCheckBtn = event.target.closest(".todo-card__check");
        if (todoCheckBtn) {
            event.preventDefault();   // stop <summary> from toggling <details>
            
            const todoId = event.target.closest(".todo-card").dataset.id;
            AppController.toggleTodoCompleted(todoId);
            updateDisplay();
        }
    }

    function setEventListeners() {
        // open/close dialog for adding/canceling a new project
        const addProjectBtn = document.querySelector(".btn-icon--add-project");
        const addProjectDialog = document.querySelector(".add-project-modal");
        addProjectBtn.addEventListener("click", () => {
            addProjectDialog.showModal();
        });
        document.querySelector(".cancel-project").addEventListener("click", () => {
            addProjectDialog.close();
            document.querySelector(".add-project-modal__form").reset();
        });

        // add project to the project-rail
        const addProjectForm = document.querySelector(".add-project-modal__form");
        addProjectForm.addEventListener("submit", addProject);

        // select project
        const projectList = document.querySelector("ul.project-list");
        projectList.addEventListener("click", selectProject);

        // open/close dialog for deleting projects
        const deleteProjectBtn = document.querySelector(".btn--danger");
        const deleteProjectDialog = document.querySelector(".delete-project-modal");
        deleteProjectBtn.addEventListener("click", () => {
            deleteProjectDialog.showModal();
        });
        document.querySelector(".cancel-delete-project").addEventListener("click", () => {
            deleteProjectDialog.close();
        });

        // delete project
        const deleteProjectForm = document.querySelector(".delete-project-modal__form");
        deleteProjectForm.addEventListener("submit", deleteProject);

        // open/close dialog for updating/canceling a project
        const updateProjectBtn = document.querySelector(".btn-icon--update-project");
        const updateProjectDialog = document.querySelector(".update-project-modal");
        updateProjectBtn.addEventListener("click", () => {
            updateProjectDialog.showModal();
        });
        document.querySelector(".cancel-update-project").addEventListener("click", () => {
            updateProjectDialog.close();
            document.querySelector(".update-project-modal__form").reset();
        });

        // update project
        const updateProjectForm = document.querySelector(".update-project-modal__form");
        updateProjectForm.addEventListener("submit", updateProject);

        // open/close dialog for adding/canceling a todo-item in current project
        const addTodoBtn = document.querySelector(".btn-icon--add-todo");
        const addTodoDialog = document.querySelector(".add-todo-modal");
        addTodoBtn.addEventListener("click", () => {
            addTodoDialog.showModal();
        });
        document.querySelector(".cancel-todo").addEventListener("click", () => {
            addTodoDialog.close();
            document.querySelector(".add-todo-modal__form").reset();
        });

        // add todo-item in current project
        const addTodoForm = document.querySelector(".add-todo-modal__form");
        addTodoForm.addEventListener("submit", addTodo);

        // collapse previously selected card
        const todoList = document.querySelector(".todo-list");
        todoList.addEventListener("click", collapseTodoCard);

        // open/close dialog for updating a todo-item
        const updateTodoDialog = document.querySelector(".update-todo-modal");
        todoList.addEventListener("click", showUpdateTodoDialog);
        document.querySelector(".cancel-update-todo").addEventListener("click", (event) => {
            updateTodoDialog.close();
            document.querySelector(".update-todo-modal__form").reset();
            delete document.querySelector(".update-todo-modal__form").dataset.todoId;
        });

        // update todo-item
        const updateTodoForm = document.querySelector(".update-todo-modal__form");
        updateTodoForm.addEventListener("submit", updateTodo);

        // open/close dialog for deleting a todo-item
        const deleteTodoDialog = document.querySelector(".delete-todo-modal");
        todoList.addEventListener("click", (event) => {
            const deleteBtn = event.target.closest(".btn-delete-todo");
            if (deleteBtn) {
                const todoId = event.target.closest(".todo-card").dataset.id;
                // store the id temporarily in update modal form
                document.querySelector(".delete-todo-modal__form").dataset.todoId = todoId;

                deleteTodoDialog.showModal();
            }    
        });
        document.querySelector(".cancel-delete-todo").addEventListener("click", () => {
            deleteTodoDialog.close();
            delete document.querySelector(".delete-todo-modal__form").dataset.todoId;
        });

        // delete a todo
        const deleteTodoForm = document.querySelector(".delete-todo-modal__form");
        deleteTodoForm.addEventListener("submit", deleteTodo);

        // toggle a todo complete status
        todoList.addEventListener("click", toggleTodoCompleted);
    }

    function initializeApp() {
        AppController.loadAppData();
        setEventListeners();
        updateDisplay();
    }
    
    return {initializeApp};
})();

export default uiController;
import appController from "./app-controller.js";
import AppController from "./app-controller.js";
import { parseISO, format } from "date-fns";

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

        // show empty state if currentProject-todolist is empty
        const isEmptyTodo = AppController.getCurrentProject().todoList.length === 0;
        const emptyState = document.querySelector(".empty-state");
        emptyState.classList.toggle("hidden", !isEmptyTodo);
    }

    function displayTodos() {
        const todoList = document.querySelector(".todo-list");
        todoList.innerHTML = "";

        AppController.getCurrentProject().getAllTodos().forEach(todo => {
            const html = `
                <details class="todo-card">
                    <summary class="todo-card__summary">
                        <span class="todo-card__check"></span>
                        <span class="todo-card__content">
                            <span class="todo-card__title">${todo.title}</span>
                            <span class="todo-card__meta">
                                Due <time datetime="${todo.dueDate}">${format(parseISO(todo.dueDate), "MMM d, yyyy")}</time>
                            </span>
                        </span>
                        <span class="todo-card__priority todo-card__priority--high">${todo.priority}</span>
                    </summary>

                    <div class="todo-card__details">
                        <section class="todo-card__section">
                            <h3 class="todo-card__section-title">Description</h3>
                            <p class="todo-card__text">
                                ${todo.description}
                            </p>
                        </section>

                        <section class="todo-card__section">
                            <h3 class="todo-card__section-title">Notes</h3>
                            <p class="todo-card__text">
                                ${todo.notes}
                            </p>
                        </section>
                        
                        <section class="todo-checklist">
                            <h3 class="todo-card__section-title">Checklist</h3>
                            <ul class="todo-checklist__list">
                                
                            </ul>
                        </section>

                        <div class="todo-card__actions">
                            <button type="button" class="btn btn--secondary">Edit todo</button>
                            <button type="button" class="btn btn--danger">Delete todo</button>
                        </div>
                    </div>
                </details>
            `;

            todoList.insertAdjacentHTML("beforeend", html);

            // add checkList
            const checklist = document.querySelector(".todo-checklist__list");
            todo.checklist.forEach(checkList => {
                const html = `
                    <li class="todo-checklist__item">
                        <span class="todo-checklist__dot"></span>
                        ${checkList}
                    </li>
                `

                checklist.insertAdjacentHTML("beforeend", html);
            }) 
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
        const checklist   = document.getElementById("todo-checklist").value.split("\n");

        AppController.addTodo(title, description, dueDate, priority, notes, checklist);
        updateDisplay();

        document.querySelector(".add-todo-modal").close();
        document.querySelector(".add-todo-modal__form").reset();
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
        })

        // add project to the project-rail
        const addProjectForm = document.querySelector(".project-modal__form");
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
        })

        // delete project
        const deleteProjectForm = document.querySelector(".delete-project-modal");
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
        })

        // update project
        const updateProjectForm = document.querySelector(".update-project-modal__form");
        updateProjectForm.addEventListener("submit", updateProject);

        // open/close dialog for adding/canceling a todo-item to current project
        const addTodoBtn = document.querySelector(".btn-icon--add-todo");
        const addTodoDialog = document.querySelector(".add-todo-modal");
        addTodoBtn.addEventListener("click", () => {
            addTodoDialog.showModal();
        });
        document.querySelector(".cancel-todo").addEventListener("click", () => {
            addTodoDialog.close();
            document.querySelector(".add-todo-modal__form").reset();
        })

        // add todo-item to current project
        const addTodoForm = document.querySelector(".add-todo-modal__form");
        addTodoForm.addEventListener("submit", addTodo);
    }

    function initializeApp() {
        setEventListeners();
        updateDisplay();
    }
    
    return {initializeApp};
})();

export default uiController;
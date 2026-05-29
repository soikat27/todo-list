import AppController from "./app-controller.js";
import { parseISO, format } from "date-fns";
import ChecklistItem from "./checklist-item.js";

/**
 * UiController — DOM layer for stayListed.
 * Renders projects/todos, handles modals and clicks, and delegates
 * data changes to AppController.
 */
const uiController = (() => {

    /** Re-render the full UI (projects, header, todo list). */
    function updateDisplay() {
        displayProjects();
        updateCurrentProjectUI();
        displayTodos();
    }
    
    /** Build the horizontal project rail from AppController state. */
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

    /** Update header title, empty state, and default-project button visibility. */
    function updateCurrentProjectUI() {
        const curProjectTitle = document.querySelector(".main-header__title");
        curProjectTitle.textContent = AppController.getCurrentProject().title;

        const isDefaultProject = AppController.getCurrentProject() === AppController.getDefaultProject();
        const deleteBtn = document.querySelector(".btn--danger");
        deleteBtn.classList.toggle("hidden", isDefaultProject);

        const updateBtn = document.querySelector(".btn-icon--update-project");
        updateBtn.classList.toggle("hidden", isDefaultProject);

        const isEmptyTodo = AppController.getCurrentProject().todoList.length === 0;
        const emptyState = document.querySelector(".empty-state");
        emptyState.classList.toggle("hidden", !isEmptyTodo);
    }

    /** Render expandable todo cards for the current project. */
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

            if (todo.checklist.length > 0) {
                const html = `
                    <section class="todo-checklist">
                        <h3 class="todo-card__section-title">Checklist</h3>
                        <ul class="todo-checklist__list">
                                
                        </ul>
                    </section>
                `;
                cardDetails.insertAdjacentHTML("beforeend", html);

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
            
            const actionBtnHtml = `
                <div class="todo-card__actions">
                    <button type="button" class="btn btn--secondary btn-edit">Edit todo</button>
                    <button type="button" class="btn btn--danger btn-delete-todo">Delete todo</button>
                </div>
            `;
            cardDetails.insertAdjacentHTML("beforeend", actionBtnHtml);
        });
    }

    /** @param {Event} event - Project rail click. */
    function selectProject(event) {
        const project = event.target.closest(".project-item");
        if (project) {
            const projectId = project.dataset.id;
            AppController.selectProject(projectId);
            updateDisplay();
        }
    }

    /** @param {SubmitEvent} event - Add project form submit. */
    function addProject(event) {
        event.preventDefault();

        const projectTitle = document.getElementById("project-title").value;
        AppController.createProject(projectTitle);
        updateDisplay();
        
        document.querySelector(".add-project-modal").close();
        document.querySelector(".add-project-modal__form").reset();
    }

    /** @param {SubmitEvent} event - Delete project confirmation submit. */
    function deleteProject(event) {
        event.preventDefault();

        const project = AppController.getCurrentProject();
        AppController.deleteProject(project.id);
        updateDisplay();

        document.querySelector(".delete-project-modal").close();
    }

    /** @param {SubmitEvent} event - Update project form submit. */
    function updateProject(event) {
        event.preventDefault();

        const updatedTitle = document.getElementById("updated-project-title").value;
        const projectId = AppController.getCurrentProject().id;
        AppController.updateProject(projectId, updatedTitle);
        updateDisplay();

        document.querySelector(".update-project-modal").close();
        document.querySelector(".update-project-modal__form").reset();
    }

    /** @param {SubmitEvent} event - Add todo form submit. */
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

    /** Close other todo cards when one is clicked closed. */
    function collapseTodoCard(event) {
        const todoItem = event.target.closest("details");
        if (!todoItem || todoItem.open)
            return;

        document.querySelectorAll("details").forEach(card => {
            card.open = false;
        });
    }

    /** @param {SubmitEvent} event - Update todo form submit. */
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

    /**
     * Open the update modal and pre-fill fields for the clicked todo.
     * Stores todoId on the form via dataset for submit.
     * @param {Event} event
     */
    function showUpdateTodoDialog(event) {
        const updateBtn = event.target.closest(".btn-edit");
        if (updateBtn) {
            const todoId = event.target.closest(".todo-card").dataset.id;
            const todo = AppController.getCurrentProject().getTodo(todoId);
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

    /** @param {SubmitEvent} event - Delete todo confirmation submit. */
    function deleteTodo(event) {
        event.preventDefault();

        const todoId = event.currentTarget.dataset.todoId;
        AppController.removeTodo(todoId);
        updateDisplay();

        document.querySelector(".delete-todo-modal").close();
    }

    /**
     * Toggle todo completed when the check circle is clicked.
     * preventDefault stops the summary from expanding the card.
     * @param {Event} event
     */
    function toggleTodoCompleted(event) {
        const todoCheckBtn = event.target.closest(".todo-card__check");
        if (todoCheckBtn) {
            event.preventDefault();
            
            const todoId = event.target.closest(".todo-card").dataset.id;
            AppController.toggleTodoCompleted(todoId);
            updateDisplay();
        }
    }

    /** Attach all modal and delegated list click/submit listeners. */
    function setEventListeners() {
        const addProjectBtn = document.querySelector(".btn-icon--add-project");
        const addProjectDialog = document.querySelector(".add-project-modal");
        addProjectBtn.addEventListener("click", () => {
            addProjectDialog.showModal();
        });
        document.querySelector(".cancel-project").addEventListener("click", () => {
            addProjectDialog.close();
            document.querySelector(".add-project-modal__form").reset();
        });

        const addProjectForm = document.querySelector(".add-project-modal__form");
        addProjectForm.addEventListener("submit", addProject);

        const projectList = document.querySelector("ul.project-list");
        projectList.addEventListener("click", selectProject);

        const deleteProjectBtn = document.querySelector(".btn--danger");
        const deleteProjectDialog = document.querySelector(".delete-project-modal");
        deleteProjectBtn.addEventListener("click", () => {
            deleteProjectDialog.showModal();
        });
        document.querySelector(".cancel-delete-project").addEventListener("click", () => {
            deleteProjectDialog.close();
        });

        const deleteProjectForm = document.querySelector(".delete-project-modal__form");
        deleteProjectForm.addEventListener("submit", deleteProject);

        const updateProjectBtn = document.querySelector(".btn-icon--update-project");
        const updateProjectDialog = document.querySelector(".update-project-modal");
        updateProjectBtn.addEventListener("click", () => {
            updateProjectDialog.showModal();
        });
        document.querySelector(".cancel-update-project").addEventListener("click", () => {
            updateProjectDialog.close();
            document.querySelector(".update-project-modal__form").reset();
        });

        const updateProjectForm = document.querySelector(".update-project-modal__form");
        updateProjectForm.addEventListener("submit", updateProject);

        const addTodoBtn = document.querySelector(".btn-icon--add-todo");
        const addTodoDialog = document.querySelector(".add-todo-modal");
        addTodoBtn.addEventListener("click", () => {
            addTodoDialog.showModal();
        });
        document.querySelector(".cancel-todo").addEventListener("click", () => {
            addTodoDialog.close();
            document.querySelector(".add-todo-modal__form").reset();
        });

        const addTodoForm = document.querySelector(".add-todo-modal__form");
        addTodoForm.addEventListener("submit", addTodo);

        const todoList = document.querySelector(".todo-list");
        todoList.addEventListener("click", collapseTodoCard);

        const updateTodoDialog = document.querySelector(".update-todo-modal");
        todoList.addEventListener("click", showUpdateTodoDialog);
        document.querySelector(".cancel-update-todo").addEventListener("click", (event) => {
            updateTodoDialog.close();
            document.querySelector(".update-todo-modal__form").reset();
            delete document.querySelector(".update-todo-modal__form").dataset.todoId;
        });

        const updateTodoForm = document.querySelector(".update-todo-modal__form");
        updateTodoForm.addEventListener("submit", updateTodo);

        const deleteTodoDialog = document.querySelector(".delete-todo-modal");
        todoList.addEventListener("click", (event) => {
            const deleteBtn = event.target.closest(".btn-delete-todo");
            if (deleteBtn) {
                const todoId = event.target.closest(".todo-card").dataset.id;
                document.querySelector(".delete-todo-modal__form").dataset.todoId = todoId;

                deleteTodoDialog.showModal();
            }    
        });
        document.querySelector(".cancel-delete-todo").addEventListener("click", () => {
            deleteTodoDialog.close();
            delete document.querySelector(".delete-todo-modal__form").dataset.todoId;
        });

        const deleteTodoForm = document.querySelector(".delete-todo-modal__form");
        deleteTodoForm.addEventListener("submit", deleteTodo);

        todoList.addEventListener("click", toggleTodoCompleted);
    }

    /**
     * Boot the app: load saved data, bind listeners, render UI.
     * Entry point called from index.js.
     */
    function initializeApp() {
        AppController.loadAppData();
        setEventListeners();
        updateDisplay();
    }
    
    return {initializeApp};
})();

export default uiController;

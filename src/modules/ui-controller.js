import appController from "./app-controller.js";
import AppController from "./app-controller.js";

const uiController = (() => {

    function updateDisplay() {
        displayProjects();
        // update display associates concerning current project
        updateCurrentProjectUI();

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
    }

    function displayTodo() {

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
    }

    function initializeApp() {
        setEventListeners();
        updateDisplay();
    }
    
    return {initializeApp};
})();

export default uiController;
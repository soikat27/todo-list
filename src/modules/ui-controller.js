import AppController from "./app-controller.js";

const uiController = (() => {

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

        const curProjectTitle = document.querySelector(".main-header__title");
        curProjectTitle.textContent = AppController.getCurrentProject().title;
    }

    function selectProject(event) {
        const project = event.target.closest(".project-item");
        if (project) {
            const projectId = project.dataset.id;
            AppController.selectProject(projectId);

            displayProjects();
        }
    }

    function addProject(event) {
        event.preventDefault();

        const projectTitle = document.getElementById("project-title").value;
        AppController.createProject(projectTitle);
        displayProjects();
        
        document.querySelector(".project-modal").close();
        document.querySelector(".project-modal__form").reset();
    }

    function setEventListeners() {
        // open/close dialog for adding/canceling a new project
        const addProjectBtn = document.querySelector(".btn-icon--add-project");
        const addProjectDialog = document.querySelector(".project-modal");
        addProjectBtn.addEventListener("click", () => {
            addProjectDialog.showModal();
        });
        document.querySelector(".cancel-project").addEventListener("click", () => {
            addProjectDialog.close();
            document.querySelector(".project-modal__form").reset();
        })

        // add project to the project-rail
        const projectModalForm = document.querySelector(".project-modal__form");
        projectModalForm.addEventListener("submit", addProject);

        // select project
        const projectList = document.querySelector("ul.project-list");
        projectList.addEventListener("click", selectProject);
    }

    function initializeApp() {
        setEventListeners();
        displayProjects();
    }
    
    return {initializeApp};
})();

export default uiController;
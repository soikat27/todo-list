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
    }

    function addProject(event) {

        AppController.createProject()
    }

    function setEventListeners() {
        const addProjectBtn = document.querySelector(".btn-icon--add-project");
        const addProjectDialog = document.querySelector(".project-modal");
        addProjectBtn.addEventListener("click", () => {
            addProjectDialog.showModal();
        });
    }
    setEventListeners();
})();
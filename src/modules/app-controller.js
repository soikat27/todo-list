import Project from "./project.js";

const appController = (() => {
    const defaultProject = new Project("Default");
    let projects = [defaultProject];
    let curProject = defaultProject;

    function getAllProjects() {
        return [...projects];
    }

    function getCurrentProject() {
        return curProject;
    }

    function selectProject(projectId) {
        const project = projects.find(item => item.id === projectId);
        if (project)
            curProject = project;
    }

    function createProject (title) {
        const project = new Project(title);
        projects.push(project);
    }

    function deleteProject(projectId) {
        const project = projects.find(item => item.id === projectId);
        if (project === defaultProject) {
            // alert("Default project can't be deleted!");
            return false;
        }

        projects = projects.filter(item => item.id !== projectId);
        if (project === curProject)
            curProject = defaultProject;
        return true;
    }

    
})();
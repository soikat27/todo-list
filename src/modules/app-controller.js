import Project from "./project.js";
import Todo from "./todo.js";

const appController = (() => {
    const defaultProject = new Project("default");
    let projects = [defaultProject];
    let curProject = defaultProject;

    function getAllProjects() {
        return [...projects];
    }

    function getCurrentProject() {
        return curProject;
    }

    function getDefaultProject() {
        return defaultProject;
    }

    function selectProject(projectId) {
        const project = projects.find(item => item.id === projectId);
        if (project)
            curProject = project;
    }

    function createProject (title) {
        if (title) {
            const project = new Project(title);
            projects.push(project);
        }
    }

    function deleteProject(projectId) {
        const project = projects.find(item => item.id === projectId);
        if (project === defaultProject) {
            alert("Default project can't be deleted!");
            return false;
        }

        projects = projects.filter(item => item.id !== projectId);
        if (project === curProject)
            curProject = defaultProject;
        return true;
    }

    function updateProject(projectId, newTitle) {
        const project = projects.find(item => item.id === projectId);

        if (!project)
            return false;
        if (project === defaultProject) {
            alert("Default project can't be updated!");
            return false;
        }

        project.updateProject(newTitle);
        return true;
    }

    function addTodo(title, description, dueDate, priority, notes="", checklist=[]) {
        const todo = new Todo(title, description, dueDate, priority, notes, checklist);
        curProject.addTodo(todo);
    }

    function removeTodo(todoId) {
        createProject.removeTodo(todoId);
    }

    function updateTodo(todoId, newTitle, newDesc, newDueDate, newPriority, newNotes, newChecklist) {
        const todo = curProject.getTodo(todoId);
        if (todo)
            todo.updateTodo(newTitle, newDesc, newDueDate, newPriority, newNotes, newChecklist);
    }

    return {getAllProjects, getCurrentProject, getDefaultProject, selectProject, createProject, deleteProject, addTodo, removeTodo, updateProject, updateTodo};
})();

export default appController;
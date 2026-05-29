import Project from "./project.js";
import Todo from "./todo.js";
import ChecklistItem from "./checklist-item.js";
import {saveData, loadData} from "./storage.js";

const appController = (() => {
    let defaultProject = new Project("default");
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
            saveData("projects", projects);
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

        saveData("projects", projects);
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
        saveData("projects", projects);
        return true;
    }

    function addTodo(title, description, dueDate, priority, notes="", checklist=[]) {
        const todo = new Todo(title, description, dueDate, priority, notes, checklist);
        curProject.addTodo(todo);
        saveData("projects", projects);
    }

    function removeTodo(todoId) {
        curProject.removeTodo(todoId);
        saveData("projects", projects);
    }

    function updateTodo(todoId, newTitle, newDesc, newDueDate, newPriority, newNotes, newChecklist) {
        const todo = curProject.getTodo(todoId);
        if (todo) {
            todo.updateTodo(newTitle, newDesc, newDueDate, newPriority, newNotes, newChecklist);
            saveData("projects", projects);
        }    
    }

    function toggleTodoCompleted(todoId) {
        const todo = curProject.getTodo(todoId);
        if (todo) {
            todo.toggleCompleted();
            saveData("projects", projects);
        }       
    }

    function loadAppData() {
        const projectData = loadData("projects");
        if (projectData) {
            projects.length = 0;
            projectData.forEach(project => {
                const title = project.title;
                const curProject = new Project(title);

                project.todoList.forEach(todo => {
                    const title = todo.title;
                    const description = todo.description;
                    const dueDate = todo.dueDate;
                    const priority = todo.priority;
                    const notes = todo.notes;
                    
                    const curTodo = new Todo(title, description, dueDate, priority, notes, []);
                    curTodo.completed = todo.completed;

                    todo.checklist.forEach(checklist => {
                        const title = checklist.title;
                        const curChecklist = new ChecklistItem(title);
                        curChecklist.completed = checklist.completed;
                        curTodo.checklist.push(curChecklist);
                    });

                    curProject.todoList.push(curTodo);
                });

                projects.push(curProject);
            });

            curProject = projects[0];
            defaultProject = projects[0];
        }
    }

    return {getAllProjects, getCurrentProject, getDefaultProject, selectProject, createProject, deleteProject, addTodo, removeTodo, updateProject, updateTodo, toggleTodoCompleted, loadAppData};
})();

export default appController;
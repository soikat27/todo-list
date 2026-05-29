import Project from "./project.js";
import Todo from "./todo.js";
import ChecklistItem from "./checklist-item.js";
import {saveData, loadData} from "./storage.js";

/**
 * AppController — central state and business logic.
 * Manages projects/todos, calls saveData after mutations, and rebuilds
 * models from localStorage on loadAppData().
 */
const appController = (() => {
    let defaultProject = new Project("default");
    let projects = [defaultProject];
    let curProject = defaultProject;

    /** @returns {Project[]} Copy of all projects. */
    function getAllProjects() {
        return [...projects];
    }

    /** @returns {Project} The project currently selected in the UI. */
    function getCurrentProject() {
        return curProject;
    }

    /** @returns {Project} The default project (cannot be deleted or renamed). */
    function getDefaultProject() {
        return defaultProject;
    }

    /**
     * Switch the active project.
     * @param {string} projectId
     */
    function selectProject(projectId) {
        const project = projects.find(item => item.id === projectId);
        if (project)
            curProject = project;
    }

    /**
     * Create a new project and save.
     * @param {string} title
     */
    function createProject (title) {
        if (title) {
            const project = new Project(title);
            projects.push(project);
            saveData("projects", projects);
        }
    }

    /**
     * Delete a project by id. Default project is protected.
     * @param {string} projectId
     * @returns {boolean}
     */
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

    /**
     * Rename a project. Default project is protected.
     * @param {string} projectId
     * @param {string} newTitle
     * @returns {boolean}
     */
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

    /**
     * Add a todo to the current project and save.
     * @param {string} title
     * @param {string} description
     * @param {string} dueDate
     * @param {string} priority
     * @param {string} [notes=""]
     * @param {ChecklistItem[]} [checklist=[]]
     */
    function addTodo(title, description, dueDate, priority, notes="", checklist=[]) {
        const todo = new Todo(title, description, dueDate, priority, notes, checklist);
        curProject.addTodo(todo);
        saveData("projects", projects);
    }

    /**
     * Remove a todo from the current project and save.
     * @param {string} todoId
     */
    function removeTodo(todoId) {
        curProject.removeTodo(todoId);
        saveData("projects", projects);
    }

    /**
     * Update a todo on the current project and save.
     * @param {string} todoId
     * @param {string} newTitle
     * @param {string} newDesc
     * @param {string} newDueDate
     * @param {string} newPriority
     * @param {string} newNotes
     * @param {ChecklistItem[]} newChecklist
     */
    function updateTodo(todoId, newTitle, newDesc, newDueDate, newPriority, newNotes, newChecklist) {
        const todo = curProject.getTodo(todoId);
        if (todo) {
            todo.updateTodo(newTitle, newDesc, newDueDate, newPriority, newNotes, newChecklist);
            saveData("projects", projects);
        }    
    }

    /**
     * Toggle a todo's completed state and save.
     * @param {string} todoId
     */
    function toggleTodoCompleted(todoId) {
        const todo = curProject.getTodo(todoId);
        if (todo) {
            todo.toggleCompleted();
            saveData("projects", projects);
        }       
    }

    /**
     * Load projects from localStorage and rebuild Project/Todo/ChecklistItem instances.
     * Called once on app init before the UI renders.
     */
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

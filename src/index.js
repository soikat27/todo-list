import "./styles/normalize.css";
import "./styles/style.css";

// import Todo from "./modules/todo.js";
// import Project from "./modules/project.js";
// import AppController from "./modules/app-controller.js";
import UiController from "./modules/ui-controller.js";
// import ChecklistItem from "./modules/checklist-item.js";

// const todo = new Todo("title", "desc", "2016-12-11", "low");
// todo.toggleCompleted();
// todo.addToChecklist(new ChecklistItem("sub-title"));
// todo.toggleChecklistCompleted("5f1e01db-68b0-4551-8c04-a556bb74fd3f");
// console.log(todo);

// console.log(AppController.getAllProjects());
// AppController.createProject("project-1");
// AppController.createProject("project-2");
// AppController.createProject("project-3");
// AppController.createProject("project-4");

// AppController.selectProject(AppController.projects[3].id);

// // AppController.deleteProject(AppController.projects[0].id);

// AppController.addTodo("todo-1", "desc-1", "0000-00-1", "l", "notes-1");
// AppController.addTodo("todo-2", "desc-2", "0000-00-2", "h");
// AppController.addTodo("todo-3", "desc-3", "0000-00-3", "m", "notes-3");
// AppController.addTodo("todo-4", "desc-4", "0000-00-4", "h");

// console.log(AppController.getAllProjects());
// console.log(AppController.getCurrentProject());

UiController.initializeApp();
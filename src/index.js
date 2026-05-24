import "./styles/normalize.css";
import "./styles/style.css";

import Todo from "./modules/todo.js";
import ChecklistItem from "./modules/checklist-item.js";

const todo = new Todo("title", "desc", "2016-12-11", "low");
todo.toggleCompleted();
todo.addToChecklist(new ChecklistItem("sub-title"));
todo.toggleChecklistCompleted("5f1e01db-68b0-4551-8c04-a556bb74fd3f");
console.log(todo);
/**
 * A project that groups todos (e.g. "default", "Work").
 * Each project owns a todoList and is persisted to localStorage.
 */
export default class Project {
    /**
     * @param {string} title - Display name shown in the project rail.
     */
    constructor(title) {
        this.id = crypto.randomUUID();
        this.title = title.trim();
        this.todoList = [];
    }

    /**
     * Add a todo to this project.
     * @param {import("./todo.js").default} todo
     */
    addTodo(todo) {
        this.todoList.push(todo);
    }

    /**
     * Remove a todo by id.
     * @param {string} todoId
     */
    removeTodo(todoId) {
        this.todoList = this.todoList.filter(curTodo => curTodo.id !== todoId);
    }

    /**
     * Find one todo by id.
     * @param {string} todoId
     * @returns {import("./todo.js").default|undefined}
     */
    getTodo(todoId) {
        const todo = this.todoList.find(curTodo => curTodo.id === todoId);
        if (todo)
            return todo;
    }

    /** Return a copy of this project's todos. */
    getAllTodos() {
        return [...this.todoList];
    }

    /**
     * Rename this project.
     * @param {string} newTitle
     */
    updateProject(newTitle) {
        this.title = newTitle;
    }
}

export default class Project {
    constructor(title) {
        this.id = crypto.randomUUID();
        this.title = title.trim();
        this.todoList = [];
    }

    addTodo(todo) {
        this.todoList.push(todo);
    }

    removeTodo(todoId) {
        this.todoList = this.todoList.filter(curTodo => curTodo.id !== todoId);
    }

    getTodo(todoId) {
        const todo = this.todoList.find(curTodo => curTodo.id === todoId);
        if (todo)
            return todo;
    }

    getAllTodos() {
        return [...this.todoList];
    }

    updateProject(newTitle) {
        this.title = newTitle;
    }
}
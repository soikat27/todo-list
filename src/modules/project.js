class Project {
    constructor(title) {
        this.title = title;
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
}
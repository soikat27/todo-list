export default class ChecklistItem {
    constructor(title) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.completed = false;
    }

    toggleCompleted() {
        this.completed = !this.completed;
    }
}
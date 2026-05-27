import ChecklistItem from "./checklist-item.js";

export default class Todo {
    constructor(title, description, dueDate, priority, notes="", checklist=[]) {
        this.id = crypto.randomUUID();
        this.title = title.trim();
        this.description = description.trim();
        this.dueDate = dueDate.trim();
        this.priority = priority;
        this.notes = notes.trim();
        this.checklist = checklist;
        this.completed = false;
    }

    toggleCompleted() {
        this.completed = !this.completed;
    }

    addToChecklist(item) {
        if (item instanceof ChecklistItem)
            this.checklist.push(item);
    }

    toggleChecklistCompleted(checklistId) {
        const checklistItem = this.checklist.find(curItem => curItem.id === checklistId);
        if (checklistItem)
            checklistItem.toggleCompleted();
    }
}
import ChecklistItem from "./checklist-item.js";

export default class Todo {
    constructor(title, description, dueDate, priority, notes="", checklist=[]) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
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
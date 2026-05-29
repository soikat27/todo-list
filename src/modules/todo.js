import ChecklistItem from "./checklist-item.js";

/**
 * A task inside a project — title, due date, priority, notes, and optional checklist.
 * Owned by a Project and persisted to localStorage.
 */
export default class Todo {
    /**
     * @param {string} title
     * @param {string} description
     * @param {string} dueDate
     * @param {string} priority - "Low", "Medium", or "High"
     * @param {string} [notes=""]
     * @param {ChecklistItem[]} [checklist=[]]
     */
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

    /** Toggle the todo between done and not done. */
    toggleCompleted() {
        this.completed = !this.completed;
    }

    /**
     * Add a checklist item to this todo.
     * @param {ChecklistItem} item
     */
    addToChecklist(item) {
        if (item instanceof ChecklistItem)
            this.checklist.push(item);
    }

    /**
     * Toggle completion for one checklist item by id.
     * @param {string} checklistId
     */
    toggleChecklistCompleted(checklistId) {
        const checklistItem = this.checklist.find(curItem => curItem.id === checklistId);
        if (checklistItem)
            checklistItem.toggleCompleted();
    }

    /**
     * Replace this todo's editable fields (used by the update modal).
     * @param {string} newTitle
     * @param {string} newDesc
     * @param {string} newDueDate
     * @param {string} newPriority
     * @param {string} newNotes
     * @param {ChecklistItem[]} newChecklist
     */
    updateTodo(newTitle, newDesc, newDueDate, newPriority, newNotes, newChecklist) {
        this.title = newTitle.trim();
        this.description = newDesc.trim();
        this.dueDate = newDueDate.trim();
        this.priority = newPriority;
        this.notes = newNotes.trim();
        this.checklist = newChecklist;
    }
}

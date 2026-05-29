/**
 * A single sub-task inside a todo's checklist (e.g. "Buy milk").
 * Stored on the parent Todo and saved to localStorage as { id, title, completed }.
 */
export default class ChecklistItem {
    /**
     * @param {string} title - Text shown for this checklist line.
     */
    constructor(title) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.completed = false;
    }

    /** Toggle this item between done and not done. */
    toggleCompleted() {
        this.completed = !this.completed;
    }
}

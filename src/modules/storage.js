/**
 * Save a value to localStorage as JSON.
 * @param {string} key - Storage key (e.g. "projects").
 * @param {*} value - Data to persist (projects array, etc.).
 */
function saveData(key, value) {
    const data = JSON.stringify(value);
    localStorage.setItem(key, data);
}

/**
 * Load and parse JSON from localStorage.
 * @param {string} key - Storage key to read.
 * @returns {*} Parsed data, or null if nothing is stored.
 */
function loadData(key) {
    const data = localStorage.getItem(key);
    
    if (data)
        return JSON.parse(data);
    return null;
}

export {saveData, loadData};

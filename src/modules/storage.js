function saveData(key, value) {
    const data = JSON.stringify(value);
    localStorage.setItem(key, data);
}

function loadData(key) {
    const data = localStorage.getItem(key);
    
    if (data)
        return JSON.parse(data);
    return null;
}

export {saveData, loadData};
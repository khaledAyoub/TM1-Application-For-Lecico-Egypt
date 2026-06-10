
const addToLocalStorage = (key, value) => {
    localStorage.setItem(key, value);
}

const getFromLocalStorage = (key) => {
    if (localStorage.getItem(key)) {
        return localStorage.getItem(key);
    }
    else {
        return null;
    }
}

export { addToLocalStorage, getFromLocalStorage }
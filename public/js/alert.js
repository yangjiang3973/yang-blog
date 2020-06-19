export const hideAlert = () => {
    const el = document.querySelector('.alert');
    el.className = 'alert';
    el.style.display = 'none';
};

export const showAlert = (type, message) => {
    const el = document.querySelector('.alert');
    el.className = `alert alert--${type}`;
    el.lastElementChild.innerText = message;

    el.style.display = 'flex';
    window.setTimeout(hideAlert, 5000);
};

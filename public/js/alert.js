export const hideAlert = () => {
    const el = document.querySelector('.alert');
    if (el) el.parentElement.removeChild(el);
};

export const showAlert = (type, message) => {
    const el = document.querySelector('.alert');
    el.classList.add(`alert--${type}`);
    const alertText = document.createElement('span');
    alertText.innerText = message;
    el.appendChild(alertText);
    el.style.display = 'flex';
    window.setTimeout(hideAlert, 5000);
};

import '@babel/polyfill';
import { login } from './login';

window.addEventListener('load', init, false);

function init() {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener(
        'submit',
        e => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            login(email, password);
        },
        false
    );
}

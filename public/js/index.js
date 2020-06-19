import '@babel/polyfill';
import { login, register } from './login';

window.addEventListener('load', init, false);

function init() {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener(
        'submit',
        e => {
            e.preventDefault();
            login();
        },
        false
    );

    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener(
        'submit',
        e => {
            e.preventDefault();
            register();
        },
        false
    );
}

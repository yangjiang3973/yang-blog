import '@babel/polyfill';
import { login, register } from './login';

window.addEventListener('load', init, false);

function init() {
    const loginForm = document.getElementById('login-form');
    if (loginForm)
        loginForm.addEventListener(
            'submit',
            e => {
                e.preventDefault();
                login();
            },
            false
        );

    const registerForm = document.getElementById('register-form');
    if (registerForm)
        registerForm.addEventListener(
            'submit',
            e => {
                e.preventDefault();
                register();
            },
            false
        );

    const flyoutToggle = document.getElementById('flyout-toggle');
    if (flyoutToggle) {
        const flyoutBody = document.getElementById('flyout-body');
        document.body.addEventListener(
            'click',
            e => {
                e.preventDefault();
                flyoutBody.classList.remove('flyout__open');
            },
            false
        );
        flyoutToggle.addEventListener(
            'click',
            e => {
                e.stopPropagation();
                flyoutBody.classList.toggle('flyout__open');
            },
            false
        );
        flyoutBody.addEventListener(
            'click',
            e => {
                e.stopPropagation();
            },
            false
        );
    }
}

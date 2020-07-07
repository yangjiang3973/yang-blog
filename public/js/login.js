import axios from 'axios';
import validator from 'validator';
import { showAlert } from './alert';

export const login = async () => {
    const email = document.getElementById('login-email');
    const emailString = email.value.toLowerCase();
    const password = document.getElementById('login-password');
    const passwordString = password.value;
    // need to validate
    if (!validator.isEmail(emailString)) {
        email.focus();
        const emailStatus = document.getElementById('login-status-email');
        emailStatus.style.display = 'inline-flex';
        return;
    }

    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/login',
            data: {
                email: emailString,
                password: passwordString
            }
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Logged in successfully');
            window.setTimeout(() => {
                location.reload();
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

export const register = async () => {
    const email = document.getElementById('register-email');
    const emailString = email.value.toLowerCase();
    if (!validator.isEmail(emailString)) {
        email.focus();
        const emailStatus = document.getElementById('register-status-email');
        emailStatus.style.display = 'inline-flex';
        return;
    }
    const name = document.getElementById('register-name').value;
    const password = document.getElementById('register-password').value;
    const passwordConfirm = document.getElementById('register-passwordConfirm')
        .value;
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/signup',
            data: {
                name,
                email: emailString,
                password,
                passwordConfirm
            }
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Sign up successfully');
            window.setTimeout(() => {
                location.reload();
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: '/api/v1/users/logout'
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Logged out successfully');
            window.setTimeout(() => {
                location.reload();
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

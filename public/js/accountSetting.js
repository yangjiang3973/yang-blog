import validator from 'validator';
import axios from 'axios';
import { showAlert } from './alert';

export const updatePassword = async () => {
    const currentPassword = document.getElementById('account-current-password')
        .value;
    const newPassword = document.getElementById('account-new-password').value;
    const newPasswordConfirm = document.getElementById(
        'account-confirm-password'
    ).value;

    try {
        const res = await axios({
            method: 'PATCH',
            url: '/api/v1/users/updateMyPassword',
            data: {
                currentPassword,
                newPassword,
                newPasswordConfirm
            }
        });
        if (res.data.status === 'success') {
            showAlert('success', 'updated successfully');
            window.setTimeout(() => {
                location.reload();
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

export const updateEmail = async () => {
    const email = document.getElementById('account-email').value.toLowerCase();
    if (!validator.isEmail(email)) {
        showAlert('error', 'Please input a valid email');
        return;
    }
    await sendUpdate({ email });
    //TODO: add something to show waiting
};

export const updateName = async () => {
    const name = document.getElementById('account-name').value;
    if (!name || name.length === 0) return;
    await sendUpdate({ name });
};

const sendUpdate = async data => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: '/api/v1/users/updateMe',
            data: data
        });
        if (res.data.status === 'success') {
            showAlert('success', 'updated successfully');
            window.setTimeout(() => {
                location.reload();
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

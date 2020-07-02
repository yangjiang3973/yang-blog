import axios from 'axios';
import { showAlert } from './alert';

export const updateEmail = async () => {
    const email = document.getElementById('account-email').value;
    console.log('updateEmail -> email', email);
    if (!email || email.length === 0) return;
    try {
        const res = await axios({
            method: 'PATCH',
            url: '/api/v1/users/updateMe',
            data: {
                email
            }
        });
        if (res.data.status === 'success') {
            showAlert('success', 'updated successfully');
            window.setTimeout(() => {
                location.reload();
            }, 1500);
        }
    } catch (err) {
        console.log('updateEmail -> err', err);
        // showAlert('error', err.response.data.message);
    }
};

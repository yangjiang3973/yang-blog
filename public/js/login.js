import axios from 'axios';

export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/login',
            data: {
                email,
                password
            }
        });
        if (res.data.status === 'success') {
            // do action for success
            showAlert('success', 'Logged in successfully');
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

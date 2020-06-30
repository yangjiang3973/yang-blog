import axios from 'axios';
import { showAlert } from './alert';

export const commentSubmit = async () => {
    const commentInput = document.getElementById('comment-input').value;
    const postId = window.location.pathname.split('/').pop();
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/comments',
            data: { text: commentInput, postId }
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Comment submitted successfully');
            window.setTimeout(() => {
                location.reload();
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

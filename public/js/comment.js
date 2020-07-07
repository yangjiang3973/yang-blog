import axios from 'axios';
import { showAlert } from './alert';

export const commentSubmit = async () => {
    const commentInput = document.getElementById('comment-input').value;
    const washedText = commentInput.replace(/^\s*[\r\n]/gm, '');
    if (washedText.length === 0) {
        showAlert('error', 'Please do not submit empty comments');
        return;
    }
    if (washedText.length > 1000) {
        showAlert('error', 'Comments length beyonds limit');
        return;
    }

    const postId = window.location.pathname.split('/').pop();
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/comments',
            data: { text: washedText, postId }
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

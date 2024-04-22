import toast from 'react-hot-toast';

function showError(message) {
    return toast.error(message);
}

export { showError };

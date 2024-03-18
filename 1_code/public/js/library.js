const logout = () => {
    fetch('auth/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => {
        if (response.redirected) {
            window.location.href = response.url;
        } else {
            console.log('Logout success');
        }
    })
    .catch(error => {
        console.log('Error:',error);
    })
}
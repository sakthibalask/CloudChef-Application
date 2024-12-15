function initializeDesktopAuthentication(){
    // Initialize desktop authentication
    const loginBtn = document.getElementById('loginBtn');

    loginBtn.addEventListener('click', function(){
        sessionStorage.setItem('sessionToken', '1234567890');
        const currentUrl = new URL(window.location.href);
        currentUrl.hash = "orders";
        window.history.replaceState(null, '', currentUrl.href);
        window.location.reload();
    });
}

initializeDesktopAuthentication();
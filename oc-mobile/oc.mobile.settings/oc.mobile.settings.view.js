function initializeSettings(){
    let logoutBtn = document.getElementById('logout');
    if(logoutBtn){
        logoutBtn.addEventListener('click', function(){
            sessionStorage.removeItem('sessionToken');
            const targetId = 'authenticate';
            window.history.pushState({ targetId }, '?', `#${targetId}`);
            window.location.reload();
        });
    }
}

initializeSettings();
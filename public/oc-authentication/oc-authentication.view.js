function initializeLoginPage(){
    let loginBtn = document.getElementById("loginBtn");

    loginBtn.addEventListener('click', function(){
        sessionStorage.setItem('sessionToken', '1234567890');
        const targetId = 'menu';
        window.history.pushState({ targetId }, '?', `#${targetId}`);
        window.location.reload();
    });

}

initializeLoginPage();
import AuthCollectionFactory from "/public/oc.metadata.factory/factories/oc.authentication.factory.js";

function initializeLoginPage(){
    let loginBtn = document.getElementById("loginBtn");

    loginBtn.addEventListener('click', async function(){
        console.log("1");
        // const authLogin = new AuthCollectionFactory();
        // const payload = {
        //     staffId: "FC001",
        //     password: "12/03/2000"
        // };        
        // const response = await authLogin.login(payload);
        // console.log(response);
        sessionStorage.setItem('sessionToken', '1234567890');
        const targetId = 'menu';
        window.history.pushState({ targetId }, '?', `#${targetId}`);
        window.location.reload();
    });

    

}

initializeLoginPage();
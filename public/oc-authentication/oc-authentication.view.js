import AuthCollectionFactory from "/public/oc.metadata.factory/factories/oc.authentication.factory.js";

function initializeLoginPage(){
    let loginBtn = document.getElementById("loginBtn");

    loginBtn.addEventListener('click', function(){
        let staffId = document.getElementById('staff-id').value;
        let staffPassword = document.getElementById('staff-password').value;
        if(staffId !== null && staffPassword !== null){
            mobileAuthentication(staffId, staffPassword);
        }else{
            alert("All fields must be entered");
        }
    });

    async function mobileAuthentication(staffId, staffPassword){
         const authLogin = new AuthCollectionFactory();
         const payload = {
            staffId: staffId || null,
            password: staffPassword || null
        };
        const response = await authLogin.login(payload);
        if(!!response){
            alert('Login Succcesfull');
            if(response.role === 'STAFF'){
                const currentUrl = new URL(window.location.href);
                currentUrl.hash = "orders";
                window.history.replaceState(null, '', currentUrl.href);
                sessionStorage.setItem('sessionToken', response.token);
                sessionStorage.setItem('staffId', staffId);
                window.location.reload();
            }else{
                alert('Access Denied');
            }
        }else{
            console.error(error);
        }
    }

    

}

initializeLoginPage();
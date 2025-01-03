import AuthCollectionFactory from "/public/oc.metadata.factory/factories/oc.authentication.factory.js";

function initializeDesktopAuthentication(){
    // Initialize desktop authentication
    const loginBtn = document.getElementById('loginBtn');

    loginBtn.addEventListener('click', function(){
        let staffId = document.getElementById('staff-id').value;
        let staffPassword = document.getElementById('staff-password').value;
        if(staffId !== null && staffPassword !== null){
            desktopAuthentication(staffId, staffPassword);
        }else{
            alert("All fields must be entered");
        }
    });

    async function desktopAuthentication(staffId, staffPassword){
        const authLogin = new AuthCollectionFactory();
        const payload = {
            staffId: staffId || null,
            password: staffPassword || null
        };
        console.log(payload);     
        const response = await authLogin.login(payload);
        if(!!response){
            if(response.role === 'CHEF'){
                const currentUrl = new URL(window.location.href);
                currentUrl.hash = "orders";
                window.history.replaceState(null, '', currentUrl.href);
                sessionStorage.setItem('sessionToken', response.token);
                window.location.reload();
                alert('Login Succcesfull');
            }else if(response.role === 'ADMIN'){
                const currentUrl = new URL(window.location.href);
                currentUrl.hash = "dashboard";
                window.history.replaceState(null, '', currentUrl.href);
                sessionStorage.setItem('sessionToken', response.token);
                window.location.reload();
                alert('Login Succcesfull');
            }
            else{
                alert('Access Denied');
            }
        }else{
            console.error(error);
        }
        
    }
}

initializeDesktopAuthentication();
function isMobile() {
    return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
}

window.onload = function() {
    if (isMobile()) {
        window.location.href = '/oc-mobile/oc-mobile.app.html';
    }
};

document.addEventListener('DOMContentLoaded', function(){
    loadDesktopInitialPage();
});

async function showLoadingIndicator(){
    const desktopContainer = document.querySelector('.oc-desktop-app-body');
    try{
        const response = await fetch('../public/oc-loading.screen.html');

        const loadingScreen = await response.text();

        desktopContainer.innerHTML = loadingScreen;
    }catch(error){
        console.error(error);
    }
}


async function loadDesktopInitialPage() {
    const sessionToken = sessionStorage.getItem('sessionToken');
    const DesktopMainScreen = document.querySelector('.oc-desktop-main-screen');
    if(sessionToken === null){
        const currentUrl = new URL(window.location.href);
        const targetId = "authenticate";
        currentUrl.hash = `#${targetId}`;
        window.history.pushState({ targetId }, '', currentUrl.toString());
        loadDesktopLoginPage();
    }else{
        const currentUrl = new URL(window.location.href);
        let dynamicTargetId = currentUrl.toString().split("#")[1];
        try{
            const response = await fetch(`./oc.desktop.${dynamicTargetId}/oc.desktop.${dynamicTargetId}.view.html`);

            const initailDesktopPage = await response.text();

            if(initailDesktopPage){
                DesktopMainScreen.innerHTML = initailDesktopPage;
                loadCSS(`./oc.desktop.${dynamicTargetId}/oc.desktop.${dynamicTargetId}.view.css`);
                loadJS(`./oc.desktop.${dynamicTargetId}/oc.desktop.${dynamicTargetId}.view.js`);
                const currentUrl = new URL(window.location.href);

                
                if(currentUrl.hash !== '#orders' && currentUrl.hash !== '#dashboard'){
                    const targetId = "authenticate";
                    currentUrl.hash = `#${targetId}`;
                    window.history.pushState({ targetId }, '', currentUrl.toString());
                    sessionStorage.removeItem('sessionToken');
                    loadDesktopLoginPage();
                }
            } 
        }catch(err){
            // console.error(error);
            loadErrorPageDesktop(DesktopMainScreen)
        }
    }
}

async function loadErrorPageDesktop(container){
    const currentUrl = new URL(window.location.href);
    const targetId = "error";
    currentUrl.hash = `#${targetId}`;
    window.history.pushState({ targetId }, '', currentUrl.toString());
    const errorResponse = await fetch('../public/oc-notfound.screen.html');
    const errorScreen = await errorResponse.text();
    container.innerHTML = errorScreen;
}

async function loadDesktopLoginPage() {
    const DesktopMainScreen = document.querySelector('.oc-desktop-main-screen');
    try{
        const response = await fetch('../public/oc-desktop-authentication/oc-desk-authentication.view.html');
        const loginPage = await response.text();

        DesktopMainScreen.innerHTML = loginPage;
        loadCSS('../public/oc-desktop-authentication/oc-desk-authentication.view.css')
        loadJS('../public/oc-desktop-authentication/oc-desk-authentication.view.js')
    }catch(error){
        console.error(error);
    }
}

function loadCSS(href) {
    const existingLink = document.querySelector(`link[href="${href}"]`);
    if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.setAttribute('data-dynamic', 'true');
        document.head.appendChild(link);
    }
}

function loadJS(src) {
    return new Promise((resolve, reject) => {
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (!existingScript) {
            const script = document.createElement('script');
            script.src = src;
            script.setAttribute('data-dynamic', 'true');
            script.setAttribute('type', 'module'); 
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            document.body.appendChild(script);
        } else {
            resolve();
        }
    });
}
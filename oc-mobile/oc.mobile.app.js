function isDesktop() {
    return !/Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
}

window.onload = function () {
    if (isDesktop()) {
        window.location.href = '/oc-desktop/oc-desktop.app.html';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    loadInitialPage();
    initializeNavigation();
});

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.oc-mob-nav_options');
    const mainContent = document.querySelector('.oc-mob-page-area');

    navLinks.forEach(link => {
        link.addEventListener('click', async (event) => {
            event.preventDefault();
            const targetUrl = event.target.closest('a').getAttribute('href').substring(1);
            const [targetId] = targetUrl.split('?');
            const currentUrl = new URL(window.location.href);
            currentUrl.hash = `#${targetId}`;
            currentUrl.search = '';
            window.history.pushState({ targetId }, '', currentUrl.toString());

            try {
                await loadContent(targetId, mainContent);
                refreshScreen();
            } catch (error) {
                handleError(error, mainContent);
            }
        });
    });
}

async function refreshScreen() {
    const mainContent = document.querySelector('.oc-mob-page-area');
    const currentUrl = new URL(window.location.href);
    let targetId = currentUrl.hash.substring(1).split('?')[0];
    targetId = targetId || 'menu';

    try {
        await loadContent(targetId, mainContent);
        console.log(`Screen refreshed for targetId: ${targetId}`);
    } catch (error) {
        handleError(error, mainContent);
    }
}

async function showLoadingIndicator(container) {
    try {
        const response = await fetch('../public/oc-loading.screen.html');
        const loadingScreen = await response.text();
        container.innerHTML = loadingScreen;
    } catch (error) {
        console.log('Unable to find the loading screen', error);
    }
}

async function loadContent(targetId, container) {
    try {
        cleanupPageResources();

        const currentUrl = new URL(window.location.href);
        currentUrl.hash = `#${targetId}`;
        window.history.pushState({ targetId }, '', currentUrl.toString());

        const response = await fetch(`./oc.mobile.${targetId}/oc.mobile.${targetId}.view.html`);
        if (!response.ok) {
            throw new Error(`Could not load ${targetId}.html`);
        }

        const html = await response.text();
        container.innerHTML = html;

        await loadJS(`./oc.mobile.${targetId}/oc.mobile.${targetId}.view.js`, true);
        loadCSS(`./oc.mobile.${targetId}/oc.mobile.${targetId}.view.css`);
    } catch (err) {
        const mainContent = document.querySelector('.oc-mob-page-area');
        const navigationContainer = document.querySelector('.oc-mob-navigation');
        const targetId = "error";

        const errorResponse = await fetch('../public/oc-notfound.screen.html');
        const errorScreen = await errorResponse.text();

        mainContent.innerHTML = errorScreen;
        navigationContainer.style.display = "none";
    }
}

function cleanupPageResources() {
    const dynamicCSSLinks = document.querySelectorAll('link[rel="stylesheet"][data-dynamic="true"]');
    dynamicCSSLinks.forEach(link => link.parentNode.removeChild(link));

    const dynamicScripts = document.querySelectorAll('script[data-dynamic="true"]');
    dynamicScripts.forEach(script => script.parentNode.removeChild(script));
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

function loadJS(src, isModule = false) {
    return new Promise((resolve, reject) => {
        cleanupPageResources(); // Ensures the script is reloaded fresh

        const script = document.createElement('script');
        script.src = `${src}?timestamp=${Date.now()}`; // Add timestamp to avoid caching issues
        script.type = isModule ? 'module' : 'text/javascript';
        script.defer = isModule;
        script.setAttribute('data-dynamic', 'true');
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.body.appendChild(script);
    });
}

function handleError(error, container) {
    container.innerHTML = `
        <div class="error-message">
            <p>Oops! Something went wrong while loading the content.</p>
            <p><button onclick="window.location.reload()">Retry</button></p>
        </div>
    `;
}

function loadInitialPage() {
    const mainContent = document.querySelector('.oc-mob-page-area');
    const isReload = performance.navigation.type === 1;

    if (isReload) {
        showLoadingIndicator(mainContent);
        setTimeout(() => {
            continueInitialPageLoad(mainContent);
        }, 2000);
    } else {
        continueInitialPageLoad(mainContent);
    }
}

function continueInitialPageLoad(mainContent) {
    const sessionToken = sessionStorage.getItem('sessionToken');
    if (sessionToken === null) {
        loadLoginPage();
    } else {
        const currentUrl = new URL(window.location.href);
        let targetId = currentUrl.hash.substring(1).split('?')[0];
        targetId = targetId !== "error" ? targetId || 'menu' : 'menu';

        loadContent(targetId, mainContent).catch(error => {
            handleError(error, mainContent);
        });
    }
}

async function loadLoginPage() {
    const targetId = 'authenticate';
    const mainBody = document.querySelector('.oc-mob-body');
    showLoadingIndicator(mainBody);

    setTimeout(async () => {
        const loginPage = await fetch('../public/oc-authentication/oc-authentication.view.html');
        window.history.pushState({ targetId }, '', `#${targetId}`);
        const loginHtml = await loginPage.text();
        mainBody.innerHTML = loginHtml;

        await loadJS('../public/oc-authentication/oc-authentication.view.js', true);
        loadCSS('../public/oc-authentication/oc-authentication.view.css');
    }, 2000);
}

window.addEventListener('popstate', (event) => {
    const targetId = event.state ? event.state.targetId : window.location.hash.substring(1).split('?')[0];
    if (targetId) {
        const mainContent = document.querySelector('.oc-mob-page-area');
        loadContent(targetId, mainContent).catch(error => {
            handleError(error, mainContent);
        });
    }
});

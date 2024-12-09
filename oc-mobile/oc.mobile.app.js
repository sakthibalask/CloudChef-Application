function isDesktop() {
    return !/Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
}

window.onload = function () {
    if (isDesktop()) {
        window.location.href = '/oc-desktop/oc-desktop.app.html';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    loadInitialPage();
});

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.oc-mob-nav_options');
    const mainContent = document.querySelector('.oc-mob-page-area');

    navLinks.forEach(link => {
        link.addEventListener('click', async (event) => {
            event.preventDefault();
            const targetUrl = event.target.closest('a').getAttribute('href').substring(1);

            // Extract and clean the targetId (removes query params if any)
            const [targetId] = targetUrl.split('?'); // Ignore query params
            const currentUrl = new URL(window.location.href);
            currentUrl.hash = `#${targetId}`; // Set only the hash
            currentUrl.search = ''; // Remove any existing query parameters
            window.history.pushState({ targetId }, '', currentUrl.toString());

            try {
                await loadContent(targetId, mainContent);
            } catch (error) {
                handleError(error, mainContent);
            }
        });
    });
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

        // Fetch the content
        const response = await fetch(`./oc.mobile.${targetId}/oc.mobile.${targetId}.view.html`);
        if (!response.ok) {
            throw new Error(`Could not load ${targetId}.html`);
        }

        const html = await response.text();
        container.innerHTML = html;
        loadCSS(`./oc.mobile.${targetId}/oc.mobile.${targetId}.view.css`);
        await loadJS(`./oc.mobile.${targetId}/oc.mobile.${targetId}.view.js`);
    } catch (error) {
        throw error;
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

function loadJS(src) {
    return new Promise((resolve, reject) => {
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (!existingScript) {
            const script = document.createElement('script');
            script.src = src;
            script.setAttribute('data-dynamic', 'true');
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            document.body.appendChild(script);
        } else {
            resolve();
        }
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
    const isReload = performance.navigation.type === 1; // Check if the page was reloaded

    if (isReload) {
        showLoadingIndicator(mainContent);
        setTimeout(() => {
            continueInitialPageLoad(mainContent);
        }, 2000); // Display loading screen for 2 seconds on reload
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

        // Extract and clean the targetId (removes query params if any)
        let targetId = currentUrl.hash.substring(1).split('?')[0]; // Remove query parameters if any
        targetId = targetId || 'menu'; // Default to 'menu' if no hash or invalid targetId

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

        const loginCSSLink = document.createElement('link');
        loginCSSLink.rel = 'stylesheet';
        loginCSSLink.href = '../public/oc-authentication/oc-authentication.view.css';
        document.body.appendChild(loginCSSLink);

        const loginJSLink = document.createElement('script');
        loginJSLink.src = '../public/oc-authentication/oc-authentication.view.js';
        document.body.appendChild(loginJSLink);
    }, 2000); // Show loading screen for 2 seconds on login
}

window.addEventListener('popstate', (event) => {
    let targetId = event.state ? event.state.targetId : window.location.hash.substring(1);
    targetId = targetId.split('?')[0]; // Remove query parameters if any
    if (targetId) {
        const mainContent = document.querySelector('.oc-mob-page-area');
        loadContent(targetId, mainContent).catch(error => {
            handleError(error, mainContent);
        });
    }
});

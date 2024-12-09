function isMobile() {
    return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
}

window.onload = function() {
    if (isMobile()) {
        // Redirect to the mobile view if the device type has changed
        window.location.href = '/oc-mobile/oc-mobile.app.html';
    }
};
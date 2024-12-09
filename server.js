const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Function to detect mobile devices using User-Agent
function isMobile(userAgent) {
    return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(userAgent);
}

// Serve static files for desktop and mobile views
app.use('/oc-desktop', express.static(path.join(__dirname, 'oc-desktop')));
app.use('/oc-mobile', express.static(path.join(__dirname, 'oc-mobile')));

// Serve static files from the 'public' directory
app.use('/public', express.static(path.join(__dirname, 'public')));

// Redirect based on the device type
app.get('/', (req, res) => {
    const userAgent = req.headers['user-agent'];
    if (isMobile(userAgent)) {
        // Redirect to mobile view
        res.redirect('/oc-mobile/oc-mobile.app.html');
    } else {
        // Redirect to desktop view
        res.redirect('/oc-desktop/oc-desktop.app.html');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Frontend server running at http://localhost:${PORT}`);
    console.log('Backend server running at http://localhost:8181');
});

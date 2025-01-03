function initailDesktopDashboard(){

    const logoutBtn = document.getElementById('logout-btn');
    const viewOrderLineBtn = document.getElementById('view-orderline');
    

    const menuBtns = document.querySelectorAll('.oc-desk-dashboard-menu-items li');

    let selectedMenu = sessionStorage.getItem('selectedmenu');
    if(selectedMenu !== null){
        menuBtns.forEach((menuBtn) => {
            if(menuBtn.textContent.toString().trim() === selectedMenu){
                _setActiveClass(menuBtn);
            }
        });
        _viewContainer(selectedMenu);
    }else{
        _viewContainer('dashboard');
    }

    menuBtns.forEach( (menuBtn) => {
        menuBtn.addEventListener('click', () => {
            menuBtns.forEach(menuBtn => menuBtn.classList.remove('active'));
            menuBtn.classList.add('active');
            sessionStorage.setItem('selectedmenu', menuBtn.textContent.toString().trim())
            _viewContainer(menuBtn.textContent);
        });
    });

    viewOrderLineBtn.addEventListener('click', function(){
        const currentUrl = new URL(window.location.href);
        const targetId = "orders";
        currentUrl.hash = `#${targetId}`;
        window.history.pushState({ targetId }, '', currentUrl.toString());
        window.location.reload();
    });

   

    logoutBtn.addEventListener('click', function(){
        const currentUrl = new URL(window.location.href);
        const targetId = "authenticate";
        currentUrl.hash = `#${targetId}`;
        window.history.pushState({ targetId }, '', currentUrl.toString());
        sessionStorage.removeItem('sessionToken');
        sessionStorage.removeItem('selectedmenu');
        window.location.reload();
    });

    async function _fetchViewContext(path){
        const response = await fetch(path);
        const html = response.text();
        return html;
    }

    async function _viewContainer(selectedOptionElement){
        const dashboardContext = document.querySelector('.oc-desk-dashboard-view-content');
        const viewContext = await _fetchViewContext(`./oc.desktop.dashboard/impl/oc.desktop.${selectedOptionElement.toString().trim()}.context.html`);
        dashboardContext.innerHTML = viewContext;

        switch (selectedOptionElement.toString().trim().toLowerCase()){
            case 'menu':
                _menuView();
        }
    }

    function _setActiveClass(menuBtn){
        menuBtns.forEach(menuBtn => menuBtn.classList.remove('active'));
        menuBtn.classList.add('active');
    }

    function _menuView(){
        const viewItemBtn = document.getElementById('view-details');
        const closeoverlayBtn = document.getElementById('close-overlay');
        const menuOverlay = document.querySelector('.oc-desk-menu-overlay');

        viewItemBtn.addEventListener('click', function(){
            
            menuOverlay.classList.add('is-open');
        });

        closeoverlayBtn.addEventListener('click', function(){
            menuOverlay.classList.remove('is-open');
        });
    }


    
}

initailDesktopDashboard();
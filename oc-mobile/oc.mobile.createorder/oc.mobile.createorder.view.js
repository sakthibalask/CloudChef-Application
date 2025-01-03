async function initializeCreateOrderPage(){
    const { default: MenuCollection } = await import("/public/oc.metadata.factory/factories/oc.menu.factory.js");
    const { default: OrdersCollectionFactory } = await import("/public/oc.metadata.factory/factories/oc.orders.factory.js");
    const staffId = sessionStorage.getItem('staffId');
    let orderPayload = {
        orderType: 'Dine In',
        staffId: staffId
    };
    
    initializeOrderRenderList();
    
    async function initializeOrderRenderList(){
        const orderList = await getCurrentOrderList();
        const createActionsViewOverlay = document.querySelector('.oc-mob-createorder-view-overlay'); 
        document.querySelector('.oc-mob-createorder-view-form-input').textContent = staffId;
        loadCurrentOrderList(createActionsViewOverlay);
        

        // Assuming `loadCurrentOrderList` is already defined
        async function loadCurrentOrderList(createActionsViewOverlay) {
            const createOrderBtn = document.getElementById('create-order');
            let ordersList = await getCurrentOrderList();

            // Set up the "Create Order" button functionality
            createOrderBtn.addEventListener('click', async function () {
                try {
                    const response = await fetch('./oc.mobile.createorder/impl/oc.mobile.createorder.form.view.html');
                    const createActionsView = await response.text();
                    loadCreateActionsView(createActionsView);
                } catch (error) {
                    console.error(error);
                }
            });

            const orderListFilterChips = document.querySelectorAll('.oc-mob-createorder-view-form-filterChips span');
            const orderListContainer = document.querySelector('.oc-mob-createorder-view-lists');

            // Function to update the displayed orders based on the selected filter
            function updateFilteredOrders(filterStatus) {
                const filteredOrders = ordersList.filter(order => 
                    filterStatus === 'all' || order.status.toLowerCase() === filterStatus.toLowerCase()
                );

                // Clear the container
                orderListContainer.innerHTML = '';

                if(filteredOrders.length === 0){
                    const noOrdersMessage = document.createElement('p');
                    noOrdersMessage.textContent = 'No orders found';
                    orderListContainer.appendChild(noOrdersMessage);
                }else{
                    // Render the filtered orders
                    filteredOrders.forEach(order => {
                        const orderElement = document.createElement('li');
                        orderElement.classList.add('oc-mob-createorder-view-list');
                        if(order.tableId === null){
                            orderElement.style.pointerEvents = 'none';
                        }
                        orderElement.innerHTML = `
                            <div class="oc-mob-createorder-view-list-left" style="${order.tableId === null ? 'display: none; pointer-events: none;' : ''}">
                                <span class="oc-mob-createorder-view-list-left-title">${order.tableId}</span>
                                <span class="oc-mob-createorder-view-list-left-subtitle"><i class="ri-user-fill"></i> ${order.capacity}</span>
                            </div>
                            <div class="oc-mob-createorder-view-list-right">
                                <span class="oc-mob-createorder-view-list-right-title">${order.orderId}</span>
                                <span class="oc-mob-createorder-view-list-right-subtitle">${order.itemQty} Items</span>
                            </div>
                            <div class="oc-mob-createorder-view-list-bottom">
                                <span class="${order.status.toLowerCase()}">${order.status}</span>
                            </div>`;
                        orderListContainer.appendChild(orderElement);

                        // Add click event to navigate to order summary
                        orderElement.addEventListener('click', function () {
                            initializeOrderSummary('./oc.mobile.createorder/impl/oc.mobile.ordersummary.view.html', createActionsViewOverlay, order);
                        });
                    });
                }
            }

            // Add event listeners to filter chips
            orderListFilterChips.forEach(chip => {
                chip.addEventListener('click', function () {
                    // Remove active class from all chips
                    orderListFilterChips.forEach(chip => chip.classList.remove('active'));
                    
                    // Add active class to the clicked chip
                    this.classList.add('active');

                    // Get the selected filter status from the clicked chip's id
                    const selectedFilter = this.id; // e.g., 'all', 'on-going', 'completed', etc.

                    // Update the displayed orders based on the selected filter
                    updateFilteredOrders(selectedFilter);
                });
            });

            // Initial render with the active filter chip
            const activeChip = document.querySelector('.oc-mob-createorder-view-form-filterChips span.active');
            const initialFilter = activeChip ? activeChip.id : 'all';
            updateFilteredOrders(initialFilter);
        }

        async function getCurrentOrderList() {
            let orderCollection = new OrdersCollectionFactory();
            let ordersList = [];
            const staffId = sessionStorage.getItem('staffId');
        
            try {
                const orders = await orderCollection.viewOrdersByStaffId(staffId); 
                orders.forEach(order => {
                    let orderData = {
                        tableId: null,
                        capacity: null,
                        orderId: null,
                        itemQty: null,
                        status: 'on-going',
                        menuItems: null,
                    };
                    
                    if(order != null) {
                        if(order.orderTable != null) {
                            orderData.tableId = order.orderTable.tableId ? order.orderTable.tableId : null;
                            orderData.capacity = order.orderTable.capacity ? order.orderTable.capacity : null;
                            orderData.orderId = order.orderId ? order.orderId : null;
                            orderData.itemQty = order.orderItemsno ? order.orderItemsno : null;
                            orderData.menuItems = order.orderItems ? order.orderItems : null;
                        }else{
                            orderData.status = 'completed';
                            orderData.orderId = order.orderId ? order.orderId : null;
                            orderData.itemQty = order.orderItemsno ? order.orderItemsno : null;
                            orderData.menuItems = order.orderItems ? order.orderItems : null;
                        }
                        
                    }
                    ordersList.push(orderData);
                });
            } catch (error) {
                ordersList = [];
                console.error('Error fetching orders:', error);
                sessionStorage.removeItem('sessionToken');
                window.location.reload();
            }
        
            return ordersList;
        }

         // Section: OrderSummary View Initialization
        async function initializeOrderSummary(path, overlayContainer, menuItems) {
                overlayContainer.classList.add('is-open');
                
                try {
                    const overlayText = await fetchOverlayContent(path);
                    overlayContainer.innerHTML = overlayText;

                    setupCloseOverlayButton(overlayContainer);
                    setupUpdateMenuOptions();
                    setupSummaryRenderFunction(overlayContainer, menuItems);
                    setupSliderFunctionality(overlayContainer);
                } catch (error) {
                    console.error(error);
                    
                }

            function setupCloseOverlayButton(overlayContainer) {
                const closeOverlayBtn = document.getElementById('close-overlay');
                if (!closeOverlayBtn) {
                    console.error('Close overlay button not found');
                    return;
                }

                closeOverlayBtn.addEventListener('click', () => {
                    overlayContainer.classList.remove('is-open');
                });
            }

            function setupUpdateMenuOptions(){
                const updateMenuOptionsBtn = document.getElementById('update-menuitems');
                updateMenuOptionsBtn.addEventListener('click', async function(){
                    const updateMenuOverlayText = await fetchOverlayContent('./oc.mobile.createorder/impl/oc.mobile.updateorder.form.html');
                    const overlayMenuContainer = document.querySelector('.oc-mob-createorderform-view-overlay');
                    overlayMenuContainer.innerHTML = updateMenuOverlayText;
                    overlayMenuContainer.classList.add('is-open');

                    setupCloseOverlayButton(overlayMenuContainer);
                    setupUpdateMenuFormView(overlayMenuContainer);
                });
            }

            function setupUpdateMenuFormView(overlayContainer){

            }

            async function updateOrderItems (orderId, orderPayload){

            }

            async function getUpdateMenuItems() {
                var menuCollection = new MenuCollection();
                let menuItems = [];
                try{
                    menuCollection.fetchAllMenuData().then((menuData) => {
                        menuData.forEach((menuItem) => {
                            let menu = {
                                id: menuItem.itemId,
                                name: menuItem.itemName,
                                image: menuItem.itemImage,
                            }
                            menuItems.push(menu);
                        });
                    }).catch((error) => {
                        console.error("Error fetching menu items:", error);
                        sessionStorage.removeItem('sessionToken');
                        window.location.reload();
                    });
    
                }catch(error){
                    console.error("Error fetching menu items:", error);
                    sessionStorage.removeItem('sessionToken');
                    window.location.reload();
                }
    
                return menuItems;
                
                // { id: 1, name: "Dosa", image: "https://www.cubesnjuliennes.com/wp-content/uploads/2023/10/Best-Crispy-Plain-Dosa-Recipe.jpg" },
            }

            function setupSummaryRenderFunction(overlayContainer, orders){
                const orderSummaryContainer = overlayContainer.querySelector('.oc-mob-ordersummary-view-order-lists');
                if (!orderSummaryContainer) {
                    console.error('Order summary container not found');
                }else{
                    orderSummaryContainer.innerHTML = '';
                    const orderTableNumber = overlayContainer.querySelector('.oc-mob-ordersummary-view-header-subtitle');
                    orderTableNumber.textContent = `Table ${orders.tableId}`;
                    orders.menuItems.forEach((menuItem) => {
                        const menuItemElement = document.createElement('li');
                        menuItemElement.classList.add('oc-mob-ordersummary-view-order-list');
                        menuItemElement.innerHTML = 
                        `<div class="oc-mob-ordersummary-view-order-list-img-container">
                            <img 
                                src=${menuItem.itemImage} 
                                alt="" 
                                class="oc-mob-ordersummary-view-order-list-item-img">
                        </div>
                        <div class="oc-mob-ordersummary-view-order-list-details">
                            <span class="oc-mob-ordersummary-view-order-list-item-name">${menuItem.itemName}</span>
                            <span class="oc-mob-ordersummary-view-order-list-item-count">${menuItem.itemQty}</span>
                        </div>`

                        orderSummaryContainer.appendChild(menuItemElement);
                    });
                }
            }

            async function fetchOverlayContent(path) {
                const response = await fetch(path);
                return await response.text();
            }

            function setupSliderFunctionality(overlayContainer) {
                const swipeBtn = document.querySelector('.oc-mob-ordersummary-view-sliderBtn span');
                const sliderBtn = document.querySelector('.oc-mob-ordersummary-view-sliderBtn');
                const swipeBtnContainer = document.querySelector('.oc-mob-ordersummary-view-sliderBtns');

                if (!swipeBtn || !sliderBtn || !swipeBtnContainer) {
                    console.error('Slider elements not found');
                    return;
                }

                let isDragging = false;
                let startX = 0;
                let currentX = 0;
                let sliderWidth = 0;

                const startDrag = (e) => {
                    isDragging = true;
                    startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
                    sliderWidth = sliderBtn.offsetWidth - swipeBtn.offsetWidth;
                };

                const moveDrag = (e) => {
                    if (!isDragging) return;
                    currentX = e.type === 'mousemove' ? e.clientX - startX : e.touches[0].clientX - startX;
                    currentX = Math.min(Math.max(0, currentX), sliderWidth);
                    requestAnimationFrame(() => {
                        swipeBtn.style.transform = `translateX(${currentX}px)`;
                    });
                };

                const endDrag = () => {
                    if (!isDragging) return;
                    isDragging = false;

                    if (currentX >= sliderWidth - 10) {
                        completeCheckout(swipeBtn, swipeBtnContainer, sliderBtn, overlayContainer);
                    } else {
                        resetSwipeButton(swipeBtn);
                    }
                };

                addSliderEventListeners(sliderBtn, startDrag, moveDrag, endDrag);
            }

            function addSliderEventListeners(sliderBtn, startDrag, moveDrag, endDrag) {
                sliderBtn.addEventListener('mousedown', startDrag);
                sliderBtn.addEventListener('mousemove', moveDrag);
                sliderBtn.addEventListener('mouseup', endDrag);
                sliderBtn.addEventListener('mouseleave', endDrag);

                sliderBtn.addEventListener('touchstart', startDrag);
                sliderBtn.addEventListener('touchmove', moveDrag);
                sliderBtn.addEventListener('touchend', endDrag);
            }

            function completeCheckout(swipeBtn, swipeBtnContainer, sliderBtn, overlayContainer) {
                const sliderWidth = sliderBtn.offsetWidth - swipeBtn.offsetWidth;
                swipeBtn.style.transform = `translateX(${sliderWidth}px)`;
                swipeBtnContainer.innerHTML = `
                    <button class="oc-mob-ordersummary-view-sliderBtn placed-order">Order Completed 
                        <span id="swipe-btn">
                            <i class="ri-check-double-fill"></i>
                        </span>
                    </button>
                `;

                removeSliderEventListeners(sliderBtn);
                let tableId = overlayContainer.querySelector('.oc-mob-ordersummary-view-header-subtitle').textContent.toString().split(" ")[1].trim();
                let orderCollection = new OrdersCollectionFactory();
                orderCollection.unFreezeSelectedTables(tableId);
                setTimeout(() => {
                    overlayContainer.classList.remove('is-open');
                }, 2000);
                initializeOrderRenderList();
            }

            function resetSwipeButton(swipeBtn) {
                swipeBtn.style.transform = 'translateX(0px)';
            }

            function removeSliderEventListeners(sliderBtn) {
                sliderBtn.replaceWith(sliderBtn.cloneNode(true)); // Removes all event listeners
            }
        }    
    }

    function loadCreateActionsView (createActionsView) {
        const overlayContainer = document.querySelector('.oc-mob-createorderactions-view-overlay');
        overlayContainer.classList.add('is-open');
        overlayContainer.innerHTML = createActionsView;
        setupTabFunctionality();
        setupOverlayButtonActions();
        const closeOverlayBtn = document.getElementById('closeactions-overlay');
        closeOverlayBtn.addEventListener('click', function(){
            overlayContainer.classList.remove('is-open');
        });
    }


    function setupTabFunctionality() {
            const overlayTabs = document.querySelectorAll('.oc-mob-createorder-view-form-tab');

            overlayTabs.forEach(tab => {
                tab.addEventListener('click', function () {
                    overlayTabs.forEach(t => t.classList.remove('active-tab'));
                    tab.classList.add('active-tab');
                    orderPayload.orderType = tab.textContent;
                });
            });
    }

    function setupOverlayButtonActions() {
            const overlayBtns = document.querySelectorAll('.oc-mob-createorder-view-form-btn');
            const overlayContainer = document.querySelector('.oc-mob-createorder-view-overlay');

            overlayBtns.forEach(btn => {
                btn.addEventListener('click', function(){
                    const btnId = btn.id;
                    switch(btnId){
                        case 'oc-table':
                            initializeTableView('./oc.mobile.createorder/impl/oc.mobile.tables.view.html', overlayContainer);
                            break;
                        case 'oc-menu':
                            initializeViewMenu('./oc.mobile.createorder/impl/oc.mobile.sm-menu.view.html', overlayContainer);
                            break;
                    }
                })
            });
    }

    // Section: Table View Initialization
    async function initializeTableView(path, overlayContainer){
            overlayContainer.classList.add('is-open');
            freezeAllTablesTemporarily();
            try{
                const response = await fetch(path);
                overlayContainer.innerHTML = await response.text();
                waitForElement('#close-overlay', () => {
                    setupTableViewInteractions(overlayContainer);
                });
                waitForElement('.oc-mob-tables-view-4mtable', () => {
                    setupTableViewInteractions(overlayContainer);
                });
                getAllTables();
            }catch(error){
                console.error(error);
                sessionStorage.removeItem('sessionToken');
                window.location.reload();
            }


        // Updated to freeze all tables temporarily
        function freezeAllTablesTemporarily() {
            const tableSelectors = ['.oc-mob-tables-view-4mtable', '.oc-mob-tables-view-6mtable', '.oc-mob-tables-view-pmtable'];
            tableSelectors.forEach(selector => {
                const tables = document.querySelectorAll(selector);
                tables.forEach(table => {
                    table.classList.add('is-frozen-temp'); // Temporary frozen state
                    table.style.pointerEvents = 'none';
                    table.style.cursor = 'wait';
                    table.style.backgroundColor = '#ffe6e6';
                });
            });
        }

        // Waits for the element to load : Common Implementation
        function waitForElement(selector, callback) {
            const interval = setInterval(() => {
                if (document.querySelector(selector)) {
                    clearInterval(interval);
                    callback();
                }
            }, 100);
        }

        // Fetchs all tables from the Backend / Server
        async function getAllTables() {
            try {
                const orderCollection = new OrdersCollectionFactory();
                const response = await orderCollection.viewSelectedTables();

                response.forEach((table) => {
                    const tableSelector = getTableSelector(table.capacity);
                    const tableElements = document.querySelectorAll(`${tableSelector}`);

                    tableElements.forEach((tableElement) => {
                        if (tableElement.id === table.tableId) {
                            tableElement.classList.remove('is-frozen-temp');
                            tableElement.classList.add('is-frozen');
                            tableElement.style.pointerEvents = 'default';
                            tableElement.style.backgroundColor = '#ffcccc';
                        }
                    });

                    const frozenTableElements = document.querySelectorAll(`${tableSelector}.is-frozen`);

                    frozenTableElements.forEach((frozenTable) => {
                        frozenTable.addEventListener('click', () => handleFrozenTableClick(frozenTable));
                    });
                });
            } catch (error) {
                console.error(error);
                sessionStorage.removeItem('sessionToken');
                window.location.reload();
            }
        }

        function handleFrozenTableClick(frozenTable) {
            frozenTable.classList.remove('is-frozen');
            frozenTable.classList.add('is-selected');
            frozenTable.style.pointerEvents = 'default';
            frozenTable.style.backgroundColor = 'lightgray';

            const freezeBtn = document.getElementById('reserve-btn');
            const unfreezeBtn = document.getElementById('unfreeze-btn');

            unfreezeBtn.style.display = 'block';
            freezeBtn.style.display = 'none';

            unfreezeBtn.addEventListener('click', () => handleUnfreeze(frozenTable, freezeBtn, unfreezeBtn));
        }

        async function handleUnfreeze(table, freezeBtn, unfreezeBtn) {
            table.classList.remove('is-selected');
            table.style.backgroundColor = '#ffffff';
            unfreezeBtn.style.display = 'none';
            freezeBtn.style.display = 'block';
            let orderCollection = new OrdersCollectionFactory();
            orderCollection.unFreezeSelectedTables(table.id);
        }


        // Returns the selector for the table based on the capacity
        function getTableSelector(capacity) {
            switch (capacity) {
                case 4:
                    return '.oc-mob-tables-view-4mtable';
                case 6:
                    return '.oc-mob-tables-view-6mtable';
                case 8:
                    return '.oc-mob-tables-view-pmtable';
                default:
                    return '';
            }
        }

        // Setups the Table View Interactions
        function setupTableViewInteractions(overlayContainer){
            const closeOverlayBtn = document.getElementById('close-overlay');
            const reserveBtn = document.getElementById('reserve-btn');
            closeOverlayBtn.addEventListener('click', () => overlayContainer.classList.remove('is-open'));
            setupTableSelection();
            setupFloorChipsAndFormations();
            setupReserveAction(reserveBtn, overlayContainer);
        }

        // Setups the Table Selection
        function setupTableSelection(){
            const tableSelectors = ['.oc-mob-tables-view-4mtable', '.oc-mob-tables-view-6mtable', '.oc-mob-tables-view-pmtable'];

            tableSelectors.forEach(selector => {
                const tables = document.querySelectorAll(selector);
                tables.forEach(table => {
                    table.addEventListener('click', () => {
                        document.querySelectorAll('.is-selected').forEach(selectedTable => selectedTable.classList.remove('is-selected'));
                        table.classList.add('is-selected');
                    });
                });
            });
            
        }

        // Setups the FloorChips Formation
        function setupFloorChipsAndFormations() {
            const floorChips = document.querySelectorAll('.oc-mob-tables-view-container-floorchip');
            const tableFormations = document.querySelectorAll('.oc-mob-tables-view-container-table-formation');

            floorChips.forEach((chip, index) => {
                chip.addEventListener('click', () => {
                    floorChips.forEach(c => c.classList.remove('active-chip'));
                    chip.classList.add('active-chip');

                    tableFormations.forEach(f => f.style.display = 'none');
                    tableFormations[index].style.display = 'grid';
                });
            });

            floorChips[0].classList.add('active-chip');
            tableFormations.forEach((formation, index) => {
                formation.style.display = index === 0 ? 'grid' : 'none';
            });
        }

        // Setups Reserve Actions Btn
        function setupReserveAction(reserveBtn, overlayContainer) {
            reserveBtn.replaceWith(reserveBtn.cloneNode(true));
            reserveBtn = document.getElementById('reserve-btn');
            
            reserveBtn.addEventListener('click', () => {

                const selectedTable = document.querySelector('.is-selected');
                if (selectedTable) {
                    if (selectedTable.classList.contains('oc-mob-tables-view-4mtable')) {
                        orderPayload.orderTable = {tableId: `GF:0${selectedTable.querySelector('span').innerText}`,status: "Occupied", floor: "Ground Floor", capacity: 4};
                    } else if (selectedTable.classList.contains('oc-mob-tables-view-6mtable')) {
                        orderPayload.orderTable = {tableId: `FF:0${selectedTable.querySelector('span').innerText}`, status: "Occupied", floor: "1st Floor", capacity: 6};
                    } else if (selectedTable.classList.contains('oc-mob-tables-view-pmtable')) {
                        orderPayload.orderTable = {tableId: `SF:0${selectedTable.querySelector('span').innerText}`, status: "Occupied", floor: "2nd Floor", capacity: 8};
                    }
                }
                console.log(orderPayload);
                overlayContainer.classList.remove('is-open');
                document.querySelectorAll('.is-selected').forEach(table => table.classList.remove('is-selected'));
            });
        }
    }

    // Section: Table View Initialization Ends

    // Section: Menu View Initialization
    async function initializeViewMenu(path, overlayContainer) {
            if(orderPayload.orderTable === undefined){
                alert('Select Table First');
            }else{
                overlayContainer.classList.add('is-open');

                try {
                    const overlayText = await fetchOverlayContent(path);
                    overlayContainer.innerHTML = overlayText;
                    if(orderPayload.orderTable !== undefined){
                        document.querySelector('.oc-mob-overlay-view-container-header-table').textContent = `Table : ${orderPayload.orderTable.tableId}`;
                        document.querySelector('.oc-mob-overlay-view-container-header-persons').innerHTML = `<i class='bx bxs-user'></i> ${orderPayload.orderTable.capacity}`;
                    }else{
                        document.querySelector('.oc-mob-overlay-view-container-header-table').textContent = 0;
                        document.querySelector('.oc-mob-overlay-view-container-header-persons').innerHTML = `<i class='bx bxs-user'></i>`;
                    }

                    const menuItems = await getMenuItems();
                    let currentOrders = [];

                    setupOverlayCloseButton(overlayContainer);
                    setupSearchFunctionality(menuItems, currentOrders);

                    renderSearchResults(menuItems, currentOrders);
                    renderCurrentOrder(currentOrders);
                } catch (error) {
                    console.error("Error initializing menu view:", error);
                }
            }

            // Fetchs the Overlay Content
        async function fetchOverlayContent(path) {
            const response = await fetch(path);
            return await response.text();
        }

        // todo: Menu Items needed to be fetched from server
        async function getMenuItems() {
            var menuCollection = new MenuCollection();
            let menuItems = [];
            try{
                menuCollection.fetchAllMenuData().then((menuData) => {
                    menuData.forEach((menuItem) => {
                        let menu = {
                            id: menuItem.itemId,
                            name: menuItem.itemName,
                            image: menuItem.itemImage,
                        }
                        menuItems.push(menu);
                    });
                }).catch((error) => {
                    console.error("Error fetching menu items:", error);
                });

            }catch(error){
                console.error("Error fetching menu items:", error);
            }

            return menuItems;
            
            // { id: 1, name: "Dosa", image: "https://www.cubesnjuliennes.com/wp-content/uploads/2023/10/Best-Crispy-Plain-Dosa-Recipe.jpg" },
        }

        // Function to Close the Overlay
        function setupOverlayCloseButton(overlayContainer) {
            const closeOverlayBtn = document.getElementById('close-overlay');
            closeOverlayBtn.addEventListener('click', () => {
                overlayContainer.classList.remove('is-open');
            });
        }

        // Search Functionality
        function setupSearchFunctionality(menuItems, currentOrders) {
            const searchInput = document.querySelector('.oc-mob-overlay-view-container-input');
            const currentOrderContainer = document.querySelector('.oc-mob-overlay-view-container-grp-menu');

            searchInput.addEventListener('input', (event) => {
                const query = event.target.value;
                currentOrderContainer.classList.add('oc-mob-display-hidden');

                const filteredItems = menuItems.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
                renderSearchResults(filteredItems, currentOrders);
                // resultsContainer.classList.add('oc-mob-display-hidden');
            });
        }

        // Function to Render Search Results
        function renderSearchResults(items, currentOrders) {
            const resultsContainer = document.querySelector('.oc-mob-overlay-view-search-container-results-list');
            resultsContainer.innerHTML = items.length === 0
                ? '<h2 class="oc-mob-overlay-view-search-container-emptyresults">Item Not Found</h2>'
                : '';

            items.forEach(item => {
                const resultItem = document.createElement('li');
                resultItem.innerHTML = ` 
                    <div class="oc-mob-overlay-view-search-container-img">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="oc-mob-overlay-view-search-container-context">
                        <span class="oc-mob-overlay-view-search-container-context-title">${item.name}</span>
                        <span class="oc-mob-overlay-view-search-container-addtocart" id="addtocart-${item.id}"> Add to Cart</span>
                    </div>`;
                resultsContainer.appendChild(resultItem);

                document.getElementById(`addtocart-${item.id}`).addEventListener('click', () => {
                    addToCart(item, currentOrders);
                    resultsContainer.style.display = 'none';
                });
            });
        }

        // Function to Add to Cart
        function addToCart(itemData, currentOrders) {
            const existingItem = currentOrders.find(orderItem => orderItem.id === itemData.id);

            if (!existingItem) {
                currentOrders.push({ ...itemData, count: 1 });
            } else {
                existingItem.count += 1;
            }

            renderCurrentOrder(currentOrders);
        }

        // Renders Current Orders
        function renderCurrentOrder(currentOrders) {
            const currentOrderContainer = document.querySelector('.oc-mob-overlay-view-container-grp-menu');
            const resultsContainer = document.querySelector('.oc-mob-overlay-view-search-container-results-list');

            if (currentOrders.length === 0) {
                currentOrderContainer.classList.add('oc-mob-display-hidden');
                resultsContainer.innerHTML = '<h2 class="oc-mob-overlay-view-search-container-emptyresults">Nothing in the cart..., Search anything in menu</h2>';
                return;
            }

            currentOrderContainer.classList.remove('oc-mob-display-hidden');
            currentOrderContainer.innerHTML = '';

            currentOrders.forEach(orderItem => {
                const orderElement = document.createElement('div');
                orderElement.classList.add('oc-mob-overlay-view-container-item-menu');
                orderElement.innerHTML = `
                    <div class="oc-mob-overlay-view-container-item-menu-input">
                        <input type="checkbox" class="oc-mob-overlay-view-container-item-menu-checkbox">
                    </div>
                    <div class="oc-mob-overlay-view-container-item-menu-content">
                        <div class="oc-mob-overlay-view-container-item-menu-content-img">
                            <img src="${orderItem.image}" alt="">
                        </div>
                        <div class="oc-mob-overlay-view-container-item-menu-content-context">
                            <span class="oc-mob-overlay-view-container-item-menu-content-context-title">${orderItem.name}</span>
                            <div class="oc-mob-overlay-view-container-item-menu-content-context-span">
                                <span id="decrement-${orderItem.id}"><i class="ri-subtract-line"></i></span>
                                <span id="count-${orderItem.id}">${orderItem.count}</span>
                                <span id="increment-${orderItem.id}"><i class="ri-add-line"></i></span>
                            </div>
                        </div>
                    </div>`;

                currentOrderContainer.appendChild(orderElement);

                document.getElementById(`increment-${orderItem.id}`).addEventListener('click', () => {
                    orderItem.count += 1;
                    document.getElementById(`count-${orderItem.id}`).textContent = orderItem.count;
                });

                document.getElementById(`decrement-${orderItem.id}`).addEventListener('click', () => {
                    if (orderItem.count > 1) {
                        orderItem.count -= 1;
                        document.getElementById(`count-${orderItem.id}`).textContent = orderItem.count;
                    } else {
                        currentOrders.splice(currentOrders.indexOf(orderItem), 1);
                        renderCurrentOrder(currentOrders);
                    }
                });
            });

            if(currentOrders.length !== 0){
                setupOrderButton(overlayContainer, currentOrders);
            }
        }

        // Function to Setup Order Btn
        function setupOrderButton(overlayContainer, currentOrders) {
            const orderButton = document.querySelector('.oc-mob-overlay-view-btn');
            orderButton.addEventListener('click',  () => {
                createOrder(currentOrders);
            });
        }

        async function createOrder(currentOrders){
            console.log("Order Created");
            try{
                const orderCollection = new OrdersCollectionFactory();
                const responseData = await orderCollection.getLastOrderId();
                if(responseData.orderid){
                    let orderId = (responseData.orderid).match(/\d+/);
                    console.log(orderId);
                    if(orderId){
                        let updatedId = parseInt(orderId[0], 10) + 1;
                        let newOrderId = (responseData.orderid).replace(orderId[0], updatedId.toString().padStart(orderId[0].length, '0')); 
                        orderPayload.orderId = newOrderId;
                    }else{
                        orderPayload.orderId = '#OC001';
                    }
                    orderPayload.orderStatus = "In Progress";
                    orderPayload.orderMessage = "In Progress";
                    orderPayload.orderItemsno = currentOrders.length;
                    let orderItems = [];
                    currentOrders.forEach( (order) =>{
                        let orderItem = {
                            itemId: order.id,
                            itemName: order.name,
                            itemQty: order.count,
                            itemImage: order.image,
                            itemStatus: "In Progress"
                        }
                        orderItems.push(orderItem);
                    });
                    orderPayload.orderItems = orderItems;
                    console.log(orderPayload);
                    const response = orderCollection.createOrder(orderPayload);
                    overlayContainer.classList.remove('is-open');
                    document.querySelector('.oc-mob-createorderactions-view-overlay').remove('is-open');
                    console.log(response);
                    initializeOrderRenderList();
                } 
            }catch(error){
                console.error(error);
            }

        }
    }
   
    
}

initializeCreateOrderPage();


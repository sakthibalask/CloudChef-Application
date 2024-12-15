function initailDesktopOrders(){
    const orderLine = [
        {
            orderId: "#OC010",
            staffId: "FC001",
            orderType: "Dine In",
            orderTable: "Table 2",
            orderStatus: "Ready",
            orderMessage: "Ready to serve",
            orderItemsNo: 5,
            orderitemData: [
                { itemId: "#FC001", itemName: "South Indian Briyani", itemQuantity: 1, itemStatus: "Ready" },
                { itemId: "#FC002", itemName: "Chicken 65 Boneless", itemQuantity: 1, itemStatus: "Ready" },
                { itemId: "#FC003", itemName: "Bread Halwa", itemQuantity: 1, itemStatus: "Ready" },
                { itemId: "#FC004", itemName: "Tandoori Roti", itemQuantity: 4, itemStatus: "Ready" },
                { itemId: "#FC005", itemName: "Butter Chicken", itemQuantity: 1, itemStatus: "Ready" },
            ]
        },
        {
            orderId: "#OC020",
            staffId: "FC002",
            orderType: "Dine In",
            orderTable: "Table 5",
            orderStatus: "Cooking",
            orderMessage: "Preparing",
            orderItemsNo: 4,
            orderitemData: [
                { itemId: "#FC001", itemName: "South Indian Briyani", itemQuantity: 1, itemStatus: "Ready" },
                { itemId: "#FC002", itemName: "Chicken 65 Boneless", itemQuantity: 1, itemStatus: "Ready" },
                { itemId: "#FC003", itemName: "Bread Halwa", itemQuantity: 1, itemStatus: "Preparing" },
                { itemId: "#FC004", itemName: "Butter Chicken", itemQuantity: 1, itemStatus: "Preparing" },
            ]
        },
        {
            orderId: "#OC030",
            staffId: "FC003",
            orderType: "Take Away",
            orderTable: "Table 8",
            orderStatus: "Cooking",
            orderMessage: "Preparing",
            orderItemsNo: 4,
            orderitemData: [
                { itemId: "#FC001", itemName: "South Indian Briyani", itemQuantity: 1, itemStatus: "Ready" },
                { itemId: "#FC002", itemName: "Chicken 65 Boneless", itemQuantity: 1, itemStatus: "Ready" },
                { itemId: "#FC003", itemName: "Bread Halwa", itemQuantity: 1, itemStatus: "Preparing" },
                { itemId: "#FC004", itemName: "Butter Chicken", itemQuantity: 1, itemStatus: "Preparing" },
            ]
        },
        {
            orderId: "#OC040",
            staffId: "FC010",
            orderType: "Dine In",
            orderTable: "Table 12",
            orderStatus: "Ready",
            orderMessage: "Ready to serve",
            orderItemsNo: 2,
            orderitemData: [
                { itemId: "#FC001", itemName: "South Indian Briyani", itemQuantity: 1, itemStatus: "Ready" },
                { itemId: "#FC002", itemName: "Chicken 65 Boneless", itemQuantity: 1, itemStatus: "Ready" },
            ]
        },
    ];

    const filterChips = document.querySelectorAll('.oc-desk-orders-view-container-header-chips span');
    const ordersContainer = document.querySelector('.oc-desk-orders-view-container-main-orders');
    const searchInput = document.querySelector('.oc-desk-orders-view-container-header-actions-input');

    const profileBtn = document.querySelector('.oc-desk-orders-view-header-profile');
    const profileModal = document.querySelector('.oc-desk-orders-view-header-profile-container');

    profileBtn.addEventListener('click', function(){
        profileModal.classList.toggle('is-open');

        const logoutBtn = document.getElementById('chef-logout');
        logoutBtn.addEventListener('click', function(){
            sessionStorage.removeItem('sessionToken');
            const currentUrl = new URL(window.location.href);
            currentUrl.hash = "authenticate";
            window.history.replaceState(null, '', currentUrl.href);
            window.location.reload();
        });
    });

    if(ordersContainer){
        // Function to render orders dynamically
        function renderOrders(filteredOrders) {
            // Clear the existing orders
            ordersContainer.innerHTML = '';
            
            // Add each order to the container
            filteredOrders.forEach(order => {
                const orderElement = document.createElement('li');
                orderElement.classList.add('oc-desk-orders-view-container-main-order');
                orderElement.innerHTML = 
                    `   <div class="oc-desk-orders-view-container-main-order-header">
                            <div class="oc-desk-orders-view-container-main-order-header-left">
                                <span>Order ${order.orderId}</span>
                                <span>${order.orderType} - ${order.orderTable}</span>
                            </div>
                            <div class="oc-desk-orders-view-container-main-order-header-right">
                                <span class="status-${order.orderStatus.toLowerCase() === 'ready' ? 'ready' : 'progress'}">${order.orderStatus}</span>
                                <span class="status-${order.orderStatus.toLowerCase() === 'ready' ? 'serve' : 'preparing'}">${order.orderMessage}</span>
                            </div>
                        </div>
                        <div class="oc-desk-orders-view-container-main-order-footer">
                            <div class="oc-desk-orders-view-container-main-order-footer-btns">
                                <button class="oc-desk-orders-view-container-main-order-footer-item-btn">${order.orderItemsNo} Items <i class="ri-expand-diagonal-line"></i></button>
                                <button class="oc-desk-orders-view-container-main-order-footer-btn">It's Done <i class="ri-flashlight-line"></i></button>
                            </div>
                        </div>`;
                ordersContainer.appendChild(orderElement);

                const orderItemBtn = orderElement.querySelector('.oc-desk-orders-view-container-main-order-footer-item-btn');

                orderItemBtn.addEventListener('click', function(){
                    loadDesktopItemOverlay(order);
                });
            });
        }

        // Initial rendering of all orders
        renderOrders(orderLine);

        // Filter functionality for chips
        filterChips.forEach(filter => {
            filter.addEventListener('click', () => {
                filterChips.forEach(filter => filter.classList.remove('active-chips'));
                filter.classList.add('active-chips');
                const filterValue = filter.textContent.trim();
                
                // Filter orders based on the clicked chip
                const filteredOrders = filterValue === 'All'
                    ? orderLine  // If 'All' is selected, display all orders
                    : orderLine.filter(order => order.orderStatus.toLowerCase() === filterValue.toLowerCase());
                
                // Render the filtered orders
                renderOrders(filteredOrders);
            });
        });

        // Search functionality
        searchInput.addEventListener('input', function(event) {
            const searchTerm = event.target.value.toLowerCase();
            
            // Filter orders based on the search term
            const filteredOrders = orderLine.filter(order => {
                return order.orderId.toLowerCase().includes(searchTerm) ||
                    order.staffId.toLowerCase().includes(searchTerm) ||
                    order.orderType.toLowerCase().includes(searchTerm) ||
                    order.orderTable.toLowerCase().includes(searchTerm) ||
                    order.orderMessage.toLowerCase().includes(searchTerm);
            });
            
            // Render the filtered orders
            renderOrders(filteredOrders);
        });

        async function loadDesktopItemOverlay(order){
            const itemOverlay = document.querySelector('.oc-desk-orders-view-container-main-items-overlay');
            itemOverlay.classList.add('is-open');

            try{
                const response = await fetch('./oc.desktop.orders/impl/oc.desktop.orderitem.overlay.html');
                let overlayContent = await response.text();

                overlayContent = overlayContent
                        .replace('{{orderId}}', order.orderId || '')
                        .replace('{{staffId}}', order.staffId || 'N/A')
                        .replace('{{orderTable}}', order.orderTable || 'N/A')
                        .replace('{{orderMessage}}', order.orderMessage || 'N/A')
                        .replace('{{orderStatus}}', order.orderStatus.toLowerCase() || 'N/A')
                        .replace('{{orderType}}', order.orderType || 'N/A');

                itemOverlay.innerHTML = overlayContent;

                const itemContainer = document.querySelector('.oc-desk-orderitem-overlay-view-container-items-lists');

                order.orderitemData.forEach(item => {
                    const itemElement = document.createElement('li');
                    itemElement.classList.add('oc-desk-orderitem-overlay-view-container-item');
                    itemElement.innerHTML = 
                        `${item.itemStatus.toLowerCase() === 'preparing' 
                            ? `<label for="">
                                    <input type="checkbox" name="" id="">
                                    <span class="oc-desk-orderitem-overlay-view-container-item-id">${item.itemId}</span>
                                </label>`
                            : `<span class="oc-desk-orderitem-overlay-view-container-item-id">${item.itemId}</span>`}
                        
                        <div>
                            <span class="oc-desk-orderitem-overlay-view-container-item-name">${item.itemName}</span>
                            <span class="oc-desk-orderitem-overlay-view-container-item-qty">Qty: ${item.itemQuantity}</span>
                        </div>
                        <span class="oc-desk-orderitem-overlay-view-container-item-status status-${item.itemStatus.toLowerCase()}">
                            ${item.itemStatus.toLowerCase() === 'ready' 
                                ? '<i class="ri-check-double-line"></i>' 
                                : '<i class="ri-timer-line"></i>'}
                        </span>`;

                    itemContainer.appendChild(itemElement);
                    const baselineElement = document.createElement('span');
                    baselineElement.classList.add('oc-desk-orderitem-overlay-view-container-item-baseline');
                    itemContainer.appendChild(baselineElement);
                });

                if(order.orderStatus.toLowerCase() === 'cooking'){
                    const statusBtn = document.querySelector('.oc-desk-orderitem-overlay-view-container-main-btn');
                    statusBtn.textContent = 'Ready to Serve'
                }else{
                    const statusBtn = document.querySelector('.oc-desk-orderitem-overlay-view-container-main-btns');
                    statusBtn.style.display = 'none';
                }

                const closeBtn = document.getElementById('close-overlay');
                closeBtn.addEventListener('click', function(){
                    itemOverlay.classList.remove('is-open');
                });
            } catch (err) {
                console.error(err);
            }
        }
    }
}

initailDesktopOrders();

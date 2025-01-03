function initializeOrdersPage() {
    const orders = [
        {
            table: "Table 3",
            items: 3,
            orderId: "#OC001",
            status: "Cancelled",
        },
        {
            table: "Table 2",
            items: 5,
            orderId: "#OC010",
            status: "Ready",
            
        },
        {
            table: "Table 5",
            items: 7,
            orderId: "#OC021",
            status: "In-Progress",
            
        },
        {
            table: "Table 5",
            items: 2,
            orderId: "#OC022",
            status: "In-Progress",
        },
        {
            table: "Table 10",
            items: 8,
            orderId: "#OC030",
            status: "Completed",
        }
    ];

    const ordersData = [
        {
            orderId: "#OC001",
            table: "Table 3",
            itemNo: 3,
            items: [
                {
                    itemName: "Masala Dosa",
                    itemStatus: "Cancelled"
                },
                {
                    itemName: "Filter Coffee",
                    itemStatus: "Cancelled"
                },
                {
                    itemName: "Medu Vada",
                    itemStatus: "Cancelled"
                }
            ],
            status: "Cancelled",
        },
        {
            orderId: "#OC022",
            table: "Table 5",
            itemNo: 2,
            items: [
                {
                    itemName: "Masala Dosa",
                    itemStatus: "Ready"
                },
                {
                    itemName: "Medu Vada",
                    itemStatus: "Preparing"
                }
            ],
            status: "In-Progress",
        },
        {
            orderId: "#OC010",
            table: "Table 2",
            itemNo: 5,
            items: [
                {
                    itemName: "South Indian Briyani",
                    itemStatus: "Ready"
                },
                {
                    itemName: "Chicken 65 Boneless",
                    itemStatus: "Ready"
                },
                {
                    itemName: "Bread Halwa",
                    itemStatus: "Ready"
                },
                {
                    itemName: "Tandoori Roti",
                    itemStatus: "Ready"
                },
                {
                    itemName: "Butter Chicken",
                    itemStatus: "Ready"
                }
            ],
            status: "Ready",
        },
        {
            orderId: "#OC021",
            table: "Table 5",
            itemNo: 7,
            items: [
                {
                    itemName: "South Indian Briyani",
                    itemStatus: "Ready"
                },
                {
                    itemName: "Chicken 65 Boneless",
                    itemStatus: "Ready"
                },
                {
                    itemName: "Bread Halwa",
                    itemStatus: "Ready"
                },
                {
                    itemName: "Chicken Tikka",
                    itemStatus: "Ready"
                },
                {
                    itemName: "Ghee Rice",
                    itemStatus: "Ready"
                },
                {
                    itemName: "Papad",
                    itemStatus: "Preparing"
                },
                {
                    itemName: "Guleb Jamun (2pcs)",
                    itemStatus: "Preparing"
                }
            ],
            status: "In-Progress",
        },
        {
            orderId: "#OC030",
            table: "Table 10",
            itemNo: 8,
            items: [
                {
                    itemName: "Paneer Butter Masala",
                    itemStatus: "Done"
                },
                {
                    itemName: "Dal Tadka",
                    itemStatus: "Done"
                },
                {
                    itemName: "Jeera Rice",
                    itemStatus: "Done"
                },
                {
                    itemName: "Tandoori Roti",
                    itemStatus: "Done"
                },
                {
                    itemName: "Mixed Veg Curry",
                    itemStatus: "Done"
                },
                {
                    itemName: "Curd Rice",
                    itemStatus: "Done"
                },
                {
                    itemName: "Papad",
                    itemStatus: "Done"
                },
                {
                    itemName: "Rasgulla (2pcs)",
                    itemStatus: "Done"
                }
            ],
            status: "Completed",
        }
    ];
    

    const orderListContainer = document.querySelector('.oc-mob-orders-lists');
    const orderDetailsOverlay = document.querySelector('.oc-mob-orders-view-overlay');
    const searchInput = document.querySelector('.oc-mob-orders-search-input');

    // Populate the orders dynamically
    function populateOrders(filter) {
        const filteredOrders = orders.filter(order =>
            filter === 'all' || order.status.toLowerCase().includes(filter)
        );

        // Clear and re-populate the orders based on the filter
        orderListContainer.innerHTML = '';
        filteredOrders.forEach(order => {
            const orderCard = document.createElement('li');
            orderCard.className = 'oc-mob-orders-card';
            orderCard.innerHTML = `
                <div class="oc-mob-orders-headers">
                    <div class="oc-mob-orders-header-details-left">
                        <h3 class="oc-mob-orders-table">${order.table}</h3>
                        <span class="oc-mob-orders-items">${order.items} items</span>
                    </div>
                    <div class="oc-mob-orders-header-details-right">
                        <h3 class="oc-mob-orders-orderId">${order.orderId}</h3>
                    </div>
                </div>
                <div class="oc-mob-orders-status status-${order.status.toLowerCase()}">${order.status}</div>
            `;
            orderListContainer.appendChild(orderCard);

            orderCard.addEventListener('click', () => showOrdersData(order));
        });

        searchInput.addEventListener('input', function(event){
            const searchQuery = event.target.value.toLowerCase();
    
            const filteredOrders = orders.filter(order => 
                order.orderId.toLowerCase().includes(searchQuery) || order.table.toLowerCase().includes(searchQuery)
            );
    
            orderListContainer.innerHTML = '';
            filteredOrders.forEach(order => {
                const orderCard = document.createElement('li');
                orderCard.className = 'oc-mob-orders-card';
                orderCard.innerHTML = `
                    <div class="oc-mob-orders-headers">
                        <div class="oc-mob-orders-header-details-left">
                            <h3 class="oc-mob-orders-table">${order.table}</h3>
                            <span class="oc-mob-orders-items">${order.items} items</span>
                        </div>
                        <div class="oc-mob-orders-header-details-right">
                            <h3 class="oc-mob-orders-orderId">${order.orderId}</h3>
                        </div>
                    </div>
                    <div class="oc-mob-orders-status status-${order.status.toLowerCase()}">${order.status}</div>
                `;
                orderListContainer.appendChild(orderCard);
        
                orderCard.addEventListener('click', () =>showOrdersData(order));
            });
        });

        async function showOrdersData(order) {
            orderDetailsOverlay.classList.add('is-open'); // Open the overlay
            try {
                // Fetch and inject the overlay HTML
                const response = await fetch('./oc.mobile.orders/impl/oc.mobile.orders.view.overlay.html');
                const orderOverlayTemplate = await response.text();
                orderDetailsOverlay.innerHTML = orderOverlayTemplate;
        
                // Populate the overlay with order details
                const orderDetails = ordersData.find(data => data.orderId === order.orderId);
        
                if (orderDetails) {
                    // Set header details
                    document.querySelector('.oc-mob-orders-view-overlay-title').textContent = orderDetails.orderId;
                    document.querySelector('.oc-mob-orders-view-overlay-view-header-title').textContent = orderDetails.table;
                    document.querySelector('.oc-mob-orders-view-overlay-view-status').textContent = orderDetails.status;
                    document.querySelector('.oc-mob-orders-view-overlay-view-status').className = `oc-mob-orders-view-overlay-view-status status-${orderDetails.status.toLowerCase().replace(/ /g, '')}`;
                    document.querySelector('.oc-mob-orders-view-overlay-view-itemNo').textContent = `No of Items: ${orderDetails.itemNo}`;
        
                    // Populate items list
                    const itemsContainer = document.querySelector('.oc-mob-orders-view-overlay-view-table-items');
                    itemsContainer.innerHTML = ''; // Clear existing items
                    orderDetails.items.forEach(item => {
                        const itemElement = document.createElement('li');
                        itemElement.innerHTML = `
                            <span>${item.itemName}</span>
                            <span class="oc-mob-orders-view-overlay-view-status status-${item.itemStatus.toLowerCase().replace(/ /g, '')}">
                                ${item.itemStatus}
                            </span>
                        `;
                        itemsContainer.appendChild(itemElement);
                    });
                }
        
                // Close overlay on close button click
                const closeOrderOverlay = document.getElementById('close-orderoverlay');
                closeOrderOverlay.addEventListener('click', function () {
                    orderDetailsOverlay.classList.remove('is-open');
                });
            } catch (error) {
                console.error('Error loading order overlay:', error);
            }
        }
        
    }

    // Populate orders initially with all filters
    populateOrders('in-progress');

    // Add event listeners for filter chips
    let filterChips = document.querySelectorAll('.oc-mob-orders-filter-chip');

    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(chip => chip.classList.remove('active'));
            chip.classList.add('active');

            const filter = chip.textContent.trim().toLowerCase();

            // Update the URL with the selected filter
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('filters', filter);
            history.replaceState({}, '', currentUrl);

            // Populate orders based on the selected filter
            populateOrders(filter);
        });
    });
}

// Initialize the orders page
initializeOrdersPage();

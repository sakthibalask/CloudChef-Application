function initializeCheckout(){
    const currentOrderList = document.querySelector('.oc-mob-checkout-view-container-orders-list');
    const currentOrderOverlay =  document.querySelector('.oc-mob-checkout-view-overlay');

    const currentOrders = [
        {id: "#OC001", tableNo: 2, status: "checkout"},
        {id: "#OC021", tableNo: 3, status: "checkout"},
    ];

    const OrdersData = [
        {
            id: "#OC001", 
            orderItems: [
                {id: "#F032", name: "Dosa", qty: 3, price: 60.50},
                {id: "#F020", name: "Idly", qty: 4, price: 12.50},
            ],
            tableNo: 2,
        },
        {
            id: "#OC021", 
            orderItems: [
                {id: "#F032", name: "Dosa", qty: 3, price: 60.50},
                {id: "#F020", name: "Idly", qty: 4, price: 12.50},
            ],
            tableNo: 3,
        }
    ];

    function renderOrdersList(currentOrders){
        currentOrders.forEach(order => {
            const orderElement = document.createElement('li');
            orderElement.classList.add('oc-mob-checkout-view-container-order');
            orderElement.innerHTML =
                    `<span class="oc-mob-checkout-view-container-order-context-data table-data">Table : ${order.tableNo}</span>
                    <span class="oc-mob-checkout-view-container-order-context-data order-data">${order.id}</span>
                    <span class="oc-mob-checkout-view-container-order-context-data status-${order.status}" id="order-${order.id}">${order.status}</span>`;
            currentOrderList.appendChild(orderElement);

            orderElement.addEventListener('click', function(){
                currentOrderOverlay.classList.add('is-open');
                renderOrderOverlay(order);
            });
        });
    }

    async function renderOrderOverlay(orderItem){
        try{
            const response = await fetch(`./oc.mobile.checkout/impl/oc.mobile.checkout.form.view.html`);
            const overlayContent = await response.text();

            currentOrderOverlay.innerHTML = overlayContent;

            const closeBtn = document.getElementById('close-overlay');
            if(closeBtn){
                closeBtn.addEventListener('click', function(){
                    currentOrderOverlay.classList.remove('is-open');
                });
            }

            const orderItemsList = document.querySelector('.oc-mob-checkout-overlay-container-lists');
            if(orderItemsList){
                orderItemsList.innerHTML = '';

                const orderDetails = OrdersData.find(order => order.id === orderItem.id);
                if(orderDetails && orderDetails.orderItems){
                    orderDetails.orderItems.forEach((item, index) => {
                        const itemElement = document.createElement('li');
                        itemElement.classList.add('oc-mob-checkout-overlay-container-list');
                        itemElement.innerHTML = 
                            `<div class="oc-mob-checkout-overlay-list-item">
                                <span class="oc-mob-checkout-overlay-container-list-count">${item.qty}</span>
                                <span><i class="ri-close-large-line"></i></span>
                            </div>
                            <div class="oc-mob-checkout-overlay-list-item-data">
                                <span class="oc-mob-checkout-overlay-list-item-data-title">${item.name}</span>
                            </div>
                            <div class="oc-mob-checkout-overlay-list-item-data-price">
                                <span><i class="ri-money-rupee-circle-line"></i> ${item.price * item.qty}</span>
                            </div>`;
                        orderItemsList.appendChild(itemElement);
                    })
                }
            }
        }catch(error){
            console.error(error);
        }
    }

    renderOrdersList(currentOrders);
}

initializeCheckout();
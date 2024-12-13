function initializeCreateOrderPage() {

    const overlayTabs = document.querySelectorAll('.oc-mob-createorder-view-form-tab');
    const overlayBtns = document.querySelectorAll('.oc-mob-createorder-view-form-btn');
    const overlayContainer = document.querySelector('.oc-mob-createorder-view-overlay');
    
    overlayTabs.forEach(tabs =>{
        tabs.addEventListener('click', function(){
            overlayTabs.forEach(tabs => tabs.classList.remove('active-tab'))
            tabs.classList.add('active-tab');
        });
    });

    overlayBtns.forEach(btns => {
        btns.addEventListener('click', function(){
            let btnId = btns.id;
            switch (btnId){
                case 'oc-table': 
                    initializeTableView('./oc.mobile.createorder/impl/oc.mobile.tables.view.html');
                    break;
                case 'oc-menu':
                    initializeViewMenu('./oc.mobile.createorder/impl/oc.mobile.sm-menu.view.html');
                    break;
                case 'oc-ordersummary':
                    initializeOrderSummary('./oc.mobile.createorder/impl/oc.mobile.ordersummary.view.html');
            }
            
        });
    });

    async function initializeTableView(path){
        overlayContainer.classList.add('is-open');
        try{
            const response = await fetch(path);
            const overlayText = await response.text();

            overlayContainer.innerHTML = overlayText;
        }catch(error){
            console.error(error);
        }

        const closeOverlayBtn = document.getElementById('close-overlay');
        const reserveBtn = document.getElementById('reserve-btn');

        closeOverlayBtn.addEventListener('click', function(){
            overlayContainer.classList.remove('is-open');
        });

        

        const tableBtns_4 = document.querySelectorAll('.oc-mob-tables-view-4mtable') 
        const tableBtns_6 = document.querySelectorAll('.oc-mob-tables-view-6mtable');
        const tableBtns_pm = document.querySelectorAll('.oc-mob-tables-view-pmtable');
        

        if(tableBtns_4){
            tableBtns_4.forEach(table => {
                table.addEventListener('click', function(){
                    table.classList.toggle('is-selected');
                });
            });
        }

        if(tableBtns_6){
            tableBtns_6.forEach(table => {
                table.addEventListener('click', function(){
                    table.classList.toggle('is-selected');
                });
            });
        }

        if(tableBtns_pm){
            tableBtns_pm.forEach(table => {
                table.addEventListener('click', function(){
                    table.classList.toggle('is-selected');
                });
            });
        }

        const floorChips = document.querySelectorAll('.oc-mob-tables-view-container-floorchip');
        const tableFormations = document.querySelectorAll('.oc-mob-tables-view-container-table-formation');

        floorChips.forEach((chip, index) => {
            chip.addEventListener('click', function () {
                floorChips.forEach(chip => chip.classList.remove('active-chip'));

                chip.classList.add('active-chip');
    
                tableFormations.forEach(formation => formation.style.display = 'none');
    
            
                tableFormations[index].style.display = 'grid';
            });
        });

        floorChips[0].classList.add('active-chip');
        tableFormations.forEach((formation, index) => {
            formation.style.display = index === 0 ? 'grid' : 'none';
        });

        reserveBtn.addEventListener('click', function(){
            const selectedTables = [];

            document.querySelectorAll('.oc-mob-tables-view-4mtable.is-selected').forEach(table => {
                selectedTables.push({
                    type: '4-member',
                    tableNumber: table.querySelector('span').innerText
                });
            });

            document.querySelectorAll('.oc-mob-tables-view-6mtable.is-selected').forEach(table => {
                selectedTables.push({
                    type: '6-member',
                    tableNumber: table.querySelector('span').innerText
                });
            });

            document.querySelectorAll('.oc-mob-tables-view-pmtable.is-selected').forEach(table => {
                selectedTables.push({
                    type: 'Party',
                    tableNumber: table.querySelector('span').innerText
                });
            });

            console.log('Selected Tables:', selectedTables);

            overlayContainer.classList.remove('is-open');
        });
    }

    async function initializeOrderSummary(path) {
        overlayContainer.classList.add('is-open');
        try {
            const response = await fetch(path);
            const overlayText = await response.text();
    
            overlayContainer.innerHTML = overlayText;
    
            const closeOverlayBtn = document.getElementById('close-overlay');
            closeOverlayBtn.addEventListener('click', function () {
                overlayContainer.classList.remove('is-open');
            });
    
            const swipeBtn = document.querySelector('.oc-mob-ordersummary-view-sliderBtn span');
            const sliderBtn = document.querySelector('.oc-mob-ordersummary-view-sliderBtn');
            const swipeBtnContainer = document.querySelector('.oc-mob-ordersummary-view-sliderBtns');
    
            if (!swipeBtn || !sliderBtn) {
                console.error('Swipe button or slider button not found');
                return;
            }
    
            let isDragging = false;
            let startX = 0;
            let currentX = 0;
            let sliderWidth = 0;
    
            const startDrag = function (e) {
                isDragging = true;
                startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
                sliderWidth = sliderBtn.offsetWidth - swipeBtn.offsetWidth;
            };
    
            const moveDrag = function (e) {
                if (!isDragging) return;
                currentX = e.type === 'mousemove' ? e.clientX - startX : e.touches[0].clientX - startX;
                currentX = Math.min(Math.max(0, currentX), sliderWidth); // Ensure within bounds
                
                // Use requestAnimationFrame for smoother movement
                requestAnimationFrame(function () {
                    swipeBtn.style.transform = `translateX(${currentX}px)`;
                });
            };
    
            const endDrag = function () {
                if (!isDragging) return;
                isDragging = false;
    
                // Check if the swipe reached the end
                if (currentX >= sliderWidth - 10) {
                    // Smooth final position
                    swipeBtn.style.transform = `translateX(${sliderWidth}px)`;
                    
                    // Update button text, icon, and styles
                    swipeBtnContainer.innerHTML = `
                       <button class="oc-mob-ordersummary-view-sliderBtn placed-order">Checkout Successfully 
                            <span id="swipe-btn">
                                <i class="ri-check-double-fill"></i>
                            </span>
                        </button>
                    `;
                    // Disable further interactions
                    sliderBtn.removeEventListener('mousedown', startDrag);
                    sliderBtn.removeEventListener('mousemove', moveDrag);
                    sliderBtn.removeEventListener('mouseup', endDrag);
                    sliderBtn.removeEventListener('mouseleave', endDrag);
                    sliderBtn.removeEventListener('touchstart', startDrag);
                    sliderBtn.removeEventListener('touchmove', moveDrag);
                    sliderBtn.removeEventListener('touchend', endDrag);
                    setTimeout(function() {
                        overlayContainer.classList.remove('is-open');
                    },2000);
                } else {
                    swipeBtn.style.transform = `translateX(0px)`; // Reset to starting position
                }
            };
    
            // Add event listeners
            sliderBtn.addEventListener('mousedown', startDrag);
            sliderBtn.addEventListener('mousemove', moveDrag);
            sliderBtn.addEventListener('mouseup', endDrag);
            sliderBtn.addEventListener('mouseleave', endDrag);
    
            // For touch devices
            sliderBtn.addEventListener('touchstart', startDrag);
            sliderBtn.addEventListener('touchmove', moveDrag);
            sliderBtn.addEventListener('touchend', endDrag);
        } catch (error) {
            console.error(error);
        }
    }

    async function initializeViewMenu(path) {
        overlayContainer.classList.add('is-open');
        try{
            const response = await fetch(path);
            const overlayText = await response.text();
            
            overlayContainer.innerHTML = overlayText;

            const menuItems = [
                { id: 1, name: "Dosa", image: "https://www.cubesnjuliennes.com/wp-content/uploads/2023/10/Best-Crispy-Plain-Dosa-Recipe.jpg"},
                {id: 2, name: "South Indian Chicken Biryani", image: "https://images.unsplash.com/photo-1701579231349-d7459c40919d?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
                {id: 3, name: "Idli", image: "https://static.vecteezy.com/system/resources/previews/015/933/273/non_2x/idli-vada-sambhar-also-known-as-idly-medu-wada-and-sambar-free-photo.jpg"},
                {id: 4,  name: "Chicken Curry", image: "https://feastwithsafiya.com/wp-content/uploads/2022/03/chicken-curry-recipe.jpg"}
            ];
    
            let currentOrders = [];
            
            const closeOverlayBtn = document.getElementById('close-overlay');
            const searchInput = document.querySelector('.oc-mob-overlay-view-container-input');
            const resultsContainer = document.querySelector('.oc-mob-overlay-view-search-container-results-list');
            const emptyMessage = document.querySelector('.oc-mob-overlay-view-search-container-emptyresults');
            const orderButton = document.querySelector('.oc-mob-overlay-view-btn');
            const currentOrderContainer = document.querySelector('.oc-mob-overlay-view-container-grp-menu');

            closeOverlayBtn.addEventListener('click', function(){
                overlayContainer.classList.remove('is-open');
            });

            

            resultsContainer.innerHTML = '<h2 class="oc-mob-overlay-view-search-container-emptyresults">Nothing in the cart..., Search anything in menu</h2>';

            searchInput.addEventListener('input', function(event){
                const query = event.target.value;

                currentOrderContainer.classList.add('oc-mob-display-hidden');

                const filteredItems = []
                menuItems.forEach(item =>{
                    if(item.name.toLowerCase().includes(query.toLowerCase())){
                        filteredItems.push(item);
                    }
                });

                renderSearchResults(filteredItems);
            });

            function renderSearchResults(items){
                if(items.length === 0){
                    resultsContainer.innerHTML = `<h2 class="oc-mob-overlay-view-search-container-emptyresults">Item Not Found</h2>`;
                    return;
                }

                resultsContainer.innerHTML = '';
                items.forEach(item => {
                    const resultItem = document.createElement('li');
                    
                    resultItem.innerHTML = ` 
                        <div class="oc-mob-overlay-view-search-container-img">
                            <img src=${item.image} alt=${item.name}>
                        </div>
                        <div class="oc-mob-overlay-view-search-container-context">
                            <span class="oc-mob-overlay-view-search-container-context-title">${item.name}</span>
                            <span class="oc-mob-overlay-view-search-container-addtocart" id="addtocart-${item.id}"> Add to Cart</span>
                        </div>`;
                    resultsContainer.appendChild(resultItem);


                    const cartBtn = document.getElementById(`addtocart-${item.id}`);
                    if(cartBtn){
                        cartBtn.addEventListener('click', function(){
                            addToCart(item);
                            searchInput.value = '';
                            console.log("Added to Cart");
                        });   
                    }
                });
            }

            function addToCart(itemData){
                const existingItem = currentOrders.find(orderItem => orderItem.id === itemData.id);

                if(!existingItem) {
                    currentOrders.push({ ...itemData, count: 1});
                }else{
                    existingItem.count += 1;
                }

                renderCurrentOrder();
            }

            function renderCurrentOrder(){
                if(currentOrders.length === 0){
                    currentOrderContainer.classList.add('oc-mob-display-hidden');
                    resultsContainer.innerHTML = '<h2 class="oc-mob-overlay-view-search-container-emptyresults">Nothing in the cart..., Search anything in menu</h2>';
                }else{
                    currentOrderContainer.classList.remove('oc-mob-display-hidden');
                    resultsContainer.innerHTML = '';

                    currentOrderContainer.innerHTML = '';
                    currentOrders.forEach(orderItem =>{
                        const orderElement = document.createElement('div');
                        orderElement.classList.add('oc-mob-overlay-view-container-item-menu');

                        orderElement.innerHTML = `
                        <div class="oc-mob-overlay-view-container-item-menu-input">
                            <input type="checkbox" class="oc-mob-overlay-view-container-item-menu-checkbox">
                        </div>
                        <div class="oc-mob-overlay-view-container-item-menu-content">
                            <div class="oc-mob-overlay-view-container-item-menu-content-img">
                                <img src=${orderItem.image} alt="">
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

                        document.getElementById(`increment-${orderItem.id}`).addEventListener('click', function(){
                            orderItem.count += 1;
                            document.getElementById(`count-${orderItem.id}`).textContent = orderItem.count;
                        });

                        document.getElementById(`decrement-${orderItem.id}`).addEventListener('click', function(){
                            if (orderItem.count > 1) {
                                orderItem.count -= 1;
                                document.getElementById(`count-${orderItem.id}`).textContent = orderItem.count;
                            } else {
                                currentOrders = currentOrders.filter(cartItem => cartItem.id !== orderItem.id);
                                renderCurrentOrder();
                            }
                        });
                    });
                }
            }

            orderButton.addEventListener('click', function(){
                overlayContainer.classList.remove('is-open');
            });

            renderSearchResults(menuItems);
            renderCurrentOrder()
        }catch(error){
            console.error(error);
        }
    }
}

initializeCreateOrderPage();
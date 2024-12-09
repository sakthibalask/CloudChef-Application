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
                    loadOverlayData('./oc.mobile.createorder/impl/oc.mobile.sm-menu.view.html');
                    break;
                case 'oc-ordersummary':
                    loadOverlayData('./oc.mobile.createorder/impl/oc.mobile.ordersummary.view.html');
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

    async function loadOverlayData(path) {
        overlayContainer.classList.add('is-open');
        try{
            const response = await fetch(path);
            const overlayText = await response.text();

            overlayContainer.innerHTML = overlayText;

            const closeOverlayBtn = document.getElementById('close-overlay');

            closeOverlayBtn.addEventListener('click', function(){
                overlayContainer.classList.remove('is-open');
            });
        }catch(error){
            console.error(error);
        }
    }

    
    
}

initializeCreateOrderPage();
function initializeMenuPage() {
    const menuSearchBtn = document.getElementById('menu-search');
    const filterChips = document.querySelectorAll('.oc-mob-menu-filter-chips');
    const searchContainer = document.querySelector('.oc-mob-menu-search');
    const menuListContainer = document.querySelector('.oc-mob-menu-lists');
    const filterOverlay = document.querySelector('.oc-mob-menu-filter-overlay');

    let selectedFilters = [];
    let lastScrollTop = 0;

    // Sample dynamic menu data
    const menuItems = [
        {
            name: "Dosa",
            type: "Veg",
            status: "Available in 10 mins",
            statusClass: "ready",
            img: "https://www.cubesnjuliennes.com/wp-content/uploads/2023/10/Best-Crispy-Plain-Dosa-Recipe.jpg",
            category: "Breakfast"
        },
        {
            name: "South Indian Chicken Biryani",
            type: "Non-Veg",
            status: "Available in 30 mins",
            statusClass: "ready",
            img: "https://images.unsplash.com/photo-1701579231349-d7459c40919d?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            category: "Lunch"
        },
        {
            name: "Idli",
            type: "Veg",
            status: "Available Now",
            statusClass: "ready",
            img: "https://static.vecteezy.com/system/resources/previews/015/933/273/non_2x/idli-vada-sambhar-also-known-as-idly-medu-wada-and-sambar-free-photo.jpg",
            category: "Breakfast"
        },
        {
            name: "Chicken Curry",
            type: "Non-Veg",
            status: "Available in 20 mins",
            statusClass: "ready",
            img: "https://feastwithsafiya.com/wp-content/uploads/2022/03/chicken-curry-recipe.jpg",
            category: "Dinner"
        }
    ];

    // Function to render menu items based on filters
    function renderMenuItems() {
        const filteredItems = menuItems.filter(item => {
            if (selectedFilters.length === 0 || selectedFilters.includes('filters')) return true;

            const matchesType = selectedFilters.includes(item.type);
            const matchesCategory = selectedFilters.includes(item.category);
            return matchesType || matchesCategory;
        });

        // Clear existing items
        menuListContainer.innerHTML = '';

        // Populate filtered items
        filteredItems.forEach(item => {
            const listItem = document.createElement('li');
            listItem.className = 'oc-mob-menu-list';
            listItem.innerHTML = `
                <div class="oc-mob-menu-item">
                    <div class="oc-mob-menu-item-header">
                        <span class="oc-mob-menu-item-type ${item.type.toLowerCase()}">
                            <i class='bx bx-food-tag'></i>
                        </span>
                        <span class="oc-mob-menu-item-name">${item.name}</span>
                    </div>
                    <div class="oc-mob-menu-item-content">
                        <span class="oc-mob-menu-item-status ${item.statusClass}">
                            <i class='bx bxs-time'></i> ${item.status}
                        </span>
                    </div>
                </div>
                <div class="oc-mob-menu-item-img">
                    <img src="${item.img}" alt="${item.name}">
                </div>
            `;
            menuListContainer.appendChild(listItem);
        });
    }

    // Initialize filters from URL hash (e.g., #menu?filter=Veg)
    const urlHash = window.location.hash;
    const urlParams = new URLSearchParams(urlHash.split('?')[1]);
    urlParams.getAll('filter').forEach(filter => {
        selectedFilters.push(decodeURIComponent(filter));
    });

    // Mark active filters
    filterChips.forEach(chip => {
        const chipText = chip.textContent.trim();
        if (selectedFilters.includes(chipText)) {
            chip.classList.add('active');
        }
    });

    // Handle search functionality
    if (menuSearchBtn) {
        menuSearchBtn.addEventListener('click', toggleSearchContainer);
    }

    function toggleSearchContainer() {
        if (!searchContainer.querySelector('input[type="search"]')) {
            searchContainer.classList.toggle('visible');
            const searchInput = document.createElement('input');
            searchInput.type = 'search';
            searchInput.placeholder = 'Search...';
            searchInput.addEventListener('input', event => {
                const searchTerm = event.target.value.toLowerCase();
                const filteredItems = menuItems.filter(item =>
                    item.name.toLowerCase().includes(searchTerm)
                );
                selectedFilters = [];
                renderMenuItems(filteredItems);
            });
            searchContainer.appendChild(searchInput);
        } else {
            const searchInput = searchContainer.querySelector('input[type="search"]');
            searchContainer.classList.toggle('visible');
            searchContainer.removeChild(searchInput);
        }
    }

    // Handle scrolling
    window.addEventListener('scroll', function () {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
            searchContainer.style.display = 'block';
        } else {
            searchContainer.style.display = 'none';
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // Handle filter chips
    filterChips.forEach(chip => {
        chip.addEventListener('click', function () {
            const chipText = chip.textContent.trim();

            if (chipText === 'filters') {
                showFilters();
                return;
            }

            chip.classList.toggle('active');
            if (chip.classList.contains('active')) {
                selectedFilters.push(chipText);
            } else {
                const index = selectedFilters.indexOf(chipText);
                if (index > -1) {
                    selectedFilters.splice(index, 1);
                }
            }

            // Update URL with selected filters
            const queryString = selectedFilters
                .map(filter => `filter=${encodeURIComponent(filter)}`)
                .join('&');
            window.history.replaceState(
                { selectedFilters },
                document.title,
                `${window.location.pathname}#menu?${queryString}`
            );

            renderMenuItems();
        });
    });

    // Load filters overlay
    async function showFilters() {
        if (filterOverlay.innerHTML.trim() !== '') {
            // Close filter overlay if it's already open
            filterOverlay.classList.remove('is-open');
            filterOverlay.innerHTML = '';
        } else {
            try {
                // Fetch the filter options (HTML content)
                const response = await fetch('./oc.mobile.menu/impl/oc.mobile.menu.filter.view.html');
                const filterOptions = await response.text();
                filterOverlay.innerHTML = filterOptions;

                // Add overlay open class
                filterOverlay.classList.add('is-open');

                // Add event listener for the close button
                const filterCloseBtn = document.getElementById('close-overlay');
                if (filterCloseBtn) {
                    filterCloseBtn.addEventListener('click', function () {
                        // Close the overlay and clear its content
                        filterOverlay.classList.remove('is-open');
                        filterOverlay.innerHTML = '';
                        // Optionally, update URL to reflect the removal of the filters
                        window.history.replaceState(
                            { selectedFilters },
                            document.title,
                            `${window.location.pathname}#menu`
                        );
                    });
                }

            } catch (error) {
                console.error('Error fetching filter options:', error);
            }
        }
    }

    // Initial render
    renderMenuItems();
}

initializeMenuPage();

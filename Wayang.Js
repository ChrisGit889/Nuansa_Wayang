document.addEventListener('DOMContentLoaded', () => {

    // ======================================================
    // 1. LOGIKA HAMBURGER MENU
    // ======================================================
    function setupHamburgerMenu() {
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const navMenu = document.getElementById('nav-menu');

        if (hamburgerBtn && navMenu) {
            hamburgerBtn.addEventListener('click', () => {
                hamburgerBtn.classList.toggle('active');
                navMenu.classList.toggle('show');
            });
        }
    }
    
    // ======================================================
    // 2. FUNGSI HIGHLIGHT HALAMAN AKTIF
    // ======================================================
    function highlightActivePage() {
        // Menggunakan window.location.pathname untuk mendapatkan path halaman saat ini
        const currentPage = window.location.pathname.split("/").pop();

        const navLinks = document.querySelectorAll('.professional-navbar nav a');
        
        navLinks.forEach(link => {
            // Membandingkan href link dengan halaman saat ini
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }

    // ======================================================
    // 3. FUNGSI SMOOTH SCROLL & LAINNYA
    // ======================================================
    // (Fungsi ini untuk halaman fakta/sejarah, jadi tetap aman di sini)
    function scrollToFakta(targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    const scrollIcon = document.querySelector('.scroll-down-icon');
    if (scrollIcon) {
        scrollIcon.addEventListener('click', (event) => {
            event.preventDefault();
            scrollToFakta('fakta-1'); 
        });
    }

    // Event listener untuk kartu aksesoris
    const aksesorisCards = document.querySelectorAll('.aksesoris-card');
    aksesorisCards.forEach(card => {
        card.addEventListener('click', (event) => {
            const href = card.getAttribute('href');
            if (href === '#null' || href === '#') {
                event.preventDefault(); 
            }
        });
    });

    // =========================================================================
    // 4. LOGIKA HALAMAN TOKOH (GALERI, FAVORIT, MODAL)
    // =========================================================================
    const wayangGridContainer = document.getElementById('wayang-grid-container');

    // Cek jika kita berada di halaman 'tokoh.html'
    if (wayangGridContainer) {
        // Semua kode untuk halaman tokoh ada di dalam sini...
        // (Kode ini tidak saya ubah, hanya dipastikan posisinya benar)
        const searchInput = document.getElementById('search-input');
        const sortSelect = document.getElementById('sort-select');
        const modal = document.getElementById('wayang-modal');
        const favoritesBtn = document.getElementById('favorites-btn');

        const dataWayangWithId = dataWayang.map((wayang, index) => ({
            ...wayang,
            id: index
        }));

        let favorites = JSON.parse(localStorage.getItem('wayangFavorites')) || [];
        let showingFavorites = false;

        const saveFavorites = () => {
            localStorage.setItem('wayangFavorites', JSON.stringify(favorites));
        };

        function renderGallery(data) {
            wayangGridContainer.innerHTML = '';
            data.forEach((wayang) => { 
                const isLoved = favorites.includes(wayang.id);
                const card = document.createElement('div');
                card.classList.add('wayang-item');
                card.dataset.id = wayang.id;
                card.innerHTML = `
                    <span class="love-btn ${isLoved ? 'loved' : ''}" data-id="${wayang.id}">♥</span>
                    <img src="${wayang.Gambar}" alt="Tokoh Wayang ${wayang.Nama}">
                    <div class="wayang-overlay">
                        <p class="wayang-nama">${wayang.Nama}</p>
                    </div>
                `;
                wayangGridContainer.appendChild(card);
            });
        }
        
        function showModal(wayangId) {
            const wayang = dataWayangWithId.find(w => w.id === wayangId);
            if (wayang) {
                document.getElementById('modal-wayang-nama').textContent = wayang.Nama;
                document.getElementById('modal-wayang-gambar').src = wayang.Gambar;
                document.getElementById('modal-wayang-asal').textContent = wayang.Asal || 'Tidak Diketahui';
                document.getElementById('modal-wayang-pembuat').textContent = wayang.Pembuat || 'Tidak Diketahui';
                document.getElementById('modal-wayang-tanggal').textContent = wayang['Tanggal Dibuat'] || 'Tidak Diketahui';
                document.getElementById('modal-wayang-medium').textContent = wayang.Medium || 'Tidak Diketahui';
                document.getElementById('modal-wayang-penjelasan').textContent = wayang.Penjelasan || "Penjelasan tidak tersedia.";
                modal.style.display = 'block';
            }
        }
        
        function closeModal() {
            modal.style.display = 'none';
        }

        function applyFiltersAndSort() {
            let filteredData = [...dataWayangWithId]; 
            const searchTerm = searchInput.value.toLowerCase();
            const sortValue = sortSelect.value;
            
            if (showingFavorites) {
                filteredData = filteredData.filter(wayang => favorites.includes(wayang.id));
            }
        
            if (searchTerm) {
                filteredData = filteredData.filter(wayang => 
                    (wayang.Nama || '').toLowerCase().includes(searchTerm)
                );
            }
        
            if (sortValue === 'asc') {
                filteredData.sort((a, b) => (a.Nama || '').localeCompare(b.Nama || '')); 
            } else if (sortValue === 'desc') {
                filteredData.sort((a, b) => (b.Nama || '').localeCompare(a.Nama || '')); 
            }
        
            renderGallery(filteredData);
        }

        // --- EVENT LISTENERS (Halaman Tokoh) ---
        searchInput.addEventListener('input', applyFiltersAndSort);
        sortSelect.addEventListener('change', applyFiltersAndSort);

        favoritesBtn.addEventListener('click', () => {
            showingFavorites = !showingFavorites;
            if (showingFavorites) {
                favoritesBtn.classList.add('active');
                favoritesBtn.innerHTML = 'Tampilkan Semua';
            } else {
                favoritesBtn.classList.remove('active');
                favoritesBtn.innerHTML = 'Wayang Favorite ♡';
            }
            applyFiltersAndSort();
        });

        wayangGridContainer.addEventListener('click', (e) => {
            const card = e.target.closest('.wayang-item');
            if (!card) return;
            const wayangId = parseInt(card.dataset.id, 10);

            if (e.target.classList.contains('love-btn')) {
                const index = favorites.indexOf(wayangId);
                if (index > -1) {
                    favorites.splice(index, 1);
                    e.target.classList.remove('loved');
                } else {
                    favorites.push(wayangId);
                    e.target.classList.add('loved');
                }
                saveFavorites();
                if (showingFavorites) { applyFiltersAndSort(); }
            } 
            else if (e.target.tagName === 'IMG') {
                showModal(wayangId);
            }
        });

        modal.querySelector('.close-button').addEventListener('click', closeModal);
        window.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
        document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(); });

        applyFiltersAndSort();
    }

    // ======================================================
    // 5. JALANKAN FUNGSI-FUNGSI UTAMA
    // ======================================================
    // Panggil fungsi-fungsi ini secara langsung karena navbar sudah ada di HTML
    setupHamburgerMenu();
    highlightActivePage();
});
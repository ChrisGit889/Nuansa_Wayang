document.addEventListener('DOMContentLoaded', () => {
    // 1. Buat Navbar (Tidak diubah)
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            const navContainer = document.getElementById('navbar-container');
            if (navContainer) {
                navContainer.innerHTML = data;
                highlightActivePage();
            }
        })
        .catch(error => console.error('Gagal memuat navbar:', error));

    // 2. Fungsi untuk Highlight Halaman Aktif (Tidak diubah)
    function highlightActivePage() {
        const path = window.location.pathname;
        let currentPage = path.substring(path.lastIndexOf('/') + 1).replace('.html', '');
        
        if (!currentPage || currentPage === 'index') {
            currentPage = 'beranda';
        }

        const navLinks = document.querySelectorAll('.professional-navbar a');
        
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('data-page');
            if (linkPage === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // 3. FUNGSI SMOOTH SCROLL (Tidak diubah)
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

    // 4. LOGIKA LAIN (Tidak diubah)
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
    // 5. AWAL DARI KODE GALERI, MODAL, DAN FITUR FAVORIT
    // =========================================================================
    const wayangGridContainer = document.getElementById('wayang-grid-container');
    // Cek jika kita berada di halaman 'tokoh.html', jika tidak, hentikan eksekusi kode galeri
    if (!wayangGridContainer) {
        return;
    }

    // --- DOM Elements ---
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    const modal = document.getElementById('wayang-modal');
    const favoritesBtn = document.getElementById('favorites-btn');

    // Langkah 1: Tambahkan ID unik ke setiap objek wayang
    const dataWayangWithId = dataWayang.map((wayang, index) => ({
        ...wayang,
        id: index
    }));

    // --- Variabel State untuk Fitur Favorit ---
    let favorites = JSON.parse(localStorage.getItem('wayangFavorites')) || [];
    let showingFavorites = false;

    // Fungsi untuk menyimpan favorit ke localStorage
    const saveFavorites = () => {
        localStorage.setItem('wayangFavorites', JSON.stringify(favorites));
    };

    // Fungsi untuk menampilkan kartu wayang ke galeri
    function renderGallery(data) {
        wayangGridContainer.innerHTML = '';
        
        data.forEach((wayang, index) => { 
            const isLoved = favorites.includes(wayang.id); // Cek status favorit berdasarkan ID
            
            const card = document.createElement('div');
            card.classList.add('wayang-item');
            card.dataset.id = wayang.id; // Gunakan ID sebagai penanda di elemen

            card.innerHTML = `
                <span class="love-btn ${isLoved ? 'loved' : ''}" data-id="${wayang.id}">♥</span>
                <img src="${wayang.Gambar}" alt="Tokoh Wayang ${wayang.Nama}">
                <div class="wayang-overlay">
                    <p class="wayang-nama">${wayang.Nama}</p>
                </div>
            `;
            
            wayangGridContainer.appendChild(card);
            // Animasi tetap dipertahankan
            setTimeout(() => {
                card.classList.add('animated');
            }, index * 50);
        });
    }
    
    // Fungsi untuk menampilkan detail wayang di modal (diperbarui untuk menggunakan ID)
    function showModal(wayangId) {
        const wayang = dataWayangWithId.find(w => w.id === wayangId);
        if (wayang) {
            // Logika pemotongan penjelasan Anda tetap dipertahankan
            let penjelasanSingkat = wayang.Penjelasan || "Penjelasan tidak tersedia.";
            const firstSentenceMatch = penjelasanSingkat.match(/[^.!?]*[.!?]/);
            if (firstSentenceMatch) {
                penjelasanSingkat = firstSentenceMatch[0].trim();
            } else if (penjelasanSingkat.length > 120) {
                penjelasanSingkat = penjelasanSingkat.substring(0, 120).trim() + "...";
            }
            
            document.getElementById('modal-wayang-nama').textContent = wayang.Nama;
            document.getElementById('modal-wayang-gambar').src = wayang.Gambar;
            document.getElementById('modal-wayang-asal').textContent = wayang.Asal || 'Tidak Diketahui';
            document.getElementById('modal-wayang-pembuat').textContent = wayang.Pembuat || 'Tidak Diketahui';
            document.getElementById('modal-wayang-tanggal').textContent = wayang['Tanggal Dibuat'] || 'Tidak Diketahui';
            document.getElementById('modal-wayang-medium').textContent = wayang.Medium || 'Tidak Diketahui';
            document.getElementById('modal-wayang-penjelasan').textContent = penjelasanSingkat;
            modal.style.display = 'block';
        }
    }
    
    function closeModal() {
        modal.style.display = 'none';
    }

    // Fungsi utama untuk filter, sort, dan favorit (diperbarui)
    function applyFiltersAndSort() {
        let filteredData = [...dataWayangWithId]; 
        const searchTerm = searchInput.value.toLowerCase();
        const sortValue = sortSelect.value;
        
        // Tahap 1: Filter berdasarkan favorit (jika aktif)
        if (showingFavorites) {
            filteredData = filteredData.filter(wayang => favorites.includes(wayang.id));
        }
    
        // Tahap 2: Filter berdasarkan pencarian (logika pencarian Anda dipertahankan)
        if (searchTerm) {
            filteredData = filteredData.filter(wayang => {
                const name = (wayang.Nama || '').toLowerCase();
                const asal = (wayang.Asal || '').toLowerCase();
                const pembuat = (wayang.Pembuat || '').toLowerCase();
                return name.includes(searchTerm) || asal.includes(searchTerm) || pembuat.includes(searchTerm);
            });
        }
    
        // Tahap 3: Urutkan data
        if (sortValue === 'asc') {
            filteredData.sort((a, b) => (a.Nama || '').localeCompare(b.Nama || '')); 
        } else if (sortValue === 'desc') {
            filteredData.sort((a, b) => (b.Nama || '').localeCompare(a.Nama || '')); 
        }
    
        renderGallery(filteredData);
    }

    // --- EVENT LISTENERS (Disederhanakan dan Diperbaiki) ---
    searchInput.addEventListener('input', applyFiltersAndSort);
    sortSelect.addEventListener('change', applyFiltersAndSort);

    // Event listener untuk tombol "Wayang Favorite"
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

    // Listener utama yang digabung untuk efisiensi (menangani klik hati & buka modal)
    wayangGridContainer.addEventListener('click', (e) => {
        const card = e.target.closest('.wayang-item');
        if (!card) return;

        const wayangId = parseInt(card.dataset.id, 10);

        // Jika tombol hati yang diklik
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

            if (showingFavorites) {
                applyFiltersAndSort();
            }
        } 
        // Jika gambar yang diklik
        else if (e.target.tagName === 'IMG') {
            showModal(wayangId);
        }
    });
    modal.querySelector('.close-button').addEventListener('click', closeModal);
    window.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(); });
    applyFiltersAndSort();
}
);
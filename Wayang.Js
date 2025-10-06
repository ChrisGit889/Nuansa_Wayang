document.addEventListener('DOMContentLoaded', () => {
    if (typeof dataWayang === 'undefined' || !Array.isArray(dataWayang)) {
        console.error("Error: Array dataWayang tidak ditemukan atau formatnya salah.");
        return; 
    }

    // --- DOM Elements ---
    const wayangGridContainer = document.getElementById('wayang-grid-container');
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');

    // Elemen Modal
    const modal = document.getElementById('wayang-modal');
    const closeButton = modal.querySelector('.close-button');
    const modalNama = document.getElementById('modal-wayang-nama');
    const modalGambar = document.getElementById('modal-wayang-gambar');
    
    // Tempat mengisi detail wayang
    const modalAsal = document.getElementById('modal-wayang-asal');
    const modalPembuat = document.getElementById('modal-wayang-pembuat');
    const modalTanggal = document.getElementById('modal-wayang-tanggal');
    const modalMedium = document.getElementById('modal-wayang-medium');
    const modalPenjelasan = document.getElementById('modal-wayang-penjelasan');
    
    // Fungsi untuk Merender Galeri
    function renderGallery(data) {
        wayangGridContainer.innerHTML = '';
        
        data.forEach((wayang) => {
            const nama = wayang.Nama; 
            const gambarPath = wayang.Gambar;
            
            if (gambarPath && nama) { 
                const card = document.createElement('div');
                card.classList.add('wayang-item');
                card.dataset.nama = nama; 

                card.innerHTML = `<img src="${gambarPath}" alt="Tokoh Wayang ${nama}">`;
                wayangGridContainer.appendChild(card);
            }
        });
        attachModalListeners(); 
    }
    
    // 2. Fungsi untuk Menampilkan Modal dengan Data dari data.js
    function showModal(namaTokoh) {
        // Cari data wayang berdasarkan Nama
        const wayang = dataWayang.find(w => w.Nama === namaTokoh);

        if (wayang) {
            let penjelasanSingkat = wayang.Penjelasan || "Penjelasan tidak tersedia.";
            
            const firstSentenceMatch = penjelasanSingkat.match(/[^.!?]*[.!?]/);
            if (firstSentenceMatch) {
                 penjelasanSingkat = firstSentenceMatch[0].trim();
            } else if (penjelasanSingkat.length > 120) {
                 penjelasanSingkat = penjelasanSingkat.substring(0, 120).trim() + "...";
            }
            
            // Mengisi konten Modal
            modalNama.textContent = wayang.Nama;
            modalGambar.src = wayang.Gambar;
            modalGambar.alt = `Gambar ${wayang.Nama}`;

            modalAsal.textContent = wayang.Asal || 'Tidak Diketahui';
            modalPembuat.textContent = wayang.Pembuat || 'Tidak Diketahui';
            modalTanggal.textContent = wayang['Tanggal Dibuat'] || 'Tidak Diketahui';
            modalMedium.textContent = wayang.Medium || 'Tidak Diketahui';
            modalPenjelasan.textContent = penjelasanSingkat;
            
            modal.style.display = 'block';
        }
    }
    
    function closeModal() {
        modal.style.display = 'none';
    }

    function attachModalListeners() {
        const wayangItems = document.querySelectorAll('.wayang-item');
        wayangItems.forEach(item => {
            item.addEventListener('click', () => {
                const namaTokoh = item.dataset.nama;
                showModal(namaTokoh);
            });
        });
    }

    function applyFiltersAndSort() {
        let filteredData = [...dataWayang]; 
        const searchTerm = searchInput.value.toLowerCase();
        const sortValue = sortSelect.value;
        
        // 1. Filtering (Pencarian)
        if (searchTerm) {
            filteredData = filteredData.filter(wayang => {
                const name = (wayang.Nama || '').toLowerCase();
                const asal = (wayang.Asal || '').toLowerCase();
                const pembuat = (wayang.Pembuat || '').toLowerCase();
                return name.includes(searchTerm) || 
                       asal.includes(searchTerm) || 
                       pembuat.includes(searchTerm);
            });
        }

        // 2. Sorting (Pengurutan)
        filteredData.sort((a, b) => {
            const nameA = (a.Nama || '').toLowerCase();
            const nameB = (b.Nama || '').toLowerCase();
            
            if (sortValue === 'asc') {
                return nameA.localeCompare(nameB); // A - Z
            } else if (sortValue === 'desc') {
                return nameB.localeCompare(nameA); // Z - A
            }
            return 0;
        });

        renderGallery(filteredData);
    }
    
    // Event listener untuk Search dan Sort
    if (searchInput) searchInput.addEventListener('input', applyFiltersAndSort);
    if (sortSelect) sortSelect.addEventListener('change', applyFiltersAndSort);

    // Menutup modal
    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
    applyFiltersAndSort();
});
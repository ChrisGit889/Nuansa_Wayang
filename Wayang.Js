document.addEventListener('DOMContentLoaded', () => {
    if (typeof dataWayang === 'undefined' || !Array.isArray(dataWayang)) {
        console.error("Error: Array dataWayang tidak ditemukan atau formatnya salah.");
        return; 
    }

    const lihatSemuaBtn = document.getElementById('lihat-semua-btn');
    const filterSection = document.getElementById('filter-section');
    const tokohGaleri = document.getElementById('tokoh-galeri');
    const searchInput = document.getElementById('search-tokoh-input');
    const sortSelect = document.getElementById('sort-select');

    function renderGallery(data) {
        tokohGaleri.innerHTML = '';
        
        data.forEach(wayang => {
            const nama = wayang.Nama; 
            const gambarPath = wayang.Gambar;
            
            if (gambarPath && nama) { 
                const card = document.createElement('div');
                card.classList.add('tokoh-card');

                card.innerHTML = `
                    <img src="${gambarPath}" alt="Tokoh Wayang ${nama}">
                    <div class="tokoh-name">${nama}</div>
                `;
                tokohGaleri.appendChild(card);
            }
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
                // Buat Pencarian Nama, Asal, atau Pembuat
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

        // 3. Render
        renderGallery(filteredData);
    }

    
    // Tombol Lihat Semua Tokoh
    lihatSemuaBtn.addEventListener('click', () => {
        filterSection.style.display = 'flex';
        tokohGaleri.style.display = 'grid';
        lihatSemuaBtn.style.display = 'none';
        applyFiltersAndSort(); 
    });

    searchInput.addEventListener('input', applyFiltersAndSort);
    sortSelect.addEventListener('change', applyFiltersAndSort);
});
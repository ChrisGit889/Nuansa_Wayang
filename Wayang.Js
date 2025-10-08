document.addEventListener('DOMContentLoaded', () => {
    // 1. Buat Navbar
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

    // 2. Fungsi untuk Highlight Halaman Aktif
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

    // 3. FUNGSI SMOOTH SCROLL (Untuk halaman fakta.html)
    function scrollToFakta(targetId) {
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth' 
            });
        }
    }
    
    const scrollIcon = document.querySelector('.scroll-down-icon');
    if (scrollIcon) {
        scrollIcon.addEventListener('click', (event) => {
            event.preventDefault();
            scrollToFakta('fakta-1'); 
        });
    }

    const aksesorisCards = document.querySelectorAll('.aksesoris-card');
    aksesorisCards.forEach(card => {
        card.addEventListener('click', (event) => {
            const href = card.getAttribute('href');
            if (href === '#null' || href === '#') {
                event.preventDefault(); 
            }
        });
    });

    // --- 5. LOGIKA GALERI DAN MODAL (Hanya berlaku di halaman tokoh) ---
    // --- DOM Elements ---
    const wayangGridContainer = document.getElementById('wayang-grid-container');
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    const modal = document.getElementById('wayang-modal');
    // Cek keberadaan modal untuk menghindari error di halaman lain
    if (modal) {
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
            if (wayangGridContainer) wayangGridContainer.innerHTML = '';
            
            data.forEach((wayang, index) => { 
                const nama = wayang.Nama; 
                const gambarPath = wayang.Gambar;
                
                if (gambarPath && nama) { 
                    const card = document.createElement('div');
                    card.classList.add('wayang-item');
                    card.dataset.nama = nama; 
                    card.innerHTML = `
                        <img src="${gambarPath}" alt="Tokoh Wayang ${nama}">
                        <div class="wayang-overlay">
                            <p class="wayang-nama">${nama}</p>
                        </div>
                    `;
                    
                    if (wayangGridContainer) {
                        wayangGridContainer.appendChild(card);
                        setTimeout(() => {
                            card.classList.add('animated');
                        }, index * 50); 
                    }
                }
            });
            attachModalListeners(); 
        }
        
        function showModal(namaTokoh) {
            // Cari data wayang berdasarkan Nama
            const wayang = dataWayang.find(w => w.Nama === namaTokoh);

            if (wayang) {
                let penjelasanSingkat = wayang.Penjelasan || "Penjelasan tidak tersedia.";
                
                // Ambil 1 kalimat pertama (sesuai request User) atau potong jika terlalu panjang
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
            // Memastikan dataWayang tersedia
            if (typeof dataWayang === 'undefined') return; 
            let filteredData = [...dataWayang]; 
            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
            const sortValue = sortSelect ? sortSelect.value : '';
            
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

        // Inisialisasi galeri (hanya jika ada container)
        if (wayangGridContainer) applyFiltersAndSort();
    }

    // 6. LOGIKA KUIS INTERAKTIF
const quizOptions = document.getElementById('quiz-options');
const learnMoreBtn = document.getElementById('learn-more-btn');
const quizButtons = document.querySelectorAll('#quiz-options .quiz-btn');

if (quizOptions) {
    quizOptions.addEventListener('click', (event) => {
        const clickedButton = event.target;

        if (clickedButton.classList.contains('quiz-btn')) {
            const isCorrect = clickedButton.getAttribute('data-answer') === 'correct';
            
            // Nonaktifkan semua tombol setelah jawaban diberikan
            quizButtons.forEach(btn => btn.classList.add('wrong-answer'));

            if (isCorrect) {
                // Jawaban Benar
                clickedButton.classList.remove('wrong-answer');
                clickedButton.classList.add('correct-answer');  // Tampilkan hijau
                
                // Sembunyikan tombol Pelajari Lebih Lanjut (Karena sudah benar)
                learnMoreBtn.style.display = 'none';

            } else {
                // Jawaban Salah
                clickedButton.classList.add('wrong-answer');
                // Cari jawaban yang benar dan tandai dengan hijau
                const correctAnswerBtn = document.querySelector('.quiz-btn[data-answer="correct"]');
                if (correctAnswerBtn) {
                    correctAnswerBtn.classList.remove('wrong-answer');
                    correctAnswerBtn.classList.add('correct-answer');
                }
                learnMoreBtn.style.display = 'inline-block';
            }
            // Nonaktifkan semua tombol agar tidak bisa diklik lagi
            quizButtons.forEach(btn => btn.style.pointerEvents = 'none');
        }
    });
}
});
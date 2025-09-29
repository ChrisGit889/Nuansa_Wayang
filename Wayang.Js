document.addEventListener('DOMContentLoaded', function() {

    const exploreButton = document.getElementById('explore-btn');
    
    const contentSection = document.getElementById('content-section');

    exploreButton.addEventListener('click', function() {
        contentSection.scrollIntoView({ behavior: 'smooth' });
    });

});
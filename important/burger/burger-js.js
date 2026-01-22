function toggleMenu() {
    const menu = document.querySelector('.menu');
    const hamburger = document.querySelector('.hamburger');
    const overlay = document.querySelector('.overlay');

    const isOpening = !menu.classList.contains('open');

    menu.classList.toggle('open');
    hamburger.classList.toggle('open');
    overlay.classList.toggle('show');

    if (!isOpening) {
        const allSubmenus = document.querySelectorAll('.submenu');
        const allArrows = document.querySelectorAll('.arrow');

        allSubmenus.forEach(sub => sub.classList.remove('open'));
        allArrows.forEach(arrow => arrow.classList.remove('open'));
    }
}

// Function to toggle the visibility of a specific submenu
function toggleSubmenu(section) {
    const submenu = document.getElementById(section + '-submenu');
    const arrow = document.getElementById(section + '-arrow');

    submenu.classList.toggle('open');
    arrow.classList.toggle('open');
}
document.addEventListener('DOMContentLoaded', () => {
    const menuHamburguer = document.querySelector('.menu-hamburguer');
    const navMenu = document.querySelector('nav');
    const fecharMenu = document.querySelector('.fechar-menu');

    if (menuHamburguer) {
        menuHamburguer.addEventListener('click', () => {
            navMenu.classList.add('ativo');
        });
    }

    if (fecharMenu) {
        fecharMenu.addEventListener('click', () => {
            navMenu.classList.remove('ativo');
        });
    }
});

document.getElementById('currentYear').textContent = new Date().getFullYear();
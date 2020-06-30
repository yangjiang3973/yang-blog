export const menuFloat = () => {
    const menu = document.getElementById('menu');
    const rect = menu.getBoundingClientRect();
    const overview = document.getElementById('overview');
    const scrollLimit = overview.clientHeight;
    const offset =
        document.documentElement.scrollTop || document.body.scrollTop;
    if (offset > scrollLimit) {
        menu.classList.add('menu__float');
        menu.style.left = rect.left;
    } else if (offset < scrollLimit) {
        menu.classList.remove('menu__float');
    }
};

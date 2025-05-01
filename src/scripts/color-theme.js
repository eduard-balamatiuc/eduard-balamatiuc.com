const theme = (() => {
    const localStorageTheme = localStorage?.getItem("theme") ?? '';
    if (['dark', 'light'].includes(localStorageTheme)) {
        return localStorageTheme;
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
})();

if (theme === 'light') {
    document.documentElement.classList.add('light-theme');
} else {
    document.documentElement.classList.remove('light-theme');
}

window.localStorage.setItem('theme', theme);

const handleToggleClick = () => {
    const element = document.documentElement;
    element.classList.toggle("light-theme");

    const isDark = !element.classList.contains("light-theme");
    localStorage.setItem("theme", isDark ? "dark" : "light");
}

document.querySelector('.theme-toggle')?.addEventListener("click", handleToggleClick);
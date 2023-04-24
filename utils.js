// variables
const themeToggle = document.querySelector('.theme-toggle');
const switchEl = document.querySelector('.switch');

//animate tranistion between themes
function transition() {
  document.documentElement.classList.add('transition');
  window.setTimeout(() => {
    document.documentElement.classList.remove('transition');
  }, 1000);
}

function changeTheme() {
  const theme = document.documentElement.getAttribute('data-theme');
  if (theme === 'light') {
    transition();
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    transition();
    document.documentElement.setAttribute('data-theme', 'light');
  }
}

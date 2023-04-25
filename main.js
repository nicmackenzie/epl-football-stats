themeToggle.addEventListener('click', () => {
  switchEl.classList.toggle('dark');
  changeTheme();
});

input.addEventListener('blur', e => {
  if (e.target.value.trim() === '') {
    input.classList.add('is-invalid');
  }
});

input.addEventListener('change', e => {
  if (e.target.value.trim() !== '') {
    input.classList.remove('is-invalid');
  }
});

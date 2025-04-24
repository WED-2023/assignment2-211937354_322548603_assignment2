function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(div => div.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

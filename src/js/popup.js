(function() {
  const popup = document.querySelector('.popup');
  const closePopupBtn = popup.querySelector('.popup__close-btn');
  let timer;

  closePopupBtn.addEventListener('click', () => {
    popup.classList.remove('popup--opened');
    clearTimeout(timer);
  });

  window.openPopup = () => popup.classList.add('popup--opened');

  window.closePopupOnTimer = () => {
    timer = setTimeout(() => {
      popup.classList.remove('popup--opened');
    }, 5000);
  }
})();

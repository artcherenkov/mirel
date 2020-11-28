(function () {
  const ENDPOINT = 'https://httpbin.org/post';
  const INPUT_INVALID_CLASS = 'question__input--invalid';

  const ANIMATION_DURATION = 600; // мс
  const ANIMATION = `animation: shake ${ANIMATION_DURATION}ms;`

  /**
   * Проверяет валидность формы
   * @param form DOM-элемент формы
   * @returns {boolean}
   */
  const checkValidity = (form) => {
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;
    Array.from(inputs).map(input => {
      input.classList.remove(INPUT_INVALID_CLASS);
      if (!input.value) {
        isValid = false;
        input.classList.add(INPUT_INVALID_CLASS);
      }
    });

    return isValid;
  }

  /**
   * Собирает данные из формы
   * @param form DOM-элемент формы
   * @returns {{}} объект вида {name: value, name: value ...}, где name - имя поля, value - значение
   */
  const collectFormData = (form) => {
    const formData = new FormData(form);
    let res = {}
    for (let [name, value] of formData) {
      res = { ...res, [name]: value };
    }

    return { ...res };
  }

  /**
   * Отправляет форму по указанному адресу
   * @param form DOM-элемент формы
   * @param url адрес, на который необходимо отправить форму
   * @returns {Promise<void>}
   */
  const sendForm = async (form, url) => {
    const data = JSON.stringify(collectFormData(form));
    await fetch(url, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        form.reset();
        window.openPopup();
        window.closePopupOnTimer()
      })
      .catch(() => {
        alert('Ошибка соединения');
      });
  }

  /**
   * Проигрывает анимацию на элементе
   * @param {HTMLElement} elem DOM-элемент
   * @param {string} animation строка CSS-свойства. Например, const `animation: shake ${duration}ms;`
   * @param {number} duration длительность анимации
   */
  const playAnimation = (elem, animation, duration) => {
    elem.style = animation;
    setTimeout(() => elem.removeAttribute('style'), duration)
  }

  const forms = document.forms;

  /**
   * Добавляет обработчики событий для всех форм на странице
   * @param forms список DOM-элементов форм
   */
  (function addFormEventListeners(forms) {
    Array.from(forms).map((form) => {
      form.addEventListener('submit', (evt) => {
        evt.preventDefault();

        if (checkValidity(form)) {
          sendForm(form, ENDPOINT)
        } else {
          playAnimation(form, ANIMATION, ANIMATION_DURATION);
        }
      });
    });
  })(forms);

  /**
   * Добавляет обработчики событий для всех input или textarea каждой формы
   * @param forms список DOM-элементов форм
   */
  (function addInputsEventListeners(forms) {
    Array.from(forms).map((form) => {
      const inputs = form.querySelectorAll('input, textarea');
      Array.from(inputs).map((input) => {
        input.addEventListener('input', () => {
          if (!input.value) {
            input.classList.add(INPUT_INVALID_CLASS);
          } else {
            input.classList.remove(INPUT_INVALID_CLASS);
          }
        });
      });
    });
  })(forms);
})();

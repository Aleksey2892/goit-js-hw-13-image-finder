import './styles.scss';
import fetchImages from './js/apiService';
import tempCard from './templates/tempCard.hbs';
import refs from './js/refs';
import iObserver from './js/observer';

import notification from 'toastr';
import './js/toastrSetting';
import 'toastr/build/toastr.css';
import './js/lightbox';

// LISTENERS
refs.form.addEventListener('submit', formHandler);

// FUNCTIONS
export let search = '';

function formHandler() {
  event.preventDefault();

  if (refs.input.value === search) {
    notification['warning'](
      `Введите другой запрос для поиска`,
      `Повторный запрос '${search}'`,
    );
    return;
  }

  clearPage();
  search = refs.input.value;

  // from apiService
  fetchImages(search)
    .then(res => {
      if (res.data.hits.length === 0) {
        notification['error'](
          'Попробуйте другой поисковой запрос',
          'Ничего не найдено',
        );

        refs.btnMore.removeEventListener('click', loadMoreData);
        refs.checkBox.removeEventListener('click', isChecked);
      } else {
        const quantity = res.data.total;
        const resData = res.data.hits;

        notification['success'](
          `По вашему запросу найдено ${quantity} изображений`,
          'Запрос выполнен',
        );

        refs.spinner.classList.add('disabled');
        // render page
        renderCards(resData);

        refs.checkBox.addEventListener('click', isChecked);
        refs.btnMore.addEventListener('click', loadMoreData);
      }
    })
    .catch(err => {
      console.log(err);
      notification['error'](`Ошибка: "${err}"`, 'Что-то пошло не так');
    })
    .finally(() => {
      refs.spinner.classList.add('disabled');
      refs.input.value = '';
    });
}

// render page
export function renderCards(data) {
  // from templates
  refs.gallery.insertAdjacentHTML('beforeend', tempCard(data));

  refs.btnBox.classList.remove('disabled');
}

// btn load more
export function loadMoreData() {
  refs.btnMore.setAttribute('disabled', true);
  refs.spinner.classList.remove('disabled');
  refs.btnMore.querySelector('span').textContent = '';

  // from apiService
  fetchImages(search)
    .then(data => {
      refs.spinner.classList.add('disabled');
      renderCards(data.data.hits);
    })
    .finally(() => {
      if (!refs.checkBox.checked) refs.btnMore.removeAttribute('disabled');
      refs.btnMore.querySelector('span').textContent = 'Load More...';
    })
    .catch(err => console.log(err));
}

// auto-loading by scrolling
function isChecked() {
  if (refs.checkBox.checked) {
    refs.btnMore.setAttribute('disabled', true);
    iObserver.observe(refs.btnMore);
  } else {
    iObserver.disconnect();
    refs.btnMore.classList.remove('transparent');
    refs.btnMore.removeAttribute('disabled');
  }
}

// clear page
function clearPage() {
  refs.gallery.innerHTML = '';
  refs.btnBox.classList.add('disabled');

  refs.btnMore.removeEventListener('click', loadMoreData);
  refs.checkBox.removeEventListener('click', isChecked);
}

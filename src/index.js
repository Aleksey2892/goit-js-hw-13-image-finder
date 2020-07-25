import './styles.scss';
import fetchImages from './js/apiService';
import tempCard from './templates/tempCard.hbs';
import refs from './js/refs';
import iObserver from './js/observer';

import notification from 'toastr';
import './js/toastrSetting';
import 'toastr/build/toastr.css';
import {
  checkTotalItems,
  pageNumberCounter,
  nextActiveLink,
} from './js/pagination';
import './js/lightbox';
// import $ from 'jquery';

// LISTENERS
refs.form.addEventListener('submit', formHandler);

// FUNCTIONS
export let search = '';

function formHandler() {
  event.preventDefault();

  if (refs.input.value === search) return;

  clearPage();
  search = refs.input.value;

  fetchImages(search)
    .then(res => {
      refs.pagesCounter.innerHTML = '';
      pageNumberCounter.pageNum = 0;

      const totalItems = res.data.total;
      checkTotalItems(totalItems);

      if (res.data.hits.length === 0) {
        notification['error'](
          'Попробуйте другой поисковой запрос',
          'Ничего не найдено',
        );
        refs.btnMore.removeEventListener('click', loadMoreData);
        refs.checkBox.removeEventListener('click', isChecked);
      } else {
        notification['success'](
          `По вашему запросу найдено ${res.data.total} изображений`,
          'Запрос выполнен',
        );
        refs.spinner.classList.add('disabled');
        renderCards(res.data.hits);
        refs.checkBox.addEventListener('click', isChecked);
      }
    })
    .catch(err => {
      notification['error'](`Ошибка: "${err}"`, 'Что-то пошло не так');
    })
    .finally(() => {
      refs.spinner.classList.add('disabled');
      refs.input.value = '';
    });
}

export function renderCards(data) {
  refs.gallery.insertAdjacentHTML('beforeend', tempCard(data));

  refs.btnMore.addEventListener('click', loadMoreData);
  refs.btnBox.classList.remove('disabled');
}

export function loadMoreData() {
  refs.btnMore.setAttribute('disabled', true);
  refs.spinner.classList.remove('disabled');
  refs.btnMore.querySelector('span').textContent = '';

  fetchImages(search)
    .then(data => {
      refs.spinner.classList.add('disabled');
      renderCards(data.data.hits);
      nextActiveLink();
    })
    .finally(() => {
      if (!refs.checkBox.checked) refs.btnMore.removeAttribute('disabled');
      refs.btnMore.querySelector('span').textContent = 'Load More...';
    })
    .catch(data => console.log(data));
}

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

function clearPage() {
  refs.gallery.innerHTML = '';
  refs.btnBox.classList.add('disabled');
}

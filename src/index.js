import './styles.scss';
import fetchImages from './js/apiService';
import tempCard from './templates/tempCard.hbs';
import refs from './js/refs';
import iObserver from './js/observer';

import notification from 'toastr';
import './js/toastrSetting';
import 'toastr/build/toastr.css';
import { checkTotalItems, pageNumberCounter } from './js/pagination';
// import pageNumbers from './js/pagination';
// import $ from 'jquery';

// LISTENERS
refs.form.addEventListener('submit', formHandler);
refs.checkBox.addEventListener('click', isChecked);

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
      } else {
        notification['success'](
          `По вашему запросу найдено ${res.data.total} изображений`,
          'Запрос выполнен',
        );
        refs.spinner.classList.add('disabled');
        refs.btnMore.querySelector('span').textContent = 'Load More';
        renderCards(res.data.hits);
      }
    })
    .catch(err => console.log(err))
    .finally(() => {
      refs.spinner.classList.add('disabled');
      refs.input.value = '';
      // console.log(search);
    });
}

// убрать потом экспорт
export function renderCards(data) {
  refs.gallery.insertAdjacentHTML('beforeend', tempCard(data));

  refs.btnMore.addEventListener('click', loadMoreData);
  refs.btnBox.classList.remove('disabled');
}

export function loadMoreData() {
  // isChecked();
  refs.btnMore.setAttribute('disabled', true);
  refs.spinner.classList.remove('disabled');
  refs.btnMore.querySelector('span').textContent = '';

  fetchImages(search)
    .then(data => {
      refs.spinner.classList.add('disabled');
      refs.btnMore.querySelector('span').textContent = 'Load More';
      renderCards(data.data.hits);
    })
    .finally(() => {
      if (!refs.checkBox.checked) refs.btnMore.removeAttribute('disabled');
    })
    .catch(data => console.log(data));
}

function isChecked() {
  if (refs.checkBox.checked) {
    refs.btnMore.classList.add('transparent');
    refs.btnMore.setAttribute('disabled', true);
    // refs.btnMore.querySelector('span').textContent = 'Loading';
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

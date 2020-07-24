import './styles.scss';
import fetchImages from './js/apiService';
import tempCard from './templates/tempCard.hbs';
import refs from './js/refs';
import iObserver from './js/observer';
import notification from 'toastr';
import './js/toastrSetting';
import 'toastr/build/toastr.css';
import $ from 'jquery';

// LISTENERS
refs.form.addEventListener('submit', formHandler);
refs.checkBox.addEventListener('click', isChecked);

// FUNCTIONS
export let search = '';

function formHandler() {
  event.preventDefault();

  refs.input.value !== search ? clearPage() : false; // а так можно?))

  search = refs.input.value;

  fetchImages(search)
    .then(res => {
      if (res.data.hits.length === 0) {
        notification['error'](
          'Попробуйте другой поисковой запрос',
          'Ничего не найдено',
        );
      } else {
        notification['success'](
          `По вашему запросу найдено ${res.data.total} изображений`,
          'Ничего не найдено',
        );
        refs.spinner.classList.add('disabled');
        refs.btnMore.querySelector('span').textContent = 'Load More';
        renderCards(res.data.hits);
      }
    })
    .catch(data => console.log(data))
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
  refs.spinner.classList.remove('disabled');
  refs.btnMore.querySelector('span').textContent = '';

  fetchImages(search)
    .then(data => {
      refs.spinner.classList.add('disabled');
      refs.btnMore.querySelector('span').textContent = 'Load More';
      renderCards(data.data.hits);
    })
    .catch(data => console.log(data))
    .finally(() => {
      // console.log(search);
    });
}

function isChecked() {
  refs.checkBox.checked
    ? iObserver.observe(refs.btnMore)
    : iObserver.disconnect();
}

function clearPage() {
  refs.gallery.innerHTML = '';
  refs.btnBox.classList.add('disabled');
}

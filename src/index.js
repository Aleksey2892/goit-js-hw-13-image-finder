import './styles.scss';
import { fetchImages, pageNumber } from './js/apiService';
import tempCard from './templates/tempCard.hbs';
import refs from './js/refs';
import iObserver from './js/observer';

import notification from 'toastr';
import './js/toastrSetting';
import 'toastr/build/toastr.css';
import './js/lightbox';
import showModal from './js/lightbox';
import { statisticHandler, favorites } from './js/statistics';
import $ from 'jquery';

// LISTENERS
refs.form.addEventListener('submit', formHandler);
refs.btnFavorites.addEventListener('click', favoritesHandler);

// FUNCTIONS
export let search = '';
const idForLike = [];

function formHandler() {
  event.preventDefault();
  isActiveFavorites = false;

  if (refs.input.value === search) {
    notification['warning'](
      `Введите другой запрос для поиска`,
      `Повторный запрос '${search}'`,
    );
    return;
  }

  clearPage();
  search = refs.input.value;
  pageNumber.counter = 0;

  // from apiService
  fetchImages(search)
    .then(res => {
      // pageNumber.counter = 0;
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
        searchId(res.data.hits);
        setLike(idForLike);

        // gallery lisnener
        refs.gallery.addEventListener('click', galleryHandler);

        refs.checkBox.addEventListener('click', isChecked);
        refs.btnMore.addEventListener('click', loadMoreData);

        refs.btnMore.style = 'display: flex';
        refs.checkBoxLabel.style = 'display: block';
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
      searchId(data.data.hits);
      setLike(idForLike);
    })
    .finally(() => {
      if (!refs.checkBox.checked) refs.btnMore.removeAttribute('disabled');
      refs.btnMore.querySelector('span').textContent = 'Load More...';
    })
    .catch(err => {
      console.log(err);
      notification['error'](`Ошибка: "${err}"`, 'Что-то пошло не так');
    });
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

  refs.btnMore.removeEventListener('click', galleryHandler);

  refs.btnMore.removeEventListener('click', loadMoreData);
  refs.checkBox.removeEventListener('click', isChecked);
}

function galleryHandler(event) {
  if (isActiveFavorites) {
    if (event.target.parentElement.classList.contains('like')) {
      if (favorites.length >= 1) {
        const li = $(event.target).parents('.card')[0];
        li.style = 'display: none';
      }
    }
  }

  showModal();

  if (event.target.parentElement.dataset.like === 'like') {
    statisticHandler(event);
  }
}

let isActiveFavorites = false;

function favoritesHandler(event) {
  isActiveFavorites = true;
  clearPage();
  renderCards(favorites);

  refs.btnMore.removeEventListener('click', loadMoreData);
  refs.checkBox.removeEventListener('click', isChecked);
  refs.btnMore.style = 'display: none';
  refs.checkBoxLabel.style = 'display: none';

  refs.gallery.addEventListener('click', galleryHandler);
  const allLikesCards = document.querySelectorAll('[data-like="like"]');

  allLikesCards.forEach(statLike => {
    statLike.classList.add('like');
  });
}

function searchId(res) {
  res.forEach(el => {
    el.id = String(el.id);
    favorites.forEach(el2 => {
      if (el.id === el2.id) {
        idForLike.push(el.id);
      }
    });
  });
}

function setLike(idForLike) {
  try {
    idForLike.forEach(id => {
      const li = document.querySelector(`[data-id="${id}"]`);
      if (li === null) return;
      li.querySelector('[data-like="like"]').classList.add('like');
      const spanLikes = Number(
        li.querySelector('[data-like="like"] > span').textContent,
      );

      const totalLikes = spanLikes + 1;
      li.querySelector('[data-like="like"] > span').textContent = totalLikes;
    });
  } catch (err) {
    console.log(err);
    notification['error'](`Ошибка: "${err}"`, 'Что-то пошло не так');
  }
}

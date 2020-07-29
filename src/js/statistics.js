import refs from './refs';
import $ from 'jquery';
import loadPage from './loadPage';
import { renderCards } from '../index';

function statisticHandler(event) {
  if (event.target.nodeName === 'SPAN' || event.target.nodeName === 'I') {
    if (event.target.nodeName === 'I') {
      const parentTarget = event.target.nextElementSibling;

      plusLike(parentTarget);

      event.target.parentElement.classList.toggle('like');
    } else {
      plusLike(event.target);

      event.target.parentElement.classList.toggle('like');
    }
  }
}

let favorites = [];
if (loadPage()) favorites = loadPage(); // recovers data on reboot from localStorage
if (favorites.length >= 1) {
  refs.quantityLikes.textContent = favorites.length;
}

function plusLike(elem) {
  const id = $(elem).parents('.card')[0].dataset.id;
  const numberLikes = Number(elem.textContent);

  if (!checkId(id)) {
    createObj(elem);
    refs.quantityLikes.textContent = favorites.length;

    elem.textContent = numberLikes + 1;
  } else {
    favorites = removeObj(favorites, id);
    refs.quantityLikes.textContent = favorites.length;

    localStorage.setItem('favorites', JSON.stringify(favorites));

    elem.textContent = numberLikes - 1;
  }
}

function createObj(elem) {
  let favoriteItem = {};

  favoriteItem.id = $(elem).parents('.card')[0].dataset.id;

  favoriteItem.webformatURL = $(elem)
    .parents('.photo-card')[0]
    .firstElementChild.getAttribute('src');

  favoriteItem.largeImageURL = $(elem)
    .parents('.photo-card')[0]
    .firstElementChild.dataset.largeimg.substr(1);

  const likesQuantity = Number(elem.textContent);
  favoriteItem.likes = likesQuantity + 1;

  favoriteItem.views = $(elem).parents(
    '.stats',
  )[0].children[1].lastElementChild.textContent;

  favoriteItem.comments = $(elem).parents(
    '.stats',
  )[0].children[2].lastElementChild.textContent;

  favoriteItem.downloads = $(elem).parents(
    '.stats',
  )[0].children[3].lastElementChild.textContent;

  favorites.push(favoriteItem);

  localStorage.setItem('favorites', JSON.stringify(favorites));
}

function checkId(number) {
  return favorites.find(card => card.id === number);
}

function removeObj(arr, id) {
  return arr.filter(obj => obj.id !== id);
}

export { statisticHandler, favorites };

import refs from './refs';
import $ from 'jquery';

function fn(event) {
  if (event.target.nodeName === 'SPAN' || event.target.nodeName === 'I') {
    if (event.target.nodeName === 'I') {
      const parentTarget = event.target.nextElementSibling;
      plusLike(parentTarget);
    } else {
      plusLike(event.target);
    }
  }
}
const favorites = [];

function plusLike(elem) {
  const id = $(elem).parents('.card')[0].dataset.id;

  favorites.find(el => {
    if (el.id === id) {
      console.log('нашел');
      let like = Number(elem.textContent);
      return (elem.textContent = like - 1);
    } else {
      console.log('не нашел');
      createObj(elem);
      let likes = Number(elem.textContent);
      elem.textContent = likes + 1;
    }
  });
}

function createObj(elem) {
  let favoriteItem = {};

  favoriteItem.id = $(elem).parents('.card')[0].dataset.id;
  favoriteItem.webformatURL = $(elem)
    .parents('.photo-card')[0]
    .firstElementChild.getAttribute('src');
  favoriteItem.largeImageURL = $(elem).parents(
    '.photo-card',
  )[0].firstElementChild.dataset.largeimg;
  favoriteItem.likes = elem.textContent;
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
  console.log(favoriteItem);
  console.log(favorites);
}

export default fn;

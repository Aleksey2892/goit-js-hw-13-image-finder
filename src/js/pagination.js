import axios from 'axios';
import { myApiKey } from './apiService';
import { search, renderCards } from '../index';
import tempCard from '../templates/tempCard.hbs';
import refs from './refs';

/*
 */

refs.pagesCounter.addEventListener('click', testFetch);

export function checkTotalItems(totalItems) {
  if (totalItems >= 500) {
    console.log('render 42 pages');
  } else {
    const totalPageRender = Math.round(totalItems / 12);

    for (let i = 0; i < totalPageRender; i += 1) {
      render('#');
    }
  }
}

let num = 0;
function render(url) {
  num += 1;
  document.querySelector('.pagination-count').insertAdjacentHTML(
    'beforeend',
    `<li>
    <a href="${url}" data-num="${num}">${num}</a>
    </li>`,
  );
}

function testFetch(event) {
  const num = event.target.dataset.num;

  return axios
    .get(
      `?image_type=photo&orientation=horizontal&q=${search}&page=${num}&per_page=12&key=${myApiKey}`,
    )
    .then(res => {
      console.log(res.data.hits);
      document.querySelector('.gallery').innerHTML = '';
      renderCards(res.data.hits);
    });
}

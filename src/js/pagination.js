import axios from 'axios';
import { myApiKey } from './apiService';

import { search, renderCards } from '../index';
import refs from './refs';

/*
 */

refs.pagesCounter.addEventListener('click', fetchPagination);

export function checkTotalItems(totalItems) {
  let totalPageRender = Math.round(totalItems / 12);

  if (totalItems >= 500) {
    totalPageRender = 42;

    for (let i = 0; i < totalPageRender; i += 1) {
      render('#');
    }
  } else {
    for (let i = 0; i < totalPageRender; i += 1) {
      render('#');
    }
  }
}

export const pageNumberCounter = {
  pageNum: 0,
};
// let num = 0;

function render(url) {
  pageNumberCounter.pageNum += 1;

  refs.pagesCounter.insertAdjacentHTML(
    'beforeend',
    `<li>
    <a href="${url}" data-num="${pageNumberCounter.pageNum}">${pageNumberCounter.pageNum}</a>
    </li>`,
  );
  refs.pagesCounter.querySelector('li').classList.add('active');
}

function fetchPagination(event) {
  if (event.target.nodeName !== 'A') return;

  refs.pagesCounter.querySelector('li.active').classList.remove('active');
  event.target.parentElement.classList.add('active');
  const num = event.target.dataset.num;

  return axios
    .get(
      `?image_type=photo&orientation=horizontal&q=${search}&page=${num}&per_page=12&key=${myApiKey}`,
    )
    .then(res => {
      refs.gallery.innerHTML = '';
      renderCards(res.data.hits);
    })
    .catch(err => console.log(err));
}

export function nextActiveLink() {
  const activeLink = refs.pagesCounter.querySelector('.active');

  if (activeLink.nextElementSibling === null) return;

  activeLink.nextElementSibling.classList.add('active');
  activeLink.classList.remove('active');
}

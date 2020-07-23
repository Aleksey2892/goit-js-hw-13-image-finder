import './styles.scss';
import fetchImages from './js/apiService';
import tempCard from './templates/tempCard.hbs';

const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('.input'),
  gallery: document.querySelector('.gallery'),
  btnMore: document.querySelector('.btn-more'),
  spinner: document.querySelector('.loader'),
};

refs.form.addEventListener('submit', formHandler);

let search = '';

function formHandler() {
  event.preventDefault();

  if (refs.input.value !== search) {
    refs.gallery.innerHTML = '';
  }

  search = refs.input.value;

  fetchImages(search)
    .then(data => renderCards(data.data.hits))
    .catch(data => console.log(data))
    .finally(() => {
      refs.spinner.classList.add('disabled');
      refs.input.value = '';
      console.log(search);
    });
}

function renderCards(data) {
  refs.gallery.insertAdjacentHTML('beforeend', tempCard(data));

  refs.btnMore.addEventListener('click', btnHandler);
  refs.btnMore.classList.remove('disabled');
}

function btnHandler() {
  refs.spinner.classList.remove('disabled');

  fetchImages(search)
    .then(data => renderCards(data.data.hits))
    .catch(data => console.log(data))
    .finally(() => {
      refs.spinner.classList.add('disabled');
      console.log(search);
    });
}

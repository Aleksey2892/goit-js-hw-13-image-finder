import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/src/styles/main.scss';
import refs from './refs';
import { options } from 'toastr';

refs.gallery.addEventListener('click', showModal);

function showModal() {
  const largeImg = event.target.dataset.largeimg.substr(1);

  basicLightbox
    .create(
      `
		<img width="1400" height="900" src="${largeImg}">
	`,
      { closable: true },
    )
    .show();
}

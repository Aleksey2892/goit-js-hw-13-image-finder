import axios from 'axios';
import refs from './refs';
import { checkTotalItems } from './pagination';
const apiKey = '17035174-bfc38ce79fe188f7bfeb26d93';
export const myApiKey = '17616559-acc4465745e7b4973de900fa6';
axios.defaults.baseURL = 'https://pixabay.com/api/';

let pageNumber = 1;

function fetchImages(search) {
  pageNumber += 1;
  return axios
    .get(
      `?image_type=photo&orientation=horizontal&q=${search}&page=${pageNumber}&per_page=12&key=${myApiKey}`,
    )
    .then(res => res)
    .then(res => {
      const totalItems = res.data.total;
      checkTotalItems(totalItems);

      return res;
    })
    .catch(err => {
      throw err;
    });
}

export default fetchImages;

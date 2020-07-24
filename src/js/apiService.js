// import refs from './refs';
import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api/';

const apiKey = '17035174-bfc38ce79fe188f7bfeb26d93';
export const myApiKey = '17616559-acc4465745e7b4973de900fa6';

let pageNumber = 1;

function fetchImages(search) {
  pageNumber += 1;
  return axios
    .get(
      `?image_type=photo&orientation=horizontal&q=${search}&page=${pageNumber}&per_page=12&key=${myApiKey}`,
    )
    .then(res => res)
    .catch(err => {
      throw err;
    });
}

export default fetchImages;

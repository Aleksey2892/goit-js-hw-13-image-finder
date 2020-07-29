import { favorites } from './statistics';
import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api/';

export const myApiKey = '17616559-acc4465745e7b4973de900fa6';

const pageNumber = {
  counter: 0,
};

function fetchImages(search) {
  pageNumber.counter += 1;
  console.log(pageNumber.counter);
  return axios
    .get(
      `?image_type=photo&orientation=horizontal&q=${search}&page=${pageNumber.counter}&per_page=12&key=${myApiKey}`,
    )
    .then(res => {
      console.log(res.data);
      return res;
    })
    .catch(err => {
      throw err;
    });
}

export { fetchImages, pageNumber };

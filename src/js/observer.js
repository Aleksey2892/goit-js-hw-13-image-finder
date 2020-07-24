import { loadMoreData, search } from '../index';

export const iObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    entry.isIntersecting ? loadMoreData(search) : false;
  });
});

export default iObserver;

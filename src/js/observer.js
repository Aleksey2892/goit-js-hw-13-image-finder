import { loadMoreData, search } from '../index';

export const iObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) loadMoreData(search);
  });
});

export default iObserver;

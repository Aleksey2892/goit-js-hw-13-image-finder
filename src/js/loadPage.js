function loadPage() {
  try {
    if (localStorage.getItem('favorites')) {
      const getFavorites = localStorage.getItem('favorites');
      const parsedFavorites = JSON.parse(getFavorites);
      return parsedFavorites;
    }
  } catch (err) {
    console.log('Local storage error:', err);
  }
}

export default loadPage;

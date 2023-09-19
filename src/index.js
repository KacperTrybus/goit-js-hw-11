import Notiflix from 'notiflix';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let startIndex = 0;
let currentPage = 1;
loadMoreBtn.style.display = 'none';

const handleSearch = async () => {
  const searchQuery = form.searchQuery.value; //value w search input
  const apiKey = '39539383-c957f911c4d26df2837324ce8';

  const queryParams = {
    key: apiKey,
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: currentPage,
  };

  const url = `https://pixabay.com/api/?${new URLSearchParams(
    queryParams
  ).toString()}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.hits.length === 0) {
      // jak znaleziono 0 obrazow
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      for (const image of data.hits) {
        //info o obrazkach
        const photoCard = document.createElement('div');
        photoCard.classList.add('photo-card');

        const img = document.createElement('img');
        img.src = image.webformatURL;
        img.alt = image.tags;
        img.loading = 'lazy';

        const info = document.createElement('div');
        info.classList.add('info');

        const likes = document.createElement('p');
        likes.classList.add('info-item');
        likes.innerHTML = `<b>Likes:</b> ${image.likes}`;

        const views = document.createElement('p');
        views.classList.add('info-item');
        views.innerHTML = `<b>Views:</b> ${image.views}`;

        const comments = document.createElement('p');
        comments.classList.add('info-item');
        comments.innerHTML = `<b>Comments:</b> ${image.comments}`;

        const downloads = document.createElement('p');
        downloads.classList.add('info-item');
        downloads.innerHTML = `<b>Downloads:</b> ${image.downloads}`;

        info.appendChild(likes);
        info.appendChild(views);
        info.appendChild(comments);
        info.appendChild(downloads);

        photoCard.appendChild(img);
        photoCard.appendChild(info);

        gallery.appendChild(photoCard);
      }

      const totalHits = data.totalHits; // liczba pasuajcych obrazow
      const imagesPerPage = 40;
      startIndex += imagesPerPage; //wyswietlanie 40 pbrazow na strone
      if (startIndex < totalHits) {
        loadMoreBtn.style.display = 'block';
        currentPage++;
      } else {
        loadMoreBtn.style.display = 'none';
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }
    }
  } catch (error) {
    console.error('Błąd podczas wysyłania żądania:', error);
  }
};

form.addEventListener('submit', async event => {
  event.preventDefault();

  gallery.innerHTML = '';
  loadMoreBtn.style.display = 'none';
  startIndex = 0;
  currentPage = 1;

  await handleSearch();
});

loadMoreBtn.addEventListener('click', async () => {
  await handleSearch();
});

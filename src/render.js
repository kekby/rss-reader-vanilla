import i18next from 'i18next';

const createMessageEl = (status, message) => {
  const div = document.createElement('div');
  div.className = `feedback ${status === 'error' ? 'text-danger' : 'text-success'}`;
  div.textContent = message;
  return div;
};

const renderFeeds = (rssFeeds) => {
  const container = document.querySelector('.feeds');
  const postsContainer = document.querySelector('.posts');
  container.innerHTML = '';

  const feedTitle = document.createElement('h2');
  feedTitle.textContent = i18next.t('feeds');
  container.appendChild(feedTitle);

  const list = document.createElement('ul');
  list.className = 'list-group mb-5';
  container.appendChild(list);

  rssFeeds.forEach(({ title, description }) => {
    const item = document.createElement('li');
    item.className = 'list-group-item';
    item.innerHTML = `<h3>${title}</h3><p>${description}</p>`;
    list.appendChild(item);
  });

  const posts = rssFeeds.map((feed) => feed.posts).flat();

  if (posts.length > 0) {
    const title = document.createElement('h2');
    title.textContent = i18next.t('posts');
    postsContainer.appendChild(title);
  }

  // <a href="https://ru.hexlet.io/courses/html-pug/lessons/iteration/theory_unit" class="font-weight-bold" data-id="2" target="_blank" rel="noopener noreferrer">Циклы / HTML: Препроцессор Pug</a>

  const postsList = document.createElement('ul');
  postsList.className = 'list-group mb-5';
  postsContainer.appendChild(postsList);

  posts.forEach(({
    link, title, id,
  }) => {
    const item = document.createElement('li');
    item.className = 'list-group-item d-flex justify-content-between align-items-start';
    item.innerHTML = `
      <a href=${link} class="font-weight-bold" data-id=${id} target="_blank" rel="noopener noreferrer">${title}</a>
      <button type="button" class="btn btn-primary btn-sm" data-id=${id}" data-toggle="modal" data-target="#modal">${i18next.t('viewPost')}</button>
    `;
    postsList.appendChild(item);
  });
};

const render = ({ status, message, rssFeeds }) => {
  const input = document.querySelector('input[name="url"]');
  const submitButton = document.querySelector('button[type="submit"]');
  const formContainer = document.querySelector('.mx-auto');

  const messageEls = document.querySelectorAll('.feedback');
  messageEls.forEach((el) => el.remove());

  if (status === 'error' || status === 'rss-filled') {
    const messageEl = createMessageEl(status, message);
    formContainer.appendChild(messageEl);
  }

  if (status === 'error') {
    input.classList.add('is-invalid');
  } else {
    input.classList.remove('is-invalid');
  }

  if (status === 'fetching') {
    submitButton.setAttribute('disabled', true);
  } else {
    submitButton.removeAttribute('disabled');
  }

  if (status === 'rss-filled') {
    renderFeeds(rssFeeds);
  }
};

export default render;

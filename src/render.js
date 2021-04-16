import i18next from 'i18next';

const createMessageEl = (status, message) => {
  const div = document.createElement('div');
  div.className = `feedback ${status === 'error' ? 'text-danger' : 'text-success'}`;
  div.textContent = i18next.t(message);
  return div;
};

const renderModal = (post) => {
  const modalTitleEl = document.querySelector('.modal-title');
  const modalDescriptionEl = document.querySelector('.modal-body');
  const modalFullArticleLink = document.querySelector('.full-article');

  modalTitleEl.textContent = post.title;
  modalDescriptionEl.textContent = post.description;
  modalFullArticleLink.href = post.link;
};

const renderFeeds = (state, onButtonClick) => {
  const { rssFeeds, readed } = state;

  const container = document.querySelector('.feeds');
  const postsContainer = document.querySelector('.posts');
  container.innerHTML = '';
  postsContainer.innerHTML = '';

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

  const postsList = document.createElement('ul');
  postsList.className = 'list-group mb-5';
  postsContainer.appendChild(postsList);

  posts.forEach((post) => {
    const {
      link, title, id,
    } = post;
    const item = document.createElement('li');
    item.className = 'list-group-item d-flex justify-content-between align-items-start';
    item.innerHTML = `
      <a href=${link} class=${readed.some((postId) => postId === id) ? 'font-weight-normal' : 'font-weight-bold'} data-id=${id} target="_blank" rel="noopener noreferrer">${title}</a>
      <button type="button" class="btn btn-primary btn-sm" data-id=${id} data-toggle="modal" data-target="#modal">${i18next.t('viewPost')}</button>
    `;
    postsList.appendChild(item);

    item.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        const { id: postId } = e.target.dataset;
        if (postId) {
          renderModal(post);
          onButtonClick(postId);
        }
      }
    });
  });
};

const render = (state) => {
  const {
    status, message, readed,
  } = state;
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
    input.setAttribute('readonly', true);
  } else {
    submitButton.removeAttribute('disabled');
    input.removeAttribute('readonly');
  }

  if (status === 'rss-filled') {
    const onButtonClick = (id) => {
      readed.push(id);
      render(state);
    };
    renderFeeds(state, onButtonClick);
  }
};

export default render;

import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import watcher from './watcher';
import parse from './parser';
import validate from './validate';

export default () => {
  const state = {
    // 'init' | 'fetching' | 'rss-filled' | 'error'
    status: 'init',
    // eslint-disable-next-line max-len
    // { url: string, title: string, description: string, posts: Array<{ id: number, title: string, description: string}> }
    rssFeeds: [],
    message: null,
  };

  const form = document.querySelector('form.rss-form');

  const watchedState = watcher(state);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const value = data.get('url');

    try {
      validate(watchedState, value);
    } catch (err) {
      watchedState.status = 'error';
      watchedState.message = err.message;
    }

    watchedState.rssUrl = value;
    watchedState.status = 'fetching';
    watchedState.message = '';

    axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${value}`)
      .catch((err) => {
        watchedState.message = 'Ошибка сети';
        watchedState.status = 'error';
        throw new Error(err);
      })
      .then((res) => {
        try {
          return parse(res.data.contents);
        } catch (err) {
          watchedState.message = 'Ресурс не содержит валидный RSS';
          watchedState.status = 'error';
          throw new Error(err);
        }
      })
      .then((rssData) => {
        form.elements.url.value = '';
        watchedState.status = 'rss-filled';
        watchedState.message = 'RSS успешно загружен';
        watchedState.rssFeeds = [...watchedState.rssFeeds, {
          ...rssData,
          url: value,
        }];
      });
  });
};

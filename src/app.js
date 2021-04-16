import axios from 'axios';
import i18next from 'i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import watcher from './watcher';
import parse from './parser';
import validate from './validate';
import translations from './translations';

const run = () => {
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

  const getRss = (value) => {
    watchedState.rssUrl = value;
    watchedState.status = 'fetching';
    watchedState.message = '';

    axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${value}`)
      .then((res) => parse(res.data.contents))
      .then((rssData) => {
        form.elements.url.value = '';
        watchedState.status = 'rss-filled';
        watchedState.message = i18next.t('rssFilled');
        watchedState.rssFeeds = [...watchedState.rssFeeds, {
          ...rssData,
          url: value,
        }];
      })
      .catch((err) => {
        if (err.message === 'Network Error') {
          watchedState.message = i18next.t('errors.network');
        } else {
          watchedState.message = err.message;
        }

        watchedState.status = 'error';
      });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const value = data.get('url');

    try {
      validate(watchedState, value);
      getRss(value);
    } catch (err) {
      watchedState.status = 'error';
      watchedState.message = err.message;
    }
  });
};

export default () => {
  i18next.init({
    lng: 'ru',
    debug: true,
    resources: translations,
  }).then(run);
};

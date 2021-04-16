import i18next from 'i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'jquery';
import watcher from './watcher';
import parse from './parser';
import validate from './validate';
import translations from './translations';
import { getRss } from './api';
import { findAddedPosts } from './utils';

const FEED_UPDATE_INTERVAL = 5000;

const run = () => {
  const state = {
    // 'init' | 'fetching' | 'rss-filled' | 'error'
    status: 'init',
    // eslint-disable-next-line max-len
    // { url: string, title: string, description: string, posts: Array<{ id: number, title: string, description: string}> }
    rssFeeds: [],
    message: null,
    realtime: false,
    readed: [],
  };

  const form = document.querySelector('form.rss-form');

  const watchedState = watcher(state);

  const runRefreshInterval = () => {
    setTimeout(() => {
      const { rssFeeds } = watchedState;

      const getUpdatedFeeds = rssFeeds
        .map((feed) => getRss(feed.url)
          .then((res) => parse(res.data.contents))
          .then((parsedFeed) => findAddedPosts(feed, parsedFeed))
          .then((newPosts) => ({ ...feed, posts: [...newPosts, ...feed.posts] })));

      Promise.all(getUpdatedFeeds).then((results) => {
        watchedState.realtime = true;
        watchedState.rssFeeds = results;
      }).finally(runRefreshInterval);
    }, FEED_UPDATE_INTERVAL);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const value = data.get('url');

    try {
      validate(watchedState, value);

      watchedState.rssUrl = value;
      watchedState.status = 'fetching';
      watchedState.message = '';

      getRss(value)
        .then((res) => parse(res.data.contents))
        .then((rssData) => {
          form.elements.url.value = '';
          watchedState.status = 'rss-filled';
          watchedState.message = 'rssFilled';
          watchedState.rssFeeds = [...watchedState.rssFeeds, {
            ...rssData,
            url: value,
          }];
        })
        .then(() => {
          if (!watchedState.realtime) {
            runRefreshInterval();
          }
        })
        .catch((err) => {
          if (err.message === 'Network Error') {
            watchedState.message = 'errors.network';
          } else {
            watchedState.message = err.message;
          }

          watchedState.status = 'error';
        });
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

import onChange from 'on-change';
import render from './render';

const watcher = (state) => onChange(state, () => {
  render(state);
});

export default watcher;

import onChange from 'on-change';
import render from './render';

const watcher = (state) => onChange(state, () => {
  console.log(state);
  render(state);
});

export default watcher;

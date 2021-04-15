const createErrorEl = (error) => {
  const div = document.createElement('div');
  div.className = 'feedback text-danger';
  div.textContent = error;
  return div;
};

const render = ({ status, error }) => {
  const input = document.querySelector('input[name="url"]');

  if (status === 'error') {
    input.classList.add('is-invalid');

    const errorContainer = document.querySelector('.mx-auto');
    const errorEl = createErrorEl(error);

    errorContainer.appendChild(errorEl);
  } else {
    input.classList.remove('is-invalid');
    const errorEls = document.querySelectorAll('.feedback.text-danger');
    errorEls.forEach((el) => el.remove());
  }
};

export default render;

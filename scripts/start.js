const loadText = document.querySelector('.loading-text');
const background = document.querySelector('.background');
const button = document.querySelector('a');

let load = 0;

function blurring() {
  load++;

  if (load > 100) {
    clearInterval(int);
    loadText.classList.add('hide');
    button.classList.remove('hide');
  }

  loadText.innerText = `${load}%`;
  loadText.style.opacity = scale(load, 0, 100, 1, 0);
  background.style.filter = `blur(${scale(load, 0, 100, 30, 0)}px)`;
}

let int = setInterval(blurring, 20);

const scale = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
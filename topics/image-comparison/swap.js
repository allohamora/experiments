const swapBeforeAndAfter = () => {
  const imageComparison = document.querySelector('.queens-gambit');
  const after = imageComparison.getAttribute('after');
  const before = imageComparison.getAttribute('before');

  imageComparison.setAttribute('after', before);
  imageComparison.setAttribute('before', after);
};

setInterval(swapBeforeAndAfter, 1000);

const anchors = document.querySelectorAll('a');
anchors.forEach((a) => {
  a.setAttribute('target', '__blank');
  a.setAttribute('rel', 'noopener noreferrer');
});
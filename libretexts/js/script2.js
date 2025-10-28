document.addEventListener('DOMContentLoaded', () => {
  enhanceElides();

  document.querySelectorAll('.answer-header').forEach(header => {
    header.addEventListener('click', function () {
      const targetId = this.getAttribute('data-target');
      const content = document.getElementById(targetId);
      const arrow = this.querySelector('.answer-arrow');

      const isHidden = content.classList.contains('is-hidden');
      this.classList.toggle('is-open');

      if (isHidden) {
        content.classList.remove('is-hidden');
        slideToggleContent(content, true);
        if (arrow) arrow.textContent = '−';
      } else {
        slideToggleContent(content, false);
        if (arrow) arrow.textContent = '+';
      }
    });
  });
});

class MenuInteraction extends HTMLElement {
  connectedCallback() {
    setTimeout(() => this.init(), 0);
  }

  init() {
    const menuImages = document.querySelectorAll('.menu-image-container');
    const menuItems = document.querySelectorAll('.menu-item');

    const handleHover = (id, isActive) => {
      const targetImage = document.querySelector(`.menu-image-container[data-id="${id}"]`);
      const targetItem = document.querySelector(`.menu-item[data-id="${id}"]`);

      if (targetImage) {
        isActive ? targetImage.classList.add('highlight') : targetImage.classList.remove('highlight');
      }
      if (targetItem) {
        isActive ? targetItem.classList.add('highlight') : targetItem.classList.remove('highlight');
      }
    };

    menuImages.forEach(img => {
      img.addEventListener('mouseenter', () => handleHover(img.dataset.id, true));
      img.addEventListener('mouseleave', () => handleHover(img.dataset.id, false));
    });

    menuItems.forEach(item => {
      item.addEventListener('mouseenter', () => handleHover(item.dataset.id, true));
      item.addEventListener('mouseleave', () => handleHover(item.dataset.id, false));
    });
  }
}

customElements.define('menu-interaction', MenuInteraction);

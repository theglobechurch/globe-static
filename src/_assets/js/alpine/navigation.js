export default () => ({
  navOpen: false,
  menuLabel: 'Menu',

  init() {
    this.$watch('navOpen', () => {
      this.menuLabel = this.navOpen ? 'Close' : 'Menu';
    });

    document.addEventListener('keyup', (event) => this.escapeClose(event));
  },

  toggle() {
    this.navOpen = !this.navOpen;
    // prevent scrolling when the menu is open
    document.body.classList.toggle('preventScroll', this.navOpen);
  },

  close() {
    if (!this.navOpen) return;

    this.navOpen = false;
    document.body.classList.remove('preventScroll');
  },

  // using alpine js listen for the escape key to close the menu
  escapeClose(event) {
    if (event.key === 'Escape' && this.navOpen) {
      this.close();
    }
  }
})

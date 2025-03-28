export default () => ({
  navOpen: false,
  menuLabel: 'Menu',

  init() {
    this.$watch('navOpen', () => {
      this.menuLabel = this.navOpen ? 'Close' : 'Menu'
    });

    document.addEventListener('keyup', (event) => this.escapeClose(event));
  },

  toggle() {
    this.navOpen = !this.navOpen
  },

  // using alpine js listen for the escape key to close the menu
  escapeClose(event) {
    if (event.key === 'Escape' && this.navOpen) {
      this.navOpen = false
    }
  }
})

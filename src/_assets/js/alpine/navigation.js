export default () => ({
  navOpen: false,
  menuLabel: 'Menu',

  init() {
    this.$watch('navOpen', () => {
      this.menuLabel = this.navOpen ? 'Close' : 'Menu'
    });
  },

  toggle() {
    this.navOpen = ! this.navOpen
  }
})

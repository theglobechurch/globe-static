export const bannerImageCrossFade = () => {
  const imageBanner = document.querySelector('.js-imageBanner');
  if (imageBanner) {
    const imageBannerChildren = imageBanner.children;

    for (let i = 1; i < imageBannerChildren.length; i++) {
      const img = imageBannerChildren[i].querySelector('img');
      if (img) {
        img.style.opacity = '0';
      }
    }

    let currentIndex = Math.floor(Math.random() * 4) + 1;
    setInterval(() => {
      const currentImg = imageBannerChildren[currentIndex].querySelector('img');
      if (currentImg) {
        currentImg.style.opacity = '1';
      }

      const previousIndex = (currentIndex - 1 + imageBannerChildren.length) % imageBannerChildren.length;
      const previousImg = imageBannerChildren[previousIndex].querySelector('img');
      if (previousImg) {
        previousImg.style.opacity = '0';
      }

      currentIndex = (currentIndex + 1) % imageBannerChildren.length;
    }, 7000);
  }
};

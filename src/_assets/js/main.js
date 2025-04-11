import Alpine from 'alpinejs';
import coreNav from './alpine/navigation.js';
import { bannerImageCrossFade } from './bannerImage.js';

window.Alpine = Alpine;
Alpine.data('coreNav', coreNav);
Alpine.start();

bannerImageCrossFade();

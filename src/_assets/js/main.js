import Alpine from 'alpinejs';
import coreNav from './alpine/navigation.js';


window.Alpine = Alpine;
Alpine.data('coreNav', coreNav)
Alpine.start();

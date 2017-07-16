import './map.js';
import * as Turbolinks from 'turbolinks';
import Collapsable from './collapsable.js';

window.addEventListener('DOMContentLoaded', () => {
    Turbolinks.start();
    Collapsable.init();

    document.addEventListener('turbolinks:load', Collapsable.init);
});

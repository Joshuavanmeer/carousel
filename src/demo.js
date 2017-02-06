import { Carousel } from './carousel';

const sweetCarousel = new Carousel({
    parent: 'slide-container',
    uiControls: 'ui-controls',
    swipeEnabled: true,
    buttonControlPrefs: [{min: 0, max: 2000}],
    arrowControlPrefs: [{min: 0, max: 2000}]
});

sweetCarousel.init();
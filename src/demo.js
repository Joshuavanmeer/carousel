import { Carousel } from './carousel';

const sweetCarousel = new Carousel({
    parent: 'slide-container',
    uiControls: 'ui-controls',
    speed: 1,
    buttonControlPrefs: [{min: 0, max: 2000}],
    arrowControlPrefs: [{min: 0, max: 2000}]
});



sweetCarousel.initTest();
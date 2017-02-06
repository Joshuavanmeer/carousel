export class Carousel {

    constructor(config) {

        this.cachedSlides           = null;
        this.cachedArrowControls    = null;
        this.cachedButtonControls   = null;
        this.parent                 = document.getElementById(config.parent);
        this.uiControls             = document.getElementById(config.uiControls);
        this.slides                 = config.slides;
        this.speed                  = config.speed;
        this.arrowControlPrefs      = config.arrowControlPrefs;
        this.buttonControlPrefs     = config.buttonControlPrefs;
        this.arrowControlsEnabled   = null;
        this.buttonControlsEnabled  = null;
        this.touchEnabled           = null;
        this.carouselSizeX          = null;
        this.carouselSizeY          = null;
        this.activeSlide            = 0;

    }



    // sets up state for carousel
    init() {
        this.touchEnabled = this.touchAvailable();
        this.renderSlides(this.slides);
    }




    initTest() {
        this.carouselSizeX = this.getCarouselDimension('x');
        this.carouselSizeY = this.getCarouselDimension('y');
        this.arrowControlsEnabled = this.isControlEnabled(this.arrowControlPrefs);
        this.buttonControlsEnabled = this.isControlEnabled(this.buttonControlPrefs);
        this.cachedSlides = this.cacheSlides('slide');
        this.renderUI();
        this.cachedArrowControls = this.cacheUiControls('arrow-control');
        this.cachedButtonControls = this.cacheUiControls('button-control');
        this.updateUi();
        this.renderSlides();
        this.assignEventListeners([this.parent.parentElement], 'click', this.handleClick);
    }



    // returns screen dimensions
    getCarouselDimension(dimension) {
        const unit = dimension === 'x' ? 'Width' : 'Height';
        return this.parent['offset' + unit];
    }




    touchEnabled () {

    }



    cacheSlides(className) {
        let slides = Array.from(document.getElementsByClassName(className));
        let stack = [];
        slides.forEach((slide) => {
            stack.push({
                id: slide.dataset.id,
                elem: slide
            });
        });
        return stack;
    }



    cacheUiControls(className) {
        let tempArr = [];
        if (this.arrowControlsEnabled) {
            let controlsArr = Array.from(document.getElementsByClassName(className));
            controlsArr.forEach((control) => {
                let tempObj = { active: false, elem: control };
                if (control.dataset.id) tempObj.id = Number(control.dataset.id);
                tempArr.push(tempObj);
            })
        }
        return tempArr;
    }



    // checks if a control type should be enabled
    // according to preferences and screen dimensions
    isControlEnabled (prefs) {
        return prefs.some((prefsObj) => {
            return this.carouselSizeX >= prefsObj.min && this.carouselSizeX <= prefsObj.max
        })
    }



    // handles assignment of event listeners
    assignEventListeners (elems, ev, action) {
        elems.forEach((elem) => {
            elem.addEventListener(ev, (ev) => {
                action.call(this, ev);
            })
        });
    }



    handleClick (ev) {
        const target = ev.target;
        if (target.classList.contains('arrow-control')) this.moveSlide(target.dataset.action);
        else if (target.classList.contains('button-control')) {
            this.moveSlide(target.dataset.action, Number(target.dataset.id));
        }
        else return false;
    }



    moveSlide(direction, slots = 1) {
        let newSlotPosition;
        if (direction === 'left') {
            newSlotPosition = - (this.activeSlide - slots);
            this.activeSlide--;
        }
        else if (direction === 'right') {
            newSlotPosition = -(this.activeSlide + slots);
            this.activeSlide++;
        }
        else if (direction === 'manual') {
            newSlotPosition = -slots;
            this.activeSlide = slots;
        }
        const offset = newSlotPosition * this.carouselSizeX;
        this.parent.style.transform = 'translateX(' + offset + 'px)';
        this.updateUi();
    }



    updateUi() {
        if (this.arrowControlsEnabled) this.renderArrowControls();
        if (this.buttonControlsEnabled) this.renderButtonControls();
    }



    renderArrowControls () {
        const inactiveClass = 'inactive';
        const slidesLength = this.cachedSlides.length - 1;
        const arrowLeft = this.cachedArrowControls[0].elem;
        const arrowRight = this.cachedArrowControls[1].elem;
        if (this.activeSlide === 0 && !arrowLeft.classList.contains(inactiveClass)) {
            if(this.activeSlide !== slidesLength) arrowRight.classList.remove(inactiveClass);
            arrowLeft.classList.add(inactiveClass);
        }
        if (this.activeSlide === slidesLength && !arrowRight.classList.contains(inactiveClass)) {
            if (this.activeSlide !== 0) arrowLeft.classList.remove(inactiveClass);
            arrowRight.classList.add(inactiveClass);
        }
        if (this.activeSlide !== 0 && this.activeSlide !== slidesLength) {
            if (arrowLeft.classList.contains(inactiveClass)) arrowLeft.classList.remove(inactiveClass);
            if (arrowRight.classList.contains(inactiveClass)) arrowRight.classList.remove(inactiveClass);
        }


    }



    renderButtonControls () {
        const inactiveClass = 'inactive';
        this.cachedButtonControls.forEach((button) => {
            if (button.id === this.activeSlide) button.elem.classList.add(inactiveClass);
            if (button.id !== this.activeSlide &&
                button.elem.classList.contains(inactiveClass)) button.elem.classList.remove(inactiveClass);
        });
    }




    renderSlides() {
        this.parent.style.width = this.carouselSizeX * 3 + 'px';
    }




    // renders the UI controls according to preferences
    renderUI() {
        let template = '';
        this.uiControls.innerHTML = '';
        if (this.arrowControlsEnabled) {
            template += `<button data-action="left" class="arrow-control" id="arrow-left" type="button"><==</button>
                         <button data-action="right" class="arrow-control" id="arrow-right" type="button">==></button>`
        }
        if (this.buttonControlsEnabled) {
            template += `<div id="button-controls">`;
            for (let i = 0, j = this.cachedSlides.length; i < j; i++) {
                template += `<button data-id="${i}" data-action="manual" type="button" class="button-control">O</button>`
            }
            template += `</div>`;
        }
        this.uiControls.insertAdjacentHTML('afterbegin', template);
    }




}
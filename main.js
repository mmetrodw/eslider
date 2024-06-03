class ESlider {
	constructor(options) {
		this.initialSettings = {
			slideDuration: 600,
			slideDirection: 'horizontal', // horizontal, vertical
			slideEasing: 'easeOutCirc',
			autoSlide: true,
			autoSlideInterval: 3000
		};
		this.settings = this.deepMerge(this.initialSettings, options);

		this.currentSlideIndex = 1;
		this.elements = {
			wrapper: document.getElementById(this.settings.target),
			sliderWrapper: null,
			slides: null,
			nextSlideButton: null,
			prevSlideButton: null,
			navigationItems: null
		};
		this.totalSlides = 0;
		this.slideWidth = 0;
		this.isSlidingAllowed = true;
		this.isDragging = false;
		this.firstSlideClone = null;
		this.lastSlideClone = null;
		this.initialPosition = 0;
		this.currentPosition = 0;
		this.threshold = 100;
		this.init();
	}

	init() {
		this.elements.wrapper.style.setProperty('--slideDuration', this.settings.slideDuration + 'ms');
		this.elements.wrapper.style.setProperty('--slideEasing', 'var(--' + this.settings.slideEasing + ')');
		this.elements.wrapper.classList.add(
			this.settings.slideDirection === 'horizontal' ? 'es-horizontal' : 'es-vertical'
		);

		this.elements.sliderWrapper = this.elements.wrapper.querySelector('.es-slider');
		this.elements.slides = this.elements.sliderWrapper.querySelectorAll('.es-slide');
		this.elements.nextSlideButton = this.elements.wrapper.querySelector('.es-next-slide');
		this.elements.prevSlideButton = this.elements.wrapper.querySelector('.es-prev-slide');
		this.elements.navigationItems = this.elements.wrapper.querySelectorAll('.es-navigation-item');

		this.totalSlides = this.elements.slides.length;
		this.slideWidth = this.elements.wrapper.offsetWidth;
		this.slideHeight = this.elements.wrapper.offsetHeight;
		this.threshold = this.settings.slideDirection === 'horizontal' ? this.slideWidth / 4 : this.slideHeight / 4;
		this.firstSlideClone = this.elements.slides[0].cloneNode(true);
		this.lastSlideClone = this.elements.slides[this.totalSlides - 1].cloneNode(true);

		this.elements.sliderWrapper.appendChild(this.firstSlideClone);
		this.elements.sliderWrapper.insertBefore(this.lastSlideClone, this.elements.slides[0]);

		// Update Sildes Collection
		this.elements.slides = this.elements.sliderWrapper.querySelectorAll('.es-slide');

		// Set Slider Position
		const dimension = this.settings.slideDirection === 'horizontal' ? 'width' : 'height';
		const position = this.settings.slideDirection === 'horizontal' ? 'left' : 'top';
		const dimensionValue = this.settings.slideDirection === 'horizontal' ? this.slideWidth : this.slideHeight;

		this.elements.sliderWrapper.style[dimension] = dimensionValue * (this.totalSlides + 2) + 'px';
		this.elements.sliderWrapper.style[position] = -(dimensionValue * this.currentSlideIndex) + 'px';

		this.highlightCurrentNavigationItem();
		this._addEventsListener();

		if(this.settings.autoSlide) {
			let autoSlideIntervalId;

			const stopAutoSlide = () => {
				clearInterval(autoSlideIntervalId);
			}

			const startAutoSlide = () => {
				autoSlideIntervalId = setInterval(() => {
					if (this.isSlidingAllowed) {
						this.moveToNextSlide();
					}
				}, this.settings.autoSlideInterval);
			}
			this.elements.wrapper.addEventListener('mouseenter', stopAutoSlide);
			this.elements.wrapper.addEventListener('mouseleave', startAutoSlide);
			startAutoSlide();
		}
	}

	_addEventsListener() {
		// Slider Navigation
		this.elements.prevSlideButton.addEventListener('click', this.moveToPrevSlide.bind(this));
		this.elements.nextSlideButton.addEventListener('click', this.moveToNextSlide.bind(this));
		this.elements.navigationItems.forEach((item, index) => {
			item.addEventListener('click', this.moveToSlideByNavigation.bind(this, index + 1));
		});

		['mousedown', 'touchstart'].forEach(event => this.elements.sliderWrapper.addEventListener(event, this.dragStart.bind(this), { passive: true }));
		['mousemove', 'touchmove'].forEach(event => this.elements.sliderWrapper.addEventListener(event, this.dragAction.bind(this), { passive: true }));
		['mouseup', 'mouseleave', 'touchend'].forEach(event => this.elements.wrapper.addEventListener(event, this.dragEnd.bind(this), { passive: true }));

		// Animation Events
		this.elements.sliderWrapper.addEventListener('transitionend', this.adjustCurrentSlideIndex.bind(this));
		// Window Resize
		window.addEventListener('resize', () => {
			this.slideWidth = this.elements.wrapper.offsetWidth;
			this.slideHeight = this.elements.wrapper.offsetHeight;
			this.threshold = this.settings.slideDirection === 'horizontal' ? this.slideWidth / 4 : this.slideHeight / 4;
			// Set Slider Position
			const dimension = this.settings.slideDirection === 'horizontal' ? 'width' : 'height';
			const position = this.settings.slideDirection === 'horizontal' ? 'left' : 'top';
			const dimensionValue = this.settings.slideDirection === 'horizontal' ? this.slideWidth : this.slideHeight;

			this.elements.sliderWrapper.style[dimension] = dimensionValue * (this.totalSlides + 2) + 'px';
			this.elements.sliderWrapper.style[position] = -(dimensionValue * this.currentSlideIndex) + 'px';
		});
	}

	moveToNextSlide() {
		if (!this.isSlidingAllowed) return;
		this.isSlidingAllowed = false;
		this.currentSlideIndex++;
		this.updateSlidePosition();
	}

	moveToPrevSlide() {
		if (!this.isSlidingAllowed) return;
		this.isSlidingAllowed = false;
		this.currentSlideIndex--;
		this.updateSlidePosition();
	}

	moveToSlideByNavigation(index) {
		if (!this.isSlidingAllowed) return;
		this.isSlidingAllowed = false;
		this.currentSlideIndex = index;
		this.updateSlidePosition();
	}

	dragStart(event) {
		if (!this.isSlidingAllowed) return;
		this.isDragging = true;

		const eventCoords = event.type === 'touchmove' ? event.touches[0] : event;
		this.initialPosition = this.settings.slideDirection === 'horizontal' ? eventCoords.clientX : eventCoords.clientY;
		this.currentPosition = this.initialPosition;
	}

	dragAction(event) {
		if (!this.isSlidingAllowed) return;
		if (!this.isDragging) return;

		const eventCoords = event.type === 'touchmove' ? event.touches[0] : event;
		this.currentPosition = this.settings.slideDirection === 'horizontal' ? eventCoords.clientX : eventCoords.clientY;

		const dragDifference = this.currentPosition - this.initialPosition;
		const currentSliderPosition = this.settings.slideDirection === 'horizontal' ? this.slideWidth * this.currentSlideIndex : this.slideHeight * this.currentSlideIndex;

		this.elements.sliderWrapper.style[this.settings.slideDirection === 'horizontal' ? 'left' : 'top'] = -currentSliderPosition + dragDifference + 'px';
	}

	dragEnd(event) {
		if (!this.isDragging) return;
		this.isDragging = false;

		if (this.currentPosition - this.initialPosition < -this.threshold) {
			this.moveToNextSlide();
		} else if (this.currentPosition - this.initialPosition > this.threshold) {
			this.moveToPrevSlide();
		} else {
			this.elements.wrapper.classList.add('sliding');
			
			// Set Slider Position
			const position = this.settings.slideDirection === 'horizontal' ? 'left' : 'top';
			const dimensionValue = this.settings.slideDirection === 'horizontal' ? this.slideWidth : this.slideHeight;
			this.elements.sliderWrapper.style[position] = -(dimensionValue * this.currentSlideIndex) + 'px';
		}
	}

	updateSlidePosition() {
		this.highlightCurrentNavigationItem();
		this.elements.wrapper.classList.add('sliding');
		if(this.settings.slideDirection === 'horizontal'){
			this.elements.sliderWrapper.style.left = -(this.slideWidth * this.currentSlideIndex) + 'px';
		} else {
			this.elements.sliderWrapper.style.top = -(this.slideHeight * this.currentSlideIndex) + 'px';
		}
	}

	highlightCurrentNavigationItem() {
		const index = (this.currentSlideIndex - 1 + this.totalSlides) % this.totalSlides;
		this.elements.navigationItems.forEach(item => item.classList.remove('current'));
		this.elements.navigationItems[index].classList.add('current');
	}

	adjustCurrentSlideIndex() {
		this.elements.wrapper.classList.remove('sliding');
		if (this.currentSlideIndex > this.totalSlides) {
			this.currentSlideIndex = 1;
		} else if (this.currentSlideIndex < 1) {
			this.currentSlideIndex = this.totalSlides;
		}
		if(this.settings.slideDirection === 'horizontal') {
			this.elements.sliderWrapper.style.left = -(this.slideWidth * this.currentSlideIndex) + 'px';
		} else {
			this.elements.sliderWrapper.style.top = -(this.slideHeight * this.currentSlideIndex) + 'px';
		}
		this.isSlidingAllowed = true;
	}

	// Method to deeply merge default options with user-provided options
	deepMerge(target, source) {
		if (typeof target !== 'object' || target === null) {
			target = {};
		}

		if (typeof source !== 'object' || source === null) {
			return target;
		}

		for (const key in source) {
			if (source[key] instanceof Object && target[key]) {
				target[key] = this.deepMerge(target[key], source[key]);
			} else {
				target[key] = source[key];
			}
		}

		return target;
	}
 }

 const slider = new ESlider({
	target: 'test'
 });
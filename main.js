class ESlider {
	constructor(containerId) {
		this.currentSlideIndex = 1;
		this.elements = {
			wrapper: document.getElementById(containerId),
			sliderWrapper: null,
			slides: null,
			nextSlideButton: null,
			prevSlideButton: null,
			navigationItems: null
		};
		this.totalSlides = 0;
		this.slideWidth = 0;
		this.isSlidingAllowed = true;
		this.firstSlideClone = null;
		this.lastSlideClone = null;
		this.posInitial = 0;
		this.posX = 0;
		this.threshold = 100;
		this.init();
	}
 
	init() {
		this.elements.sliderWrapper = this.elements.wrapper.querySelector('.es-slider');
		this.elements.slides = this.elements.sliderWrapper.querySelectorAll('.es-slide');
		this.elements.nextSlideButton = this.elements.wrapper.querySelector('.es-next-slide');
		this.elements.prevSlideButton = this.elements.wrapper.querySelector('.es-prev-slide');
		this.elements.navigationItems = this.elements.wrapper.querySelectorAll('.es-navigation-item');
		this.totalSlides = this.elements.slides.length;
		this.slideWidth = this.elements.sliderWrapper.offsetWidth;
		this.firstSlideClone = this.elements.slides[0].cloneNode(true);
		this.lastSlideClone = this.elements.slides[this.totalSlides - 1].cloneNode(true);
 
		this.elements.sliderWrapper.appendChild(this.firstSlideClone);
		this.elements.sliderWrapper.insertBefore(this.lastSlideClone, this.elements.slides[0]);
 
		this.elements.nextSlideButton.addEventListener('click', () => this.moveToNextSlide());
		this.elements.prevSlideButton.addEventListener('click', () => this.moveToPrevSlide());
		
		this.elements.navigationItems.forEach((item, index) => {
			item.addEventListener('click', () => this.moveToSlideByNavigation(index + 1));
		});
 
		this.elements.sliderWrapper.style.left = -(this.slideWidth * this.currentSlideIndex) + 'px';
		this.highlightCurrentNavigationItem();
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
	

	updateSlidePosition() {
		this.highlightCurrentNavigationItem();
		this.animation(this.elements.sliderWrapper, 'left', this.elements.sliderWrapper.offsetLeft, -this.slideWidth * this.currentSlideIndex, 'px', 500, 'easing', () => {
			this.isSlidingAllowed = true;
			if(this.currentSlideIndex > this.totalSlides) {
				this.currentSlideIndex = 1;
				this.elements.sliderWrapper.style.left = -(this.slideWidth * this.currentSlideIndex) + 'px';
			} else if(this.currentSlideIndex < 1) {
				this.currentSlideIndex = this.totalSlides;
				this.elements.sliderWrapper.style.left = -(this.slideWidth * this.currentSlideIndex) + 'px';
			}
		});
	}
 
	highlightCurrentNavigationItem() {
		const index = (this.currentSlideIndex - 1 + this.totalSlides) % this.totalSlides;
		this.elements.navigationItems.forEach(item => item.classList.remove('current'));
		this.elements.navigationItems[index].classList.add('current');
	}
 
	animation(element, property, startValue, endValue, unit, duration, easingName, callback) {
		let startTime = null;
		function update(currentTime) {
			if(startTime === null) {
				startTime = currentTime;
			}
			const elapsedTime = currentTime - startTime;
			const progress = Math.min(elapsedTime / duration, 1);
			const currentValue = startValue + (endValue - startValue) * progress;
			element.style[property] = currentValue + unit;

			if(progress < 1) {
				window.requestAnimationFrame(update);
			} else {
				if(typeof callback === "function") {
					callback();
				}
			}
		}

		requestAnimationFrame(update);
	}
 }
 
 const slider = new ESlider("test");
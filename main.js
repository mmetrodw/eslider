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
		this.initialPositionX = 0;
		this.currentPositionX = 0;
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
		// Оновлюємо колекцію слайдів
    this.elements.slides = this.elements.sliderWrapper.querySelectorAll('.es-slide');

    this.elements.prevSlideButton.addEventListener('click', this.moveToPrevSlide.bind(this));
		this.elements.nextSlideButton.addEventListener('click', this.moveToNextSlide.bind(this));
		
		this.elements.navigationItems.forEach((item, index) => {
			item.addEventListener('click', () => this.moveToSlideByNavigation(index + 1));
		});
 
    // Mouse events
    this.elements.wrapper.onmousedown = this.dragStart.bind(this);

    // Touch events
    this.elements.wrapper.addEventListener('touchstart', this.dragStart.bind(this));
    this.elements.wrapper.addEventListener('touchmove', this.dragAction.bind(this));
    this.elements.wrapper.addEventListener('touchend', this.dragEnd.bind(this));

		this.elements.sliderWrapper.style.left = -(this.slideWidth * this.currentSlideIndex) + 'px';
		this.highlightCurrentNavigationItem();
	}
 
	moveToNextSlide() {
	  console.log('next');
		if (!this.isSlidingAllowed) return;
		this.isSlidingAllowed = false;
		this.currentSlideIndex++;
		console.log('here')
		this.updateSlidePosition();
	}
 
	moveToPrevSlide() {
	  console.log('prev')
		if (!this.isSlidingAllowed) return;
		this.isSlidingAllowed = false;
		this.currentSlideIndex--;
		console.log('here prev')
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
    event.preventDefault();

    this.initialPositionX = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX;

    document.addEventListener('mouseup', this.dragEnd.bind(this));
    document.addEventListener('mousemove', this.dragAction.bind(this));
	}
	
	dragAction(event) {
	  if (!this.isSlidingAllowed) return;
    event.preventDefault();

    this.currentPositionX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
    
    const dragDifference = this.currentPositionX - this.initialPositionX;
    const currentSliderPosition = this.slideWidth * this.currentSlideIndex;

    this.elements.sliderWrapper.style.left = -currentSliderPosition + dragDifference + 'px';
	}

  dragEnd(event) {
    event.preventDefault();
    if (this.currentPositionX - this.initialPositionX < -this.threshold) {
      this.moveToNextSlide();
    } else if (this.currentPositionX - this.initialPositionX > this.threshold) {
      this.moveToPrevSlide();
    } else {
      this.animation(
        this.elements.sliderWrapper,
        'left',
        this.elements.sliderWrapper.offsetLeft,
        -this.slideWidth * this.currentSlideIndex,
        'px',
        500,
        'easing',
        null
      );
    }
    
    document.removeEventListener('mouseup', this.dragEnd.bind(this));
    document.removeEventListener('mousemove', this.dragAction.bind(this));
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
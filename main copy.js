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
 
		this.elements.sliderWrapper.addEventListener('transitionend', this.adjustCurrentSlideIndex.bind(this));
		
		// Mouse events
		this.elements.wrapper.onmousedown = this.dragStart.bind(this);
		
		// Touch events
		this.elements.wrapper.addEventListener('touchstart', this.dragStart.bind(this));
		this.elements.wrapper.addEventListener('touchend', this.dragEnd.bind(this));
		this.elements.wrapper.addEventListener('touchmove', this.dragAction.bind(this));
 
		this.updateSlidePosition();
		this.adjustCurrentSlideIndex();
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
	

	/* COMMENT 
	dragStart(event) {
		if (!this.isSlidingAllowed) return;
		event = event || window.event;
		event.preventDefault();
		
		if(event.type == 'touchstart') {
			this.posInitial = event.touches[0].clientX;
		} else {
			this.posInitial = event.clientX;
			document.onmouseup = this.dragEnd.bind(this);
			document.onmousemove = this.dragAction.bind(this);
		}

	}
	
	dragAction(event) {
		if (!this.isSlidingAllowed) return;
		event = event || window.event;
		event.preventDefault();

		if(event.type == 'touchmove') {
			this.posX = event.touches[0].clientX;
		} else {
			this.posX = event.clientX;
		}
		const translateX = this.posX - this.posInitial;
		this.elements.sliderWrapper.style.transform = 'translateX(' + translateX + 'px)';
	}
	
	dragEnd() {
		if(this.posX - this.posInitial < -this.threshold) {
			this.moveToNextSlide();
		} else if(this.posX - this.posInitial > this.threshold) {
			this.moveToPrevSlide();
		}
		document.onmouseup = null;
		document.onmousemove = null;
		this.elements.sliderWrapper.style.transform = 'translateX(0px)';
	}*/
 
	updateSlidePosition() {
		this.elements.sliderWrapper.classList.add('sliding');
		this.elements.sliderWrapper.style.left = -(this.slideWidth * this.currentSlideIndex) + 'px';
		this.highlightCurrentNavigationItem();
	}
 
	highlightCurrentNavigationItem() {
		const index = (this.currentSlideIndex - 1 + this.totalSlides) % this.totalSlides;
		this.elements.navigationItems.forEach(item => item.classList.remove('current'));
		this.elements.navigationItems[index].classList.add('current');
	}
 
	adjustCurrentSlideIndex() {
		this.elements.sliderWrapper.classList.remove('sliding');
		if (this.currentSlideIndex > this.totalSlides) {
			this.currentSlideIndex = 1;
		} else if (this.currentSlideIndex < 1) {
			this.currentSlideIndex = this.totalSlides;
		}
		this.elements.sliderWrapper.style.left = -(this.slideWidth * this.currentSlideIndex) + 'px';
		this.isSlidingAllowed = true;
	}
 }
 
 const slider = new ESlider("test");
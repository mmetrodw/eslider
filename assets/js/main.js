class ESlider {
	constructor(options) {
		const initialSettings = {
			target: null,
			data: null,
			animation: 'sliding',
			navigation: true,
			pagination: true,
			slicePieces: 10,
			sliceDelay: 75,
			slideDuration: 600,
			slideDirection: 'horizontal', // horizontal, vertical
			slideEasing: 'easeOutCirc',
			autoSlide: true,
			autoSlideInterval: 3000
		};
		this.settings = this.deepMerge(initialSettings, options);

		this.elements = {
			wrapper: document.getElementById(this.settings.target)
		};
		this.currentSlideIndex = 0;
		this.checkErrors();
		this.buidSlider();
		this.init();
	}

	checkErrors() {
		if(!this.elements.wrapper) {
			throw new Error('ESlider: Target element not found');
		}
		if(!this.settings.data) {
			throw new Error('ESlider: Data not provided');
		}
	}
 
	buidSlider() {
		this.elements.wrapper.classList.add(
			'es-wrapper',
			this.settings.slideDirection === 'horizontal' ? 'es-horizontal' : 'es-vertical'
		);
		// Animation
		this.elements.wrapper.classList.add('es-' + this.settings.animation + '-animation');

		this.elements.wrapper.style.setProperty('--slideDuration', this.settings.slideDuration + 'ms');
		this.elements.wrapper.style.setProperty('--slideEasing', 'var(--' + this.settings.slideEasing + ')');

		this.elements.sliderWrapper = document.createElement('DIV');
		this.elements.sliderWrapper.classList.add('es-slider');

		this.settings.data.forEach((item, index) => {
			let slide = document.createElement('DIV');
			slide.classList.add('es-slide');
			const sliceWidth = 100 / this.settings.slicePieces;
			for(var i = 0; i < this.settings.slicePieces; i++) {
				let piece = document.createElement('DIV');
				piece.classList.add('es-piece');
				piece.style.setProperty('--slice-delay', this.settings.sliceDelay * i + 'ms');
				piece.style.setProperty('--slice-left', sliceWidth * i + '%');
				piece.style.setProperty('--slice-right', sliceWidth * (i + 1) + '%');

				if(item.image) {
					let img = document.createElement('IMG');
					img.src = item.image;
					piece.appendChild(img);
				}
				slide.appendChild(piece)
			}
			this.elements.sliderWrapper.appendChild(slide);
		});

		this.elements.wrapper.appendChild(this.elements.sliderWrapper);
		this.elements.slides = this.elements.sliderWrapper.querySelectorAll('.es-slide');

		// Pagination
		if(this.settings.pagination) {
			this.elements.paginationWrapper = document.createElement('DIV');
			this.elements.paginationWrapper.classList.add('es-pagination-wrapper');
			this.elements.wrapper.appendChild(this.elements.paginationWrapper);
			this.settings.data.forEach((item, index) => {
				let dot = document.createElement('button');
				dot.classList.add('es-pagination-item');
				this.elements.paginationWrapper.append(dot);
			});
			this.elements.paginationItem = this.elements.paginationWrapper.querySelectorAll('.es-pagination-item');
		}

		// Navigation Buttons
		if(this.settings.navigation) {
			this.elements.navigationWrapper = document.createElement('DIV');
			this.elements.navigationWrapper.classList.add('es-navigation-wrapper');
			this.elements.wrapper.appendChild(this.elements.navigationWrapper);

			this.elements.prevSlideButton = document.createElement("button");
			this.elements.prevSlideButton.classList.add('es-prev-slide');
			this.elements.navigationWrapper.appendChild(this.elements.prevSlideButton);

			this.elements.nextSlideButton = document.createElement("button");
			this.elements.nextSlideButton.classList.add('es-next-slide');
			this.elements.navigationWrapper.appendChild(this.elements.nextSlideButton);
		}
	}

	init() {
		this.totalSlides = this.settings.data.length;
		this.slideWidth = this.elements.wrapper.offsetWidth;
		this.slideHeight = this.elements.wrapper.offsetHeight;
		this.isSlidingAllowed = true;
		this.isDragging = false;
		this.initialPosition = 0;
		this.currentPosition = 0;
		this.threshold = this.settings.slideDirection === 'horizontal' ? this.slideWidth / 4 : this.slideHeight / 4;

		this.elements.slides[this.currentSlideIndex].classList.add('es-current-slide');
		let nextSlide = this.currentSlideIndex + 1 < this.totalSlides ? this.currentSlideIndex + 1 : 0;
		this.elements.slides[nextSlide].classList.add('es-next-slide');

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
		this.elements.paginationItem.forEach((item, index) => {
			item.addEventListener('click', this.moveToSlideByNavigation.bind(this, index + 1));
		});

		// Animation Events
		this.elements.sliderWrapper.addEventListener('transitionend', this.adjustCurrentSlideIndex.bind(this));
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
		this.elements.slides[this.currentSlideIndex - 1].classList.add('es-slide-hide');
		this.highlightCurrentNavigationItem();
	}

	highlightCurrentNavigationItem() {
		const index = (this.currentSlideIndex - 1 + this.totalSlides) % this.totalSlides;
		this.elements.paginationItem.forEach(item => item.classList.remove('current'));
		this.elements.paginationItem[index].classList.add('current');
	}

	adjustCurrentSlideIndex() {
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
	target: 'test2',
	autoSlide: true,
	slideDirection: 'horizontal',
	//slideDirection: 'horizontal',
	animation: 'slice',
	//animation: 'sliding',
	data: [
		{
			image: 'assets/img/1.jpg'
		}, {
			image: 'assets/img/2.jpg'
		}, {
			image: 'assets/img/3.jpg'
		}, {
			image: 'assets/img/4.jpg'
		}, {
			image: 'assets/img/5.jpg'
		}, {
			image: 'assets/img/6.jpg'
		}, {
			image: 'assets/img/7.jpg'
		}
	]
 });
const easingFunctions = {
	linear: (time) => {
		return time;
	},
	easeInSine: (time) => {
		return -1 * Math.cos(time * (Math.PI / 2)) + 1;
	},
	easeOutSine: (time) => {
		return Math.sin(time * (Math.PI / 2));
	},
	easeInOutSine: (time) => {
		return -0.5 * (Math.cos(Math.PI * time) - 1);
	},
	easeInQuad: (time) => {
		return time * time;
	},
	easeOutQuad: (time) => {
		return time * (2 - time);
	},
	easeInOutQuad: (time) => {
		return time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time;
	},
	easeInCubic: (time) => {
		return time * time * time;
	},
	easeOutCubic: (time) => {
		const time1 = time - 1;
		return time1 * time1 * time1 + 1;
	},
	easeInOutCubic: (time) => {
		return time < 0.5 ?
			4 * time * time * time :
			(time - 1) * (2 * time - 2) * (2 * time - 2) + 1;
	},
	easeInQuart: (time) => {
		return time * time * time * time;
	},
	easeOutQuart: (time) => {
		const time1 = time - 1;
		return 1 - time1 * time1 * time1 * time1;
	},
	easeInOutQuart: (time) => {
		const time1 = time - 1;
		return time < 0.5 ? 8 * time * time * time * time : 1 - 8 * time1 * time1 * time1 * time1;
	},
	easeInQuint: (time) => {
		return time * time * time * time * time;
	},
	easeOutQuint: (time) => {
		const time1 = time - 1;
		return 1 + time1 * time1 * time1 * time1 * time1;
	},
	easeInOutQuint: (time) => {
		const time1 = time - 1;
		return time < 0.5 ? 16 * time * time * time * time * time : 1 + 16 * time1 * time1 * time1 * time1 * time1;
	},
	easeInExpo: (time) => {
		if (time === 0) {
			return 0;
		}
		return Math.pow(2, 10 * (time - 1));
	},
	easeOutExpo: (time) => {
		if (time === 1) {
			return 1;
		}
		return (-Math.pow(2, -10 * time) + 1);
	},
	easeInOutExpo: (time) => {
		if (time === 0 || time === 1) {
			return time;
		}

		const scaledTime = time * 2;
		const scaledTime1 = scaledTime - 1;

		if (scaledTime < 1) {
			return 0.5 * Math.pow(2, 10 * (scaledTime1));
		}

		return 0.5 * (-Math.pow(2, -10 * scaledTime1) + 2);
	},
	easeInCirc: (time) => {
		const scaledTime = time / 1;
		return -1 * (Math.sqrt(1 - scaledTime * time) - 1);
	},
	easeOutCirc: (time) => {
		const time1 = time - 1;
		return Math.sqrt(1 - time1 * time1);
	},
	easeInOutCirc: (time) => {
		const scaledTime = time * 2;
		const scaledTime1 = scaledTime - 2;

		if (scaledTime < 1) {
			return -0.5 * (Math.sqrt(1 - scaledTime * scaledTime) - 1);
		}

		return 0.5 * (Math.sqrt(1 - scaledTime1 * scaledTime1) + 1);
	},
	easeInBack: (time, magnitude = 1.70158) => {
		return time * time * ((magnitude + 1) * time - magnitude);
	},
	easeOutBack: (time, magnitude = 1.70158) => {
		const scaledTime = time / 1 - 1;
		return (scaledTime * scaledTime * ((magnitude + 1) * scaledTime + magnitude)) + 1;
	},
	easeInOutBack: (time, magnitude = 1.70158) => {
		const scaledTime = time * 2;
		const scaledTime2 = scaledTime - 2;
		const s = magnitude * 1.525;

		if (scaledTime < 1) {
			return 0.5 * scaledTime * scaledTime * ((s + 1) * scaledTime - s);
		}

		return (0.5 * (scaledTime2 * scaledTime2 * ((s + 1) * scaledTime2 + s) + 2));
	},
	easeInElastic: (time, magnitude = 0.7) => {
		if (time === 0 || time === 1) {
			return time;
		}

		const scaledTime = time / 1;
		const scaledTime1 = scaledTime - 1;
		const p = 1 - magnitude;
		const s = p / (2 * Math.PI) * Math.asin(1);

		return -(Math.pow(2, 10 * scaledTime1) * Math.sin((scaledTime1 - s) * (2 * Math.PI) / p));
	},
	easeOutElastic: (time, magnitude = 0.7) => {
		if (time === 0 || time === 1) {
			return time;
		}

		const p = 1 - magnitude;
		const scaledTime = time * 2;
		const s = p / (2 * Math.PI) * Math.asin(1);

		return (Math.pow(2, -10 * scaledTime) * Math.sin((scaledTime - s) * (2 * Math.PI) / p)) + 1;
	},
	easeInOutElastic: (time, magnitude = 0.65) => {
		if (time === 0 || time === 1) {
			return time;
		}

		const p = 1 - magnitude;
		const scaledTime = time * 2;
		const scaledTime1 = scaledTime - 1;
		const s = p / (2 * Math.PI) * Math.asin(1);

		if (scaledTime < 1) {
			return -0.5 * (Math.pow(2, 10 * scaledTime1) * Math.sin((scaledTime1 - s) * (2 * Math.PI) / p));
		}

		return (Math.pow(2, -10 * scaledTime1) * Math.sin((scaledTime1 - s) * (2 * Math.PI) / p) * 0.5) + 1;
	},
	easeOutBounce: (time) => {
		const scaledTime = time / 1;

		if (scaledTime < (1 / 2.75)) {
			return 7.5625 * scaledTime * scaledTime;
		} else if (scaledTime < (2 / 2.75)) {
			const scaledTime2 = scaledTime - (1.5 / 2.75);
			return (7.5625 * scaledTime2 * scaledTime2) + 0.75;
		} else if (scaledTime < (2.5 / 2.75)) {
			const scaledTime2 = scaledTime - (2.25 / 2.75);
			return (7.5625 * scaledTime2 * scaledTime2) + 0.9375;
		} else {
			const scaledTime2 = scaledTime - (2.625 / 2.75);
			return (7.5625 * scaledTime2 * scaledTime2) + 0.984375;
		}
	},
	easeInBounce: (time) => {
		return 1 - easingFunctions.easeOutBounce(1 - time);
	},
	easeInOutBounce: (time) => {
		if (time < 0.5) {
			return easingFunctions.easeInBounce(time * 2) * 0.5;
		}
		return (easingFunctions.easeOutBounce((time * 2) - 1) * 0.5) + 0.5;
	}
};

class ESlider {
	constructor(options) {
		this.initialSettings = {
			slideDuration: 1000,
			autoSlide: false,
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
		this.threshold = this.slideWidth / 4;
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
    this.elements.sliderWrapper.addEventListener('mousedown', this.dragStart.bind(this));
    this.elements.sliderWrapper.addEventListener('mousemove', this.dragAction.bind(this));
    this.elements.sliderWrapper.addEventListener('mouseup', this.dragEnd.bind(this));
    this.elements.wrapper.addEventListener('mouseleave', this.dragEnd.bind(this));

    // Touch events
    this.elements.wrapper.addEventListener('touchstart', this.dragStart.bind(this));
    this.elements.wrapper.addEventListener('touchmove', this.dragAction.bind(this));
    this.elements.wrapper.addEventListener('touchend', this.dragEnd.bind(this));

		this.elements.sliderWrapper.style.left = -(this.slideWidth * this.currentSlideIndex) + 'px';
		this.elements.sliderWrapper.style.width = this.slideWidth * (this.totalSlides + 2) + 'px';
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
	
	dragStart(event) {
    event.preventDefault();
    if (!this.isSlidingAllowed) return;
		this.isDragging = true;

    this.initialPositionX = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX;
    this.currentPositionX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
	}
	
	dragAction(event) {
    event.preventDefault();
	  if (!this.isSlidingAllowed) return;
	  if (!this.isDragging) return;

    this.currentPositionX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;

    const dragDifference = this.currentPositionX - this.initialPositionX;
    const currentSliderPosition = this.slideWidth * this.currentSlideIndex;

    this.elements.sliderWrapper.style.left = -currentSliderPosition + dragDifference + 'px';
	}

  dragEnd(event) {
    event.preventDefault();
	  if (!this.isDragging) return;
		this.isDragging = false;

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
        this.settings.slideDuration / 100 * Math.abs(this.currentPositionX - this.initialPositionX) / this.threshold * 100,
        'easeOutExpo'
      );
    }
  }

	updateSlidePosition() {
		this.highlightCurrentNavigationItem();
		this.elements.wrapper.classList.add('sliding');

		this.animation(this.elements.sliderWrapper, 'left', this.elements.sliderWrapper.offsetLeft, -this.slideWidth * this.currentSlideIndex, 'px', this.settings.slideDuration, 'easeOutExpo', () => {
			this.isSlidingAllowed = true;
			this.elements.wrapper.classList.remove('sliding');

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
			const currentValue = startValue + (endValue - startValue) * easingFunctions[easingName](progress);
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
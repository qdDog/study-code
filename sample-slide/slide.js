	/**
	 * 原生js面向对象写的一个简单的轮播插件
	 * @param { String } selector [轮播容器的一个选择符]
	 * @param { Object } params   [一个配置对象]
	 */
	function Slide (selector, params) {
		if(!document.querySelector(selector)) {
			return;
		}
		params = params || {};
		this.params = params;
		params.speed = params.speed || 3000;
		params.navigation = params.navigation || false;
		params.pagination = params.pagination || false;
		params.mode = params.mode || "horizontal";
		this.carouselWrap = document.querySelector(selector);
		this.imageWrapper = document.querySelector(selector + ' .imageList');
		this.imageItems = document.querySelectorAll(selector + ' li');
		
		this.index = 0;
		this.paginationBtn = null;
		this.init();
		

	}
	Slide.prototype = {
		constructor: Slide,
		index: 0,
		timer: null,
		autoPlayTime: null,
		//初始化
		init: function() {		
			this.isHorizontal(); 		
			if(this.params.navigation) {
		 		this.create_navigation_btn();
 				this.prevBtn = document.querySelector('.navigation-prev');
				this.nextBtn = document.querySelector('.navigation-next');
		 	}
		 	if(this.params.pagination) {
		 		this.pagination = document.querySelector('.pagination');
		 		this.createPagination();
		 		this.paginationCurrent();
		 	}
		 	
		 	this.initEvent();
		 	this.autoPlay();
		 	
		},
		isHorizontal: function() {
			if (this.params.mode == 'horizontal') {
				this.imageWrapper.style.width = this.imageItems[0].offsetWidth * this.imageItems.length + 'px';
				this.slideSize = this.imageItems[0].offsetWidth;
				this.slideDirection = 'offsetLeft';
				this.styleDirection = 'left';
			} else if (this.params.mode == 'vertical') {
				this.imageWrapper.style.height = this.imageItems[0].offsetHeight * this.imageItems.length + 'px';
				this.slideSize = this.imageItems[0].offsetHeight;
				this.slideDirection = 'offsetTop';
				this.styleDirection = 'top';
			}
		},
		//创建分页器
		createPagination: function() {
			var	paginationHtml = '',
				i;
			for (i = 0; i < this.imageItems.length; i++) {
				paginationHtml += '<span class="pagination-item"></span>';
			}
		 	this.pagination.innerHTML = paginationHtml;
		 	this.paginationBtn = document.querySelectorAll('.pagination-item');
		 	this.paginationBtn[0].className = 'current';
		},
		//创建左右按钮
		create_navigation_btn: function() {
			var navigationHtml = '';
		 
	 		navigationHtml += '<span class="navigation-prev"></span>';
	 		navigationHtml += '<span class="navigation-next"></span>';
		 	var navigationWrap = document.createElement('div');
		 	navigationWrap.className = 'navigationWrap';

		 	navigationWrap.innerHTML = navigationHtml;	
		 	this.carouselWrap.appendChild(navigationWrap);
		},
		
		/**
		 * 轮播函数
		 * @param  { String } direction    [用来区分点击的上一个图片的按钮还是下一个图片的按钮]
		 * @param  { Number } currentIndex [用来配合分页器显示图片相应index的轮播图]
		 * 
		 */
		startMove: function(direction, currentIndex) {
			var that  = this;
			clearInterval(this.timer);
			if (direction) {
				if(direction == 'next') {
					this.index++;
					if(this.index >= this.imageItems.length) {
						this.index = 0;
					}
				} else if(direction == 'prev') {
					this.index--;
					if (this.index <= 0) {
						this.index = this.imageItems.length;
					}
				}
				this.timer = setInterval(function() {
					 that.move(that.index * -that.slideSize);
				}, 30);
			} else {
				this.timer = setInterval(function() {
					 that.move(currentIndex * -that.slideSize);
				}, 30);
			}
		},
		/**
		 * 移动函数
		 * @param  {[Number]} target [根据当前第几章图片算出要移动的距离]
		 * 
		 */
		move: function(target) {
			var speed = Math.floor((target - this.imageWrapper[this.slideDirection]) / 10);
			this.imageWrapper.style[this.styleDirection] = this.imageWrapper[this.slideDirection] + speed + 'px';

			if (speed == 0) {
				this.imageWrapper.style[this.styleDirection] = target + 'px';
			}
			if (this.imageWrapper[this.slideDirection] == target) {
				clearInterval(this.timer);
			}
		},
		//当前分页器
		paginationCurrent: function() {
			var i, that = this;
			for (i = 0; i < this.paginationBtn.length; i++) {
				this.paginationBtn[i].index = i;
				this.paginationBtn[i].onclick = function () {
					that.tabClassName();
					this.className = 'current';
					that.startMove(null, this.index);
				};
			}
		},
		//清空所有className
		tabClassName: function() {
			for(var i = 0; i < this.paginationBtn.length; i++) {
				this.paginationBtn[i].className = '';
			}
		},
		//初始化事件
		initEvent: function() {
			var that = this;
			if(this.params.navigation) {
				this.prevBtn.addEventListener('click', function(){
					that.prev();
				}, false);

				this.nextBtn.addEventListener('click',function(){
					that.next();
				}, false);
			}


			this.carouselWrap.addEventListener('mouseover', function() {
				that.stopAutoPlay();
			}, false);

			this.carouselWrap.addEventListener('mouseout', function() {
				that.autoPlay();
			}, false);
		},
		//上一张按钮
		prev: function() {
			this.startMove('prev');
			if(this.params.pagination) {
				this.tabClassName();
			}
			
			this.paginationBtn[this.index].className = 'current';
		},
		//下一张按钮
		next: function() {
			this.startMove('next');	
			if(this.params.pagination) {
				this.tabClassName();
			}
			this.paginationBtn[this.index].className = 'current';
		},
		//自动播放
		autoPlay: function() {
			var that = this;
			this.autoPlayTime = setInterval(function() {
				that.next();
			},that.params.speed);
		},
		//停止播放
		stopAutoPlay: function() {
			clearInterval(this.autoPlayTime);
		}
	};

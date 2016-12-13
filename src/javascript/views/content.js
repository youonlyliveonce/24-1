import PageView from './base';
import View from 'ampersand-view';
import YoutubeView from '../features/youtube/youtube';
import GridView from '../features/filtergrid/filtergrid';
import SliderView from '../features/slider/slider';
import dom from 'ampersand-dom';

let Content = PageView.extend({

	props:{
		isInitial: ['boolean', true, false]
		,isScrollTop: ['boolean', true, false]
		,subViews: ['array', true, function(){ return []; }]
		,activeElement: ['object', true, function(){ return {}; }]
		,functionStore: ['function', true, function(){ return ""; }]
	},

	events: {
		'click .Button--down' : 'handleDownClick'
	},

	hookBeforeHide: function() {

	},

	hookInRender: function () {
		let self = this;
		let elements = this.queryAll('.Element');
		if(elements.length > 0){
			elements.forEach(function(element, index, array){

				let view = {};
				switch(element.dataset.view){
					case "VideoView" :
						element.getElementsByTagName('iframe')[0].setAttribute('id', 'videobox'+index)
						view = new YoutubeView({el:element, id:'videobox'+index, parentview:self});
						view.render();
						break;
					case "GridView" :
						view = new GridView({el:element, parentview:self});
						view.render();
						break;
					case "SliderView" :
						view = new SliderView({el:element, parentview:self});
						view.render();
						break;
					default:
				}
				self.subViews.push({id:element.getAttribute("id"), view:view});
				if(index == 0){
					view.on('change:active', self.onFirstSubViewActiveChange, self);
				}
			});
		}

		this.updateActiveView();

		TweenMax.delayedCall(0.8, function(){
				self.bindSlider('.swiper-container', 'basic');
		});

		this.hammerSwipe = new Hammer(this.el);
		this.hammerSwipe.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
		this.hammerSwipe.on('swipeup', this.handleSwipeUp.bind(this));
		this.hammerSwipe.on('swipedown', this.handleSwipeDown.bind(this));

		// this.functionStore = this.handleMouseWheel.bind(this);

	},
	handleResize: function(){
		this.subViews.forEach(function(element){
			element.view.handleResize();
		});
	},
	hookAfterShow: function(){

	},
	handleMouseWheel: function(event){
		this.activeElement.view.handleMouseWheel(event);
	},
	handleDownClick: function(event){
		this.nextSlide();
	},
	handleSwipeUp: function(event){
		this.nextSlide();
	},
	handleSwipeDown: function(event){
		this.previousSlide();
	},
	previousSlide: function(){
		let index  = this.subViews.indexOf(this.activeElement);
		if(index != 0){
			CM.App.navigate(`/${this.model.lang}/?section=${this.subViews[index-1].view.el.getAttribute('id')}`);
		}
	},
	nextSlide: function(){
		// nächstes Element ermitteln
		let index  = this.subViews.indexOf(this.activeElement);
		if(index != this.subViews.length-1){
			CM.App.navigate(`/${this.model.lang}/?section=${this.subViews[index+1].view.el.getAttribute('id')}`);
		}
	},
	onFirstSubViewActiveChange: function(view, value){
		if(value) {
			dom.addClass(document.body, 'Navigation--home');
		} else {
			dom.removeClass(document.body, 'Navigation--home');
		}
	},

	updateActiveView: function(){
		let lastActiveElement = this.activeElement;

		if (CM.App._params != {} && CM.App._params.section != null){
			this.activeElement = this.subViews.filter(element => { return element.id == CM.App._params.section })[0]
		} else {
			this.activeElement = this.subViews[0]
		}
		this.activeElement.view.active = true;

		if(lastActiveElement.view && (lastActiveElement.view != this.activeElement.view)){
			lastActiveElement.view.active = false;
		}

	}

});

export default Content;

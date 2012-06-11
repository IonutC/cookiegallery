/* TO DO
	DONE * NEXT ---- on click switch big image and thumb
	DONE * PREV ---- on click swith big image and thumb
	DONE * Thumb click --- get correct image
	DONE * highlight once gets out of the view scroll to the right position
		DONE * need to get the position of active thumb
		DONE * on movement create animation effect
	DONE * make auto animation to switch big image and thumb
	DONE * on the next or prev click reset the time to _CG duration so the animation will be interupted on click
	DONE * fix the fade in and fade out effects of the big images
	DONE * Create pause btn --- will stop the animation
	DONE * create play btn -- will resume the animation
	* remove button - will remove the current image and thumb including from the cookies
	* When cookies are set the list it's build but the cookies are not loaded and split it shows the html but not the cookies from images
	* CAPTION object add image title not hardcoded text
	* INTERNET EXPLOERE SUPORT	
	* mouse hover left right move slider


	EXTRA
	* Create horizontal gallery with option
	* create an visual line ofer the image to show "time" when the image it's swithing
	
	
	OLDER ONES
	DONE * on thumb click we call a function which creates the first image on x = 0
	DONE * but when click on the thumb the image calls the thumbclick fn which returns an index --- this index it's not returning correct data
	DONE * for next click needs to increase + 1
	DONE * on prev click needs to decrease -1
	DONE * on thumb click needs to select the big image based on the returing id 
  
*/
_CG.buildList = function(){
	var _list = this,
		mainHolder = document.getElementById(CGSettings.placeTarget),
		cookieGet = _CG.cookie.get(CGSettings.setCookieName),
		thumbs = [],
		bigImgs = [],
		matchUrl = /thumb_/i,
		tWidth = _CG.thumbs.width,
		tHeight = _CG.thumbs.height,
		mObjs = [],
		startPos = 0,
		speed = 300,
		countImage,
		auto = true,
		autodelay = 5,
		noThumbsInView = 0;
	
	//calls the merged objects togheter
	//builds the HTML list
	//init the thumbs and imgs
	this.initList = function(){
		//split _thumbs cookie from big img cokoie
		_list.splitCookies();
		//create all html holders
		_list.createDomElements();
		//merge the thumbs object with the big image obj
		_list.mergeObjs();
		
		var listH = document.getElementById('listH');
		if(listH){
			_list.storeThumbsInView();
			//add dynamic width to the ul
			_list.storeUlWidth(listH);
				//create the li with img and append them to ul
			_list.setThumbs(listH);
			
			if(_CG.autoplay.enabled) {
				_list.startAutoPlay(listH, _CG.autoplay.autorotate.duration);
			}
			/*
			listH.onmousemove = function(evnt){
				//_list.stopAnimation();
				//_list.onHoverStart(evnt, listH);
			}
			listH.onmouseout = function(){
				//_list.resetAutoPlayOnClick();
			}*/
			
		}
	};
	//loops through cookie and splits the thumbs from big images
	//builds 2 arrays with new values
	this.splitCookies = function(){
		/* loop through images that are saved into the cookies
			separate the thumbs from big images
			build object with id, index src etc for each img for further linking
		*/				
		for(var i = 0; i < cookieGet.length; i++){
			//separate thumbs
			if(cookieGet[i].match(matchUrl)){
				var stripname = cookieGet[i].replace(matchUrl, '');
				thumbs.push(CGSettings.thumbdir + stripname);
			}else{
				bigImgs.push(CGSettings.imagesdir + cookieGet[i])			
			}
		}
	};
	//Holds only the HTML elements without actually images or thumbs
	this.createDomElements = function(){
		_list.createBigHolder();
		_list.creatContorls();
		_list.createThumbHolder();
		_list.clickActions();
		
	};
	//create the top part of the gal big image and controls
	this.createBigHolder = function(){
		var imgHolder = document.createElement('div'),
			gControl = document.createElement('div'),
			cHolders = document.createElement('div'),
			imgIn = document.createElement('div'),
			start = document.createElement('div'),
			stop = document.createElement('div'),
			remove = document.createElement('div');
			
		imgHolder.setAttribute('id', 'imgHolder');
		imgIn.setAttribute('id', 'imgIn');
		gControl.setAttribute('id', 'controls');
		cHolders.setAttribute('id', 'contorlHolders');
		
		
		start.setAttribute('id', 'play');
		stop.setAttribute('id', 'stop');
		remove.setAttribute('id', 'remove');
		start.setAttribute('class', 'actionControls');
		stop.setAttribute('class', 'actionControls');
		remove.setAttribute('class', 'actionControls');
		
		mainHolder.appendChild(imgHolder);
		imgHolder.appendChild(imgIn);
		imgHolder.appendChild(gControl);
		gControl.appendChild(cHolders);
		cHolders.appendChild(start);
		cHolders.appendChild(stop);
		cHolders.appendChild(remove);
		
	};
	//create controls next prev and caption
	this.creatContorls = function(){
		var infoH = document.createElement('div'),
			prev = document.createElement('div'),
			photoCaption = document.createElement('div'),
			next = document.createElement('div');
		
		infoH.setAttribute('id', 'infoH');
		prev.setAttribute('id','prev');
		next.setAttribute('id','next');
		prev.setAttribute('class', 'moveControls');
		next.setAttribute('class', 'moveControls');
		photoCaption.setAttribute('id','photoCaption');

		mainHolder.appendChild(infoH);
		infoH.appendChild(prev);
		infoH.appendChild(next);
		infoH.appendChild(photoCaption);
		
	};
	//create holder of the thumbs
	this.createThumbHolder = function(){
		var thumbH = document.createElement('div'),
			ulList = document.createElement('ul');
		thumbH.setAttribute('id','thumbH');
		ulList.setAttribute('id', 'listH')
		mainHolder.appendChild(thumbH);
		thumbH.appendChild(ulList);
	};
	this.clickActions = function(){
		var playBtn = document.getElementById('play'),
			stopBtn = document.getElementById('stop'),
			nextBtn = document.getElementById('next'),
			prevBtn = document.getElementById('prev');
			
		if(playBtn && stopBtn){
			console.log(playBtn)
			playBtn.onclick = function(){
				alert('click')
				console.log('play')
				_list.resetAutoPlayOnClick();
			}
		
			stopBtn.onclick = function(){
				console.log('stop')
				_list.stopAnimation();
			}
		}
		
		if(nextBtn && prevBtn){
			//move slider to right
			nextBtn.onclick = function(){
				_list.resetAutoPlayOnClick();
				_list.moveRight();
			}
			//move slider to left
			prevBtn.onclick = function(){
				_list.resetAutoPlayOnClick();
				_list.moveLeft();
			}
		}		
	}
	//function to create an object with detailed information
	//returns new object
    this.addImageToGallery = function(imageConfig){
        imageConfig  = {
            index : imageConfig.index,
            id : imageConfig.id,
            thumb : imageConfig.thumb,
            caption : imageConfig.caption,
            src : imageConfig.src
        };
		return imageConfig;
    };
	//once we split the cookie push into new object just the thumbs
	//returns new object
	this.setThumbObj = function(){
		var objThumb = [];
		for(var x = 0; x < thumbs.length; x++){
			objThumb.push(
				_list.addImageToGallery({
					index : x,
					id : x,
					thumb : thumbs[x],
					caption : 'title',
					src : thumbs[x]
				})			
			)		
		}
		return objThumb;
	};
	//once we split the cookie push into new object just the big images
	//returns new object
	this.setImgObj = function(){
		var objImg = [];
		for(var x = 0; x < bigImgs.length; x++){
			objImg.push(
				_list.addImageToGallery({
					index : x,
					id : x,
					thumb : bigImgs[x],
					caption : 'title',
					src : bigImgs[x]
				})			
			)		
		}
		return objImg;
	};
	//setThumbObj and setImgObj merged togheter for haveing single id or index for the same thumb and img
	//returns new object
	this.mergeObjs = function(){
		var objThumb = _list.setThumbObj();
		var objImgs = _list.setImgObj();
		for(var p in objThumb){
			for(var o in objImgs){
				mObjs[p] = {
					index : objThumb[p].index,
					id : objThumb[p].id,
					thumb : objThumb[p].thumb,
					caption : 'title',
					src : objImgs[p].src
				}
			}
		}
		return mObjs;
	};
	//get the thumb holder width and devided by the thumb width
	//return the number of the thumbs that can be visible into thumb holder
	this.storeThumbsInView = function(){
		var thumbH = document.getElementById('thumbH');
        var containerWidth = thumbH.offsetWidth;
        noThumbsInView = Math.round(containerWidth / _CG.thumbs.width);
	};
	//set width to the ul imgs.length * the thumb width	
	this.storeUlWidth = function(ulH){
		var setW = (ulH.style.width = Math.round(mObjs.length * (_CG.thumbs.width + 4)) + 'px');
		return setW;
	};
	//once the object thubms it's set apply id and value for identifing the images
	this.setThumbs = function(ulHolder){
		var x = 0, max = mObjs.length, id = 0, index = 0;
		var imgH = document.getElementById('imgIn');
		var photoCaption = document.getElementById('photoCaption');
		
		for(x; x < max; x++){
			var liList = document.createElement('li');
				id = mObjs[x].id;
				index  = mObjs[x].index;
				thumbSrc = mObjs[x].thumb,
				bigSrc = mObjs[x].src;
				
			liList.setAttribute('id', 'list_' + id);
			ulHolder.appendChild(liList);
 			
			//create thumb images and append them to each li
			_list.createImgThumb(id, liList, thumbSrc);
			
			//on click switch the big image assigned to thumb
			liList.onclick = function(e){
				_list.resetAutoPlayOnClick();
				_list.clickOnThumbnail(e);
			}
			if(x == 0){
				if(liList.hasAttribute('id', 'list_' + startPos)){
					liList.setAttribute('class', 'active');
					_list.createBigImg(startPos, imgH);
					photoCaption.innerHTML = mObjs[id].caption;
				}
			}
		};
	}
	//create thumbs annd apend them
	this.createImgThumb = function(id, list, thumbSrc){
		if(id != null || id != ''){
			var createT = document.createElement('img');
			createT.setAttribute('id','thumb_' + id);
			createT.setAttribute('width', _CG.thumbs.width);
			createT.setAttribute('height', _CG.thumbs.height);
			createT.src = thumbSrc;
			list.appendChild(createT);
		}
	};
	//general function witch gets the all objects but returns just the object with the machted id
    this.getImageDataById = function(id) {
        var countImages = mObjs.length;
        for (var i = 0; i < countImages; i++) {
            if (mObjs[i].id == id) {
                return mObjs[i];
            }
        }
    };
	//on thumbnail click get target id and replace the string convert it into number
	//then send the given id to the selectImage fn
	this.clickOnThumbnail = function(e) {
		var getTargetId = e.target.id;
		var getId = getTargetId.replace('thumb_', '');
		var id = Number(getId);
		
		//update the startPos with the new id
		startPos = id;
		_list.selectImage(id);
    };
	//moves the slider to right
	//if reaches the max length of the images starts from 0
	this.moveRight = function(ulList){
		startPos = startPos + 1;
		if(startPos >= mObjs.length) {
            startPos = 0;
        }
		_list.selectImage(mObjs[startPos].id);
	};
	//moves slider to left
	//if gets under 0 then start from the end position of the given images object
	this.moveLeft = function(){
		startPos = startPos - 1;
		if(startPos < 0){
			startPos = mObjs.length - 1;
		}
		_list.selectImage(mObjs[startPos].id);
	};
	this.createBigImg = function(id, holder){
		if(id != null){
			var foundId = document.getElementById('img_' + id),
				createImg;
			//first time the count image is null
			//but when the image is set the countImage gets the image
			if(countImage != null){
				var getImages = holder.getElementsByTagName('img'),
					imgeLength = getImages.length,
					x = 0;
					
				//loop through holder images and match the id with the found id
				for(x; x < imgeLength; x++){
					if(countImage.id != id){
						var setOpacity = getImages[x];
						clearInterval(setOpacity.timer);
						setOpacity.timer = setInterval(function(){
							_list.fdout(setOpacity);
						},_CG.autoplay.fadeduration)
					}
				}
			}
			//if the holder has no image then create the first image	
			if(!foundId){
				createImg = document.createElement('img');
				createImg.src = mObjs[id].src;
				createImg.id = 'img_' + mObjs[id].id;
				createImg.setOpacity = 0;
				createImg.style.opacity = 0;
				createImg.style.filter = 'alpha(opacity=0)';
				holder.appendChild(createImg);
			}else{
				createImg = document.getElementById('img_' + id);
				clearInterval(createImg.timer);
			}
			
			createImg.timer = setInterval(function(){
				_list.fdin(createImg);
			}, _CG.autoplay.fadeduration);
	
		}		
	}
	//fade in the big image
	this.fdin = function(image){
		//check if image has been loaded and set opacity based on the interval increases
		if(image.complete){
			image.setOpacity = image.setOpacity + _CG.autoplay.fadeduration;
			image.style.opacity = image.setOpacity / 100;
			image.style.filter = 'alpha(opacity=' + image.setOpacity + ')';
		}
		//once the image visibility reaches 100 then set opacity to 1
		if(image.setOpacity >= 100){
			image.style.opacity = 1;
			image.style.filter = 'alpha(opacity=100)';
			clearInterval(image.timer);
			countImage = image;
		}
	};
	//fade out the big image
	this.fdout = function(image){
		image.setOpacity = image.setOpacity - _CG.autoplay.fadeduration;
		image.style.opacity = image.setOpacity / 100;
		image.style.filter = 'alpha(opacity=' + image.setOpacity + ')';
		
		if(image.setOpacity <= 0){
			clearInterval(image.timer);
			if(image.parentNode){
				image.parentNode.removeChild(image);
			}
		}
	};
	//sects active class to the li
	//and if it already exists then removes the active and gives it to the next li
	this.createThumbHighLight = function(id){
		var imageData = _list.getImageDataById(id);
		for(var x = 0; x < mObjs.length; x++){
			var getList = document.getElementById('list_' + mObjs[x].id);
			if(mObjs[x].id == id){
				getList.setAttribute('class', 'active');
			}else{
				if(getList.hasAttribute('class', 'active')){
					getList.removeAttribute('class', 'active');
				}
			}
		}
	}
	this.moveHighilightIntoView = function(id){
		var newIndexHighlight;
		var listH = document.getElementById('listH');		
		var activeLi = _list.getActiveEl(listH);
		
		//start position is 0
		if(activeLi == 0) {
            newIndexHighlight = 0;
		//start from end position
        }else if(activeLi == (mObjs.length - 1)) {
			var getLast = Math.min(noThumbsInView -1, mObjs.length - 1);
			newIndexHighlight = -(getLast * _CG.thumbs.width);
		//if active bigger then thumbs move to right e.g. 6=6
        }else if(activeLi > noThumbsInView) {
            newIndexHighlight = - (noThumbsInView - 1) * _CG.thumbs.width;
		//if active bigger = to thumbs move right 6 >5	
        }else if(activeLi >= (noThumbsInView - 1)) {
			console.log('goes here')
			//var getNew = Math.min(noThumbsInView - 1, startPos - 1);
            //newIndexHighlight = - (getNew * _CG.thumbs.width);
			var getNew = Math.min(noThumbsInView - 1, startPos - 1);
			//newIndexHighlight = - (getNew * _CG.thumbs.width);
			console.log(getNew)
			
        }else if(activeLi <= 0) {
            newIndexHighlight = 1;
        }else {
            newIndexHighlight = 0;
        }		
		listH.style.webkitTransitionDuration = listH.style.MozTransitionDuration = speed + 'ms';
		listH.style.msTransitionDuration = listH.style.OTransitionDuration = speed + 'ms';
		listH.style.transitionDuration = speed + 'ms';
		
		listH.style.left = newIndexHighlight + 'px';
		
	};
	//returns the id of the active li elem
	this.getActiveEl = function(listH){
		var getLi = listH.getElementsByTagName('li');
		var foundActive
		for(var x = 0; x < getLi.length; x++){
			if(getLi[x].className == 'active'){
				foundActive = getLi[x].id.replace('list_', '');
				break;			
			}
		}
		return Number(foundActive);
	}
	//select big image based on the id
	this.selectImage = function(id){
		var holder = document.getElementById('imgIn');
		var imageData = _list.getImageDataById(id);
		var photoCaption = document.getElementById('photoCaption');
		
		_list.createBigImg(id, holder);
		_list.createThumbHighLight(id);
		_list.moveHighilightIntoView(id);
		
		photoCaption.innerHTML = mObjs[id].caption;
	};
	//start auto play of the ul based on the _CG settings duration
	this.startAutoPlay = function(ulList, time){
		_CG.autoplay.enabled = true;
		ulList.timer = setInterval(function(){
			_list.moveRight();
		}, time)		
	};
	this.stopAnimation = function(){
		var listH = document.getElementById('listH')
		if(_CG.autoplay.enabled == true){
			clearInterval(listH.timer);
		}		
	}
	//when clicking the next or prev stop the interval for auto rotate and reset it again to the _CG settings
	this.resetAutoPlayOnClick = function(){
		var listH = document.getElementById('listH');
		console.log('reset')
		if(_CG.autoplay.enabled == true){
			clearInterval(listH.timer);
			_list.startAutoPlay(listH, _CG.autoplay.autorotate.duration);
		}
	}
	this.onHoverStart = function(e, ulList) {
		var deltaX = _list.getPosition(thumbH);
		var scrollX;
		var getWidth = _list.storeUlWidth(ulList);
		var width = Number(getWidth.replace('px', ''));
		
		deltaX = e.pageX - deltaX.x;
		
		//user starts to scroll right
		if(deltaX >= width){
			deltaX = deltaX / 1;
			scrollX = - (deltaX - width);
		}else if(deltaX <= width){
			//deltaX = 0;
			scrollX = - (deltaX);
		}

		ulList.style.left = scrollX + 'px';
	};
	this.getPosition = function(element) {
		var xPosition = 0;
		var yPosition = 0;
		while(element) {
			xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
			yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
			element = element.offsetParent;
		}
		return { x: xPosition, y: yPosition };
	}

	/*	
	this.setup = function(){
		var thumbH = document.getElementById('thumbH'),
			ulList = document.getElementById('listH'),
			slides = ulList.getElementsByTagName('li'),
			length = slides.length,
			index = length,
			getCWidth,
			el;
		
		// return immediately if their are less than two slides
		if(length < 2) return null;
	
		// hide slider element but keep positioning during setup
		thumbH.style.visiblilty = 'hidden';
		thumbH.width = thumbH.getBoundingClientRect().width;
	
		if(!thumbH.width) return null;
		
		for(var x = 0; x < slides.length; x++){
			getCWidth = slides[x].offsetWidth;
		}
		// dynamic css
		ulList.style.width = (length * getCWidth) + 'px';
		
		//set width to each li
		while(index--) {
			el = slides[index];
		}
		//if the width has been set then show the ul
		if(ulList.style.width){
			thumbH.style.visiblilty = 'visible';
		}
		_list.slide(index, 0, ulList, slides);
		_list.begin(next, prev);

	};
	
	this.slide = function(index, duration, ulList, liList) {
		var style = ulList.style,
			liListW;
			
		for(var x = 0; x < liList.length; x++){
			liListW = liList[x].offsetWidth;
		}
		
		style.webkitTransitionDuration = style.MozTransitionDuration = speed + 'ms';
		style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = speed + 'ms';
		
		ulList.onmouseover = function(evnt){
			//_list.onHoverStart(evnt, ulList, index, liListW, liList);
		}
	};	
	this.begin = function(nextB, prevB) {
		var thumbH = document.getElementById('thumbH'),
			ulList = thumbH.getElementsByTagName('ul')[0],
			slides = ulList.children,
			index = 0,
			liListW,
			moveRight = 0,
			moveLeft = 0,
			setActive = -1;
		
		thumbH.width = thumbH.getBoundingClientRect().width;
		
		for(var x = 0; x < slides.length; x++){
			liListW = slides[x].offsetWidth;
			slides[x].style.width = liListW + 'px';
		}
		var getMaxScroll = (liListW * slides.length) - thumbH.width;
		
		//make auto scroll
		ulList.timer = setInterval(function(){
			moveRight += liListW;
			if(moveRight >= getMaxScroll){
				moveRight = 0;
				nextT(index, slides, moveRight);
			}else{
				nextT(index, slides, moveRight);
			}
		}, _CG.autoplay.autorotate.duration)

		//on click go to next slide
		nextB.onclick = function(){
			_list.nextT(index, slides);
			
			//moveRight += liListW;
			if(moveRight >= getMaxScroll){
				moveRight = 0;
				_list.nextT(index, slides, moveRight, setActive);
			}else{
				_list.nextT(index, slides, moveRight, setActive);
			}
		}	
		prevB.onclick = function(){}	
		
	};	
	this.nextT = function(index, list){
		setThumbA = _list.getCurrentIndex() + 1;
		
		var thumbH = document.getElementById('thumbH'),
			ulList = thumbH.getElementsByTagName('ul')[0],
			liChild = listH.getElementsByTagName('li');
			
		if(setThumbA === liChild.length){
			setThumbA = 0;
		}
		_list.getIdByIndex(setThumbA);
		
		
		
		
		
		 
		for(var x = 0; x < liChild.length; x++){
			if(setActive){
				liChild[0 + setActive].style.opacity = '1';
			}else if(setActive === liChild.length){
				setActive = 0;
			}
		}
		
		/*if(index < list.length - 1){
			ulList.style.left = -(moveRight) + 'px';
		}else{
			ulList.style.left =  (moveRight) + 'px';
		}
		
	};
	this.prevT = function(index, list, moveLeft){
		var thumbH = document.getElementById('thumbH'),
			ulList = thumbH.getElementsByTagName('ul')[0];
		ulList.style.left = (moveLeft) + 'px';
	};
	this.highlightT = function(element){
		element.setAttribute('class', 'active');
	};
	//get element coordinates for hover left right of thumbs
    this.getCurrentIndex = function (){
        return _CG.startIndex;
    };
    this.getIdByIndex = function(index) {
		console.log(thumbs)
        return thumbs.id;
    };
    this.getImageDataById = function (id) {
        var countImages = this.images.length;
        for (var i = 0; i < countImages; i++) {
            if (this.images[i].id == id) {
                return this.images[i];
            }
        }
    }*/
		
	if(CGSettings.placeTarget != ''){
		if(mainHolder){
			if(doneLoading === true){
				_list.initList();
			}
		}
	}	
}

/*
GALL STRUCTURE

<div id="imgHolder">
	<div id="controlls"> Controlls: Reset | Pause | Save </div>
	<div id="imgIn">
		<div class="gallery-image">
			<img src="image">
		</div>
	</div>
</div>

<div id="infoH">
	<div class="prev">Previous</div>		<div class="photoName">Photo Name</div>		<div class="next">Next</div>
</div>

<div class="thumbH">
	<ul>
	<li>Thumb</li><li>Thumb</li><li>Thumb</li><li>Thumb</li><li>Thumb</li>
	</ul>
</div>

*/

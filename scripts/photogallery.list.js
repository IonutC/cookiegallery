function buildList(){
	var _list = this;
	
	if(CGSettings.placeTarget != ''){
		var mainHolder = document.getElementById(CGSettings.placeTarget);
		var cookieGet = _CG.cookie.get(CGSettings.setCookieName);
		var images = _CG.images;
		
		if(mainHolder){
	
			if(doneLoading === true){
				
				//create html elements for layout
				var imgHolder = document.createElement('div'),
					gControl = document.createElement('div'),
					imgIn = document.createElement('div'),
					infoH = document.createElement('div'),
					prev = document.createElement('div'),
					photoName = document.createElement('div'),
					next = document.createElement('div'),
					thumbH = document.createElement('div'),
					ulList = document.createElement('ul');
					
				//add individual ID's to each elem creted	
				imgHolder.setAttribute('id', 'imgHolder');
				gControl.setAttribute('id', 'controlls');
				imgIn.setAttribute('id', 'imgIn');
				infoH.setAttribute('id', 'infoH');
				prev.setAttribute('id','prev');
				next.setAttribute('id','next');
				photoName.setAttribute('id','photName');
				thumbH.setAttribute('id','thumbH');
				
				//created HTML elems append them to the proper elems
				mainHolder.appendChild(imgHolder);
				mainHolder.appendChild(infoH);
				mainHolder.appendChild(thumbH);
				imgHolder.appendChild(gControl);
				imgHolder.appendChild(imgIn);
				infoH.appendChild(prev);
				infoH.appendChild(photoName);
				infoH.appendChild(next);
				thumbH.appendChild(ulList);
				
				var returnedImages = _CG.imgString;
				var thumbs = [];
				var bigImgs = [];
				var matchUrl = /\/thumbs/i;
				
				var tWidth = _CG.thumbs.width;
				var tHeight = _CG.thumbs.height;
				
				//return separatly the thumbs and big images
				for(var i = 0; i < returnedImages.length; i++){
					//get the thumbs and palce them in the list
					if(returnedImages[i].match(matchUrl)){
						thumbs.push(returnedImages[i]);
					}else{
						bigImgs.push(returnedImages[i]);
					}
				}
				for(var x = 0; x < thumbs.length; x++){
					var createImgT = new Image();
					var liList = document.createElement('li');
					
					createImgT.width = tWidth;
					createImgT.height = tHeight;
					
					createImgT.src = thumbs[x];
					ulList.appendChild(liList);
					

					ulList.appendChild(liList);
					liList.appendChild(createImgT);
				}
				
				for(var z = 0; z < bigImgs.length; z++){
					var createImg = new Image(),
						galleryImage = document.createElement('div');
					
					createImg.src = bigImgs[z];
					
					galleryImage.setAttribute('class', 'gallery-image');
					

					galleryImage.appendChild(createImg);
					
					imgIn.appendChild(galleryImage);


					var _options = {
						index : i,
						id: imageObjects[i].id,
						thumb : img.getElements('img')[0].src,
						caption : img.getElements('.dg-image-gallery-caption')[0].get('html').trim(),
						src : img.getElements('.dg-image-gallery-large-image-path')[0].get('html').trim(),
						href : href
					};

				}
				
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

var selector=document.querySelector('.aside--bar__selector');
var aside= document.querySelector('.aside--bar');
var initialPage=document.querySelector('.activePage');
var initialPagePos=initialPage.getBoundingClientRect().left/window.innerWidth*100+"%"
var initialPagePosSelectorRelative=(initialPagePos.substr(0,initialPagePos.length-1)-selector.getBoundingClientRect().width/window.innerWidth*100)/(selector.getBoundingClientRect().width/window.innerWidth)+"%"
var activatedPage=initialPage;


var navLinks=document.querySelectorAll('nav a');

//https://stackoverflow.com/a/21436382
function getPage(url, from, to) {
	console.log("AJAX params: " +url+" "+from+" "+to);
    var cached=sessionStorage[url];
    if(!from){from="body";} // default to grabbing body tag
    if(to && to.split){to=document.querySelector(to);} // a string TO turns into an element
    if(!to){to=document.querySelector(from);} // default re-using the source elm as the target elm
	
	/*
	// Following line is what is causing the error. Because I've already loaded from this page, refuses to load again.
	// Figure out if there is a way to load both main and aside at the same time, or remove caching
	*/
    //if(cached){console.log("cached: " + cached);return to.innerHTML=cached;} // cache responses for instant re-use re-use

	/*
	// Will fail due to <meta>/<link>/etc... tag if meta is not closed like this: <meta />
	// See https://stackoverflow.com/a/27300830
	// And http://xahlee.info/js/html5_non-closing_tag.html
	*/
    var XHRt = new XMLHttpRequest; // new ajax
    XHRt.responseType='document';  // ajax2 context and onload() event
    XHRt.onload= function() { sessionStorage[url]=to.innerHTML= XHRt.response.querySelector(from).innerHTML;};
    XHRt.open("GET", url, true);
	console.log("about to send for" + to);
    XHRt.send();
	console.log("finished sending to" + to);
    return XHRt;
}



for (var i = 0; i < navLinks.length; i++) {
        //console.log(navLinks[i]);
		
        navLinks[i].onmouseover=function(){
			selectorMover(((this.getBoundingClientRect().left-selector.getBoundingClientRect().width)/window.innerWidth)/(selector.getBoundingClientRect().width/window.innerWidth)*100+"%",(selector.getBoundingClientRect().left/window.innerWidth)/(selector.getBoundingClientRect().width/window.innerWidth)*100+"%");
		};
		
		navLinks[i].onmouseout=function(){
			selectorMover(((activatedPage.getBoundingClientRect().left-selector.getBoundingClientRect().width)/window.innerWidth)/(selector.getBoundingClientRect().width/window.innerWidth)*100+"%",(selector.getBoundingClientRect().left/window.innerWidth)/(selector.getBoundingClientRect().width/window.innerWidth)*100+"%");
		};
		
		navLinks[i].onclick=function(){
			/* 
			// Following if statement will be important for when analytics is enabled
			// Otherwise, clicking the same page would register as an additional pageview
			// Although I'm considering whether or not this is necessary
			*/
			if (activatedPage==this){
				console.log("Same Page");
			}
			else{
				console.log("Loading different page");
				oldPage=activatedPage;
				activatedPage=this;
				var sourceDoc=this.href;
				
				
				oldPage.classList.remove('activePage');
				activatedPage.classList.add('activePage');
				document.querySelector('.aside--bar__content').style.height='0%'; //Gets rid of content first, just for aesthetic. Should not be a functional requirement
				growAside.onfinish=function(){
					console.log("finished shrinking");
					document.querySelector('.middle__white-space').style.width=(activatedPage.getBoundingClientRect().left)/window.innerWidth*100+"%";
					console.log("loading "+sourceDoc);
					
					
					
					console.log("sidebar returned: " + getPage(sourceDoc,'.aside--bar__content','.aside--bar__content'));
					growAside.onfinish=function(){
						document.querySelector('.aside--bar__content').style.height='100%';
						console.log("Loading main");
						console.log("main returned: " +getPage(sourceDoc,'.main__content','.main__content'));
					};
					//selectorMover(((activatedPage.getBoundingClientRect().left-selector.getBoundingClientRect().width)/window.innerWidth)/(selector.getBoundingClientRect().width/window.innerWidth)*100+"%",(selector.getBoundingClientRect().left/window.innerWidth)/(selector.getBoundingClientRect().width/window.innerWidth)*100+"%",true);
					growAside.reverse();
				}
				growAside.reverse();
				/*
				growAside.onfinish=function(){
					getPage('page1.html','.main__content','.main__content');
					}
				*/
				
				/*
				// Will need to a way to send proper analytics for page that isn't actually navigated to:
				// https://stackoverflow.com/questions/24199037/how-do-i-get-google-analytics-to-track-pages-called-by-ajax
				//ga(‘send’, ‘pageview’, ‘path to your virtual page’); //Find way to use google tag manager instead of analytics
				*/
			}
			return false; // Needed to prevent user from loading page when clicking link
		};
}


var timings={
			duration:500,
			fill:'both'
};

var growAside = aside.animate(
	[
		{ height:'0%' },
		{ height:'100%' }
	],timings
);

growAside.pause();
	growAside.onfinish=function(){
				document.querySelector('.aside--bar__content').style.height='100%';
			console.log("finished growing");
}


var selectorMover=function(endPos,startPos=null,boolGrowAside=false){
	console.log("Moving Selector From " + startPos + " TO " + endPos);

	var selectorAnimate=selector.animate(
		[
			{transform:"translateX("+startPos+")"},
			{transform:"translateX("+endPos+")"}
		],
		timings
	);
	if(boolGrowAside){
		
		selectorAnimate.onfinish=function(){
			console.log("Page change");
			/*
			growAside.onfinish=function(){
				
			};
			*/
			growAside.reverse();
		}
	}
}


window.onload = (event) => {
	var initialKeyframes=[
		{transform:"translateX("+(document.querySelector("nav").getClientRects()[0].width/window.innerWidth*100)/(selector.getBoundingClientRect().width/window.innerWidth)+"%)"},
		{transform:"translateX("+initialPagePosSelectorRelative+")"}
		];
	var initialTimings={
		duration:1000,
		fill:'forwards'
		}
	selector.animate(initialKeyframes,initialTimings).onfinish=function(){
		//aside.style.left=(initialPage.getBoundingClientRect().left/window.innerWidth+selector.getBoundingClientRect().width/window.innerWidth)*100+"%";
		//aside.style.left=parseFloat(initialPagePos.substring(0,initialPagePos.length-1))+(selector.getBoundingClientRect().width)/window.innerWidth*100+"%";
		document.querySelector('.middle__white-space').style.width=initialPagePos;
		growAside.play();
		};
	//console.log(selectorMover(window.innerWidth+"px",(initialPage.getBoundingClientRect().left/window.innerWidth)/(selector.getBoundingClientRect().width/window.innerWidth)*100+"%",true))
	
};
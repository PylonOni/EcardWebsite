function selectMsg(id) {
    var msgBtns = document.getElementsByClassName("greetMsg");
    var i;
    for (i = 0; i < msgBtns.length; i++) {
        msgBtns[i].disabled = false;
    }
    var selectedBtn = document.getElementById(id);
    selectedBtn.disabled = true;
}

function preview() {

    //START extracting data
    var selectedMsg = "";
    var msgBtns = document.getElementsByClassName("greetMsg");
    for (i = 0; i < msgBtns.length; i++) {
        if (msgBtns[i].disabled == true) {
            selectedMsg = msgBtns[i].innerHTML;
            break;
        }
    }
    var eventName = document.getElementById("inputEventSelection").value;
    var custemplete = document.getElementById("inputSelectedTemplete").value;
    var recName = document.getElementById("inputRecipientName").value;
    var eventDate = document.getElementById("inputEventDate").value;
    var customMsg = document.getElementById("inputCustomMsg").value;
    var bgCol = document.getElementById("inputBgCol").value;
    var greetTxtCol = document.getElementById("inputGreetTxtCol").value;
    //END extracting data

    //START inserting data
    document.getElementById("EventName").innerHTML = eventName;
    document.getElementById("greetMsg").innerHTML = selectedMsg;
    document.getElementById("recipientName").textContent = recName;
    document.getElementById("customMsg").textContent = customMsg;

    var formattedDate = "";
    if (eventDate != "") {
        let a = [{ day: 'numeric' }, { month: 'long' }, { year: 'numeric' }];
        formattedDate = join(new Date(eventDate), a, ' ');
    }
    document.getElementById("eventDate").textContent = formattedDate;

    document.getElementById("tmpl-one-preview").style.backgroundColor = bgCol;
    document.getElementById("greetMsg").style.color = greetTxtCol;
    //END inserting data
    return false;
}

function join(t, a, s) {
    function format(m) {
        let f = new Intl.DateTimeFormat('en', m);
        return f.format(t);
    }
    return a.map(format).join(s);
}

function markAsFav() {

    // extact the data
    var custemplete = document.getElementById("inputSelectedTemplete").value;
    var recName = document.getElementById("inputRecipientName").value;
    var eventDate = document.getElementById("inputEventDate").value;
    var customMsg = document.getElementById("inputCustomMsg").value;
    var bgCol = document.getElementById("inputBgCol").value;
    var greetTxtCol = document.getElementById("inputGreetTxtCol").value;

    var getFavCards = []; //this array is going to be filled with favouritedCards item in localStorage

    //if ada data in the localstorage in key favouriteCards
    if (localStorage.getItem("favouritedCards") != null) {
        var stringJson = localStorage.getItem("favouritedCards");
        // get favouritedCards item in localStorage -> parse it into JSON object -> store in getFavCards
        getFavCards = JSON.parse(stringJson); //to enable JS to read the string as JSON / read this string as JSON
    }

    // create the item to be pushed (inserted)
    newItem = { "recipientName": recName, "eventDate": eventDate, "customMessage": customMsg, "bgColor": bgCol, "greetTxtColor": greetTxtCol };

    // push the item to getFavCards
    getFavCards.push(newItem);

    //convert JSON into string pasal Localstorage only support string value
    var stringJson = JSON.stringify(getFavCards);

    // convert getFavCards into string -> store in localStorage under favoritedCards item
    localStorage.setItem("favouritedCards", stringJson);


    // display all items in getFavCards
    document.getElementById("favouritedCards").innerHTML = '';
    displayFavCards();

    return false;
}

function displayFavCards() {
    if (localStorage.getItem("favouritedCards") != null) {

        // get favouritedCards item in localStorage -> parse it into JSON object -> store in getFavCards
        var getFavCards = JSON.parse(localStorage.getItem("favouritedCards"));

        // display all items in getFavCards
        for (var i in getFavCards) {
            var div = document.createElement('div');
            div.setAttribute('class', 'favItem');
            var card = getFavCards[i];
            div.innerHTML = `
                <strong>Name:</strong> ` + card.recipientName + `<br>
                <strong>Event date:</strong> ` + card.eventDate + `<br>
                <strong>Custom message:</strong> ` + card.customMessage + `<br>
                <strong>Bg color:</strong> <span style="background-color:` + card.bgColor + ` " class="preview-color"></span>&nbsp;&nbsp;<strong>Greeting txt color:</strong> <span style="background-color:` + card.greetTxtColor + ` " class="preview-color"></span><br>
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeData(` + i + `)">X</button>
                <button type="button" class="btn btn-sm btn-outline-primary" onclick='applyData(` + JSON.stringify(card) + `)';>Use</button>
            `;
            document.getElementById("favouritedCards").appendChild(div);
        }


    }
}

function applyData(cardObj) { //or by using key
    document.getElementById("inputRecipientName").value = cardObj.recipientName;
    document.getElementById("inputEventDate").value = cardObj.eventDate;
    document.getElementById("inputCustomMsg").value = cardObj.customMessage;
    document.getElementById("inputBgCol").value = cardObj.bgColor;
    document.getElementById("inputGreetTxtCol").value = cardObj.greetTxtColor;
}

function removeData(index) {
    if (localStorage.getItem("favouritedCards") != null) {
        // get favouritedCards item in localStorage -> parse it into JSON object -> store in getFavCards
        var getFavCards = JSON.parse(localStorage.getItem("favouritedCards"));
        getFavCards.splice(index, 1);

        // convert getFavCards into string -> store in localStorage under favoritedCards item
        localStorage.setItem("favouritedCards", JSON.stringify(getFavCards));

        // display all items in getFavCards
        document.getElementById("favouritedCards").innerHTML = '';
        displayFavCards();
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("Text", ev.target.id);
}

function drop(ev) {
    var data = ev.dataTransfer.getData("Text");
    var imgsticker = document.getElementById(data);
    ev.target.appendChild(imgsticker);
    imgsticker.style.position = "absolute";
    imgsticker.style.zIndex = "1";
    dragElement(imgsticker);
    ev.preventDefault();
}

function dragElement(elmnt) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:

        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function saveAsPic() {
    domtoimage.toBlob(document.getElementById('tmpl-one-preview'))
        .then(function(blob) {
            window.saveAs(blob, 'output.png');
        });
}

(function() {
    //display existing items in localStorage under favouriteCards
    displayFavCards();

})();

//Change templete1 & 2 //

function swapImage(){
	var image = document.getElementById("imageToSwap");
	var dropd = document.getElementById("inputSelectedTemplete");
	image.src = dropd.value;
};



/*-----------------------------------------------------------------*/
var x, i, j, l, ll, selElmnt, a, b, c;
/* Look for any elements with the class "custom-select": */
x = document.getElementsByClassName("custom-select");
l = x.length;
for (i = 0; i < l; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  ll = selElmnt.length;
  /* For each element, create a new DIV that will act as the selected item: */
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /* For each element, create a new DIV that will contain the option list: */
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < ll; j++) {
    /* For each option in the original select element,
    create a new DIV that will act as an option item: */
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function(e) {
        /* When an item is clicked, update the original select box,
        and the selected item: */
        var y, i, k, s, h, sl, yl;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        sl = s.length;
        h = this.parentNode.previousSibling;
        for (i = 0; i < sl; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            yl = y.length;
            for (k = 0; k < yl; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function(e) {
    /* When the select box is clicked, close any other select boxes,
    and open/close the current select box: */
    e.stopPropagation();
    closeAllSelect(this);
    this.nextSibling.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
  });
}

function closeAllSelect(elmnt) {
  /* A function that will close all select boxes in the document,
  except the current select box: */
  var x, y, i, xl, yl, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect);

//background animation//

var petalPlayers = [];

function animatePetals() {
  var petals = document.querySelectorAll('.petal');

  if (!petals[0].animate) {
    var petalsContainer = document.getElementById('petals-container');
    petalsContainer.prepend("Uh oh, it seems like your browser doesn't support Web Animations API yet. Have you tried this in Firefox or Chrome?");
    return false;
  }

  for (var i = 0, len = petals.length; i < len; ++i) {
    var petal = petals[i];
    petal.innerHTML = '<div class="rotate"><img src="http://qqz.works/images/petal.png" class="askew"></div>';
    var scale = Math.random() * .8 + .2;


    var player = petal.animate([
      { transform: 'translate3d(' + (i/len*100) + 'vw,0,0) scale(' + scale + ')', opacity: scale },
      { transform: 'translate3d(' + (i/len*100 + 10) + 'vw,150vh,0) scale(' + scale + ')', opacity: 1 }
    ], {
      duration: Math.random() * 90000 + 3000,
      iterations: Infinity,
      delay: -(Math.random() * 5000)
    });

    petalPlayers.push(player);
  }
}

animatePetals();
////////////////////////// PARTICLE ENGINE ////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

var ParticleEngine = (function() {
	'use strict';

	function ParticleEngine(canvas_id) {
		// enforces new
		if (!(this instanceof ParticleEngine)) {
			return new ParticleEngine(args);
		}

		var _ParticleEngine = this;

		this.canvas_id = canvas_id;
		this.stage = new createjs.Stage(canvas_id);
		this.totalWidth = this.canvasWidth = document.getElementById(canvas_id).width = document.getElementById(canvas_id).offsetWidth;
		this.totalHeight = this.canvasHeight = document.getElementById(canvas_id).height = document.getElementById(canvas_id).offsetHeight;
		this.compositeStyle = "lighter";

		this.particleSettings = [{id:"small", num:300, fromX:0, toX:this.totalWidth, ballwidth:3, alphamax:0.4, areaHeight:.5, color:"#F0F0F0", fill:false},
								{id:"medium", num:100, fromX:0, toX:this.totalWidth,  ballwidth:8, alphamax:0.3, areaHeight:1, color:"#C0C0C0", fill:true},
								{id:"large", num:10, fromX:0, toX:this.totalWidth, ballwidth:30,  alphamax:0.2, areaHeight:1, color:"#A0A0A0", fill:true}];
		this.particleArray = [];
		this.lights = [{ellipseWidth:400, ellipseHeight:100, alpha:0.6, offsetX:0, offsetY:0, color:"#D0D0D0"},
						{ellipseWidth:350, ellipseHeight:250, alpha:0.3, offsetX:-50, offsetY:0, color:"#B8B8B8"},
						{ellipseWidth:100, ellipseHeight:80, alpha:0.2, offsetX:80, offsetY:-50, color:"#F8F8F8"}];

		this.stage.compositeOperation = _ParticleEngine.compositeStyle;


		function drawBgLight()
		{
			var light;
			var bounds;
			var blurFilter;
			for (var i = 0, len = _ParticleEngine.lights.length; i < len; i++) {
				light = new createjs.Shape();
				light.graphics.beginFill(_ParticleEngine.lights[i].color).drawEllipse(0, 0, _ParticleEngine.lights[i].ellipseWidth, _ParticleEngine.lights[i].ellipseHeight);
				light.regX = _ParticleEngine.lights[i].ellipseWidth/2;
				light.regY = _ParticleEngine.lights[i].ellipseHeight/2;
				light.y = light.initY = _ParticleEngine.totalHeight/2 + _ParticleEngine.lights[i].offsetY;
				light.x = light.initX =_ParticleEngine.totalWidth/2 + _ParticleEngine.lights[i].offsetX;

				blurFilter = new createjs.BlurFilter(_ParticleEngine.lights[i].ellipseWidth, _ParticleEngine.lights[i].ellipseHeight, 1);
				bounds = blurFilter.getBounds();
				light.filters = [blurFilter];
				light.cache(bounds.x-_ParticleEngine.lights[i].ellipseWidth/2, bounds.y-_ParticleEngine.lights[i].ellipseHeight/2, bounds.width*2, bounds.height*2);
				light.alpha = _ParticleEngine.lights[i].alpha;

				light.compositeOperation = "screen";
				_ParticleEngine.stage.addChildAt(light, 0);

				_ParticleEngine.lights[i].elem = light;
			}

			TweenMax.fromTo(_ParticleEngine.lights[0].elem, 10, {scaleX:1.5, x:_ParticleEngine.lights[0].elem.initX, y:_ParticleEngine.lights[0].elem.initY},{yoyo:true, repeat:-1, ease:Power1.easeInOut, scaleX:2, scaleY:0.7});
			TweenMax.fromTo(_ParticleEngine.lights[1].elem, 12, { x:_ParticleEngine.lights[1].elem.initX, y:_ParticleEngine.lights[1].elem.initY},{delay:5, yoyo:true, repeat:-1, ease:Power1.easeInOut, scaleY:2, scaleX:2, y:_ParticleEngine.totalHeight/2-50, x:_ParticleEngine.totalWidth/2+100});
			TweenMax.fromTo(_ParticleEngine.lights[2].elem, 8, { x:_ParticleEngine.lights[2].elem.initX, y:_ParticleEngine.lights[2].elem.initY},{delay:2, yoyo:true, repeat:-1, ease:Power1.easeInOut, scaleY:1.5, scaleX:1.5, y:_ParticleEngine.totalHeight/2, x:_ParticleEngine.totalWidth/2-200});
		}

		var blurFilter;
		function drawParticles(){

			for (var i = 0, len = _ParticleEngine.particleSettings.length; i < len; i++) {
				var ball = _ParticleEngine.particleSettings[i];

				var circle;
				for (var s = 0; s < ball.num; s++ )
				{
					circle = new createjs.Shape();
					if(ball.fill){
						circle.graphics.beginFill(ball.color).drawCircle(0, 0, ball.ballwidth);
						blurFilter = new createjs.BlurFilter(ball.ballwidth/2, ball.ballwidth/2, 1);
						circle.filters = [blurFilter];
						var bounds = blurFilter.getBounds();
						circle.cache(-50+bounds.x, -50+bounds.y, 100+bounds.width, 100+bounds.height);
					}else{
						circle.graphics.beginStroke(ball.color).setStrokeStyle(1).drawCircle(0, 0, ball.ballwidth);
					}

					circle.alpha = range(0, 0.1);
					circle.alphaMax = ball.alphamax;
					circle.distance = ball.ballwidth * 2;
					circle.ballwidth = ball.ballwidth;
					circle.flag = ball.id;
					_ParticleEngine.applySettings(circle, ball.fromX, ball.toX, ball.areaHeight);
					circle.speed = range(2, 10);
					circle.y = circle.initY;
					circle.x = circle.initX;
					circle.scaleX = circle.scaleY = range(0.3, 1);

					_ParticleEngine.stage.addChild(circle);


					animateBall(circle);

					_ParticleEngine.particleArray.push(circle);
				}
			}
		}

		this.applySettings = function(circle, positionX, totalWidth, areaHeight)
		{
			circle.speed = range(1, 3);
			circle.initY = weightedRange(0, _ParticleEngine.totalHeight , 1, [_ParticleEngine.totalHeight * (2-areaHeight/2)/4, _ParticleEngine.totalHeight*(2+areaHeight/2)/4], 0.8 );
			circle.initX = weightedRange(positionX, totalWidth, 1, [positionX+ ((totalWidth-positionX))/4, positionX+ ((totalWidth-positionX)) * 3/4], 0.6);
		}

		function animateBall(ball)
		{
			var scale = range(0.3, 1);
			var xpos = range(ball.initX - ball.distance, ball.initX + ball.distance);
			var ypos = range(ball.initY - ball.distance, ball.initY + ball.distance);
			var speed = ball.speed;
			TweenMax.to(ball, speed, {scaleX:scale, scaleY:scale, x:xpos, y:ypos, onComplete:animateBall, onCompleteParams:[ball], ease:Cubic.easeInOut});
			TweenMax.to(ball, speed/2, {alpha:range(0.1, ball.alphaMax), onComplete:fadeout, onCompleteParams:[ball, speed]});
		}

		function fadeout(ball, speed)
		{
			ball.speed = range(2, 10);
			TweenMax.to(ball, speed/2, {alpha:0 });
		}

		drawBgLight();
		drawParticles();
	}

	ParticleEngine.prototype.render = function()
	{
		this.stage.update();
	}

	ParticleEngine.prototype.resize = function()
	{
		this.totalWidth = this.canvasWidth = document.getElementById(this.canvas_id).width = document.getElementById(this.canvas_id).offsetWidth;
		this.totalHeight = this.canvasHeight = document.getElementById(this.canvas_id).height = document.getElementById(this.canvas_id).offsetHeight;
		this.render();

		for (var i= 0, length = this.particleArray.length; i < length; i++)
		{
			this.applySettings(this.particleArray[i], 0, this.totalWidth, this.particleArray[i].areaHeight);
		}

		for (var j = 0, len = this.lights.length; j < len; j++) {
			this.lights[j].elem.initY = this.totalHeight/2 + this.lights[j].offsetY;
			this.lights[j].elem.initX =this.totalWidth/2 + this.lights[j].offsetX;
			TweenMax.to(this.lights[j].elem, .5, {x:this.lights[j].elem.initX, y:this.lights[j].elem.initY});
		}
	}

	return ParticleEngine;

}());


////////////////////////UTILS//////////////////////////////////////
//////////////////////////////////////////////////////////////////

function range(min, max)
{
	return min + (max - min) * Math.random();
}

function round(num, precision)
{
   var decimal = Math.pow(10, precision);
   return Math.round(decimal* num) / decimal;
}

function weightedRange(to, from, decimalPlaces, weightedRange, weightStrength)
{
	if (typeof from === "undefined" || from === null) {
	    from = 0;
	}
	if (typeof decimalPlaces === "undefined" || decimalPlaces === null) {
	    decimalPlaces = 0;
	}
	if (typeof weightedRange === "undefined" || weightedRange === null) {
	    weightedRange = 0;
	}
	if (typeof weightStrength === "undefined" || weightStrength === null) {
	    weightStrength = 0;
	}

   var ret
   if(to == from){return(to);}

   if(weightedRange && Math.random()<=weightStrength){
	  ret = round( Math.random()*(weightedRange[1]-weightedRange[0]) + weightedRange[0], decimalPlaces )
   }else{
	  ret = round( Math.random()*(to-from)+from, decimalPlaces )
   }
   return(ret);
}

///////////////// RUN CODE //////////////////////////
//////////////////////////////////////////////////////

var particles
(function(){
	particles = new ParticleEngine('projector');
	createjs.Ticker.addEventListener("tick", updateCanvas);
	window.addEventListener('resize', resizeCanvas, false);

	function updateCanvas(){
		particles.render();
	}

	function resizeCanvas(){
		particles.resize();
	}
}());

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
    //eventName to evGreet
    //inputcsutommsg to inputMessage
    //custommsg to eventMessage
    var eventGreet = document.getElementById("select").value;
    var evName = document.getElementById("inputEventName")
    var recName = document.getElementById("inputRecipientName").value;
    var eventMessage = document.getElementById("inputMessage").value;
    var eventDate = document.getElementById("inputEventDate").value;
    var eventTime = document.getElementById("inputEventTime").value;
    var eventRSVP = document.getElementById("inputRSVP").value;

    var bgCol = document.getElementById("inputBgCol").value;
    var greetTxtCol = document.getElementById("inputGreetTxtCol").value;

    //END extracting data

    //START inserting data
    document.getElementById("greetMsg").innerHTML = selectedMsg;
    document.getElementById("recipientName").textContent = recName;
    document.getElementById("eventMessage").textContent = eventMessage;

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
    var recName = document.getElementById("inputRecipientName").value;
    var eventDate = document.getElementById("inputEventDate").value;
    var customMsg = document.getElementById("inputMessage").value;
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

// 404

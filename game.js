
// ****** LIB: BlackJack (game logic) ******

var BlackJack = (function () {
	// Public...
	// Enum
	BlackJack.prototype.State = {
		Nothing : 0,
		YouBusted : 1,
		ComBusted : 2,
		BothBusted : 3,
		YouExact21 : 4,
		ComExact21 : 5,
		BothExact21 : 6,
		You5Card : 7,
		Com5Card : 8,
		Both5Card : 9,
		YouScoreBetter : 10,
		ComScoreBetter : 11,
		SameScore : 12
	}
	// Functions
	BlackJack.prototype.state = function() {
		return this.bjs;
	}
	BlackJack.prototype.takeCard = function() {
		if (this.bjs == this.State.Nothing) {
			var card = getRandomCard.call(this);
			this.playerCards.push(card);
			comTurn.call(this);
			updateState.call(this);
		}
	}
	BlackJack.prototype.deal = function() {
		if (this.bjs == this.State.Nothing) {
			this.wantDeal = true;
			comTurn.call(this);
			updateState.call(this);
		}		
	}
	BlackJack.prototype.reset = function() {
		this.bjs = this.State.Nothing;
		this.wantDeal = false;
		do {
			// Prepare unused cards
			this.unusedCards = [];
			for (var i = 1; i <= 13; ++i) {
				for (var j = 0; j < 4; ++j) {
					this.unusedCards.push(i);
				}
			}
			// Pass 2 cards to player
			this.playerCards = [];
			this.playerCards.push( getRandomCard.call(this) );
			this.playerCards.push( getRandomCard.call(this) );
			// Pass 2 cards to COM
			this.comCards = [];
			this.comCards.push( getRandomCard.call(this) );
			this.comCards.push( getRandomCard.call(this) );
			// If any player busted at this point, reset
		} while (this.getComPoint() >= 21 || this.getPlayerPoint() >= 21);
	}
	BlackJack.prototype.getPlayerCards = function() {
		return this.playerCards.slice();
	}
	BlackJack.prototype.getComCards = function() {
		return this.comCards.slice();
	}
	BlackJack.prototype.getPlayerPoint = function() {
		return getPointOf.call(this, this.playerCards);
	}
	BlackJack.prototype.getComPoint = function() {
		return getPointOf.call(this, this.comCards);
	}
	// Private...
	// Variables
	var unusedCards = [];
	var playerCards = [];
	var comCards = [];
	var bjs;
	var wantDeal;
	// Constructor
	function BlackJack() {
		this.reset();
	}
	// Functions
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	function getPointOf(cards) {
		var point = 0;
		var	aceCount = 0;
		for (var i = 0; i < cards.length; ++i) {
			var card = cards[i];
			if (card == 1) {
				++aceCount;
				point += 11;
			}
			else if (card > 10) {
				point += 10;
			}
			else {
				point += card;
			}
			while (point > 21 && aceCount > 0) {
				--aceCount;
				point -= 10;
			}
		}
		return point;
	}
	function getRandomCard() {
		var i = getRandomInt.call(this, 0, this.unusedCards.length - 1);
		var card = this.unusedCards[i];
		this.unusedCards.splice(i, 1);
		return card;
	}
	function comTurn() {
		var rate = (20 - this.getComPoint()) / 20.0;
		rate += (getRandomInt.call(this, 1, 5) * 0.1);
		if (rate > 0.5) {
			var card = getRandomCard.call(this);
			this.comCards.push(card);
		}
	}
	function updateState() {
		var playerPoint = this.getPlayerPoint();
		var comPoint = this.getComPoint();
		var playerCardsCount = this.playerCards.length;
		var comCardsCount = this.comCards.length;
		
		if (playerPoint > 21 && comPoint > 21) {
			this.bjs = this.State.BothBusted;
		}
		else if (playerCardsCount >= 5 && comCardsCount >= 5) {
			this.bjs = this.State.Both5Card;
		}
		else if (playerPoint > 21) {
			this.bjs = this.State.YouBusted;
		}
		else if (playerPoint == 21) {
			this.bjs = this.State.YouExact21;
		}
		else if (playerCardsCount >= 5) {
			this.bjs = this.State.You5Card;
		}
		else if (comPoint > 21) {
			this.bjs = this.State.ComBusted;
		}
		else if (comPoint == 21) {
			this.bjs = this.State.ComExact21;
		}
		else if (comCardsCount >= 5) {
			this.bjs = this.State.Com5Card;
		}
		else if (this.wantDeal) {
			if (playerPoint > comPoint) {
				this.bjs = this.State.YouScoreBetter;
			}
			else if (comPoint > playerPoint) {
				this.bjs = this.State.ComScoreBetter;
			}
			else {
				this.bjs = this.State.SameScore;
			}
		}
	}
	// End
	return BlackJack;
})();

// ****** Variable and Helper ******

var bjack = new BlackJack();
var isMsgboxing, isConfiging;
var mui = {}; // Multilingual UI dictionary


function $(id) {
	return document.getElementById(id);
}

function toggleConfig() {
	$("topbar").className =
	$("topbar-miniball").className = 
	$("config").className = isConfiging ? "" : "on";
	isConfiging = !isConfiging;
}

function myMsgBox(txt, txt2) {
	if (txt) {
		$("MsgBox_text").innerHTML = txt + "<br>" + txt2;
	}
	$("MsgBox").className = txt ? "on" : "";
	isMsgboxing = txt ? true : false;
}

function checkBJackState() {
	var bjs = bjack.state();
	if (bjs != bjack.State.Nothing) {
		var msg = 
			bjs == bjack.State.YouBusted ? mui.YouBusted :
			bjs == bjack.State.ComBusted ? mui.ComBusted :
			bjs == bjack.State.BothBusted ? mui.BothBusted :
			bjs == bjack.State.YouExact21 ? mui.YouExact21 :
			bjs == bjack.State.ComExact21 ? mui.ComExact21 :
			bjs == bjack.State.BothExact21 ? mui.BothExact21 :
			bjs == bjack.State.You5Card ? mui.You5Card :
			bjs == bjack.State.Com5Card ? mui.Com5Card :
			bjs == bjack.State.Both5Card ? mui.Both5Card :
			bjs == bjack.State.YouScoreBetter ? mui.YouScoreBetter :
			bjs == bjack.State.ComScoreBetter ? mui.ComScoreBetter :
			bjs == bjack.State.SameScore ? mui.SameScore : mui.WhatHappened;
		var msg2 = (
			bjs == bjack.State.YouBusted ||
			bjs == bjack.State.ComExact21 ||
			bjs == bjack.State.Com5Card ||
			bjs == bjack.State.ComScoreBetter) ?
			mui.YouLose : (
			bjs == bjack.State.ComBusted ||
			bjs == bjack.State.YouExact21 ||
			bjs == bjack.State.You5Card ||
			bjs == bjack.State.YouScoreBetter) ?
			mui.YouWin : mui.DrawGame;
		myMsgBox(msg, msg2);
	}
}

function isPortraitMode() {
	var a = window.getComputedStyle($("portrait-test"), null)
	a = a.getPropertyValue("visibility");
	return (a == "visible");
}

function hideAllCards() {
	var cards = document.getElementsByClassName("card");
	for (var i = 0; i < cards.length; ++i) {
		cards[i].style.visibility = "hidden";
	}
}

function showCard(who, i, card) {
	// Figure out card text
	var cardText;
	if (card > 1 && card < 11) {
		cardText = card.toString();
	}
	else {
		cardText =
			card == 1  ? "A" :
			card == 11 ? "J" :
			card == 12 ? "Q" :
			card == 13 ? "K" : "?";
	}
	// Set text
	var omo = $(who + "-card" + (i+1));
	omo.style.visibility = "visible";
	omo.innerHTML = cardText + "<div>" + cardText + "</div>";
}

function updateFontSize() {
	var newSize = isPortraitMode() ? 28 : 18;	
	var gameWidth = $("game").offsetWidth;
	newSize *= (gameWidth / 580);
	newSize += "px";
	// change game font size
	$("game").style.fontSize = newSize;
	var gameButtons = $("game-buttons").children;
	for (var i = 0; i < gameButtons.length; ++i){
		gameButtons[i].style.fontSize = newSize;
	}
	// change msgbox font size
	$("MsgBox_text").style.fontSize = newSize;
	$("MsgBox_OK").style.fontSize = newSize;
}

function updateUI() {
	var gameOver = (bjack.state() != bjack.State.Nothing);
	hideAllCards();
	
	// Show player cards
	var cards = bjack.getPlayerCards();
	for (var i = 0; i < cards.length; ++i) {
		showCard("player", i, cards[i]);
	}
	if (gameOver) {
		var cards = bjack.getComCards();
		for (var i = 0; i < cards.length; ++i) {
			showCard("com", i, cards[i]);
		}
	}
	// Show player score
	var pointText = mui.YourPoint + bjack.getPlayerPoint();
	if (gameOver) {
		// Show COM score
		pointText += "<br>" + mui.ComPoint + bjack.getComPoint();
	}
	$("point-text").innerHTML = pointText;
	
	$("btnTakeCard").innerHTML = mui.TakeCard;
	$("btnDeal").innerHTML = mui.Deal;
	$("btnReset").innerHTML = mui.Reset;
}

function setLangAndUpdateUI(id) {
	var fontFamily;
	if (id == "日本語") {
		fontFamily = "Osaka, Meiryo UI, MS PGothic";
		mui.TakeCard = "カードを引く";
		mui.Deal = "やってみる";
		mui.Reset = "リセット";
		mui.YourPoint = "お前の点数：";
		mui.ComPoint = "ＣＯＭの点数：";
		mui.YouBusted = "21点より超えてしまった。";
		mui.ComBusted = "ＣＯＭは21点より超えてしまった。";
		mui.BothBusted = "どちらも21点より超えてしまった。";
		mui.YouExact21 = "お前は丁度21点もらった。";
		mui.ComExact21 = "ＣＯＭは丁度21点もらってしまった。";
		mui.BothExact21 = "偶然だね、どちらも21点です。";
		mui.You5Card = "お前もう五枚取ったが、21点になれず。";
		mui.Com5Card = "ＣＯＭもう五枚取ったが、21点になれず。";
		mui.Both5Card = "両方もう五枚取ったが、21点になれず。";
		mui.YouScoreBetter = "ＣＯＭより点数が多いです。";
		mui.ComScoreBetter = "ＣＯＭより点数が少ないです。";
		mui.SameScore = "両方の点数は同じです。";
		mui.WhatHappened = "予想外のことが起きた。";
		mui.YouWin = "お前の勝利だ！";
		mui.YouLose = "お前の負けだ。";
		mui.DrawGame = "これで引き分けです。";
	}
	else if (id == "简体中文") {
		fontFamily = "SimHei, Hiragino Sans GB";
		mui.TakeCard = "抽卡";
		mui.Deal = "放手一搏";
		mui.Reset = "重置游戏";
		mui.YourPoint = "您的点数：";
		mui.ComPoint = "ＣＯＭ的点数：";
		mui.YouBusted = "您超过21点，爆了！";
		mui.ComBusted = "ＣＯＭ超过21点，爆了！";
		mui.BothBusted = "双方都超过21点，爆了！";
		mui.YouExact21 = "您拿到21点！";
		mui.ComExact21 = "ＣＯＭ拿到21点！";
		mui.BothExact21 = "双方同时拿到21点！";
		mui.You5Card = "您抽了五张卡，但没超过21点。";
		mui.Com5Card = "ＣＯＭ抽了五张卡，但没超过21点。";
		mui.Both5Card = "双方都抽了五张卡，但没超过21点。";
		mui.YouScoreBetter = "您的点数比较高！";
		mui.ComScoreBetter = "ＣＯＭ的点数比较高！";
		mui.SameScore = "双方的点数一样！";
		mui.WhatHappened = "发生了出乎意料的事情";
		mui.YouWin = "您赢了！";
		mui.YouLose = "您输了！";
		mui.DrawGame = "不分胜负。";
	}
	else { // English (default)
		fontFamily = "Tahoma";
		mui.TakeCard = "Take Card";
		mui.Deal = "Deal!";
		mui.Reset = "Reset";
		mui.YourPoint = "Your point = ";
		mui.ComPoint = "COM point = ";
		mui.YouBusted = "You're busted!";
		mui.ComBusted = "COM is busted!";
		mui.BothBusted = "You all are busted!";
		mui.YouExact21 = "You've scored exactly 21!";
		mui.ComExact21 = "COM has scored exactly 21!";
		mui.BothExact21 = "You all have scored exactly 21!";
		mui.You5Card = "You've taken 5 cards, yet not busted.";
		mui.Com5Card = "COM has taken 5 cards, yet not busted.";
		mui.Both5Card = "You all have taken 5 cards, yet not busted.";
		mui.YouScoreBetter = "Your point is higher!";
		mui.ComScoreBetter = "COM's point is higher!";
		mui.SameScore = "Same point!";
		mui.WhatHappened = "Unexpected event has occurred";
		mui.YouWin = "You win!";
		mui.YouLose = "You lose!";
		mui.DrawGame = "Draw game.";
	}
	fontFamily += ", sans-serif";
	$("point-text").style.fontFamily =
	$("MsgBox").style.fontFamily =
	$("btnTakeCard").style.fontFamily =
	$("btnDeal").style.fontFamily =
	$("btnReset").style.fontFamily = fontFamily;
	updateUI();
	checkBJackState();
}


// ****** Game Entry Point ******

function onPageLoad() {
	updateFontSize();
	setLangAndUpdateUI();
	// Keyboard support
	document.addEventListener("keydown", function(event) {
		var key = event.keyCode;
		if (isMsgboxing) {
			if (key == 0x1B) { // VK_ESCAPE
				onMsgBoxOK();
			}
		}
		else {
			if (key == 67) { // 'C'
				bjack.takeCard();
			}
			else if (key == 68) { // 'D'
				bjack.deal();
			}
			else if (key == 82) { // 'R'
				bjack.reset();
			}
			else { return; }
			updateUI();
			checkBJackState();
		}
	});
	// Allow user to OK by pressing Enter when MsgBox is visible
	setInterval( function() {
		$("MsgBox_OK").focus();
	}, 10);
	// When any language radio buttons selected...
	$("config-language").addEventListener("change", function(event) {
		setLangAndUpdateUI(event.target.id);
	});
	// When any theme radio buttons selected...
	$("config-theme").addEventListener("change", function(event) {
		$("theme_css").href = "./theme/" + event.target.id +".css";
	});
}

function onBtnTakeCard() {
	if (!isMsgboxing) {
		bjack.takeCard();
		updateUI();
		checkBJackState();
	}
}

function onBtnDeal() {
	if (!isMsgboxing) {
		bjack.deal();
		updateUI();
		checkBJackState();
	}
}

function onBtnReset() {
	myMsgBox();
	bjack.reset();
	updateUI();
	checkBJackState();
}

function onMsgBoxOK() {
	if (isMsgboxing) {
		onBtnReset();
	}
}


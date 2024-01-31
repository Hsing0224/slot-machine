const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const answerButton = document.getElementById('answer');
const showBoxElement = document.getElementById('showBox');
const questionListElement = document.getElementById('questionList');
const playedListElement = document.getElementById('playedList');
let questionData;
let answerData;
let showQuestionList;

function getData() {
	Promise.all([
		fetch('../data/question.json').then(response => response.json()),
		fetch('../data/answer.json').then(response => response.json())
	]).then(dataArray => {
		questionData = dataArray[0];
		answerData = dataArray[1];
		document.body.classList.add('dataLoaded');
	});
}

function getRandom(length) {
	return Math.floor(Math.random() * length);
}

function getShowQuestion() {
	questionData.sort(function(){
		return getRandom(3) - 1;
	});
}

function changeData(dataIndex) {
	const data = questionData.splice(dataIndex, 1)[0];
	questionData.splice(2, 0, data);
}

function checkQuestion(e) {
	withAlt = e.altKey;
	withShift = e.shiftKey;

	if(!withAlt && !withShift && questionData.length > 3) {
		const itemId = questionData[2].id;
		if(itemId === 13 || itemId === 14) {
			const data = questionData.splice(2, 1)[0];
			questionData.push(data);
			checkQuestion(e);
		}
	};

	if(withAlt) {
		// 大家來找碴
		questionData.forEach((item, index)=>{
			if(item.id === 13) {				
				changeData(index);
				return;
			}
		});
	}

	if(withShift) {
		// 寫字
		questionData.forEach((item, index)=>{
			if(item.id === 14) {				
				changeData(index);
				return;
			}
		});
	}
}

function createQuestion() {
	const repeatCount = 5 - getRandom(3);

	const repeatedArray = Array.from({ length: repeatCount }, () => questionData).flat();
	
	for(let i = 0; i < repeatedArray.length; i++) {
		const data = repeatedArray[i];
		const keywordIndex = data.keyword[getRandom(data.keyword.length)];
		const item = document.createElement('li');
		const text = document.createElement('div');
		text.classList.add('text');
		text.textContent = data.name;
		text.dataset.answer = `最${answerData[keywordIndex]}`;
		item.appendChild(text);
		questionListElement.appendChild(item);
	}
}

function runAnimate() {
	showBoxElement.classList.add('show');
	questionListElement.classList.add('animate');
}

function record() {
	const data = questionData.splice(2, 1);
	const item = document.createElement('li');
	item.textContent = data[0].name;
	playedListElement.appendChild(item);
}

window.addEventListener('load', ()=>{
	getData();
});

startButton.addEventListener('click', function(e){
	const isDisabled = this.classList.contains('disabled');
	if(isDisabled) return;

	getShowQuestion();
	checkQuestion(e);
	createQuestion();
	runAnimate();
	this.style.display = 'none';
	answerButton.style.display = 'block';
});

questionList.addEventListener('animationend', function(){
	answerButton.classList.remove('disabled');
});

answerButton.addEventListener('click', function(){
	const isDisabled = this.classList.contains('disabled');
	if(isDisabled) return;

	questionListElement.classList.add('showAnswer');
	this.classList.add('disabled');
	resetButton.classList.remove('disabled');
});

resetButton.addEventListener('click', function(){
	const isDisabled = this.classList.contains('disabled');
	if(isDisabled) return;

	record();

	showBoxElement.classList.remove('show');
	questionListElement.classList.remove('animate', 'showAnswer');
	startButton.style.display = 'block';
	answerButton.style.display = 'none';
	questionListElement.innerHTML = '';

	this.classList.add('disabled');
});
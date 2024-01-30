const startButton = document.getElementById('start');
const playedList = document.getElementById('playedList');
const steps = ['最', '第二'];
let questionData;
let answerData;

function getData() {
	Promise.all([
		fetch('../data/question.json').then(response => response.json()),
		fetch('../data/answer.json').then(response => response.json())
	])
		.then(dataArray => {
			questionData = dataArray[0];
			answerData = dataArray[1];
		})
}

window.addEventListener('load', ()=>{
	getData();
});

startButton.addEventListener('click', function(){
	console.log(questionData);
	console.log(answerData);
	const isRunning = this.classList.contains('running');
	if(isRunning) {
		// 開始跑
		this.textContent = '就決定是你了！！！';
	} else {
		// 重設
		this.textContent = '所以要測的是？';
	}
	this.classList.toggle('running', !isRunning);
});
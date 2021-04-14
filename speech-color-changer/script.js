var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var mathWords = [ 'one','two','three','four','five','six','seven','eight','nine','ten','plus','minus','times','divided by','equals'];
var grammar = '#JSGF V1.0; grammar colors; public <mathWord> = ' + mathWords.join(' | ') + ' ;'
// see this for more details on grammar standard:
// https://www.w3.org/TR/jsgf/

// if i want to save content as an image, try html2canvas:
// https://stackoverflow.com/questions/18312271/how-to-save-a-rendered-webpage-as-image-with-javascript

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var diagnostic = document.querySelector('.output');
var bg = document.querySelector('html');
var hints = document.querySelector('.hints');
let expression = document.getElementById('expression');

// var colorHTML= '';
// colors.forEach(function(v, i, a){
//   console.log(v, i);
//   colorHTML += '<span style="background-color:' + v + ';"> ' + v + ' </span>';
// });
hints.innerHTML = 'Tap/click then say a mathematical expression. Try "One plus one," for example.';

document.body.onclick = function() {
  recognition.start();
  console.log('Ready to receive a math statement.');
}

recognition.onresult = function(event) {
  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
  // It has a getter so it can be accessed like an array
  // The first [0] returns the SpeechRecognitionResult at the last position.
  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
  // These also have getters so they can be accessed like arrays.
  // The second [0] returns the SpeechRecognitionAlternative at position 0.
  // We then return the transcript property of the SpeechRecognitionAlternative object
  var mathWord = event.results[0][0].transcript;
  diagnostic.textContent = 'Result received: ' + mathWord + '.';
  // expression.style.backgroundColor = 'lightgreen';
  expression.innerHTML = `${mathWord} `
  console.log('Confidence: ' + event.results[0][0].confidence);
}

recognition.onspeechend = function() {
  recognition.stop();
}

recognition.onnomatch = function(event) {
  diagnostic.textContent = "I didn't recognise that statement.";
}

recognition.onerror = function(event) {
  diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
}

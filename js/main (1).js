
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyA8Se1u5bYf34kIGFVIdKahdB5WunXWg0Y",
  authDomain: "donateform-96861.firebaseapp.com",
  databaseURL: "https://donateform-96861-default-rtdb.firebaseio.com",
  projectId: "donateform-96861",
  storageBucket: "donateform-96861.appspot.com",
  messagingSenderId: "1035749904577",
  appId: "1:1035749904577:web:84fd06d1e9b0478ed0c440"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();


// Reference messages collection
// var messagesRef = firebase.database().ref('messages'+phonenumber);

// Listen for form submit
document.getElementById('contactForm').addEventListener('submit', submitForm);

// Submit form
function submitForm(e) {
  e.preventDefault();

  // Get values
  var name = getInputVal('name');
  var CP = getInputVal('CP');
  var CD = getInputVal('CD');
  var CT = getInputVal('CT');
  var spo = getInputVal('spo');
  var Pulse = getInputVal('Pulse');
  var diaBP = getInputVal('diaBP');
  var sysBP = getInputVal('sysBP');

  // Save message
  saveMessage(name, CP, CD, CT, spo, Pulse, diaBP, sysBP);

  // Show alert
  document.querySelector('.alert').style.display = 'block';

  // Hide alert after 3 seconds
  setTimeout(function () {
    document.querySelector('.alert').style.display = 'none';
  }, 3000);

  // Clear form
  document.getElementById('contactForm').reset();
}

// Function to get get form values
function getInputVal(id) {
  return document.getElementById(id).value;
}

// Save message to firebase
function saveMessage(name, CP, CD, CT, spo, Pulse, diaBP, sysBP) {
  firebase.database().ref('PatientUpdates/' + name).push();
  firebase.database().ref('PatientUpdates/' + name).set({
    name: name,
    COVIDpositive: CP,
    CurrentDate: CD,
    CurrnetTime: CT,
    OxygrnLevel: spo,
    Pulse: Pulse,
    diaBP: diaBP,
    sysBP: sysBP,

  });
}
// Initialize Firebase
var config = {
  apiKey: "AIzaSyDPehuY1uPr5-bJdUAMRL5ogX8khdY2aSQ",
  authDomain: "isquizapp.firebaseapp.com",
  databaseURL: "https://isquizapp.firebaseio.com",
  projectId: "isquizapp",
  storageBucket: "isquizapp.appspot.com",
  messagingSenderId: "301458684734"
};
firebase.initializeApp(config);

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
      e.preventDefault();
      goToAnchor(this.getAttribute('href'));
  });
});

function goToAnchor(anchor) {
  document.querySelector(anchor).scrollIntoView({
    behavior: 'smooth'
  });
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

// helper function to round decimals with precision
function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

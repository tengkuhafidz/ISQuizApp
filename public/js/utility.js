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

function currentSemester() {
  const currDate = new Date();
  const currMonth = currDate.getMonth() + 1;
  const currYear = currDate.getFullYear();
  const currSemester = generateFullSemesterString(currMonth, currYear);
  console.log('currentSemester', currSemester);
  return currSemester;
}

function generateFullSemesterString(month, year) {
  return (month > 6) ? `ay${year}-${year+1}sem1` : `ay${year-1}-${year}sem2`;
}

//helper method for responses in admin.js of individual quizzes
function getAllSemesters() {
  const currDate = new Date();
  const currMonth = currDate.getMonth() + 1;
  const currYear = currDate.getFullYear();
  let startingYear = 2019;
  const allSemesters = [];

  let yearDifference = currYear - startingYear;
  // add both sems from all the previous years
  while(yearDifference) {
    allSemesters.unshift(generateFullSemesterString(1, startingYear))
    allSemesters.unshift(generateFullSemesterString(7, startingYear))
    startingYear++
    yearDifference--;
  }
  // add the first sem from the current annual year
  allSemesters.unshift(generateFullSemesterString(1, currYear))

  // if its after 6 months in the annual year, add the following sem from the current annual year
  if(currMonth > 6) {
    allSemesters.unshift(generateFullSemesterString(7, currYear))
  }
  return allSemesters;
}

//helper method to convert flat json into csv, used by downloadCSV
function convertArrayOfObjectsToCSV(args) {
  var result, ctr, keys, columnDelimiter, lineDelimiter, data;

  data = args.data || null;
  if (data == null || !data.length) {
      return null;
  }

  columnDelimiter = args.columnDelimiter || ',';
  lineDelimiter = args.lineDelimiter || '\n';

  keys = Object.keys(data[0]);

  result = '';
  result += keys.join(columnDelimiter);
  result += lineDelimiter;

  data.forEach(function(item) {
      ctr = 0;
      keys.forEach(function(key) {
          if (ctr > 0) result += columnDelimiter;

          result += item[key];
          ctr++;
      });
      result += lineDelimiter;
  });

  return result;
}

//helper method to convert data as csv
function downloadCSV(args, csvData) {
  var data, filename, link;

  var csv = convertArrayOfObjectsToCSV({
      data: csvData
  });
  if (csv == null) return;

  filename = args.filename || 'export.csv';

  if (!csv.match(/^data:text\/csv/i)) {
      csv = 'data:text/csv;charset=utf-8,' + csv;
  }
  data = encodeURI(csv);

  link = document.createElement('a');
  link.setAttribute('href', data);
  link.setAttribute('download', filename);
  link.click();
}

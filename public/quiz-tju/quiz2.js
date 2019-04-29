const quiz2Questions = [
  { id: 1, text: 'Tells group members what they are supposed to do', category: 'Task', score: 0 },
  { id: 2, text: 'Acts friendly with members of the group', category: 'Relationship', score: 0 },
  { id: 3, text: 'Sets standards of performance for group members', category: 'Task', score: 0 },
  { id: 4, text: 'Helps others in the group feel comfortable', category: 'Relationship', score: 0 },
  { id: 5, text: 'Makes suggestions about how to solve problems', category: 'Task', score: 0 },
  { id: 6, text: 'Responds favorably to suggestions made by others', category: 'Relationship', score: 0 },
  { id: 7, text: 'Makes his or her perspective clear to others', category: 'Task', score: 0 },
  { id: 8, text: 'Treats others fairly', category: 'Relationship', score: 0 },
  { id: 9, text: 'Develops a plan of action for the group', category: 'Task', score: 0 },
  { id: 10, text: 'Behaves in a predictable manner toward group members', category: 'Relationship', score: 0 },
  { id: 11, text: 'Defines role responsibilities for each group member', category: 'Task', score: 0 },
  { id: 12, text: 'Communicates actively with group members', category: 'Relationship', score: 0 },
  { id: 13, text: 'Clarifies his or her own role within the group', category: 'Task', score: 0 },
  { id: 14, text: 'Shows concern for the well-being of others', category: 'Relationship', score: 0 },
  { id: 15, text: 'Provides a plan for how the work is to be done', category: 'Task', score: 0 },
  { id: 16, text: 'Shows flexibility in making decisions', category: 'Relationship', score: 0 },
  { id: 17, text: 'Provides criteria for what is expected of the group', category: 'Task', score: 0 },
  { id: 18, text: 'Discloses thoughts and feelings to group members', category: 'Relationship', score: 0 },
  { id: 19, text: 'Encourages group members to do high-quality work', category: 'Task', score: 0 },
  { id: 20, text: 'Helps group members get along with each other', category: 'Relationship', score: 0 }
];

// reference to quiz 2 document
const docRef = db.collection('quizes').doc('tJUrl9JFXWshEDHLSOLg');

Vue.component('question-section', {
  props: ['question'],
  methods: {
  	goToNext: function() {
  		const nextAnchor = this.question.id < quiz2Questions.length ? '#q' + (this.question.id + 1) : '#identityForm';
  		goToAnchor(nextAnchor);
  	}
  }
})

var questions = new Vue({
  el: '#questions',
  data: {
    questionList: quiz2Questions,
  	student: { email: null, gender: null, class: null },
    results: {
      title: null,
      score: {
        relationship: 0,
        task: 0
      }
    },
    errors: {
      questions: {
        hasError: false,
        message: null
      },
      email: {
        hasError: false,
        message: null
      },
      gender: {
        hasError: false,
        message: null
      }
    },
    attempts: 0,
    chart: null
  },
  methods: {
    generateResult: function() {
      // auto detect semester
      this.student.class = currentSemester();
      this.resetValidation();
      this.validateStudentEmail();
      this.validateStudentGender();
      const scores = this.calculateScore();

      if (!this.errors.questions.hasError && !this.errors.email.hasError && !this.errors.gender.hasError) {
        this.attempts++;
        const resultsSection = document.getElementById("results");
        resultsSection.style.padding='50px 0';

        // get object key of item with max value
        let resultTitle = Object.keys(scores).reduce(function(a, b){ return scores[a] > scores[b] ? a : b })

        this.results = {
          title: resultTitle,
          scores
        }
        goToAnchor('#results');
        console.log(scores)
        if (!this.chart) {
          this.createChart(scores);
        } else {
          this.updateChart(scores);
        }
        this.addToDB();
      }
    },
  	calculateScore: function() {
  		let scores = {
  			relationship: 0,
  			task: 0,
  		}

      const notAnswered = [];

  		for (let i = 0; i < this.questionList.length; i++) {
        const qScore = Number(this.questionList[i].score);
        // validate question has been answered first
        if (qScore === 0) {
          this.errors.questions.hasError = true;
          notAnswered.push(i+1);
        } else if(this.questionList[i].category === 'Relationship'){
		    	scores.relationship += qScore;
  			} else {
  				scores.task += qScore;
  			}
		  }
      this.errors.questions.message = notAnswered.length === 0 ? null : "The following statements have not been answered: " + notAnswered.join(', ');
      return scores;
  	},
    validateStudentEmail: function() {
      const email = this.student.email;

      if(!email) {
        this.errors.email.hasError = true;
        this.errors.email.message = "This field is required";
      } else if (!email.toLowerCase().endsWith("@u.nus.edu")) {
        this.errors.email.hasError = true;
        this.errors.email.message = "Please enter a valid NUS email address. Example: <NUSNetID>@u.nus.edu";
      } else {
        this.student.email = this.student.email.toLowerCase();
      }
    },
    validateStudentGender: function() {
      const gender = this.student.gender;
      if(!gender) {
        this.errors.gender.hasError = true;
        this.errors.gender.message = "This field is required";
      }
    },
    validateStudentClass: function() {
      const studentClass = this.student.class;
      if(!studentClass) {
        this.errors.class.hasError = true;
        this.errors.class.message = "This field is required";
      }
    },
    resetValidation: function() {
      this.errors.questions.hasError = false;
      this.errors.questions.message = null;
      this.errors.email.hasError = false;
      this.errors.email.message = null;
      this.errors.gender.hasError = false;
      this.errors.gender.message = null;
    },
    addToDB: function() {
      docRef.collection('responses').doc(this.student.email).set({
        results: this.results,
        student: this.student,
        rawInputs: this.questionList,
        writtenAt: new Date()
      })
      .then(function(doc) {
          console.log("Document written with ID: ", doc.id);
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });
    },
    createChart: function(scores) {
      const resultsChart = document.getElementById("chart");
      this.chart = new Morris.Bar({
          // ID of the element in which to draw the chart.
          element: 'chart',
          data: [
            { label: 'Task', value: scores.task },
            { label: 'Relationship', value: scores.relationship }
          ],
          xkey: 'label',
          ykeys: ['value'],
          labels: ['Points'],
           ymax: 50
        });
    },
    updateChart: function(scores) {
      this.chart.setData([
          { label: 'Task', value: scores.task },
          { label: 'Relationship', value: scores.relationship }
        ])
    }
  }
})

const docRef = db.collection('quizes').doc('mI7FH4zvco1P92ChrFDF');

function drawPieChart(scores) {
  var ctx = document.getElementById('ScoresInPieChart').getContext('2d');
  data = {
  datasets: [{
    data: [scores.authoritarian, scores.democratic, scores.laissezFaire],
    backgroundColor: ['#EC407A', '#42A5F5', '#26A69A'],
  }],
  // These labels appear in the legend and in the tooltips when hovering different arcs
  labels: [
      'Authoritarian',
      'Democratic',
      'Laissez-Faire'
    ]
  };

  var myPieChart = new Chart(ctx,{
      type: 'pie',
      data: data,
  });
}

Vue.component('question-section', {
  props: ['question'],
  methods: {
  	goToNext: function() {
  		const nextAnchor = this.question.id < 12 ? '#q' + (this.question.id + 1) : '#identityForm';
  		goToAnchor(nextAnchor);
  	}
  }
})

var questions = new Vue({
  el: '#questions',
  data: {
    dbRequest: {
      isLoading: true,
      hasError: false
    },
    questionList: [],
  	student: { name: null, email: null },
    results: {
      title: null,
      score: {
        authoritarian: 0,
        democratic: 0,
        laissezFaire: 0
      }
    },
    errors: {
      questions: {
        hasError: false,
        message: null
      },
      name: {
        hasError: false,
        message: null
      },
      email: {
        hasError: false,
        message: null
      }
    },
    attempts: 0
  },
  mounted () {
    this.retrieveQuestionsFromDB();
  },
  methods: {
    generateResult: function() {
      this.attempts++;
      this.resetValidation();
      this.validateStudentName();
      this.validateStudentEmail();
      if (!this.errors.questions.hasError && !this.errors.name.hasError && !this.errors.email.hasError) {
        const scores = this.calculateScore();
        drawPieChart(scores);
        // get object key of item with max value
        let resultTitle = Object.keys(scores).reduce(function(a, b){ return scores[a] > scores[b] ? a : b })
        if (resultTitle === 'laissezFaire') resultTitle = 'laissez-faire';

        this.results = {
          title: resultTitle,
          scores
        }
        
        goToAnchor('#results');
        this.addToDB();
      }
    },
  	calculateScore: function() {
  		let scores = {
  			authoritarian: 0,
  			democratic: 0,
  			laissezFaire: 0
  		}

      const notAnswered = [];

  		for (let i = 0; i < this.questionList.length; i++) {
        const qScore = Number(this.questionList[i].score);
        // validate question has been answered first
        if (qScore === 0) {
          this.errors.questions.hasError = true;
          notAnswered.push(i+1);
        } else if(i === 0 || i === 4 || i === 7 || i === 10){
		    	scores.authoritarian += qScore;
  			} else if (i === 1 || i === 3 || i === 8 || i === 9) {
  				scores.democratic += qScore;
  			} else {
  				scores.laissezFaire += qScore;
  			}
		  }
      this.errors.questions.message = notAnswered.length === 0 ? null : "The following statements have not been answered: " + notAnswered.join(', ');
      return scores;
  	},
    validateStudentName: function() {
      if(!this.student.name) {
        this.errors.name.hasError = true;
        this.errors.name.message = "This field is required";
      } else {
        this.student.name = toTitleCase(this.student.name);
      }
    },
    validateStudentEmail: function() {
      const email = this.student.email;

      if(!email) {
        this.errors.email.hasError = true;
        this.errors.email.message = "This field is required";
      } else if (email.charAt(8) !== '@' || !email.toLowerCase().endsWith("@u.nus.edu")) {
        this.errors.email.hasError = true;
        this.errors.email.message = "Please enter a valid NUS email address. Example: <NUSNetID>@u.nus.edu";
      } else {
        this.student.email = this.student.email.toLowerCase();
      }
    },
    resetValidation: function() {
      this.errors.questions.hasError = false;
      this.errors.questions.message = null;
      this.errors.name.hasError = false;
      this.errors.name.message = null;
      this.errors.email.hasError = false;
      this.errors.email.message = null;
    },
    addToDB: function() {
      docRef.collection('responses').doc(this.student.email).set({
        results: this.results,
        student: this.student,
        writtenAt: new Date()
      })
      .then(function(doc) {
          console.log("Document written with ID: ", doc.id);
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });
    },
    retrieveQuestionsFromDB: function() {
      docRef.get().then((doc) => {
        if (doc.exists) {
          const questions = doc.data().questions;

          for(let i = 0; i < questions.length; i++) {
            this.questionList.push({
              id: i + 1,
              text: questions[i],
              score: 0
            })
          }
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
          this.dbRequest.hasError = true;
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
        this.dbRequest.hasError = true;
      })
      .finally(() => this.dbRequest.isLoading = false)
    }
  }
})
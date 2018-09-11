const docRef = db.collection('quizes').doc('mI7FH4zvco1P92ChrFDF');

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
  	student: { email: null },
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
      email: {
        hasError: false,
        message: null
      }
    },
    attempts: 0,
    pieChart: null
  },
  mounted () {
    this.retrieveQuestionsFromDB();
  },
  methods: {
    generateResult: function() {
      this.resetValidation();
      this.validateStudentEmail();
      const scores = this.calculateScore();
      if (!this.errors.questions.hasError && !this.errors.email.hasError) {
        this.attempts++;
        const resultsSection = document.getElementById("results");
        resultsSection.style.padding='50px 0';
        // createPieChart(scores);
        // get object key of item with max value
        let resultTitle = Object.keys(scores).reduce(function(a, b){ return scores[a] > scores[b] ? a : b })
        if (resultTitle === 'laissezFaire') resultTitle = 'laissez-faire';

        this.results = {
          title: resultTitle,
          scores
        }
        
        goToAnchor('#results');
        console.log(scores)
        if (!this.pieChart) {
          this.createPieChart(scores); 
        } else {
          this.updatePieChart(scores);
        }
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
    resetValidation: function() {
      this.errors.questions.hasError = false;
      this.errors.questions.message = null;
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
    },
    createPieChart: function(scores) {
      const myfirstchart = document.getElementById("myfirstchart");
      myfirstchart.style.height='50vh';
      this.pieChart = new Morris.Donut({
        // ID of the element in which to draw the chart.
        element: 'myfirstchart',
        data: [
          { label: 'Laissez-Faire', value: scores.laissezFaire },
          { label: 'Democratic', value: scores.democratic },
          { label: 'Authoritarian', value: scores.authoritarian }
        ],
        colors: ['#EC407A', '#42A5F5', '#26A69A'],
        resize: true,
      });
    },
    updatePieChart: function(scores) {
      this.pieChart.setData([
          { label: 'Laissez-Faire', value: scores.laissezFaire },
          { label: 'Democratic', value: scores.democratic },
          { label: 'Authoritarian', value: scores.authoritarian }
        ])
    }
  }
})
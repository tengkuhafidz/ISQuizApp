const quiz6Questions = [
  { id: 1, text: 'I enjoy working on teams', category: 'Interpersonal', score: 0 },
  { id: 2, text: 'I enjoy relating to others on an interpersonal basis', category: 'Interpersonal',  score: 0 },
  { id: 3, text: 'I could delegate work to others', category: 'Interpersonal',  score: 0 },
  { id: 4, text: 'I want to take charge', category: 'Interpersonal', score: 0 },
  { id: 5, text: 'I could appraise and provide feedback to employees', category: 'Interpersonal',  score: 0 },
  { id: 6, text: 'One of my greatest desires is to become a leader', category: 'Interpersonal', score: 0 },
  { id: 7, text: 'Giving directions is comfortable to me', category: 'Interpersonal',  score: 0 },
  { id: 8, text: 'I am good at planning', category: 'Task-Specific', score: 0 },
  { id: 9, text: 'I can interpret rules and regulations', category: 'Task-Specific', score: 0 },
  { id: 10, text: 'I know how to develop goals and carry them out', category: 'Task-Specific',  score: 0 },
  { id: 11, text: 'I am good at problem solving', category: 'Task-Specific',  score: 0 },
  { id: 12, text: 'I enjoy collecting and analyzing data', category: 'Cognitive',  score: 0 },
  { id: 13, text: 'I am comfortable at implementing new techniques', category: 'Cognitive', score: 0 },
  { id: 14, text: 'I am curious', category: 'Cognitive',  score: 0 },
  { id: 15, text: 'I am comfortable asking others for advice', category: 'Communication', score: 0 },
  { id: 16, text: 'If I make a mistake, I would admit it and correct it', category: 'Communication', score: 0 },
  { id: 17, text: 'I believe in workplace diversity', category: 'Communication',  score: 0 },
  { id: 18, text: 'I thrive on change', category: 'Communication',  score: 0 }
];

// reference to quiz 6 document
const docRef = db.collection('quizes').doc('OeFxqmapol9srPwcknP0');

Vue.component('question-section', {
  props: ['question'],
  methods: {
  	goToNext: function() {
  		const nextAnchor = this.question.id < quiz6Questions.length ? '#q' + (this.question.id + 1) : '#identityForm';
  		goToAnchor(nextAnchor);
  	}
  }
})

var questions = new Vue({
  el: '#questions',
  data: {
    questionList: quiz6Questions,
  	student: { email: null, gender: null },
    results: {
      totalScore: 0,
      scores: {
        interpersonal: 0,
        taskSpecific: 0,
        cognitive: 0,
        communication: 0
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
      this.resetValidation();
      this.validateStudentEmail();
      this.validateStudentGender();
      const results = this.calculateScore();

      if (!this.errors.questions.hasError && !this.errors.email.hasError && !this.errors.gender.hasError) {
        this.attempts++;
        const resultsSection = document.getElementById("results");
        resultsSection.style.padding='100px 0';

        this.results = results;
        goToAnchor('#results');
        console.log('generateResult', this.results)

        this.addToDB();
      }
    },
    generateResult: function() {
      this.resetValidation();
      this.validateStudentEmail();
      this.validateStudentGender();
      const results = this.calculateScore();

      if (!this.errors.questions.hasError && !this.errors.email.hasError && !this.errors.gender.hasError) {
        this.attempts++;
        const resultsSection = document.getElementById("results");
        resultsSection.style.padding='50px 0';

        this.results = results;
        goToAnchor('#results');
        console.log(results)
        //
        // if (!this.chart) {
        //   this.createChart(results.scores);
        // } else {
        //   this.updateChart(results.scores);
        // }
        this.addToDB();
      }
    },
    calculateScore: function() {
      let scores = {
        interpersonal: 0,
        taskSpecific: 0,
        cognitive: 0,
        communication: 0
      }

      const notAnswered = [];

      for (let i = 0; i < this.questionList.length; i++) {
        const qScore = Number(this.questionList[i].score);
        // validate question has been answered first
        if (qScore === 0) {
          this.errors.questions.hasError = true;
          notAnswered.push(i+1);
        } else if(this.questionList[i].category === 'Interpersonal'){
          scores.interpersonal += qScore;
        } else if(this.questionList[i].category === 'Task-Specific'){
          scores.taskSpecific += qScore;
        } else if(this.questionList[i].category === 'Cognitive'){
          scores.cognitive += qScore;
        } else if(this.questionList[i].category === 'Communication'){
          scores.communication += qScore;
        }
      }
      this.errors.questions.message = notAnswered.length === 0 ? null : "The following statements have not been answered: " + notAnswered.join(', ');

      return { scores };
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
        writtenAt: new Date()
      })
      .then(function(doc) {
          console.log("Document written with ID: ", doc.id);
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });
    }
  },
  computed: {
    scorePercentage: function() {
      return category => {
          switch(category) {
              case 'interpersonal':
                  return round(this.results.scores.interpersonal/35 * 100, 1) + '%';
              case 'taskSpecific':
                  return round(this.results.scores.taskSpecific/20 * 100, 1) + '%';
              case 'cognitive':
                  return round(this.results.scores.cognitive/15 * 100, 1) + '%';
              case 'communication':
                  return round(this.results.scores.communication/20 * 100, 1) + '%';
          }
      }
    }
  }
})
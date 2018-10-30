const quiz5Questions = [
  { id: 1, text: 'Everyone can create something great at some point if he or she is given appropriate conditions', category: 'Growth-Mindset', score: 0 },
  { id: 2, text: 'You either are creative or you are not—even trying very hard you cannot change much', category: 'Fixed-Mindset',  score: 0 },
  { id: 3, text: 'Anyone can develop his or her creative abilities up to a certain level', category: 'Growth-Mindset',  score: 0 },
  { id: 4, text: 'You have to be born a creator—without innate talent you can only be a scribbler', category: 'Fixed-Mindset', score: 0 },
  { id: 5, text: 'Practice makes perfect—perseverance and trying hard are the best ways to develop and expand one’s capabilities', category: 'Growth-Mindset',  score: 0 },
  { id: 6, text: 'Creativity can be developed, but one either is or is not a truly creative person', category: 'Fixed-Mindset', score: 0 },
  { id: 7, text: 'Rome was not built in a day—each creativity requires effort and work, and these two are more important than talent', category: 'Growth-Mindset',  score: 0 },
  { id: 8, text: 'Some people are creative, others are not—and no practice can change it', category: 'Fixed-Mindset', score: 0 },
  { id: 9, text: 'It does not matter what creativity level one reveals—you can always increase it', category: 'Growth-Mindset', score: 0 },
  { id: 10, text: 'A truly creative talent is innate and constant throughout his/her entire life', category: 'Fixed-Mindset',  score: 0 },
  { id: 11, text: 'I know I can efficiently solve even complicated problems', category: 'Creative Self-Efficacy',  score: 0 },
  { id: 12, text: 'I trust my creative abilities', category: 'Creative Self-Efficacy',  score: 0 },
  { id: 13, text: 'Compared with my friends, I am distinguished by my imagination and ingenuity', category: 'Creative Self-Efficacy', score: 0 },
  { id: 14, text: 'I have proved many times that I can cope with difficult situations', category: 'Creative Self-Efficacy',  score: 0 },
  { id: 15, text: 'I am sure I can deal with problems requiring creative thinking', category: 'Creative Self-Efficacy', score: 0 },
  { id: 16, text: 'I am good at proposing original solutions to problems', category: 'Creative Self-Efficacy', score: 0 },
  { id: 17, text: 'I think I am a creative person', category: 'Creative Personal Identity',  score: 0 },
  { id: 18, text: 'My creativity is important for who I am', category: 'Creative Personal Identity',  score: 0 },
  { id: 19, text: 'Being a creative person is important to me', category: 'Creative Personal Identity', score: 0 },
  { id: 20, text: 'Creativity is an important part of me', category: 'Creative Personal Identity', score: 0 },
  { id: 21, text: 'Ingenuity is a characteristic which is important to me', category: 'Creative Personal Identity', score: 0 }
];

// reference to quiz 4 document
const docRef = db.collection('quizes').doc('AWJdUqHCxiHL5XLzD6v1');

Vue.component('question-section', {
  props: ['question'],
  methods: {
  	goToNext: function() {
  		const nextAnchor = this.question.id < quiz5Questions.length ? '#q' + (this.question.id + 1) : '#identityForm';
  		goToAnchor(nextAnchor);
  	}
  }
})

var questions = new Vue({
  el: '#questions',
  data: {
    questionList: quiz5Questions,
  	student: { email: null, gender: null },
    results: {
      title: null,
      totalScore: 0,
      scores: {
        growthMindset: 0,
        fixedMindset: 0,
        creativeSelfEfficacy: 0,
        creativePersonalIdentity: 0
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

        if (!this.chart) {
          this.createChart(results.scores);
        } else {
          this.updateChart(results.scores);
        }
        this.addToDB();
      }
    },
    calculateScore: function() {
      let scores = {
          growthMindset: 0,
          fixedMindset: 0,
          creativeSelfEfficacy: 0,
          creativePersonalIdentity: 0
      }

      const notAnswered = [];

      for (let i = 0; i < this.questionList.length; i++) {
        const qScore = Number(this.questionList[i].score);
        // validate question has been answered first
        if (qScore === 0) {
          this.errors.questions.hasError = true;
          notAnswered.push(i+1);
        } else if(this.questionList[i].category === 'Growth-Mindset'){
          scores.growthMindset += qScore;
        } else if(this.questionList[i].category === 'Fixed-Mindset'){
          scores.fixedMindset += qScore;
        } else if(this.questionList[i].category === 'Creative Self-Efficacy'){
          scores.creativeSelfEfficacy += qScore;
        } else if(this.questionList[i].category === 'Creative Personal Identity'){
            scores.creativePersonalIdentity += qScore;
        }
      }
      this.errors.questions.message = notAnswered.length === 0 ? null : "The following statements have not been answered: " + notAnswered.join(', ');

      // to finalise scores (average), divide  the addition of each score to number of statements in that category
      scores.growthMindset = round(scores.growthMindset/5, 1);
      scores.fixedMindset = round(scores.fixedMindset/5, 1);
      scores.creativeSelfEfficacy = round(scores.creativeSelfEfficacy/6, 1);
      scores.creativePersonalIdentity = round(scores.creativePersonalIdentity/5, 1);
      console.log('scores', scores)

      // get object key of item with max value
      let title = Object.keys(scores).reduce(function(a, b){ return scores[a] > scores[b] ? a : b })

      return { title, scores };
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
    },
    createChart: function(scores) {
      const resultsChart = document.getElementById("chart");
      this.chart = new Morris.Bar({
          // ID of the element in which to draw the chart.
          element: 'chart',
          data: [
              { label: 'Growth-Mindset', value: scores.growthMindset },
              { label: 'Fixed-Mindset', value: scores.fixedMindset },
              { label: 'Creative Self-Efficacy', value: scores.creativeSelfEfficacy },
              { label: 'Creative Personal Identity', value: scores.creativePersonalIdentity }
          ],
          xkey: 'label',
          ykeys: ['value'],
          labels: ['Points'],
           ymax: 5
        });
    },
    updateChart: function(scores) {
      this.chart.setData([
            { label: 'Growth-Mindset', value: scores.growthMindset },
            { label: 'Fixed-Mindset', value: scores.fixedMindset },
            { label: 'Creative Self-Efficacy', value: scores.creativeSelfEfficacy },
            { label: 'Creative Personal Identity', value: scores.creativePersonalIdentity }
        ])
    },
  },
  computed: {
    properTitle: function() {
      switch(this.results.title) {
        case 'growthMindset':
          return 'Growth-Mindset';
        case 'fixedMindset':
          return 'Fixed-Mindset';
        case 'creativeSelfEfficacy':
          return 'Creative Self-Efficacy';
        case 'creativePersonalIdentity':
            return 'Creative Personal Identity'
      }
    }
  }
})

const quiz4Questions = [
  { id: 1, text: 'Most of the time, I prefer being a leader rather than a follower when working in a group', category: 'Affective-Identify', score: 0 },
  { id: 2, text: 'I am the type of person who is not interested in leading others', category: 'Affective-Identify', reverseScore: true, score: 0 },
  { id: 3, text: 'I am definitely not a leader by nature', category: 'Affective-Identify', reverseScore: true, score: 0 },
  { id: 4, text: 'I am the type of person who likes to be in charge of others', category: 'Affective-Identify', score: 0 },
  { id: 5, text: 'I believe I can contribute more to a group if I am a follower rather than a leader', category: 'Affective-Identify', reverseScore: true, score: 0 },
  { id: 6, text: 'I usually want to be the leader in the groups that I work in', category: 'Affective-Identify', score: 0 },
  { id: 7, text: 'I am the type who would actively support a leader but prefers not to be appointed as leader', category: 'Affective-Identify', reverseScore: true, score: 0 },
  { id: 8, text: 'I have a tendency to take charge in most groups or teams that I work in', category: 'Affective-Identify', score: 0 },
  { id: 9, text: 'I am seldom reluctant to be the leader of a group', category: 'Affective-Identify', score: 0 },
  { id: 10, text: 'I am only interested in leading a group if there are clear advantages for me', category: 'Noncalculative', reverseScore: true, score: 0 },
  { id: 11, text: 'I will never agree to lead if I cannot see any benefits from accepting that role', category: 'Noncalculative', reverseScore: true, score: 0 },
  { id: 12, text: 'I would only agree to be a group leader if I know I can benefit from that role', category: 'Noncalculative', reverseScore: true, score: 0 },
  { id: 13, text: 'I would agree to lead others even if there are no special rewards or benefits from that role', category: 'Noncalculative', score: 0 },
  { id: 14, text: 'I would want to know what is in it for me if I am going to agree to lead a group', category: 'Noncalculative', reverseScore: true, score: 0 },
  { id: 15, text: 'I never expect to get more priveleges if I agree to lead a group', category: 'Noncalculative', score: 0 },
  { id: 16, text: 'If I agree to lead a group, I would never expect any advantages or special benefits', category: 'Noncalculative', score: 0 },
  { id: 17, text: 'I have more of my own problems to worry about than to be concerned about the rest of the group', category: 'Noncalculative', reverseScore: true, score: 0 },
  { id: 18, text: 'Leading others is really more of a dirty job rather than an honorable one', category: 'Noncalculative', reverseScore: true, score: 0 },
  { id: 19, text: 'I feel that I have a duty to lead others if I am asked', category: 'Social-Normative', score: 0 },
  { id: 20, text: 'I agree to lead whenever I am asked or nominated by the other members', category: 'Social-Normative', score: 0 },
  { id: 21, text: 'I was taught to believe in the value of leading others', category: 'Social-Normative', score: 0 },
  { id: 22, text: 'It is appropriate for people to accept leadership roles or positions when they are asked', category: 'Social-Normative', score: 0 },
  { id: 23, text: 'I have been taught that I should always volunteer to lead others if I can', category: 'Social-Normative', score: 0 },
  { id: 24, text: 'It is not right to decline leadership roles', category: 'Social-Normative', score: 0 },
  { id: 25, text: 'It is an honor and privilege to be asked to lead', category: 'Social-Normative', score: 0 },
  { id: 26, text: 'People should volunteer to lead rather than wait for others to ask or vote for them', category: 'Social-Normative', score: 0 },
  { id: 27, text: 'I would never agree to lead just because others voted for me', category: 'Social-Normative', reverseScore: true, score: 0 }
];

// reference to quiz 4 document
const docRef = db.collection('quizes').doc('avHls1vanK3UTWZJDewz');

Vue.component('question-section', {
  props: ['question'],
  methods: {
  	goToNext: function() {
  		const nextAnchor = this.question.id < quiz4Questions.length ? '#q' + (this.question.id + 1) : '#identityForm';
  		goToAnchor(nextAnchor);
  	}
  }
})

var questions = new Vue({
  el: '#questions',
  data: {
    questionList: quiz4Questions,
  	student: { email: null, gender: null, class: null },
    results: {
      title: null,
      totalScore: 0,
      scores: {
        affectiveIdentify: 0,
        noncalculative: 0,
        socialNormative: 0,
      },
      rawScores: {
        affectiveIdentify: 0,
        noncalculative: 0,
        socialNormative: 0,
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
      },
      class: {
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
      this.validateStudentClass();

      const results = this.calculateScore();

      if (!this.errors.questions.hasError && !this.errors.email.hasError && !this.errors.gender.hasError && !this.errors.class.hasError) {
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
      let rawScores = {
        affectiveIdentify: 0,
        noncalculative: 0,
        socialNormative: 0,
      }
      let scores = {
        affectiveIdentify: 0,
        noncalculative: 0,
        socialNormative: 0,
      }
      let totalScore = 0;

      const notAnswered = [];

      for (let i = 0; i < this.questionList.length; i++) {
        const rawScore = Number(this.questionList[i].score);
        const qScore = this.questionList[i].reverseScore ? 6 - rawScore : rawScore;
        totalScore += qScore;
        // validate question has been answered first
        if (qScore === 0) {
          this.errors.questions.hasError = true;
          notAnswered.push(i+1);
        } else if(this.questionList[i].category === 'Affective-Identify'){
          rawScores.affectiveIdentify += rawScore;
          scores.affectiveIdentify += qScore;
        } else if(this.questionList[i].category === 'Noncalculative'){
          rawScores.noncalculative += rawScore;
          scores.noncalculative += qScore;
        } else if(this.questionList[i].category === 'Social-Normative'){
          rawScores.socialNormative += rawScore;
          scores.socialNormative += qScore;
        } 
      }
      this.errors.questions.message = notAnswered.length === 0 ? null : "The following statements have not been answered: " + notAnswered.join(', ');
      
      // get object key of item with max value
      let title = Object.keys(scores).reduce(function(a, b){ return scores[a] > scores[b] ? a : b })

      return { title, totalScore, scores, rawScores };
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
      this.errors.class.hasError = false;
      this.errors.class.message = null;
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
            { label: 'Affective-Identify', value: scores.affectiveIdentify },
            { label: 'Noncalculative', value: scores.noncalculative },
            { label: 'Social-Normative', value: scores.socialNormative }
          ],
          xkey: 'label',
          ykeys: ['value'],
          labels: ['Points'],
           ymax: 45
        });
    },
    updateChart: function(scores) {
      this.chart.setData([
            { label: 'Affective-Identify', value: scores.affectiveIdentify },
            { label: 'Noncalculative', value: scores.noncalculative },
            { label: 'Social-Normative', value: scores.socialNormative }
        ])
    },
  },
  computed: {
    properTitle: function() {
      switch(this.results.title) {
        case 'affectiveIdentify':
          return 'Affective-Identify';
        case 'noncalculative':
          return 'Noncalculative';
        case 'socialNormative':
          return 'Social-Normative';
      }
    }
  }
})

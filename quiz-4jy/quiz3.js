const quiz3Questions = [
  { id: 1, text: 'Have a clear understanding of where we are going', category: 'Articulate Vision', score: 0 },
  { id: 2, text: 'Paint an interesting picture of the future for my group', category: 'Articulate Vision', score: 0 },
  { id: 3, text: 'Am always seeking new opportunities for the organization/group', category: 'Articulate Vision', score: 0 },
  { id: 4, text: 'Inspire others with my plans for the future', category: 'Articulate Vision', score: 0 },
  { id: 5, text: 'Am able to get others to be committed to my dreams', category: 'Articulate Vision', score: 0 },
  { id: 6, text: 'Lead by doing, rather than simply telling', category: 'Role Model', score: 0 },
  { id: 7, text: 'Provide a good model for others to follow', category: 'Role Model', score: 0 },
  { id: 8, text: 'Lead by example', category: 'Role Model', score: 0 },
  { id: 9, text: 'Foster collaboration among group members', category: 'Foster Goal Acceptance', score: 0 },
  { id: 10, text: 'Encourage employees to be team players', category: 'Foster Goal Acceptance', score: 0 },
  { id: 11, text: 'Get the group to work together for the same goal', category: 'Foster Goal Acceptance', score: 0 },
  { id: 12, text: 'Develop a team attitude and spirit among employees', category: 'Foster Goal Acceptance', score: 0 },
  { id: 13, text: 'Show that I expect a lot from others', category: 'Performance Expectations', score: 0 },
  { id: 14, text: 'Insist on only the best performance', category: 'Performance Expectations', score: 0 },
  { id: 15, text: 'Will not settle for second best', category: 'Performance Expectations', score: 0 },
  { id: 16, text: 'Act without considering the feelings of others', category: 'Individual Support', reverseScore: true, score: 0 },
  { id: 17, text: 'Show respect for personal feelings of others', category: 'Individual Support', score: 0 },
  { id: 18, text: 'Behave in a manner thoughtful of the personal needs of others', category: 'Individual Support', score: 0 },
  { id: 19, text: 'Treat others without considering their personal feelings', category: 'Individual Support', reverseScore: true, score: 0 },
  { id: 20, text: 'Challenge others to think about old problems in new ways', category: 'Intellectual Simulation', score: 0 },
  { id: 21, text: 'Ask questions that prompt others to think', category: 'Intellectual Simulation', score: 0 },
  { id: 22, text: 'Stimulate others to rethink the way they do things', category: 'Intellectual Simulation', score: 0 },
  { id: 23, text: 'Have ideas that challenge others to reexamine some of their basic assumptions about work', category: 'Intellectual Simulation', score: 0 },
  { id: 24, text: 'Always give positive feedback when others perform well', category: 'Transactional Leader Behaviour', score: 0 },
  { id: 25, text: 'Give special recognition when others\' work is very good', category: 'Transactional Leader Behaviour', score: 0 },
  { id: 26, text: 'Commend others when they do a better-than-average-job', category: 'Transactional Leader Behaviour', score: 0 },
  { id: 27, text: 'Personally compliment others when they do outstanding work', category: 'Transactional Leader Behaviour', score: 0 },
  { id: 28, text: 'Frequently does not acknowledge the good performance of others', category: 'Transactional Leader Behaviour', reverseScore: true, score: 0 }
];

// reference to quiz 3 document
const docRef = db.collection('quizes').doc('4JYTDqsFZoWyfRSUEuoe');

Vue.component('question-section', {
  props: ['question'],
  methods: {
  	goToNext: function() {
  		const nextAnchor = this.question.id < quiz3Questions.length ? '#q' + (this.question.id + 1) : '#identityForm';
  		goToAnchor(nextAnchor);
  	}
  }
})

var questions = new Vue({
  el: '#questions',
  data: {
    questionList: quiz3Questions,
  	student: { email: null, gender: null, class: null },
    results: {
      scores: {
        articulateVision: 0,
        roleModel: 0,
        fosterGoalAcceptance: 0,
        performanceExpectations: 0,
        individualSupport: 0,
        intellectualSimulation: 0,
        transactionalLeaderBehaviour: 0
      },
      rawScores: {
        articulateVision: 0,
        roleModel: 0,
        fosterGoalAcceptance: 0,
        performanceExpectations: 0,
        individualSupport: 0,
        intellectualSimulation: 0,
        transactionalLeaderBehaviour: 0
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
      const results = this.calculateScore();
      this.validateStudentClass();

      if (!this.errors.questions.hasError && !this.errors.email.hasError && !this.errors.gender.hasError & !this.errors.class.hasError) {
        this.attempts++;
        const resultsSection = document.getElementById("results");
        resultsSection.style.padding='100px 0';

        this.results = results;
        goToAnchor('#results');
        console.log('generateResult', this.results)

        this.addToDB();
      }
    },
  	calculateScore: function() {
      let rawScores = {
        articulateVision: 0,
        roleModel: 0,
        fosterGoalAcceptance: 0,
        performanceExpectations: 0,
        individualSupport: 0,
        intellectualSimulation: 0,
        transactionalLeaderBehaviour: 0
      }
  		let scores = {
        articulateVision: 0,
        roleModel: 0,
        fosterGoalAcceptance: 0,
        performanceExpectations: 0,
        individualSupport: 0,
        intellectualSimulation: 0,
        transactionalLeaderBehaviour: 0
  		}

      const notAnswered = [];

  		for (let i = 0; i < this.questionList.length; i++) {
        const rawScore = Number(this.questionList[i].score);
        const qScore = this.questionList[i].reverseScore ? 8 - rawScore : rawScore;
        // validate question has been answered first
        if (qScore === 0) {
          this.errors.questions.hasError = true;
          notAnswered.push(i+1);
        } else if(this.questionList[i].category === 'Articulate Vision'){
          console.log('here')
		    	rawScores.articulateVision += rawScore;
          scores.articulateVision += qScore;
  			} else if(this.questionList[i].category === 'Role Model'){
          rawScores.roleModel += rawScore;
          scores.roleModel += qScore;
        } else if(this.questionList[i].category === 'Foster Goal Acceptance'){
          rawScores.fosterGoalAcceptance += rawScore;
          scores.fosterGoalAcceptance += qScore;
        } else if(this.questionList[i].category === 'Performance Expectations'){
          rawScores.performanceExpectations += rawScore;
          scores.performanceExpectations += qScore;
        } else if(this.questionList[i].category === 'Individual Support'){
          rawScores.individualSupport += rawScore;
          scores.individualSupport += qScore;
        } else if(this.questionList[i].category === 'Intellectual Simulation'){
          rawScores.intellectualSimulation += rawScore;
          scores.intellectualSimulation += qScore;
        } else if(this.questionList[i].category === 'Transactional Leader Behaviour'){
          rawScores.transactionalLeaderBehaviour += rawScore;
          scores.transactionalLeaderBehaviour += qScore;
        } 
		  }
      this.errors.questions.message = notAnswered.length === 0 ? null : "The following statements have not been answered: " + notAnswered.join(', ');
      
      // to finalise scores (average), divide  the addition of each score to number of statements in that category
      scores.articulateVision = round(scores.articulateVision/5, 1);
      scores.roleModel = round(scores.roleModel/3, 1);
      scores.fosterGoalAcceptance = round(scores.fosterGoalAcceptance/4, 1);
      scores.performanceExpectations = round(scores.performanceExpectations/3, 1);
      scores.individualSupport = round(scores.individualSupport/4, 1);
      scores.intellectualSimulation = round(scores.intellectualSimulation/4, 1);
      scores.transactionalLeaderBehaviour = round(scores.transactionalLeaderBehaviour/5, 1);

      return { scores, rawScores };
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
          // ID of the element in which to draw the chart. Transactional Leader Behaviour
          element: 'chart',
          data: [
            { label: 'Articulate Vision', value: scores.articulateVision },
            { label: 'Role Model', value: scores.roleModel },
            { label: 'Foster Goal Acceptance', value: scores.fosterGoalAcceptance },
            { label: 'Performance Expectations', value: scores.performanceExpectations },
            { label: 'Individual Support', value: scores.individualSupport },
            { label: 'Intellectual Simulation', value: scores.intellectualSimulation },
            { label: 'Transactional Leader Behaviour', value: scores.transactionalLeaderBehaviour }
          ],
          xkey: 'label',
          ykeys: ['value'],
          xLabelAngle: 25,
          padding: 70,
          labels: ['Points'],
           ymax: 7
        });
    },
    updateChart: function(scores) {
      this.chart.setData([
          { label: 'Articulate Vision', value: scores.articulateVision },
          { label: 'Role Model', value: scores.roleModel },
          { label: 'Foster Goal Acceptance', value: scores.fosterGoalAcceptance },
          { label: 'Performance Expectations', value: scores.performanceExpectations },
          { label: 'Individual Support', value: scores.individualSupport },
          { label: 'Intellectual Simulation', value: scores.intellectualSimulation },
          { label: 'Transactional Leader Behaviour', value: scores.transactionalLeaderBehaviour }
        ])
    }
  }
})

const quiz3ColRef = db.collection('quizes').doc('4JYTDqsFZoWyfRSUEuoe').collection('responses');

var quiz2Responses = new Vue({
  el: '#quiz2',
  data: {
    dbRequest: {
      isLoading: true,
      hasError: false,
      queriedAt: null
    },
    modalActive: false,
    responses: [],
    summary: {
      all: {
        total: 0,
        articulateVision: 0,
        roleModel: 0,
        fosterGoalAcceptance: 0,
        performanceExpectations: 0,
        individualSupport: 0,
        intellectualSimulation: 0,
        transactionalLeaderBehaviour: 0
      },
      male: {
        total: 0,
        articulateVision: 0,
        roleModel: 0,
        fosterGoalAcceptance: 0,
        performanceExpectations: 0,
        individualSupport: 0,
        intellectualSimulation: 0,
        transactionalLeaderBehaviour: 0
      },
      female: {
        total: 0,
        articulateVision: 0,
        roleModel: 0,
        fosterGoalAcceptance: 0,
        performanceExpectations: 0,
        individualSupport: 0,
        intellectualSimulation: 0,
        transactionalLeaderBehaviour: 0
      }
    },
    tabIndex: 0,
    moment: moment
  },
  mounted () {
    this.retrieveResponsesFromDB();
  },
  methods: {
  	retrieveResponsesFromDB: function() {
  		quiz3ColRef.orderBy("writtenAt", "desc").onSnapshot((querySnapshot) => {
  			this.responses = [];
        this.resetSummary();
        console.log('1')
  	    querySnapshot.forEach((doc) => {
        console.log('2')
          //ensure this.responses is empty
          const response = doc.data();
          // format timestamp
          response.writtenAt = moment(response.writtenAt.seconds * 1000).format('Do MMM (ddd), h:mm a');
          this.responses.push(response);
          const scores = response.results.scores;
          // summary calculation
          this.summary.all.total++;
          this.summary.all.articulateVision += scores.articulateVision;
          this.summary.all.fosterGoalAcceptance += scores.fosterGoalAcceptance;
          this.summary.all.individualSupport += scores.individualSupport;
          this.summary.all.intellectualSimulation += scores.intellectualSimulation;   
          this.summary.all.performanceExpectations += scores.performanceExpectations;
          this.summary.all.roleModel += scores.roleModel;
          this.summary.all.transactionalLeaderBehaviour += scores.transactionalLeaderBehaviour;
          if(response.student.gender === "male") {
            this.summary.male.total++;
            this.summary.male.articulateVision += scores.articulateVision;
            this.summary.male.fosterGoalAcceptance += scores.fosterGoalAcceptance;
            this.summary.male.individualSupport += scores.individualSupport;
            this.summary.male.intellectualSimulation += scores.intellectualSimulation;   
            this.summary.male.performanceExpectations += scores.performanceExpectations;
            this.summary.male.roleModel += scores.roleModel;
            this.summary.male.transactionalLeaderBehaviour += scores.transactionalLeaderBehaviour;
          } else {
            this.summary.female.total++;
            this.summary.female.articulateVision += scores.articulateVision;
            this.summary.female.fosterGoalAcceptance += scores.fosterGoalAcceptance;
            this.summary.female.individualSupport += scores.individualSupport;
            this.summary.female.intellectualSimulation += scores.intellectualSimulation;   
            this.summary.female.performanceExpectations += scores.performanceExpectations;
            this.summary.female.roleModel += scores.roleModel;
            this.summary.female.transactionalLeaderBehaviour += scores.transactionalLeaderBehaviour;
          }
  	    });
        console.log('this.summary.male.total)', this.summary.male.total)
        this.calculateSummary();
		  })
  	},
    calculateSummary: function () {
      // average out summary for all
      const all = this.summary.all;
      all.articulateVision = round(all.articulateVision/all.total, 1);
      all.fosterGoalAcceptance = round(all.fosterGoalAcceptance/all.total, 1);
      all.individualSupport = round(all.individualSupport/all.total, 1);
      all.intellectualSimulation = round(all.intellectualSimulation/all.total, 1);
      all.performanceExpectations = round(all.performanceExpectations/all.total, 1);
      all.roleModel = round(all.roleModel/all.total, 1);
      all.transactionalLeaderBehaviour = round(all.transactionalLeaderBehaviour/all.total, 1);
      // average out summary for male
      const male = this.summary.male;
      male.articulateVision = round(male.articulateVision/male.total, 1);
      male.fosterGoalAcceptance = round(male.fosterGoalAcceptance/male.total, 1);
      male.individualSupport = round(male.individualSupport/male.total, 1);
      male.intellectualSimulation = round(male.intellectualSimulation/male.total, 1);
      male.performanceExpectations = round(male.performanceExpectations/male.total, 1);
      male.roleModel = round(male.roleModel/male.total, 1);
      male.transactionalLeaderBehaviour = round(male.transactionalLeaderBehaviour/male.total, 1);
      // average out summary for female
      const female = this.summary.female;
      female.articulateVision = round(female.articulateVision/female.total, 1);
      female.fosterGoalAcceptance = round(female.fosterGoalAcceptance/female.total, 1);
      female.individualSupport = round(female.individualSupport/female.total, 1);
      female.intellectualSimulation = round(female.intellectualSimulation/female.total, 1);
      female.performanceExpectations = round(female.performanceExpectations/female.total, 1);
      female.roleModel = round(female.roleModel/female.total, 1);
      female.transactionalLeaderBehaviour = round(female.transactionalLeaderBehaviour/female.total, 1);
    },
    resetSummary: function () {
      // average out summary for all
      const all = this.summary.all;
      all.total = 0;
      all.articulateVision = 0;
      all.fosterGoalAcceptance = 0;
      all.individualSupport = 0;
      all.intellectualSimulation = 0;
      all.performanceExpectations = 0;
      all.roleModel = 0;
      all.transactionalLeaderBehaviour = 0;
      // average out summary for male
      const male = this.summary.male;
      male.total = 0;
      male.articulateVision = 0;
      male.fosterGoalAcceptance = 0;
      male.individualSupport = 0;
      male.intellectualSimulation = 0;
      male.performanceExpectations = 0;
      male.roleModel = 0;
      male.transactionalLeaderBehaviour = 0;
      // average out summary for female
      const female = this.summary.female;
      female.total = 0;
      female.articulateVision = 0;
      female.fosterGoalAcceptance = 0;
      female.individualSupport = 0;
      female.intellectualSimulation = 0;
      female.performanceExpectations = 0;
      female.roleModel = 0;
      female.transactionalLeaderBehaviour = 0;
    },
    openTab: function(tabIndex) {
      this.tabIndex = tabIndex;
    },
    promptDelete: function(email) {
      swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          quiz3ColRef.doc(email).delete().then(function() {
              console.log("Document successfully deleted!");
          }).catch(function(error) {
              console.error("Error removing document: ", error);
          });

          swal(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        }
      })
    }
  },
})

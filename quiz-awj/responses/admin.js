const quiz5ColRef = db.collection('quizes').doc('AWJdUqHCxiHL5XLzD6v1').collection('responses');

var quiz5Responses = new Vue({
  el: '#quiz5',
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
        totalResponses: 0,
        growthMindset: 0,
        fixedMindset: 0,
        creativeSelfEfficacy: 0,
        creativePersonalIdentity: 0,
      },
      male: {
        totalResponses: 0,
        growthMindset: 0,
        fixedMindset: 0,
        creativeSelfEfficacy: 0,
        creativePersonalIdentity: 0,
      },
      female: {
        totalResponses: 0,
        growthMindset: 0,
        fixedMindset: 0,
        creativeSelfEfficacy: 0,
        creativePersonalIdentity: 0,
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
  		quiz5ColRef.orderBy("writtenAt", "desc").onSnapshot((querySnapshot) => {
  			this.responses = [];
        this.resetSummary();
  	    querySnapshot.forEach((doc) => {
          //ensure this.responses is empty
          const response = doc.data();
          // format timestamp
          response.writtenAt = moment(response.writtenAt.seconds * 1000).format('Do MMM (ddd), h:mm a');
          this.responses.push(response);
          const scores = response.results.scores;
          // Initialising results in summary categories
          this.summary.all.totalResponses++;
          this.summary.all.growthMindset += scores.growthMindset;
          this.summary.all.fixedMindset += scores.fixedMindset;
          this.summary.all.creativeSelfEfficacy += scores.creativeSelfEfficacy;
          this.summary.all.creativePersonalIdentity += scores.creativePersonalIdentity;
          if(response.student.gender === "male") {
            this.summary.male.totalResponses++;
            this.summary.male.growthMindset += scores.growthMindset;
            this.summary.male.fixedMindset += scores.fixedMindset;
            this.summary.male.creativeSelfEfficacy += scores.creativeSelfEfficacy;
            this.summary.male.creativePersonalIdentity += scores.creativePersonalIdentity;
          } else {
            this.summary.female.totalResponses++;
            this.summary.female.growthMindset += scores.growthMindset;
            this.summary.female.fixedMindset += scores.fixedMindset;
            this.summary.female.creativeSelfEfficacy += scores.creativeSelfEfficacy;
            this.summary.female.creativePersonalIdentity += scores.creativePersonalIdentity;
          }
  	    });
        this.calculateSummary();
  		})
  	},
    calculateSummary: function () {
      // average out summary for all
      const all = this.summary.all;
      all.growthMindset = round(all.growthMindset/all.totalResponses, 1);
      all.fixedMindset = round(all.fixedMindset/all.totalResponses, 1);
      all.creativeSelfEfficacy = round(all.creativeSelfEfficacy/all.totalResponses, 1);
      all.creativePersonalIdentity = round(all.creativePersonalIdentity/all.totalResponses, 1);
      // average out summary for male
      const male = this.summary.male;
      male.growthMindset = round(male.growthMindset/male.totalResponses, 1);
      male.fixedMindset = round(male.fixedMindset/male.totalResponses, 1);
      male.creativeSelfEfficacy = round(male.creativeSelfEfficacy/male.totalResponses, 1);
      male.creativePersonalIdentity = round(male.creativePersonalIdentity/male.totalResponses, 1);
      // average out summary for female
      const female = this.summary.female;
      female.growthMindset = round(female.growthMindset/female.totalResponses, 1);
      female.fixedMindset = round(female.fixedMindset/female.totalResponses, 1);
      female.creativeSelfEfficacy = round(female.creativeSelfEfficacy/female.totalResponses, 1);
      female.creativePersonalIdentity = round(female.creativePersonalIdentity/female.totalResponses, 1);
    },
    resetSummary: function () {
      // average out summary for all
      const all = this.summary.all;
      all.totalResponses = 0;
      all.growthMindset = 0;
      all.fixedMindset = 0;
      all.creativeSelfEfficacy = 0;
      all.creativePersonalIdentity = 0;
      // average out summary for male
      const male = this.summary.male;
      male.totalResponses = 0;
      male.growthMindset = 0;
      male.fixedMindset = 0;
      male.creativeSelfEfficacy = 0;
      male.creativePersonalIdentity = 0;
      // average out summary for female
      const female = this.summary.female;
      female.totalResponses = 0;
      female.growthMindset = 0;
      female.fixedMindset = 0;
      female.creativeSelfEfficacy = 0;
      female.creativePersonalIdentity = 0;
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
          quiz5ColRef.doc(email).delete().then(function() {
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
    },
    promptEmail: function(email) {
      swal({
        title: 'Are you sure?',
        text: "Results will be emailed to student once you confirm!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, send email!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      }).then((result) => {
        if (result.value) {
          quiz5ColRef.doc(email).update({
            emailResend: new Date()
          }).then(function() {
              console.log("Document successfully updated!");
          }).catch(function(error) {
              console.error("Error updating document: ", error);
          });
          swal(
            'Sending email...',
            `Result is being sent to ${email}. It may take awhile.`,
            'success'
          )
        }
      })
    },
    getProperTitle(title) {
        switch(title) {
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

const quiz2ColRef = db.collection('quizes').doc('tJUrl9JFXWshEDHLSOLg').collection('responses');

var quiz2Responses = new Vue({
  el: '#quiz2',
  data: {
    classOf: 'ay2018-2019sem2',
    responses: [],
    summary: {
      all: {
        totalResponses: 0,
        task: 0,
        relationship: 0
      },
      male:  {
        totalResponses: 0,
        task: 0,
        relationship: 0
      },
      female:  {
        totalResponses: 0,
        task: 0,
        relationship: 0
      }
    },
    chart: null,
    tabIndex: 0,
    moment: moment
  },
  mounted () {
    this.retrieveResponsesFromDB();
  },
  methods: {
  	retrieveResponsesFromDB: function() {

      // set ref to the entire responses by default
      let ref = quiz2ColRef;

      // if class is not 'ay2018-2019sem1' (its unfilterable at the moment), then filter according to selected class
      if (this.classOf !== 'all') {
        ref = quiz2ColRef.where("student.class", "==", this.classOf);
      } 

  		ref.orderBy("writtenAt", "desc").onSnapshot((querySnapshot) => {
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
            this.summary.all.task += scores.task;
              this.summary.all.relationship += scores.relationship;
            if(response.student.gender === "male") {
              this.summary.male.totalResponses++;
              this.summary.male.task += scores.task;
              this.summary.male.relationship += scores.relationship;
            } else {
              this.summary.female.totalResponses++;
              this.summary.female.task += scores.task;
              this.summary.female.relationship += scores.relationship;
            }
        });
        this.calculateSummary();
		});

  	},
    calculateSummary: function () {
      // average out summary for all
      const all = this.summary.all;
      all.task = round(all.task/all.totalResponses, 1);
      all.relationship = round(all.relationship/all.totalResponses, 1);
      // average out summary for male
      const male = this.summary.male;
      male.task = round(male.task/male.totalResponses, 1);
      male.relationship = round(male.relationship/male.totalResponses, 1);
      // average out summary for female
      const female = this.summary.female;
      female.task = round(female.task/female.totalResponses, 1);
      female.relationship = round(female.relationship/female.totalResponses, 1);
    },
    resetSummary: function () {
      // average out summary for all
      const all = this.summary.all;
      all.totalResponses = 0;
      all.task = 0;
      all.relationship = 0;
      // average out summary for male
      const male = this.summary.male;
      male.totalResponses = 0;
      male.task = 0;
      male.relationship = 0;
      // average out summary for female
      const female = this.summary.female;
      female.totalResponses = 0;
      female.task = 0;
      female.relationship = 0;
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
          quiz2ColRef.doc(email).delete().then(function() {
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
          quiz2ColRef.doc(email).update({
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
    getScorePercentage: function(category, score) {
      switch(category) {
          case 'task':
              return round(score/50 * 100, 1) + '%';
          case 'relationship':
              return round(score/50 * 100, 1) + '%';
      }
  }
  },
})

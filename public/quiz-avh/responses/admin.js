const quiz4ColRef = db.collection('quizes').doc('avHls1vanK3UTWZJDewz').collection('responses');

var quiz4Responses = new Vue({
  el: '#quiz4',
  data: {
    classOf: 'ay2018-2019sem2',
    responses: [],
    summary: {
      all: {
        totalResponses: 0,
        affectiveIdentify: 0,
        noncalculative: 0,
        socialNormative: 0,
        total: 0,
      },
      male: {
        totalResponses: 0,
        affectiveIdentify: 0,
        noncalculative: 0,
        socialNormative: 0,
        total: 0,
      },
      female: {
        totalResponses: 0,
        affectiveIdentify: 0,
        noncalculative: 0,
        socialNormative: 0,
        total: 0,
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
  		// set ref to the entire responses by default
      let ref = quiz4ColRef;

      // if class is not 'ay2018-2019sem1' (its unfilterable at the moment), then filter according to selected class
      if (this.classOf !== 'all') {
        ref = quiz4ColRef.where("student.class", "==", this.classOf);
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
          this.summary.all.affectiveIdentify += scores.affectiveIdentify;
          this.summary.all.noncalculative += scores.noncalculative;
          this.summary.all.socialNormative += scores.socialNormative;
          if(response.student.gender === "male") {
            this.summary.male.totalResponses++;
            this.summary.male.affectiveIdentify += scores.affectiveIdentify;
            this.summary.male.noncalculative += scores.noncalculative;
            this.summary.male.socialNormative += scores.socialNormative;
          } else {
            this.summary.female.totalResponses++;
            this.summary.female.affectiveIdentify += scores.affectiveIdentify;
            this.summary.female.noncalculative += scores.noncalculative;
            this.summary.female.socialNormative += scores.socialNormative;
          }
  	    });
        this.calculateSummary();
		  })
  	},
    calculateSummary: function () {
      // average out summary for all
      const all = this.summary.all;
      all.affectiveIdentify = round(all.affectiveIdentify/all.totalResponses, 1);
      all.noncalculative = round(all.noncalculative/all.totalResponses, 1);
      all.socialNormative = round(all.socialNormative/all.totalResponses, 1);
      all.total = round(all.affectiveIdentify + all.noncalculative + all.socialNormative, 1);
      // average out summary for male
      const male = this.summary.male;
      male.affectiveIdentify = round(male.affectiveIdentify/male.totalResponses, 1);
      male.noncalculative = round(male.noncalculative/male.totalResponses, 1);
      male.socialNormative = round(male.socialNormative/male.totalResponses, 1);
      male.total = round(male.affectiveIdentify + male.noncalculative + male.socialNormative, 1);

      // average out summary for female
      const female = this.summary.female;
      female.affectiveIdentify = round(female.affectiveIdentify/female.totalResponses, 1);
      female.noncalculative = round(female.noncalculative/female.totalResponses, 1);
      female.socialNormative = round(female.socialNormative/female.totalResponses, 1);
      female.total = round(female.affectiveIdentify + female.noncalculative + female.socialNormative, 1);

    },
    resetSummary: function () {
      // average out summary for all
      const all = this.summary.all;
      all.totalResponses = 0;
      all.affectiveIdentify = 0;
      all.noncalculative = 0;
      all.socialNormative = 0;
      all.total = 0;
      // average out summary for male
      const male = this.summary.male;
      male.totalResponses = 0;
      male.affectiveIdentify = 0;
      male.noncalculative = 0;
      male.socialNormative = 0;
      all.total = 0;
      // average out summary for female
      const female = this.summary.female;
      female.totalResponses = 0;
      female.affectiveIdentify = 0;
      female.noncalculative = 0;
      female.socialNormative = 0;
      all.total = 0;
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
          quiz4ColRef.doc(email).delete().then(function() {
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
          quiz4ColRef.doc(email).update({
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

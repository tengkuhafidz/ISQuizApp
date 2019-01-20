const quiz1ColRef = db.collection('quizes').doc('mI7FH4zvco1P92ChrFDF').collection('responses');

var quiz1Responses = new Vue({
  el: '#quiz1',
  data: {
    classOf: 'ay2018-2019sem2',
		responses: [],
		summary: {
			all: {
				totalResponses: 0,
				authoritarian: 0,
        democratic: 0,
        laissezFaire: 0
			},
			male: {
				authoritarian: 0,
        democratic: 0,
        laissezFaire: 0
			},
			female: {
				authoritarian: 0,
        democratic: 0,
        laissezFaire: 0
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
      let ref = quiz1ColRef;

      // if class is not 'ay2018-2019sem1' (its unfilterable at the moment), then filter according to selected class
      if (this.classOf !== 'all') {
				console.log('hi', this.classOf)
        ref = quiz1ColRef.where("student.class", "==", this.classOf);
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
						this.summary.all.authoritarian += scores.authoritarian;
						this.summary.all.democratic += scores.democratic;
						this.summary.all.laissezFaire += scores.laissezFaire;
						if(response.student.gender === "male") {
							this.summary.male.totalResponses++;
							this.summary.male.authoritarian += scores.authoritarian;
							this.summary.male.democratic += scores.democratic;
							this.summary.male.laissezFaire += scores.laissezFaire;
						} else {
							this.summary.female.totalResponses++;
							this.summary.female.authoritarian += scores.authoritarian;
							this.summary.female.democratic += scores.democratic;
							this.summary.female.laissezFaire += scores.laissezFaire;
						}
				});
				this.calculateSummary();
			});
		},
		calculateSummary: function () {
      // average out summary for all
      const all = this.summary.all;
      all.authoritarian = round(all.authoritarian/all.totalResponses, 1);
      all.democratic = round(all.democratic/all.totalResponses, 1);
      all.laissezFaire = round(all.laissezFaire/all.totalResponses, 1);
      // average out summary for male
      const male = this.summary.male;
      male.authoritarian = round(male.authoritarian/male.totalResponses, 1);
      male.democratic = round(male.democratic/male.totalResponses, 1);
      male.laissezFaire = round(male.laissezFaire/male.totalResponses, 1);
      // average out summary for female
      const female = this.summary.female;
      female.authoritarian = round(female.authoritarian/female.totalResponses, 1);
      female.democratic = round(female.democratic/female.totalResponses, 1);
      female.laissezFaire = round(female.laissezFaire/female.totalResponses, 1);
    },
    resetSummary: function () {
      // average out summary for all
      const all = this.summary.all;
      all.totalResponses = 0;
      all.authoritarian = 0;
      all.democratic = 0;
      all.laissezFaire = 0;
      // average out summary for male
      const male = this.summary.male;
      male.totalResponses = 0;
      male.authoritarian = 0;
      male.democratic = 0;
      male.laissezFaire = 0;
      // average out summary for female
      const female = this.summary.female;
      female.totalResponses = 0;
      female.authoritarian = 0;
      female.democratic = 0;
      female.laissezFaire = 0;
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
          quiz1ColRef.doc(email).delete().then(function() {
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
          quiz1ColRef.doc(email).update({
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
            case 'authoritarian':
                return round(score/20 * 100, 1) + '%';
            case 'democratic':
                return round(score/20 * 100, 1) + '%';
            case 'laissezFaire':
                return round(score/20 * 100, 1) + '%';
        }
    }
  },
})

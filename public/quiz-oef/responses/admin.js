const quiz6ColRef = db.collection('quizes').doc('OeFxqmapol9srPwcknP0').collection('responses')

var quiz6Responses = new Vue({
  el: '#quiz6',
  data: {
    classOf: null,
    allClasses: null,
    responses: [],
    summary: {
      all: {
          totalResponses: 0,
          interpersonal: 0,
          taskSpecific: 0,
          cognitive: 0,
          communication: 0,
      },
      male: {
          totalResponses: 0,
          interpersonal: 0,
          taskSpecific: 0,
          cognitive: 0,
          communication: 0,
      },
      female: {
          totalResponses: 0,
          interpersonal: 0,
          taskSpecific: 0,
          cognitive: 0,
          communication: 0,
      }
    },
    tabIndex: 0,
    moment: moment
  },
  mounted () {
    this.initialiseSemesters();
    this.retrieveResponsesFromDB();
  },
  methods: {
    initialiseSemesters: function() {
      this.classOf = currentSemester();
      this.allClasses = getAllSemesters();
    },
  	retrieveResponsesFromDB: function() {
      // set ref to the entire responses by default
      let ref = quiz6ColRef;

      // if class is not 'ay2018-2019sem1' (its unfilterable at the moment), then filter according to selected class
      if (this.classOf !== 'all') {
        ref = quiz6ColRef.where("student.class", "==", this.classOf);
      } 
        
  		ref.orderBy("writtenAt", "desc").onSnapshot((querySnapshot) => {
  			this.responses = [];
        this.resetSummary();
  	    querySnapshot.forEach((doc) => {
          //ensure this.responses is empty
          const response = doc.data();
          // format timestamp
          response.writtenAt = moment(response.writtenAt.seconds * 1000).format('Do MMM YYYY h:mm a');
          this.responses.push(response);
          const scores = response.results.scores;
          // Initialising results in summary categories
          this.summary.all.totalResponses++;
          this.summary.all.interpersonal += scores.interpersonal;
          this.summary.all.taskSpecific += scores.taskSpecific;
          this.summary.all.cognitive += scores.cognitive;
          this.summary.all.communication += scores.communication;
          if(response.student.gender === "male") {
            this.summary.male.totalResponses++;
            this.summary.male.interpersonal += scores.interpersonal;
            this.summary.male.taskSpecific += scores.taskSpecific;
            this.summary.male.cognitive += scores.cognitive;
            this.summary.male.communication += scores.communication;
          } else {
            this.summary.female.totalResponses++;
            this.summary.female.interpersonal += scores.interpersonal;
            this.summary.female.taskSpecific += scores.taskSpecific;
            this.summary.female.cognitive += scores.cognitive;
            this.summary.female.communication += scores.communication;
          }
  	    });
        this.calculateSummary();
  		})
  	},
    calculateSummary: function () {
      // average out summary for all
      const all = this.summary.all;
      all.interpersonal = round(all.interpersonal/all.totalResponses, 1);
      all.taskSpecific = round(all.taskSpecific/all.totalResponses, 1);
      all.cognitive = round(all.cognitive/all.totalResponses, 1);
      all.communication = round(all.communication/all.totalResponses, 1);
      // average out summary for male
      const male = this.summary.male;
      male.interpersonal = round(male.interpersonal/male.totalResponses, 1);
      male.taskSpecific = round(male.taskSpecific/male.totalResponses, 1);
      male.cognitive = round(male.cognitive/male.totalResponses, 1);
      male.communication = round(male.communication/male.totalResponses, 1);
      // average out summary for female
      const female = this.summary.female;
      female.interpersonal = round(female.interpersonal/female.totalResponses, 1);
      female.taskSpecific = round(female.taskSpecific/female.totalResponses, 1);
      female.cognitive = round(female.cognitive/female.totalResponses, 1);
      female.communication = round(female.communication/female.totalResponses, 1);
    },
    resetSummary: function () {
      // average out summary for all
      const all = this.summary.all;
      all.totalResponses = 0;
      all.interpersonal = 0;
      all.taskSpecific = 0;
      all.cognitive = 0;
      all.communication = 0;
      // average out summary for male
      const male = this.summary.male;
      male.totalResponses = 0;
      male.interpersonal = 0;
      male.taskSpecific = 0;
      male.cognitive = 0;
      male.communication = 0;
      // average out summary for female
      const female = this.summary.female;
      female.totalResponses = 0;
      female.interpersonal = 0;
      female.taskSpecific = 0;
      female.cognitive = 0;
      female.communication = 0;
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
          quiz6ColRef.doc(email).delete().then(function() {
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
          quiz6ColRef.doc(email).update({
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
            case 'interpersonal':
                return round(score/35 * 100, 1) + '%';
            case 'taskSpecific':
                return round(score/20 * 100, 1) + '%';
            case 'cognitive':
                return round(score/15 * 100, 1) + '%';
            case 'communication':
                return round(score/20 * 100, 1) + '%';
        }
    },
    prepareCSV: function() {
      const csvData = [];
      for(let response of this.responses) {
        const { email, gender } = response.student;
        const semester = response.student.class;
        const submittedAt = response.writtenAt;
        // consolidate info of user and submission time
        const singleData = {
          submittedAt,
          email,
          gender,
          semester,
        }
        // consolidate categorical scores
        const categories = Object.keys(response.results.scores);
        for(let category of categories) {
          singleData[category] = response.results.scores[category];
        }
        // consolidate individual qn scores
        const { rawInputs } = response;
        //check if it exists as earlier version does not include rawInputs
        if(rawInputs) {
          for(let [index, rawInput] of rawInputs.entries()) {
            singleData[`question ${index + 1}`] = rawInput.score;
          }
        }        
        csvData.push(singleData);
      }
      return csvData;
    },
    downloadCSV: function() {
      downloadCSV({ filename: `Self-Perception of Leadership Skills - ${this.classOf}.csv` }, this.prepareCSV())
    }
  }
})

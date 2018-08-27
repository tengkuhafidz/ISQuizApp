const quiz2ColRef = db.collection('quizes').doc('tJUrl9JFXWshEDHLSOLg').collection('responses');
const modal = document.getElementById('modalGraph');

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
      task: 0,
      relationship: 0
    },
    chart: null,
    moment: moment
  },
  mounted () {
    this.retrieveResponsesFromDB();
  },
  methods: {
  	retrieveResponsesFromDB: function() {
  		quiz2ColRef.orderBy("writtenAt", "desc").get().then((querySnapshot) => {
  			this.dbRequest.isLoading = true;
  			this.responses = [];
        this.summary.task = 0;
        this.summary.relationship = 0;
		    querySnapshot.forEach((doc) => {
		        //ensure this.responses is empty
		        const response = doc.data();
		        // format timestamp
		        response.writtenAt = moment(response.writtenAt.seconds * 1000).format('Do MMM (ddd), h:mm a');
		        this.responses.push(response);
            // store summary
            if(response.results.title === "task") {
              this.summary.task++;
            } else {
              this.summary.relationship++;
            }
		    });
		})
		.catch((error) => {
	        console.log("Error getting document:", error);
	        this.dbRequest.hasError = true;
	    })
	    .finally(() => {
	    	this.dbRequest.isLoading = false;
	    	this.dbRequest.queriedAt = moment().format('h:mm:ss a');
	    });
  	},
    displayGraph: function() {
      this.retrieveResponsesFromDB()
      // graph wont be ready without timeout
      setTimeout(()=>{
        if (!this.chart){
          this.createChart();
        } else {
          this.updateChart();
        }
      }, 500);

      this.openModal();
      return true;
    },
    createChart: function() {
      console.log('createChart');
      this.chart = new Morris.Donut({
        // ID of the element in which to draw the chart.
        element: 'chart',
        data: [
          { label: 'Task', value: this.summary.task},
          { label: 'Relationship', value: this.summary.relationship }
        ],
        colors: ['#EC407A', '#42A5F5']
      });

    },
    updateChart: function() {
      this.chart.setData([
        { label: 'Task', value: this.summary.task},
        { label: 'Relationship', value: this.summary.relationship }
        ])
    },
    openModal: function() {
      this.modalActive = true;
    },
    closeModal: function() {
      this.modalActive = false;
    }
  },
})

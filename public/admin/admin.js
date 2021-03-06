const quiz1ColRef = db.collection('quizes').doc('mI7FH4zvco1P92ChrFDF').collection('responses');
const quiz2ColRef = db.collection('quizes').doc('tJUrl9JFXWshEDHLSOLg').collection('responses');

var quiz1Responses = new Vue({
  el: '#quiz1',
  data: {
    dbRequest: {
      isLoading: true,
      hasError: false,
      queriedAt: null
    },
    responses: [],
    moment: moment
  },
  mounted () {
    this.retrieveResponsesFromDB();
  },
  methods: {
  	retrieveResponsesFromDB: function() {
  		quiz1ColRef.orderBy("writtenAt", "desc").get().then((querySnapshot) => {
  			this.dbRequest.isLoading = true;
  			this.responses = [];
		    querySnapshot.forEach((doc) => {
		        //ensure this.responses is empty
		        const response = doc.data();
		        // format timestamp
		        response.writtenAt = moment(response.writtenAt.seconds * 1000).format('Do MMM (ddd), h:mm a');
		        this.responses.push(response);
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
  	}
  },
})

var quiz2Responses = new Vue({
  el: '#quiz2',
  data: {
    dbRequest: {
      isLoading: true,
      hasError: false,
      queriedAt: null
    },
    responses: [],
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
		    querySnapshot.forEach((doc) => {
		        //ensure this.responses is empty
		        const response = doc.data();
		        // format timestamp
		        response.writtenAt = moment(response.writtenAt.seconds * 1000).format('Do MMM (ddd), h:mm a');
		        this.responses.push(response);
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
  	}
  },
})

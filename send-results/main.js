const quiz1ColRef = db.collection('quizes').doc('mI7FH4zvco1P92ChrFDF').collection('responses');
const quiz2ColRef = db.collection('quizes').doc('tJUrl9JFXWshEDHLSOLg').collection('responses');
const quiz3ColRef = db.collection('quizes').doc('4JYTDqsFZoWyfRSUEuoe').collection('responses');
const quiz4ColRef = db.collection('quizes').doc('avHls1vanK3UTWZJDewz').collection('responses');
const quiz5ColRef = db.collection('quizes').doc('AWJdUqHCxiHL5XLzD6v1').collection('responses');


var app = new Vue({
    el: '#sendResults',
    data: {
        email: null
    },
    methods: {
        emailResults: function () {
            swal({
                title: 'Are you sure?',
                text: "All Results tied to the email will be sent to student once you confirm!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, send email!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true
            }).then((result) => {
                if (result.value) {

                    quiz1ColRef.doc(this.email).update({
                        emailResend: new Date()
                    }).then(function() {
                        console.log("Quiz 1 result request successful!");
                    }).catch(function(error) {
                        console.error("Error updating document: ", error);
                    });

                    quiz2ColRef.doc(this.email).update({
                        emailResend: new Date()
                    }).then(function() {
                        console.log("Quiz 2 result request successful!");
                    }).catch(function(error) {
                        console.error("Error updating document: ", error);
                    });

                    quiz3ColRef.doc(this.email).update({
                        emailResend: new Date()
                    }).then(function() {
                        console.log("Quiz 3 result request successful!");
                    }).catch(function(error) {
                        console.error("Error updating document: ", error);
                    });

                    quiz4ColRef.doc(this.email).update({
                        emailResend: new Date()
                    }).then(function() {
                        console.log("Quiz 4 result request successful!");
                    }).catch(function(error) {
                        console.error("Error updating document: ", error);
                    });

                    quiz5ColRef.doc(this.email).update({
                        emailResend: new Date()
                    }).then(function() {
                        console.log("Quiz 5 result request successful!");
                    }).catch(function(error) {
                        console.error("Error updating document: ", error);
                    });

                    swal(
                        'Sending email...',
                        `Results are being sent to ${this.email}. It may take awhile.`,
                        'success'
                    )
                }
            })
        }
    }
})
const quiz1ColRef = db.collection('quizes').doc('mI7FH4zvco1P92ChrFDF').collection('responses');
const quiz2ColRef = db.collection('quizes').doc('tJUrl9JFXWshEDHLSOLg').collection('responses');
const quiz3ColRef = db.collection('quizes').doc('4JYTDqsFZoWyfRSUEuoe').collection('responses');
const quiz4ColRef = db.collection('quizes').doc('avHls1vanK3UTWZJDewz').collection('responses');
const quiz5ColRef = db.collection('quizes').doc('AWJdUqHCxiHL5XLzD6v1').collection('responses');
const quiz6ColRef = db.collection('quizes').doc('OeFxqmapol9srPwcknP0').collection('responses');


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
                    const lowerCapsEmail = this.email.toLowerCase();

                    quiz1ColRef.doc(lowerCapsEmail).update({
                        emailResend: new Date()
                    }).then(function() {
                        console.log("Questionnaire 1 result request successful!");
                    }).catch(function(error) {
                        console.error("Error requesting questionnaire 1 results: ", error);
                    });

                    quiz2ColRef.doc(lowerCapsEmail).update({
                        emailResend: new Date()
                    }).then(function() {
                        console.log("Questionnaire 2 result request successful!");
                    }).catch(function(error) {
                        console.error("Error requesting questionnaire 2 results: ", error);
                    });

                    quiz3ColRef.doc(lowerCapsEmail).update({
                        emailResend: new Date()
                    }).then(function() {
                        console.log("Questionnaire 3 result request successful!");
                    }).catch(function(error) {
                        console.error("Error requesting questionnaire 3 results", error);
                    });

                    quiz4ColRef.doc(lowerCapsEmail).update({
                        emailResend: new Date()
                    }).then(function() {
                        console.log("Questionnaire 4 result request successful!");
                    }).catch(function(error) {
                        console.error("Error requesting questionnaire 4 results", error);
                    });

                    quiz5ColRef.doc(lowerCapsEmail).update({
                        emailResend: new Date()
                    }).then(function() {
                        console.log("Questionnaire 5 result request successful!");
                    }).catch(function(error) {
                        console.error("Error requesting questionnaire 5 results", error);
                    });

                    quiz6ColRef.doc(lowerCapsEmail).update({
                        emailResend: new Date()
                    }).then(function() {
                        console.log("Questionnaire 6 result request successful!");
                    }).catch(function(error) {
                        console.error("Error requesting questionnaire 6 results", error);
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
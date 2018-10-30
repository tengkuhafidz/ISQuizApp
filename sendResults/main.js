const colRef = db.collection('users')

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
                    colRef.doc(this.email).update({
                        requestResult: new Date()
                    }).then(function() {
                        console.log("Document successfully updated!");
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
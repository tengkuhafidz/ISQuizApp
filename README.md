# Leadership Questionnaire Web App

This is a simple web application developed for usage is in a leadership module of a local university. It consists of leadership questionnaires that help students identify their leadership tendencies, and allows the lecturer to track and analyse student responses.

This web application is built with Vue.js and Firebase Firestore.

It is running live [here](https://isquizapp.firebaseapp.com/admin).

## Running the Project
No installation required.

1. Go into the `public` folder
2. Open the `index.html` on the browser

## Deploying Changes  

Make sure you have `firebase-tools` installed, and you have logged in to your account with it. You account will need to have permissions to the firebase console of this project.

1. Open the project folder on your terminal/command line
2. Run `firebase deploy`

Changes will be reflected on the live site.

## Folder Structure
The main folders in this project are:
1. **public**: This is where the frontend web app codes are in. Aside from holding the different `questionnaire pages`, it also contains the `admin page` and `send-results page` (used by admin to manually send results to students).
2. **cloud-functions**: This is where the server codes are in. Primarily used to send questionnaire results to students emails. This will be triggered whenever a questionnaire is completed and submitted, and when admin manually requests for it via the `send-results` page.

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

var nodemailer = require('nodemailer');

const constants = require('./constants');

exports.emailResultsOnWrite = functions.firestore
    .document('quizes/{quizId}/responses/{responseId}')
    .onWrite((change, context) => {
      const email = context.params.responseId;
      const quizId = context.params.quizId;
      const response = change.after.data()
      const results = response.results;
      const mailOptions = getMailOptions(quizId, email, results);
      sendMail(mailOptions);
});

const sendMail = (mailOptions) => {
	var transporter = nodemailer.createTransport({
	 service: 'gmail',
	 auth: constants.GMAIL_AUTH
	});

	transporter.sendMail(mailOptions, (err, info) => {
	   if(err)
	     console.log(err)
	   else
	     console.log(info);
	});

}

const getMailOptions = (quizId, email, results) => {
  console.log('quizId', quizId)
  if(quizId === 'mI7FH4zvco1P92ChrFDF') {
    return craftQuiz1MailOptions(email, results);
  } else if(quizId === 'tJUrl9JFXWshEDHLSOLg') {
    return craftQuiz2MailOptions(email, results);
  } else if(quizId === '4JYTDqsFZoWyfRSUEuoe') {
    return craftQuiz3MailOptions(email, results);
  } else if(quizId === 'avHls1vanK3UTWZJDewz') {
    return craftQuiz4MailOptions(email, results);
  } else if(quizId === 'AWJdUqHCxiHL5XLzD6v1') {
    return craftQuiz5MailOptions(email, results);
  } else if(quizId === 'OeFxqmapol9srPwcknP0') {
      return craftQuiz6MailOptions(email, results);
  }
}

const craftQuiz1MailOptions = (email, results) => {
  const mailOptions = {
      from: 'IS3103 Questionnaire <IS3103Quiz@gmail.com>',
      to: email, // list of receivers
      subject: 'Your Results: Leadership Communication Style Preference Quiz', // Subject line
      html: `<p> Hi, </p>
       <p>Your leadership communication style is: <span style="text-transform: capitalize;"><strong>${results.title}</strong></span>.</p>
       <p>The following is your score breakdown:</p>
       <ul>
          <li><strong>Authoritarian:</strong> ${results.scores.authoritarian} </li>
          <li><strong>Democratic:</strong>  ${results.scores.democratic} </li>
          <li><strong>Laissez-Faire:</strong>  ${results.scores.laissezFaire} </li>
        </ul>
        <p>Thank you for completing the quiz.</p>`
  }
  return mailOptions;
}

const craftQuiz2MailOptions = (email, results) => {
  const mailOptions = {
      from: 'IS3103 Quiz <IS3103Quiz@gmail.com>',
      to: email, // list of receivers
      subject: 'Your Results: Leadership Style Quiz', // Subject line
      html: `<p> Hi, </p>
       <p>Your leadership style is: <span style="text-transform: capitalize;"><strong>${results.title}-Oriented</strong></span>.</p>
       <p>The following is your score breakdown:</p>
       <ul>
          <li><strong>Task:</strong> ${results.scores.task} </li>
          <li><strong>Relationship:</strong>  ${results.scores.relationship} </li>
        </ul>
        <p>Thank you for completing the quiz.</p>`
  }
  return mailOptions;
}

const craftQuiz3MailOptions = (email, results) => {
  const mailOptions = {
      from: 'IS3103 Quiz <IS3103Quiz@gmail.com>',
      to: email, // list of receivers
      subject: 'Your Results: Transformational Leadership Scale Quiz', // Subject line
      html: `<p> Hi, </p>
        <p>The following is your score breakdown:</p>
        <ul>
          <li><strong>Articulate Vision:</strong> ${results.scores.articulateVision} </li>
          <li><strong>Role Model:</strong>  ${results.scores.roleModel} </li>
          <li><strong>Foster Goal Acceptance:</strong> ${results.scores.fosterGoalAcceptance} </li>
          <li><strong>Performance Expectations :</strong>  ${results.scores.performanceExpectations} </li>
          <li><strong>Individual Support:</strong> ${results.scores.individualSupport} </li>
          <li><strong>Intellectual Simulation:</strong>  ${results.scores.intellectualSimulation} </li>
          <li><strong>Transactional Leader Behaviour:</strong> ${results.scores.transactionalLeaderBehaviour} </li>
        </ul>
        <p>Thank you for completing the quiz.</p>`
  }
  return mailOptions;
}

const craftQuiz4MailOptions = (email, results) => {
  const mailOptions = {
      from: 'IS3103 Quiz <IS3103Quiz@gmail.com>',
      to: email, // list of receivers
      subject: 'Your Results: Motivation To Lead Scale Quiz', // Subject line
      html: `<p> Hi, </p>
        <p>The following is your score breakdown:</p>
        <ul>
          <li><strong>Total Score:</strong> ${results.totalScore} </li>
          <li><strong>Affective Identify:</strong>  ${results.scores.affectiveIdentify} </li>
          <li><strong>Noncalculative:</strong> ${results.scores.noncalculative} </li>
          <li><strong>Social-Normative:</strong>  ${results.scores.socialNormative} </li>
        </ul>
        <p>Thank you for completing the quiz.</p>`
  }
  return mailOptions;
}

const craftQuiz5MailOptions = (email, results) => {
    const mailOptions = {
        from: 'IS3103 Quiz <IS3103Quiz@gmail.com>',
        to: email, // list of receivers
        subject: 'Your Results: Creative Mindset and Self-Concept Scale', // Subject line
        html: `<p> Hi, </p>
        <p>The following is your score breakdown:</p>
        <ul>
          <li><strong>Growth-Mindset:</strong> ${results.scores.growthMindset} </li>
          <li><strong>Fixed-Mindset:</strong>  ${results.scores.fixedMindset} </li>
          <li><strong>Creative Self-Efficacy:</strong> ${results.scores.creativeSelfEfficacy} </li>
          <li><strong>Creative Personal Identity:</strong>  ${results.scores.creativePersonalIdentity} </li>
        </ul>
        <p>Thank you for completing the quiz.</p>`
    }
    return mailOptions;
}

const craftQuiz6MailOptions = (email, results) => {
    const mailOptions = {
        from: 'IS3103 Quiz <IS3103Quiz@gmail.com>',
        to: email, // list of receivers
        subject: 'Your Results: Self-Perception of Leadership Skills', // Subject line
        html: `<p> Hi, </p>
        <p>The following is your score breakdown:</p>
        <ul>
          <li><strong>Interpersonal/Intrapersonal Skills:</strong> ${results.scores.interpersonal} of 35 (${ round(results.scores.interpersonal/35*100, 1) }%)</li>
          <li><strong>Task-Specific Skills:</strong>  ${results.scores.taskSpecific} of 20 (${ round(results.scores.taskSpecific/20*100, 1) }%)</li>
          <li><strong>Cognitive Skills:</strong> ${results.scores.cognitive} of 15 (${ round(results.scores.cognitive/15*100, 1) }%)</li>
          <li><strong>Communication Skills:</strong>  ${results.scores.communication} of 20 (${ round(results.scores.communication/20*100, 1) }%)</li>
        </ul>
        <p>Thank you for completing the quiz.</p>`
    }
    return mailOptions;
}

//UTILITY
// helper function to round decimals with precision
const round = (value, precision) => {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

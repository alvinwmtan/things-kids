// Initialize jsPsych
var jsPsych = initJsPsych({
  on_finish: function() {
    jsPsych.data.displayData();
  }
});

// Define consent and age check
var consent_trial = {
  type: jsPsychHtmlButtonResponse,
  stimulus: '<p>Please confirm that you consent to participate in this experiment and are over 18.</p>',
  choices: ['I Consent'],
};

// Define instructions
var instructions = {
  type: jsPsychHtmlButtonResponse,
  stimulus: '<p>In this experiment, you will see three images in each trial. Select the image that doesn’t belong with the others (the "odd one out").</p>',
  choices: ['Start Practice']
};

// Define practice trials
var practice_trials = [];
for (var i = 0; i < 6; i++) {
  practice_trials.push({
    type: jsPsychImageButtonResponse,
    stimulus: ['images/practice1.jpg', 'images/practice2.jpg', 'images/practice3.jpg'],  // Example images
    choices: ['1', '2', '3'],
    prompt: 'Select the "odd one out"',
    data: { phase: 'practice' },
    on_finish: function(data) {
      data.correct = (data.response === 2);  // Example correct answer
    }
  });
}

var practice_loop = {
  timeline: practice_trials,
  loop_function: function(data) {
    var correct_trials = jsPsych.data.get().filter({phase: 'practice', correct: true}).count();
    return correct_trials < 3;  // Require 3 correct to move on
  }
};

// Define main game trials
var game_trials = [];
var images = [
  // Example images for each trial
  ['images/image1.jpg', 'images/image2.jpg', 'images/image3.jpg'],
  ['images/image4.jpg', 'images/image5.jpg', 'images/image6.jpg'],
  // Add more sets of images here
];

// Loop through images and define trials
for (var i = 0; i < images.length; i++) {
  game_trials.push({
    type: jsPsychImageButtonResponse,
    stimulus: images[i],
    choices: ['1', '2', '3'],
    prompt: 'Select the "odd one out"',
    data: { phase: 'game' },
    on_finish: function(data) {
      // Example for marking the correct response, adjust per trial
      data.correct = (data.response === 1);  // Example correct answer index
    }
  });
}

// Combine into blocks of 10 trials
var game_timeline = [];
for (var i = 0; i < game_trials.length; i += 10) {
  game_timeline.push({
    timeline: game_trials.slice(i, i + 10),
  });
}

// Define the full experiment timeline
var timeline = [consent_trial, instructions, practice_loop, ...game_timeline];

// Start the experiment
jsPsych.run(timeline);
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

// Define 10 practice trials
var all_practice_trials = [
  {stimulus: ['images/object_images_CC0/asparagus.jpg', 'images/object_images_CC0/avocado.jpg', 'images/object_images_CC0/banner.jpg'], correct: 2},
  {stimulus: ['images/object_images_CC0/blackberry.jpg', 'images/object_images_CC0/comb.jpg', 'images/object_images_CC0/blueberry.jpg'], correct: 1},
  {stimulus: ['images/object_images_CC0/duck.jpg', 'images/object_images_CC0/flower.jpg', 'images/object_images_CC0/duckling.jpg'], correct: 1},
  {stimulus: ['images/object_images_CC0/grate.jpg', 'images/object_images_CC0/antelope.jpg', 'images/object_images_CC0/gazelle.jpg'], correct: 0},
  {stimulus: ['images/object_images_CC0/granite.jpg', 'images/object_images_CC0/gravel.jpg', 'images/object_images_CC0/hat.jpg'], correct: 2},
  {stimulus: ['images/object_images_CC0/leopard.jpg', 'images/object_images_CC0/lion.jpg', 'images/object_images_CC0/magnet.jpg'], correct: 2},
  {stimulus: ['images/object_images_CC0/pheasant.jpg', 'images/object_images_CC0/pen.jpg', 'images/object_images_CC0/pencil.jpg'], correct: 0},
  {stimulus: ['images/object_images_CC0/rack1.jpg', 'images/object_images_CC0/quad.jpg', 'images/object_images_CC0/rack2.jpg'], correct: 1},
  {stimulus: ['images/object_images_CC0/rim.jpg', 'images/object_images_CC0/saw.jpg', 'images/object_images_CC0/reel.jpg'], correct: 1},
  {stimulus: ['images/object_images_CC0/sweater.jpg', 'images/object_images_CC0/sweatsuit.jpg', 'images/object_images_CC0/thermostat.jpg'], correct: 2}
];

// Randomly select 6 practice trials
var selected_practice_trials = jsPsych.randomization.sampleWithoutReplacement(all_practice_trials, 6);

// Define practice trials
var practice_trials = [];
for (var i = 0; i < selected_practice_trials.length; i++) {
  practice_trials.push({
    type: jsPsychImageButtonResponse,
    stimulus: selected_practice_trials[i].stimulus,
    choices: ['1', '2', '3'],
    prompt: 'Select the "odd one out"',
    data: { phase: 'practice' },
    on_finish: function(data) {
      data.correct = (data.response === selected_practice_trials[i].correct);
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

// Randomly generate actual trials from object_images_CC0
var actual_trials = jsPsych.randomization.sampleWithoutReplacement(images, images.length);

// Loop through images and define trials
for (var i = 0; i < actual_trials.length; i++) {
  game_trials.push({
    type: jsPsychImageButtonResponse,
    stimulus: actual_trials[i],
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
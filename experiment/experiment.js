// Initialize jsPsych
var jsPsych = initJsPsych({
  on_finish: function() {
    jsPsych.data.displayData();
  }
});

// Define consent and age check
var consent_trial = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <p>Please enter your age:</p>
    <input type="number" id="age" name="age" min="0" max="100" required>
    <p>Please select your sex:</p>
    <select id="sex" name="sex" required>
      <option value="" disabled selected>Select your option</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="other">Other</option>
      <option value="prefer_not_to_say">Prefer not to say</option>
    </select>
    <p>Please confirm that you consent to participate in this experiment.</p>
    <input type="checkbox" id="consent_checkbox" required> I Consent
    <br><br>
    <button id="custom-submit">Submit</button>
  `,
  choices: [], // Remove built-in buttons
  response_ends_trial: false, // Don't auto-end trial on button click
  on_load: function() {
    document.getElementById('custom-submit').addEventListener('click', function() {
      // Get values before the trial ends
      var ageVal = document.getElementById('age').value;
      var sexVal = document.getElementById('sex').value;
      var consentVal = document.getElementById('consent_checkbox').checked;
      jsPsych.finishTrial({
        age: ageVal,
        sex: sexVal,
        consent: consentVal
      });
    });
  }
};

// Define instructions
var instructions = {
  type: jsPsychHtmlButtonResponse,
  stimulus: '<p>In this experiment, you will see three images in each trial. Select the image that doesn’t belong with the others (the "odd one out").</p>',
  choices: ['Continue']
};

// Page before practice trials
var practice_instructions = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `<p>Now you will begin practice trials. These trials are easy. You must get at least 3 correct responses before you can move on to the actual experiment.</p>`,
  choices: ['Begin Practice']
};

// Define 10 practice trial definitions
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

// Transform practice trial definitions into clickable image trials
var practice_trials = selected_practice_trials.map(function(trial) {
  // Build HTML with three clickable images, each with a unique id
  var html_str = '<div style="display: flex; justify-content: space-around;">';
  trial.stimulus.forEach(function(img_src, idx) {
    html_str += `<img src="${img_src}" id="img_${idx}" style="cursor: pointer; width: 200px; margin:10px;">`;
  });
  html_str += '</div>';

  return {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: html_str,
    choices: "NO_KEYS", // disable keyboard response
    data: { phase: 'practice' }, // mark phase
    on_load: function() {
      // Add click listeners to images
      trial.stimulus.forEach(function(img_src, idx) {
        document.getElementById('img_' + idx).addEventListener('click', function() {
          var trial_data = {
            clicked: idx,
            correct: (idx === trial.correct)
          };
          jsPsych.finishTrial(trial_data);
        });
      });
    }
  };
});

// Practice loop: will keep looping until the user gets at least 3 correct responses
var practice_loop = {
  timeline: practice_trials,
  loop_function: function(data) {
    // Filter practice phase responses
    var practice_data = data.filter({ phase: 'practice' });
    var num_correct = practice_data.filter({ correct: true }).count();
    return num_correct < 3;
  }
};

// Page after practice trials
var post_practice_instructions = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `<p>Great job, you met the practice criterion! Now you'll begin the actual experiment trials.</p>`,
  choices: ['Continue']
};

// Define actual experiment trials:
// Assume we have a folder of images (e.g., images/) and you want to present blocks of 10 trials.
// We use jsPsych.randomization.sampleWithoutReplacement to select 10 images for each block.
var imageFiles = [
  "images/image1.jpg",
  "images/image2.jpg",
  "images/image3.jpg",
  "images/image4.jpg",
  "images/image5.jpg",
  "images/image6.jpg",
  "images/image7.jpg",
  "images/image8.jpg",
  "images/image9.jpg",
  "images/image10.jpg",
  "images/image11.jpg",
  "images/image12.jpg",
  "images/image13.jpg",
  "images/image14.jpg",
  "images/image15.jpg"
];

// Function to generate a block of 10 trials from imageFiles.
function generateGameBlock(blockIndex) {
  // Select 10 images at random
  var selectedImages = jsPsych.randomization.sampleWithoutReplacement(imageFiles, 10);
  var game_trials = [];
  // For each trial, display 3 images (could be split or programmatically paired)
  // Here we assume each trial is built similarly to practice, adjust as needed.
  selectedImages.forEach(function(img_src, idx) {
    // For demonstration, let's display the same image in all 3 slots except one slot gets a different image.
    var oddIdx = Math.floor(Math.random()*3);
    var slotImages = [img_src, img_src, img_src];
    // For the "odd" image, choose another random image (not equal to img_src)
    var alternatives = imageFiles.filter(function(file) { return file !== img_src; });
    slotImages[oddIdx] = jsPsych.randomization.sampleWithoutReplacement(alternatives, 1)[0];
    
    var html_str = '<div style="display: flex; justify-content: space-around;">';
    slotImages.forEach(function(src, jdx) {
      html_str += `<img src="${src}" id="game_img_${blockIndex}_${idx}_${jdx}" style="cursor: pointer; width: 200px; margin:10px;">`;
    });
    html_str += '</div>';

    game_trials.push({
      type: jsPsychHtmlKeyboardResponse,
      stimulus: html_str,
      choices: "NO_KEYS",
      data: { phase: 'game' },
      on_load: function() {
        slotImages.forEach(function(src, jdx) {
          document.getElementById(`game_img_${blockIndex}_${idx}_${jdx}`).addEventListener('click', function() {
            var trial_data = {
              clicked: jdx,
              correct: (jdx === oddIdx)
            };
            jsPsych.finishTrial(trial_data);
          });
        });
      }
    });
  });
  return game_trials;
}

// Page after each game block asking if they want to continue
var continue_page = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `<p>You have completed a block of 10 trials. Do you want to continue?</p>`,
  choices: ['Continue']
};

// Build overall timeline
var timeline = [];
timeline.push(consent_trial);
timeline.push(instructions);
timeline.push(practice_instructions);
timeline.push(practice_loop);
timeline.push(post_practice_instructions);

// For demonstration, we'll schedule two blocks of game trials.
// For additional blocks, you can repeat these steps.
for (let blockIndex = 0; blockIndex < 2; blockIndex++) {
  // Push a block of 10 game trials
  timeline.push({
    timeline: generateGameBlock(blockIndex)
  });
  // After each block, ask if they want to continue, except after the final block if desired.
  timeline.push(continue_page);
}

// Start the experiment
jsPsych.run(timeline);
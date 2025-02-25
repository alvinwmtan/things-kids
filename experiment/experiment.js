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
    <h2>How old are you?:</h2>
    <div id="age-buttons">
      <button class="age-option" data-age="2">2</button>
      <button class="age-option" data-age="3">3</button>
      <button class="age-option" data-age="4">4</button>
      <button class="age-option" data-age="5">5</button>
      <button class="age-option" data-age="6">6</button>
      <button class="age-option" data-age="7">7</button>
      <button class="age-option" data-age="8">8</button>
      <button class="age-option" data-age="9">9</button>
      <button class="age-option" data-age="10+">10+</button>
      <button class="age-option" data-age="Adult">Adult</button>
    </div>
    <br>
    <h2>Please select your sex:</h2>
    <div id="sex-buttons">
      <button class="sex-option" data-sex="male">Male</button>
      <button class="sex-option" data-sex="female">Female</button>
      <button class="sex-option" data-sex="other">Other</button>
      <button class="sex-option" data-sex="prefer_not_to_say">Prefer not to say</button>
    </div>
    <br>
    <h2>Can we save your guesses?</h2>
    <div id="save-box">
      <input type="checkbox" id="save-guesses-check">
      <label for="save-guesses-check">Yes, save my guesses</label>
    </div>
    <br>
    <p style="font-size:14px;">
      By proceeding, you and your child agree to participate in this research.
      Your child will be asked to categorize common objects on this tablet.
      No audio/video taping will occur and no identifiable information will be collected.
      Your child's participation will take approximately 30 seconds – 5 minutes, depending on how long they choose to participate.
      The categorization data collected here will be used for research purposes by the Stanford Language and Cognition Lab and the San Jose Children's Discovery Museum,
      and will be displayed on the Museum's website at a future date.
      There are no risks or benefits to participating: no identifying information will be collected,
      so you and your child's identity will remain anonymous.
      Your child can stop drawing at any time or choose not to answer any question without penalty.
      For more information, email the Stanford lab at langcoglab@stanford.edu, or call 650-721-9270.
      If you are not satisfied with how this study is being conducted, or if you have any concerns, complaints, or general questions about the research or your rights as a participant,
      please contact the Stanford Institutional Review Board (IRB) at (650)-723-2480 or toll free at 1-866-680-2906.
      You can also write to the Stanford IRB, Stanford University, 3000 El Camino Real, Five Palo Alto Square, 4th Floor, Palo Alto, CA 94306.
    </p>
    <br>
    <button id="consent-submit">Submit</button>
  `,
  choices: [], // We'll handle submission manually.
  response_ends_trial: false,
  on_load: function() {
    var selectedAge = null;
    var selectedSex = null;
    var saveGuesses = "no"; // default when checkbox unchecked

    // Set up age option buttons
    var ageButtons = document.querySelectorAll('.age-option');
    ageButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        // Clear previous visuals for age options.
        ageButtons.forEach(btn => btn.style.backgroundColor = '');
        button.style.backgroundColor = 'lightblue';
        selectedAge = button.getAttribute('data-age');
      });
    });

    // Set up sex option buttons
    var sexButtons = document.querySelectorAll('.sex-option');
    sexButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        // Clear previous visuals for sex options.
        sexButtons.forEach(btn => btn.style.backgroundColor = '');
        button.style.backgroundColor = 'lightblue';
        selectedSex = button.getAttribute('data-sex');
      });
    });
    
    // Set up checkbox for saving guesses
    var saveCheckbox = document.getElementById('save-guesses-check');
    saveCheckbox.addEventListener('change', function() {
      if (this.checked) {
        saveGuesses = "yes";
      } else {
        saveGuesses = "no";
      }
    });

    // Handle submission.
    document.getElementById('consent-submit').addEventListener('click', function() {
      if (selectedAge === null || selectedSex === null) {
        alert("Please select your child's age and sex.");
      } else {
        jsPsych.finishTrial({
          age: selectedAge,
          sex: selectedSex,
          save_guesses: saveGuesses
        });
      }
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
  stimulus: `<p>Let's start with some practice trials! These are designed to help you get used to the task, so once you get 3 correct you can move on to the experiment.</p>`,
  choices: ['Begin Practice']
};

// Define 10 practice trial definitions
var all_practice_trials = [
  {stimulus: ['images/common_items/fork.jpg', 'images/common_items/knife.jpg', 'images/common_items/chocolate.jpg'], correct: 2},
  {stimulus: ['images/common_items/alligator.jpg', 'images/common_items/gondola.jpg', 'images/common_items/cat.jpg'], correct: 1},
  {stimulus: ['images/common_items/fork.jpg', 'images/common_items/knife.jpg', 'images/common_items/snow.jpg'], correct: 2},
  {stimulus: ['images/common_items/pie.jpg', 'images/common_items/dog.jpg', 'images/common_items/cat.jpg'], correct: 0},
  {stimulus: ['images/common_items/cat.jpg', 'images/common_items/alligator.jpg', 'images/common_items/bench.jpg'], correct: 2},
  {stimulus: ['images/common_items/leg.jpg', 'images/common_items/orange.jpg', 'images/common_items/apple.jpg'], correct: 0},
  {stimulus: ['images/common_items/dog.jpg', 'images/common_items/pistachio.jpg', 'images/common_items/elephant.jpg'], correct: 1},
  {stimulus: ['images/common_items/dog.jpg', 'images/common_items/cat.jpg', 'images/common_items/teapot.jpg'], correct: 2},
  {stimulus: ['images/common_items/cat.jpg', 'images/common_items/elephant.jpg', 'images/common_items/pancake.jpg'], correct: 2},
  {stimulus: ['images/common_items/turtle.jpg', 'images/common_items/apple.jpg', 'images/common_items/banana.jpg'], correct: 0},
];

var easy_practice_trials = [
  {stimulus: ['images/common_items/cat1.jpg', 'images/common_items/dog.jpg', 'images/common_items/pie.jpg'], correct: 2},
  {stimulus: ['images/common_items/chicken1.jpg', 'images/common_items/chocolate.jpg', 'images/common_items/chicken2.jpg'], correct: 1},
  {stimulus: ['images/common_items/eye.jpg', 'images/common_items/cookie1.jpg', 'images/common_items/cookie2.jpg'], correct: 0},
  {stimulus: ['images/common_items/apple1.jpg', 'images/common_items/apple2.jpg', 'images/common_items/bathtub.jpg'], correct: 2},
]

var medium_practice_trials = [
  {stimulus: ['images/common_items/cat1.jpg', 'images/common_items/dog.jpg', 'images/common_items/pie.jpg'], correct: 2},
  {stimulus: ['images/common_items/apple1.jpg', 'images/common_items/leg.jpg', 'images/common_items/orange.jpg'], correct: 1},
  {stimulus: ['images/common_items/ear.jpg', 'images/common_items/cow.jpg', 'images/common_items/deer.jpg'], correct: 0},
  {stimulus: ['images/common_items/horse.jpg', 'images/common_items/donkey.jpg', 'images/common_items/eye.jpg'], correct: 2},
  {stimulus: ['images/common_items/yogurt.jpg', 'images/common_items/tiger.jpg', 'images/common_items/soup.jpg'], correct: 1},
  {stimulus: ['images/common_items/ski.jpg', 'images/common_items/strawberry.jpg', 'images/common_items/watermelon.jpg'], correct: 0},
]

// Sample 2 easy and 4 medium practice trials.
var selected_easy = jsPsych.randomization.sampleWithoutReplacement(easy_practice_trials, 2);
var selected_medium = jsPsych.randomization.sampleWithoutReplacement(medium_practice_trials, 4);
var selected_practice_trials = selected_easy.concat(selected_medium);
selected_practice_trials = jsPsych.randomization.shuffle(selected_practice_trials);

// Global counter for correct practice responses
var practice_correct_count = 0;

// Transform practice trial definitions into clickable image trials (triangle layout)
var practice_trials = selected_practice_trials.map(function(trial, trialIndex) {
  // Build HTML: instruction text then images arranged as a triangle.
  var html_str = '<p style="text-align: center; font-weight: bold; font-size: 1.2em;">Click the odd one out</p>';
  html_str += '<div style="text-align:center;">';
  // Top row: first image
  html_str += `<div><img src="${trial.stimulus[0]}" id="practice_img_${trialIndex}_0" style="cursor:pointer; width:200px; margin:10px;"></div>`;
  // Bottom row: second and third images
  html_str += '<div>';
  html_str += `<img src="${trial.stimulus[1]}" id="practice_img_${trialIndex}_1" style="cursor:pointer; width:200px; margin:10px;">`;
  html_str += `<img src="${trial.stimulus[2]}" id="practice_img_${trialIndex}_2" style="cursor:pointer; width:200px; margin:10px;">`;
  html_str += '</div></div>';

  return {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: html_str,
    choices: "NO_KEYS", // disable default keyboard responses
    data: { phase: 'practice' },
    on_load: function() {
      // Attach click listeners to images
      trial.stimulus.forEach(function(_, idx) {
        document.getElementById(`practice_img_${trialIndex}_${idx}`).addEventListener('click', function() {
          var correct = (idx === trial.correct);
          // Update global counter if correct
          if (correct) {
            practice_correct_count++;
          }
          // Finish trial and record data.
          jsPsych.finishTrial({
            clicked: idx,
            correct: correct
          });
        });
      });
    }
  };
});

// Transform each selected practice trial into a conditional timeline node (triangle layout)
var conditional_practice_nodes = selected_practice_trials.map(function(trial, trialIndex) {
  // Build HTML: add instruction text then arrange images in a triangle.
  var html_str = '<p style="text-align: center; font-weight: bold; font-size: 1.2em;">Click the odd one out</p>';
  html_str += '<div style="text-align:center;">';
  // Top row: first image.
  html_str += `<div><img src="${trial.stimulus[0]}" id="practice_img_${trialIndex}_0" style="cursor: pointer; width:200px; margin:10px;"></div>`;
  // Bottom row: second and third images.
  html_str += '<div>';
  html_str += `<img src="${trial.stimulus[1]}" id="practice_img_${trialIndex}_1" style="cursor: pointer; width:200px; margin:10px;">`;
  html_str += `<img src="${trial.stimulus[2]}" id="practice_img_${trialIndex}_2" style="cursor: pointer; width:200px; margin:10px;">`;
  html_str += '</div></div>';

  // Create the single practice trial node
  var practiceNode = {
    timeline: [{
      type: jsPsychHtmlKeyboardResponse,
      stimulus: html_str,
      choices: "NO_KEYS", // disable default keyboard responses
      data: { phase: 'practice' },
      on_load: function() {
        // Attach click listeners to each image in the triangle layout.
        // Iterate over 0,1,2 for the three images
        [0,1,2].forEach(function(idx) {
          document.getElementById(`practice_img_${trialIndex}_${idx}`).addEventListener('click', function() {
            var correct = (idx === trial.correct);
            if (correct) {
              practice_correct_count++;
            }
            jsPsych.finishTrial({
              clicked: idx,
              correct: correct
            });
          });
        });
      }
    }],
    // Run this node only if fewer than 3 correct practice responses have been recorded.
    conditional_function: function() {
      return practice_correct_count < 3;
    }
  };
  return practiceNode;
});

// Practice loop: will keep looping until the user gets at least 3 correct responses
var practice_loop = {
  timeline: conditional_practice_nodes,
  loop_function: function(data) {
    // Filter practice phase responses
    var practice_data = data.filter({ phase: 'practice' });
    var num_correct = practice_data.filter({ correct: true }).count();
    console.log("Correct practice trials: " + num_correct);
    return num_correct < 3;
  }
};

// Page after practice trials
var post_practice_instructions = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `<p>Great job, you passed the practice trials! Now let's begin the actual experiment.</p>`,
  choices: ['Continue']
};

var continue_page = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<p>You have completed a block of trials. Do you want to continue?</p>`,
    choices: ['Continue']
};

// Fetch the image file list from your JSON file.
fetch('image_files.json')
  .then(response => response.json())
  .then(data => {
    // data now holds your array of image file paths.
    var imageFiles = data;
    
    // (Keep your existing practice/trials code unchanged.)
    // For example, your generateGameBlock function will now use the
    // imageFiles variable loaded from JSON.
    function generateGameBlock(blockIndex) {
      var game_trials = [];
      for (let trialIndex = 0; trialIndex < 10; trialIndex++) {
        // Select 3 random images without replacement from the JSON list.
        var trial_images = jsPsych.randomization.sampleWithoutReplacement(imageFiles, 3);
        
        // Build HTML to display the 3 images in a triangle.
        var html_str = '<p style="text-align: center; font-weight: bold; font-size: 1.2em;">Click the odd one out</p>';
        html_str += '<div style="text-align:center;">';
        // Top row: first image.
        html_str += `<div><img src="${trial_images[0]}" id="game_img_${blockIndex}_${trialIndex}_0" style="cursor: pointer; width: 200px; margin:10px;"></div>`;
        // Bottom row: second and third images.
        html_str += '<div>';
        html_str += `<img src="${trial_images[1]}" id="game_img_${blockIndex}_${trialIndex}_1" style="cursor: pointer; width: 200px; margin:10px;">`;
        html_str += `<img src="${trial_images[2]}" id="game_img_${blockIndex}_${trialIndex}_2" style="cursor: pointer; width: 200px; margin:10px;">`;
        html_str += '</div></div>';
        
        game_trials.push({
          type: jsPsychHtmlKeyboardResponse,
          stimulus: html_str,
          choices: "NO_KEYS",
          data: { phase: 'game', block: blockIndex, trial: trialIndex, stimuli: trial_images },
          on_load: function() {
            var startTime = performance.now();
            trial_images.forEach(function(src, jdx) {
              document.getElementById(`game_img_${blockIndex}_${trialIndex}_${jdx}`).addEventListener('click', function() {
                var rt = performance.now() - startTime;
                jsPsych.finishTrial({
                  block: blockIndex,
                  trial: trialIndex,
                  stimuli: trial_images,
                  choice: jdx,
                  rt: rt
                });
              });
            });
          }
        });
      }
      return game_trials;
    }
    
    // Build your overall timeline as before.
    var timeline = [];
    timeline.push(consent_trial);
    timeline.push(instructions);
    timeline.push(practice_instructions);
    timeline.push(practice_loop);
    timeline.push(post_practice_instructions);
    
    // For demonstration, schedule two blocks of game trials.
    for (let blockIndex = 0; blockIndex < 2; blockIndex++) {
      // Push a block of 10 game trials
      timeline.push({
        timeline: generateGameBlock(blockIndex)
      });
      // After each block, ask if they want to continue.
      timeline.push(continue_page);
    }
    
    // Start the experiment.
    jsPsych.run(timeline);

  })
  .catch(error => console.error('Error loading image files:', error));
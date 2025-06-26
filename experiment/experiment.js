const onserver = false;
let ppt_id = 'P' + Date.now();

// Initialize jsPsych
const jsPsych = initJsPsych({
  override_safe_mode: true,
  on_finish: function() {
    if (!onserver) {
      jsPsych.data.get().localSave('csv', "tk_" + ppt_id + ".csv");
    }
    jsPsych.data.displayData();
  },
  on_close: function() {
    if (!onserver) {
      jsPsych.data.get().localSave('csv', "tk_" + ppt_id + ".csv");
    }
  }
});

jsPsych.data.addProperties({ ppt_id: ppt_id });

// Data caching function
function cacheAndLogData(data) {
  if (!window.experimentData) {
    window.experimentData = [];
  }
  window.experimentData.push(data);
  
  if (onserver) {
    logData(data);
  } else {
    console.log('Trial data:', data);
  }
}

// Define consent and age check
const consent_trial = {
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
    <p style="font-size:14px; line-height:1.2;">
      By proceeding, you and your child agree to participate in this research.
      Your child will be asked to categorize common objects on this tablet.
      No audio/video taping will occur and no identifiable information will be collected.
      Your child's participation will take approximately 30 seconds – 5 minutes, depending on how long they choose to participate.
      The data collected here will be used for research purposes by the Stanford Language and Cognition Lab and the San Jose Children's Discovery Museum,
      and may be displayed on the Museum's website at a future date.
      There are no risks or benefits to participating: no identifying information will be collected,
      so you and your child's identity will remain anonymous.
      Your child can stop participating at any time or choose not to answer any question without penalty.
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
    let selectedAge = null;
    let selectedSex = null;
    let saveGuesses = "no"; // default when checkbox unchecked

    // Set up age option buttons
    const ageButtons = document.querySelectorAll('.age-option');
    ageButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        // Clear previous visuals for age options.
        ageButtons.forEach(btn => btn.style.backgroundColor = '');
        button.style.backgroundColor = 'lightblue';
        selectedAge = button.getAttribute('data-age');
      });
    });

    // Set up sex option buttons
    const sexButtons = document.querySelectorAll('.sex-option');
    sexButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        // Clear previous visuals for sex options.
        sexButtons.forEach(btn => btn.style.backgroundColor = '');
        button.style.backgroundColor = 'lightblue';
        selectedSex = button.getAttribute('data-sex');
      });
    });
    
    // Set up checkbox for saving guesses
    const saveCheckbox = document.getElementById('save-guesses-check');
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
        const data = {
          age: selectedAge,
          sex: selectedSex,
          save_guesses: saveGuesses
        };
        cacheAndLogData(data);
        jsPsych.finishTrial(data);
      }
    });
  }
};

// Define instructions
const instructions = {
  type: jsPsychHtmlButtonResponse,
  stimulus: '<p>In this experiment, you will see three images in each trial. Select the image that doesn\'t belong with the others (the "odd one out").</p>',
  choices: ['Continue']
};

// Page before practice trials
const practice_instructions = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `<p>Let's start with some practice trials! These are designed to help you get used to the task, so once you get 3 correct you can move on to the experiment.</p>`,
  choices: ['Begin Practice']
};

// Define practice trials
const easy_practice_trials = [
  {stimulus: ['images/cat_01b.jpg', 'images/cat_05s.jpg', 'images/pie.jpg'], correct: 2},
  {stimulus: ['images/chicken2_02s.jpg', 'images/chocolate.jpg', 'images/chicken2_03s.jpg'], correct: 1},
  {stimulus: ['images/eye.jpg', 'images/cookie_08s.jpg', 'images/cookie_09s.jpg'], correct: 0},
  {stimulus: ['images/apple_06s.jpg', 'images/apple_10s.jpg', 'images/bathtub.jpg'], correct: 2}
];

const medium_practice_trials = [
  {stimulus: ['images/cat_05s.jpg', 'images/dog_02s.jpg', 'images/pie.jpg'], correct: 2},
  {stimulus: ['images/apple_10s.jpg', 'images/leg.jpg', 'images/orange.jpg'], correct: 1},
  {stimulus: ['images/ear.jpg', 'images/cow.jpg', 'images/deer.jpg'], correct: 0},
  {stimulus: ['images/horse.jpg', 'images/donkey.jpg', 'images/eye.jpg'], correct: 2},
  {stimulus: ['images/yogurt.jpg', 'images/tiger.jpg', 'images/soup.jpg'], correct: 1},
  {stimulus: ['images/ski.jpg', 'images/strawberry.jpg', 'images/watermelon.jpg'], correct: 0}
];

// Sample 2 easy and 4 medium practice trials.
const selected_easy = jsPsych.randomization.sampleWithoutReplacement(easy_practice_trials, 2);
const selected_medium = jsPsych.randomization.sampleWithoutReplacement(medium_practice_trials, 4);
let selected_practice_trials = selected_easy.concat(selected_medium);
selected_practice_trials = jsPsych.randomization.shuffle(selected_practice_trials);

// Global counter for correct practice responses
let practice_correct_count = 0;

// Transform each selected practice trial into a conditional timeline node
const conditional_practice_nodes = selected_practice_trials.map(function(trial, trialIndex) {
  
  // Create the single practice trial node
  const practiceNode = {
    timeline: [{
      type: jsPsychHtmlButtonResponse,
      stimulus: `<p style="text-align: center; font-weight: bold; font-size: 1.2em;">Which one is not like the others?</p>`,
      choices: trial.stimulus,
      button_html: [
        `<img src="${trial.stimulus[0]}" style="cursor:pointer; width:200px; margin:10px;">`,
        `<img src="${trial.stimulus[1]}" style="cursor:pointer; width:200px; margin:10px;">`,
        `<img src="${trial.stimulus[2]}" style="cursor:pointer; width:200px; margin:10px;">`
      ],
      css_classes: ['triangle-layout'],
      data: { 
        phase: 'practice',
        block: 0,
        trial: trialIndex,
        stimuli: trial.stimulus,
        correct_answer: trial.correct
      },
      on_finish: function(data) {
        const correct = (data.response === trial.correct);
        if (correct) {
          practice_correct_count++;
        }
        
        const trialData = {
          ...data,
          correct: correct
        };
        cacheAndLogData(trialData);
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
const practice_loop = {
  timeline: conditional_practice_nodes,
  loop_function: function(data) {
    console.log("Correct practice trials: " + practice_correct_count);
    return practice_correct_count < 3;
  }
};

// Page after practice trials
const post_practice_instructions = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `<p>Great job, you passed the practice trials! Now let's begin the actual experiment.</p>`,
  choices: ['Continue']
};

let current_block_index = 1;

const game_trial_template = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `<p style="text-align: center; font-weight: bold; font-size: 1.2em;">Which one is not like the others?</p>`,
  choices: [0, 1, 2], // placeholder, will be replaced in on_start
  button_html: [],     // placeholder, will be replaced in on_start
  css_classes: ['triangle-layout'],
  data: { 
    phase: 'game',
  },
  on_start: function(trial) {
    // Randomly select 3 images for this trial
    const trial_images = jsPsych.randomization.sampleWithoutReplacement(imageFiles, 3);
    trial.choices = trial_images;
    trial.button_html = [
      `<img src="${trial_images[0]}" style="cursor:pointer; width:200px; margin:10px;">`,
      `<img src="${trial_images[1]}" style="cursor:pointer; width:200px; margin:10px;">`,
      `<img src="${trial_images[2]}" style="cursor:pointer; width:200px; margin:10px;">`
    ];
    trial.data.stimuli = trial_images;
    trial.data.block = current_block_index;
  },
  on_finish: function(data) {
    cacheAndLogData(data);
  }
};

const NUM_TRIALS_PER_BLOCK = 10;
const game_block = [];
for (let i = 0; i < NUM_TRIALS_PER_BLOCK; i++) {
  game_block.push({ ...game_trial_template }); // shallow copy is fine
}

const continue_page = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `<p>Great job! Do you want to look at some more pictures?</p>`,
  choices: ['Continue', 'No, I\'m done'],
  data: {
    phase: 'continue_decision'
  },
  on_finish: function(data) {
    cacheAndLogData(data);
  }
};

// Build your overall timeline as before.
let timeline = [];
let testing = false;
if (!testing) {
  timeline.push(consent_trial);
  timeline.push(instructions);
  timeline.push(practice_instructions);
  timeline.push(practice_loop);
  timeline.push(post_practice_instructions);
}

const game_loop = {
  timeline: [
    ...game_block,
    continue_page
  ],
  loop_function: function(data) {
    current_block_index++;
    const trials = data.values ? data.values() : data.trials;
    const last_trial = trials[trials.length - 1];
    // End if "No, I'm done" (button index 1) is pressed
    return !(last_trial.phase === 'continue_decision' && last_trial.response === 1);
  }
};

timeline.push(game_loop);

// Start the experiment.
jsPsych.run(timeline);

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

// Randomly select 6 practice trials
var selected_practice_trials = jsPsych.randomization.sampleWithoutReplacement(all_practice_trials, 6);

// Global counter for correct practice responses
var practice_correct_count = 0;

// Transform each selected practice trial into a conditional timeline node
var conditional_practice_nodes = selected_practice_trials.map(function(trial, trialIndex) {
  // Build HTML with three clickable images (each gets a unique id using trialIndex and image index)
  var html_str = '<div style="display: flex; justify-content: space-around;">';
  trial.stimulus.forEach(function(img_src, idx) {
    html_str += `<img src="${img_src}" id="practice_img_${trialIndex}_${idx}" style="cursor: pointer; width: 200px; margin:10px;">`;
  });
  html_str += '</div>';

  // Create the single practice trial node
  var practiceNode = {
    timeline: [{
      type: jsPsychHtmlKeyboardResponse,
      stimulus: html_str,
      choices: "NO_KEYS", // disable default keyboard responses
      data: { phase: 'practice' },
      on_load: function() {
        // Attach click listeners to each image
        trial.stimulus.forEach(function(_, idx) {
          document.getElementById(`practice_img_${trialIndex}_${idx}`).addEventListener('click', function() {
            var correct = (idx === trial.correct);
            // Update global counter if correct
            if (correct) {
              practice_correct_count++;
            }
            // Finish the trial and record data
            jsPsych.finishTrial({
              clicked: idx,
              correct: correct
            });
          });
        });
      }
    }],
    // Run this node only if fewer than 3 correct trials have been recorded.
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

// Define actual experiment trials:
// Assume we have a folder of images (e.g., images/) and you want to present blocks of 10 trials.
// We use jsPsych.randomization.sampleWithoutReplacement to select 10 images for each block.
var imageFiles = ["images/common_items/acorn.jpg", "images/common_items/airplane.jpg","images/common_items/alligator.jpg","images/common_items/aloe.jpg","images/common_items/ankle.jpg","images/common_items/ant.jpg","images/common_items/antenna.jpg","images/common_items/apple.jpg","images/common_items/applesauce.jpg","images/common_items/arm.jpg","images/common_items/artichoke.jpg","images/common_items/baby.jpg","images/common_items/ball.jpg","images/common_items/balloon.jpg","images/common_items/bamboo.jpg","images/common_items/banana.jpg","images/common_items/barrel.jpg","images/common_items/basket.jpg","images/common_items/bat1.jpg","images/common_items/bathtub.jpg","images/common_items/bear.jpg","images/common_items/bed.jpg","images/common_items/bee.jpg","images/common_items/belt.jpg","images/common_items/bench.jpg","images/common_items/bib.jpg","images/common_items/bird.jpg","images/common_items/blanket.jpg","images/common_items/blender.jpg","images/common_items/block.jpg","images/common_items/blower.jpg","images/common_items/boat.jpg","images/common_items/bobsled.jpg","images/common_items/book.jpg","images/common_items/bottle.jpg","images/common_items/bouquet.jpg","images/common_items/bowl.jpg","images/common_items/box.jpg","images/common_items/boy.jpg","images/common_items/bread.jpg","images/common_items/breakfast.jpg","images/common_items/broom.jpg","images/common_items/brush.jpg","images/common_items/bucket.jpg","images/common_items/buffet.jpg","images/common_items/bug.jpg","images/common_items/bulldozer.jpg","images/common_items/bus.jpg","images/common_items/butter.jpg","images/common_items/butterfly.jpg","images/common_items/button1.jpg","images/common_items/cake.jpg","images/common_items/camera1.jpg","images/common_items/can.jpg","images/common_items/candlestick.jpg","images/common_items/candy.jpg","images/common_items/car.jpg","images/common_items/caramel.jpg","images/common_items/carousel.jpg","images/common_items/carrot.jpg","images/common_items/cassette.jpg","images/common_items/cat.jpg","images/common_items/cereal.jpg","images/common_items/chair.jpg","images/common_items/chalk.jpg","images/common_items/cheese.jpg","images/common_items/chicken2.jpg","images/common_items/chin.jpg","images/common_items/chocolate.jpg","images/common_items/cloak.jpg","images/common_items/clock.jpg","images/common_items/closet.jpg","images/common_items/clothespin.jpg","images/common_items/cloud.jpg","images/common_items/coaster.jpg","images/common_items/coat.jpg","images/common_items/coffee.jpg","images/common_items/comb.jpg","images/common_items/cookie.jpg","images/common_items/cork.jpg","images/common_items/corn.jpg","images/common_items/cornbread.jpg","images/common_items/corset.jpg","images/common_items/couch.jpg","images/common_items/cow.jpg","images/common_items/cracker.jpg","images/common_items/crayon.jpg","images/common_items/crib.jpg","images/common_items/cup.jpg","images/common_items/cymbal.jpg","images/common_items/deer.jpg","images/common_items/diaper.jpg","images/common_items/dish.jpg","images/common_items/dog.jpg","images/common_items/doll.jpg","images/common_items/donkey.jpg","images/common_items/donut.jpg","images/common_items/door.jpg","images/common_items/drawer.jpg","images/common_items/dress.jpg","images/common_items/drink.jpg","images/common_items/dryer.jpg","images/common_items/duck.jpg","images/common_items/dumpling.jpg","images/common_items/ear.jpg","images/common_items/egg.jpg","images/common_items/elbow.jpg","images/common_items/elephant.jpg","images/common_items/eye.jpg","images/common_items/face.jpg","images/common_items/fan.jpg","images/common_items/finger.jpg","images/common_items/firetruck.jpg","images/common_items/fish.jpg","images/common_items/flag.jpg","images/common_items/flan.jpg","images/common_items/flower.jpg","images/common_items/foam.jpg","images/common_items/foot.jpg","images/common_items/footbath.jpg","images/common_items/fork.jpg","images/common_items/fox.jpg","images/common_items/freezer.jpg","images/common_items/french_fries.jpg","images/common_items/frog.jpg","images/common_items/fruitcake.jpg","images/common_items/game.jpg","images/common_items/garbage.jpg","images/common_items/giraffe.jpg","images/common_items/girl.jpg","images/common_items/glass.jpg","images/common_items/glasses.jpg","images/common_items/glue.jpg","images/common_items/gondola.jpg","images/common_items/goose.jpg","images/common_items/grass.jpg","images/common_items/grate.jpg","images/common_items/green_beans.jpg","images/common_items/gum.jpg","images/common_items/gutter.jpg","images/common_items/hair.jpg","images/common_items/hamburger.jpg","images/common_items/hammer.jpg","images/common_items/hamster.jpg","images/common_items/hand.jpg","images/common_items/hat.jpg","images/common_items/headdress.jpg","images/common_items/hedgehog.jpg","images/common_items/helicopter.jpg","images/common_items/hoe.jpg","images/common_items/hopscotch.jpg","images/common_items/horn.jpg","images/common_items/horse.jpg","images/common_items/ice_cream.jpg","images/common_items/ice.jpg","images/common_items/jacket.jpg","images/common_items/jar.jpg","images/common_items/jeans.jpg","images/common_items/juice.jpg","images/common_items/kimono.jpg","images/common_items/kitten.jpg","images/common_items/knee.jpg","images/common_items/knife.jpg","images/common_items/koala.jpg","images/common_items/ladder.jpg","images/common_items/lamb.jpg","images/common_items/lamp.jpg","images/common_items/latch.jpg","images/common_items/leg.jpg","images/common_items/lion.jpg","images/common_items/locker.jpg","images/common_items/lollipop.jpg","images/common_items/man.jpg","images/common_items/mandolin.jpg","images/common_items/map.jpg","images/common_items/marshmallow.jpg","images/common_items/meat.jpg","images/common_items/melon.jpg","images/common_items/milk.jpg","images/common_items/milkshake.jpg","images/common_items/money.jpg","images/common_items/monkey.jpg","images/common_items/moose.jpg","images/common_items/mop.jpg","images/common_items/motorcycle.jpg","images/common_items/mouse1.jpg","images/common_items/mouth.jpg","images/common_items/muffin.jpg","images/common_items/mulch.jpg","images/common_items/nail.jpg","images/common_items/napkin.jpg","images/common_items/necklace.jpg","images/common_items/net.jpg","images/common_items/nose.jpg","images/common_items/oatmeal.jpg","images/common_items/oil.jpg","images/common_items/omelet.jpg","images/common_items/orange.jpg","images/common_items/otter.jpg","images/common_items/oven.jpg","images/common_items/owl.jpg","images/common_items/paint.jpg","images/common_items/pajamas.jpg","images/common_items/pancake.jpg","images/common_items/pants.jpg","images/common_items/paper.jpg","images/common_items/parsley.jpg","images/common_items/peanut_butter.jpg","images/common_items/pen.jpg","images/common_items/pencil.jpg","images/common_items/penguin.jpg","images/common_items/pickle.jpg","images/common_items/pie.jpg","images/common_items/pig.jpg","images/common_items/pillow.jpg","images/common_items/pistachio.jpg","images/common_items/pitcher.jpg","images/common_items/pizza.jpg","images/common_items/plant.jpg","images/common_items/plate.jpg","images/common_items/pony.jpg","images/common_items/popcorn.jpg","images/common_items/popsicle.jpg","images/common_items/potato.jpg","images/common_items/pretzel.jpg","images/common_items/prism.jpg","images/common_items/prune.jpg","images/common_items/pudding.jpg","images/common_items/puddle.jpg","images/common_items/pump.jpg","images/common_items/pumpkin.jpg","images/common_items/puppy.jpg","images/common_items/purse.jpg","images/common_items/zebra.jpg","images/common_items/zipper.jpg"];

// Function to generate a block of 10 trials from imageFiles.
// Each trial now displays 3 distinct random images.
// Additional data (block, trial, rt, stimuli, choice) is recorded for every trial.
function generateGameBlock(blockIndex) {
  var game_trials = [];
  for (let trialIndex = 0; trialIndex < 10; trialIndex++) {
    // Select 3 random images without replacement for the trial.
    var trial_images = jsPsych.randomization.sampleWithoutReplacement(imageFiles, 3);
    
    // Build HTML to display the 3 images.
    var html_str = '<div style="display: flex; justify-content: space-around;">';
    trial_images.forEach(function(src, jdx) {
      html_str += `<img src="${src}" id="game_img_${blockIndex}_${trialIndex}_${jdx}" style="cursor: pointer; width: 200px; margin:10px;">`;
    });
    html_str += '</div>';
    
    // Create the trial
    game_trials.push({
      type: jsPsychHtmlKeyboardResponse,
      stimulus: html_str,
      choices: "NO_KEYS", // Disable default keyboard responses
      // Pre-set data for the trial; note that stimuli (the order) is included.
      data: { phase: 'game', block: blockIndex, trial: trialIndex, stimuli: trial_images },
      on_load: function() {
        // Record the start time of the trial.
        var startTime = performance.now();
        // Attach click listeners to each image
        trial_images.forEach(function(src, jdx) {
          document.getElementById(`game_img_${blockIndex}_${trialIndex}_${jdx}`).addEventListener('click', function() {
            // Reaction time calculation
            var rt = performance.now() - startTime;
            // Record the choice and additional data, then finish the trial.
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
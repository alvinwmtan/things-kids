const mongoose = require('mongoose')

const db_schema = new mongoose.Schema({
    phase: String,
    block: Number,
    trial_type: String,
    trial_index: Number,
    internal_node_id: Number,
    stimulus: String,
    stimuli: [String],
    correct: Boolean,
    correct_answer: Number,
    response: Number,
    rt: Number,
    time_elapsed: Number,
});

// const db = mongoose.model('db', db_schema);
const emptySchema = new mongoose.Schema({}, { strict: false });
const Entry = mongoose.model('Entry', emptySchema, 'things-kids');
module.exports = Entry;
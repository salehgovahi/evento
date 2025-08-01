const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({}, { strict: false });

// Creating indexes for course_id, chapter_id, and unit_id
userSchema.index({
    'courses.course_id': 1,
    'courses.chapters.chapter_id': 1,
    'courses.chapters.units.unit_id': 1
});

module.exports = mongoose.model('User', userSchema);

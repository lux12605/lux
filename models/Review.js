const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  periodStart: Date,
  periodEnd: Date,
  rating: { type: Number, min: 1, max: 5 },
  goals: [{ title: String, progress: { type: Number, min:0, max:100 }, notes: String }],
  strengths: String,
  improvements: String,
  overallComments: String,
  status: { type: String, enum: ['draft','submitted','finalized'], default: 'draft' }
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);

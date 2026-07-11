// ScanResult.js
// Blueprint for storing scan results in MongoDB

const mongoose = require('mongoose');

const ScanResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    type: {
      type: String,
      enum: ['text', 'email', 'url', 'phone'],
      required: true,
    },
    inputContent: { type: String, required: true },
    language: { type: String, default: 'English' },
    riskLevel: {
      type: String,
      enum: ['HIGH', 'MEDIUM', 'LOW'],
      required: true,
    },
    scamScore: { type: Number, min: 0, max: 100 },
    scamCategory: { type: String, default: 'Other' },
    summary: String,
    redFlags: [String],
    safeSigns: [String],
    recommendation: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('ScanResult', ScanResultSchema);
// history.js
// GET /api/history — get all scans
// GET /api/history/user/:userId — get user's scans
// DELETE /api/history/:id — delete a scan

const express = require('express');
const router = express.Router();
const ScanResult = require('../models/ScanResult');

// Get all recent scans
router.get('/', async (req, res) => {
  try {
    const scans = await ScanResult.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .select('-inputContent');
    res.json({ success: true, scans });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get scans by userId
router.get('/user/:userId', async (req, res) => {
  try {
    const scans = await ScanResult.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, scans });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a scan
router.delete('/:id', async (req, res) => {
  try {
    await ScanResult.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Scan deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
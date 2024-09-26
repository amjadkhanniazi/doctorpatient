import express from 'express';
import user from '../model/user.js';
import doctor from '../model/doctors.js';
import patient from '../model/patients.js';

const router = express.Router();

// Doctor Registration
router.post('/doc/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const newUser = new user({ username, password, role: 'doctor' });
    const userDoc = await newUser.save();
    const newDoctor = new doctor({ user: userDoc._id, specialty: req.body.specialty, licenseNumber: req.body.licenseNumber});
    await newDoctor.save();
    res.status(201).json({ message: 'Doctor Account created' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Patient Registration
router.post('/pat/register', async (req, res) => {
    const { username, password } = req.body;
    try {
      const newUser = new user({ username, password, role: 'patient' });
      const userPat = await newUser.save();
        const newPatient = new patient({ user: userPat._id, dateOfBirth: req.body.dateOfBirth, medicalHistory: req.body.medicalHistory });
        await newPatient.save();
      res.status(201).json({ message: 'Patient Account created' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

// User Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const newUser = await user.findOne({ username });
    if (!newUser) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await newUser.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = newUser.getToken();
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
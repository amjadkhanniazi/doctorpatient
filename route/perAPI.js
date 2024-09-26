import express from 'express';
import perscription from '../model/perscription.js';
import authenticateToken from '../middleware/authentication.js';
import authorize from '../middleware/authorization.js';

const router = express.Router()


router.post('/new', authenticateToken, authorize(['doctor']), async (req, res) => {

    try {
        const newPerscription = new perscription({
            doctor: req.user._id,
            patient: req.query.p_id,
            medications: req.body.medications,
            diagnosis: req.body.diagnosis,
            notes: req.body.notes
        });
        await newPerscription.save();
        //readin all perscriptions for a patient
        const patientPrescriptions = await perscription.find({ patient: req.query.p_id });
        // sending the perscriptions back
        res.status(201).json(patientPrescriptions);
    } catch (err) {
        res.status(400).json({ message: err });
    }
})

router.delete('/delete', authenticateToken, authorize(['doctor']), async (req, res) => {
    try {
        const deletedPerscription = await perscription.findByIdAndDelete(req.query.id);
        if (!deletedPerscription) return res.status(404).json({ message: 'Perscription not found' });
        res.status(200).json({ message: 'Perscription deleted' });
    } catch (err) {
        res.status(400).json({ message: err });
    }
})


//add madication
router.patch('/add-medication', authenticateToken, authorize(['doctor']), async (req, res) => {
    try {
        // Find the prescription by ID
        const prescription = await perscription.findById(req.query.id);

        // Check if prescription exists
        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }

        // Add new medications to the existing medications array
        prescription.medications.push(...req.body.medications); // Assuming req.body.medications is an array

        // Save the updated prescription
        await prescription.save();

        // Send the updated prescription back as response
        res.status(200).json(prescription);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update medication
router.patch('/update-medication', authenticateToken, authorize(['doctor']), async (req, res) => {
    try {
        // Find the prescription by ID
        const prescriptionUpdate = await perscription.findById(req.query.per_id);

        // Check if prescription exists
        if (!prescriptionUpdate) {
            return res.status(404).json({ message: 'Prescription not found' });
        }

        // Find the medication by medication ID
        const medication = prescriptionUpdate.medications.id(req.query.med_id);

        // Check if medication exists
        if (!medication) {
            return res.status(404).json({ message: 'Medication not found' });
        }

        // Validate and update medication fields from req.body
        if (req.body.name) medication.name = req.body.name;
        if (req.body.dosage) medication.dosage = req.body.dosage;
        if (req.body.frequency) medication.frequency = req.body.frequency;
        if (req.body.duration) medication.duration = req.body.duration;

        // Save the updated prescription
        await prescriptionUpdate.save();

        // Send the updated prescription back as response
        res.status(200).json(prescriptionUpdate);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// Delete medication
router.delete('/delete-medication', authenticateToken, authorize(['doctor']), async (req, res) => {
    try {
        // Find the prescription by ID
        const prescription = await perscription.findById(req.query.per_id);

        // Check if prescription exists
        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }

        // Find the medication by medication ID
        const medication = prescription.medications.id(req.query.med_id);

        // Check if medication exists
        if (!medication) {
            return res.status(404).json({ message: 'Medication not found' });
        }
        // Remove the medication using `pull()` and the medication ID
        prescription.medications.pull(req.query.med_id);

        // Save the updated prescription
        await prescription.save();

        // Send the updated prescription back as response
        res.status(200).json(prescription);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


export default router;
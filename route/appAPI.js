import express from 'express';
import appointment from '../model/appointment.js';
import authenticateToken from '../middleware/authentication.js';
import authorize from '../middleware/authorization.js';

const router = express.Router()


router.post('/new', authenticateToken,  authorize(['patient']), async (req, res) => {
        try {
            const newAppointment = new appointment({
                doctor: req.query.doc_id,
                patient: req.user._id,
                date: req.body.date,
                time: req.body.time,
                reason: req.body.reason
            });
            await newAppointment.save();
            //readin all perscriptions for a patient
            const patientAppointments = await appointment.find({ patient: req.user._id });
            // sending the perscriptions back
            res.status(201).json(patientAppointments);
        } catch (err) {
            res.status(400).json({ message: err });
        }
})

//Delete appointment
router.delete('/delete', authenticateToken, authorize(['patient']), async (req, res) => {
    try {
        const deletedAppointment = await appointment.findByIdAndDelete(req.query.id);
        if (!deletedAppointment) return res.status(404).json({ message: 'Appointment not found' });
        res.status(200).json({ message: 'Appointment deleted' });
    } catch (err) {
        res.status(400).json({ message: err });
    }
})

//approve appointment
router.patch('/approve', authenticateToken, authorize(['doctor']), async (req, res) => {
    try {
        const appointmentToApprove = await appointment.findById(req.query.id);
        if (!appointmentToApprove) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        appointmentToApprove.status = 'approved';
        await appointmentToApprove.save();
        res.status(200).json(appointmentToApprove);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

//reject appointment
router.patch('/reject', authenticateToken, authorize(['doctor']), async (req, res) => {
    try {
        const appointmentToReject = await appointment.findById(req.query.id);
        if (!appointmentToReject) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        appointmentToReject.status = 'rejected';
        await appointmentToReject.save();
        res.status(200).json(appointmentToReject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})



export default router;
import mongoose from "mongoose";


const perscriptionPicSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    perscriptionPic: {
        type: String,
        required: true
    }
})

export default perscriptionPicSchema;
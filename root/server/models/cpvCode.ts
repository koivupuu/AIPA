import mongoose, { Document, Schema } from 'mongoose';

interface ICPVCode extends Document {
    cpvcode: string;
    englishname: string;
    finnishname: string;
}

const CPVCodeSchema: Schema = new Schema({
    cpvcode: {
        type: String,
        required: true
    },
    englishname: {
        type: String,
        required: true
    },
    finnishname: {
        type: String,
        required: true
    }
});

const CPVCode = mongoose.model<ICPVCode>('CPVCode', CPVCodeSchema);

export default CPVCode;

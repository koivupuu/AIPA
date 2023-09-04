import mongoose, { Document, Schema } from 'mongoose';

export interface IAwardNotice extends Document {
    awardContract: Schema.Types.Mixed;
    originalProcurementCall: Schema.Types.ObjectId;
    contractDetails: {
        officialName: string;
        country: string;
        dateConclusion: string;
        totalValue: string;
    }[];
}

const AwardNoticeSchema: Schema = new Schema({
    awardContract: Schema.Types.Mixed,
    procurementCallRef: { type: Schema.Types.ObjectId, ref: 'ProcurementCall', required: true },
    contractDetails: [{
        officialName: { type: String, required: true },
        country: { type: String, required: true },
        dateConclusion: { type: String, required: true },
        totalValue: { type: String, required: true }
    }]
}, { timestamps: true });

const AwardNotice = mongoose.model<IAwardNotice>('AwardNotice', AwardNoticeSchema);

export default AwardNotice;

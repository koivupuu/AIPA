import mongoose, { Document, Schema } from 'mongoose';

export interface IProcurementCall extends Document {
    title: string; 
    docid: string;
    dateForSubmission: string; 
    datePublished: string; 
    awardNoticeRef: Schema.Types.ObjectId;
    jsondata: Schema.Types.ObjectId;
    cpvCodes: string[]; 
    relevantText: string[]; 
    lgOrig: string; 
    isoCountry: string; 
    documentType: string;
    uriDocText: string;
    iaUrlEtendering: string;
    valuesList: string;
}

const ProcurementCallSchema: Schema = new Schema({
    title: { type: String, required: true },
    docid: { type: String, required: true },
    dateForSubmission: { type: String, required: true },
    datePublished: { type: String, required: true },
    awardNoticeRef: { type: Schema.Types.ObjectId, ref: 'AwardNotice' },
    jsondata: { type: Schema.Types.ObjectId, ref: 'ProcurementCallJson' },
    cpvCodes: { type: [String], required: true },
    relevantText: { type: [String], required: true },
    lgOrig: { type: String, required: true },
    isoCountry: { type: String, required: true },
    documentType: { type: String, required: true },
    uriDocText: { type: String, required: true },
    iaUrlEtendering: { type: String, required: true },
    valuesList: { type: String, required: true },
}, { timestamps: true });

const ProcurementCall = mongoose.model<IProcurementCall>('ProcurementCall', ProcurementCallSchema);

export default ProcurementCall;

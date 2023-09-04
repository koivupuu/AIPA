import mongoose, { Document, Schema } from 'mongoose';

interface IProcurementCallJson extends Document {
    originalId: Schema.Types.ObjectId;
    data: any;
}

const ProcurementCallJsonSchema: Schema = new Schema({
    originalId: { type: Schema.Types.ObjectId, ref: 'ProcurementCall', required: true },
    data: Schema.Types.Mixed
}, { timestamps: true });

const ProcurementCallJson = mongoose.model<IProcurementCallJson>('ProcurementCallJson', ProcurementCallJsonSchema);

export default ProcurementCallJson;

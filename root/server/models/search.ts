import mongoose, { Document, Schema } from 'mongoose';
import { IProcurementCall } from './procurementCall';

interface ISearchProcurementCall extends IProcurementCall {
    procurementCall: Schema.Types.ObjectId;
    suitabilityScore: number;
}

interface ISearch extends Document {
    time?: Date;
    subProfile: Schema.Types.ObjectId;
    procurementCalls: ISearchProcurementCall[];
}

const SearchSchema: Schema = new Schema({
    time: { type: Date, default: Date.now },
    subProfile: { type: Schema.Types.ObjectId, ref: 'SubProfile', required: true },
    procurementCalls: [{
        procurementCall: { type: Schema.Types.ObjectId, ref: 'ProcurementCall', required: true },
        suitabilityScore: { type: Number, required: true }
    }],
}, { timestamps: true });

const Search = mongoose.model<ISearch>('Search', SearchSchema);

export default Search;

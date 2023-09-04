import mongoose, { Document, Schema } from 'mongoose';

interface ISubProfile extends Document {
    strategy?: string;
    financialDocuments?: string;
    pastWorks?: string;
    cpvCodes?: string[];
    industry?: string;
    tenderSize?: string;
    lowestcost?: string;
    highestcost?: string;
    description?: string;
    exclude?: string[];
    dislikedLocations?: string[];
    languages?: string[];
    lastLanguages?: string[];
    keywords?: string[];
    lastKeywords?: string[];
    subProfileName: string;
    profile: Schema.Types.ObjectId; // reference to the Profile model
    searches?: Schema.Types.ObjectId[]; // reference to the Search model
}

const SubProfileSchema: Schema = new Schema({
    strategy: String,
    financialDocuments: String,
    pastWorks: String,
    cpvCodes: [String],
    industry: String,
    tenderSize: String,
    lowestcost: String,
    highestcost: String,
    description: String,
    exclude: [String],
    dislikedLocations: [String],
    languages: [String],
    lastLanguages: [String],
    keywords: [String],
    lastKeywords: [String], 
    subProfileName: { type: String, required: true },
    profile: { type: Schema.Types.ObjectId, ref: 'Profile' }, // reference to the Profile model
    searches: [{ type: Schema.Types.ObjectId, ref: 'Search' }] // reference to the Search model
}, { timestamps: true });

const SubProfile = mongoose.model<ISubProfile>('SubProfile', SubProfileSchema);

export default SubProfile;

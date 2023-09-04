import mongoose, { Document, Schema } from 'mongoose';

interface IProfile extends Document {
    companyName: string;
    auth0sub: string;
    subProfiles: Schema.Types.ObjectId[];
}

const ProfileSchema: Schema = new Schema({
    companyName: { type: String, required: true },
    auth0sub: { type: String, required: true},
    subProfiles: [{ type: Schema.Types.ObjectId, ref: 'SubProfile' }],
}, { timestamps: true });

const Profile = mongoose.model<IProfile>('Profile', ProfileSchema);

export default Profile;

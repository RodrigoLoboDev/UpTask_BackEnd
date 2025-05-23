import mongoose, {Schema, Document, Types} from "mongoose";

export interface IToken extends Document {
    token: string
    userId: Types.ObjectId
    createAt: Date
}

const tokenSchema : Schema = new Schema({
    token: {
        type: String,
        required: true
    },
    userId: {
        type: Types.ObjectId,
        ref: 'User'
    },
    createAt: {
        type: Date,
        default: Date.now,
        expires: '10m'
    }
})

const Token = mongoose.model<IToken>('Token', tokenSchema)
export default Token
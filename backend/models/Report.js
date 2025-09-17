import mongoose from 'mongoose';

const schema = new mongoose.Schema(
    {
        requestId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Requests",
            default: null,
            required: true,
            unique: true
        },
        reportData:
        {
            type: [{
                name: {
                    type: String,
                    default: ""
                },
                mobileNo: {
                    type: Number,
                },
                wardNo: {
                    type: String,
                },
                numberOfProblems: {
                    type: Number
                },
                problems: {
                    type: [{
                        tags: [String],
                        english: String,
                        hindi: String
                    }]
                }
            }],
            default: []
        }
    },
    {
        timestamps: true
    }
);

const reportDB = mongoose.model('reports', schema);

export default reportDB;
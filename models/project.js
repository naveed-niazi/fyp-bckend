const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const projectSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true,
    },
    groupDescription: {
        type: String,
        required: true,
    },
    groupMembers: [{ type: ObjectId, ref: "User" }],

    department: String,
    documentation: {
        visionDocument: {
            title: String,
            abstract: String,
            scope: String,
            majorModules: [],
            status: String,
            fileUploaded: Boolean,
            document: {
                originalname: String,
                filename: String,
                doctype: String,
            },
            comments: [
                {
                    text: String,
                    createdAt: Date,
                    author: { type: ObjectId, ref: "User" },
                },
            ],
            uploadedAt: Date,
            updatedAt: Date,
            meetingDate: Date,
            venue: String,
        },
        finalDocumentation: [
            {
                uploadedAt: Date,
                status: String,
                document: {},
                plagiarismReport: {
                    originalname: String,
                    filename: String,
                },
            },
        ],
    },
    details: {
        marks: {
            visionDocument: String,
            supervisor: String,
            internal: String,
            external: String,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        supervisor: { type: ObjectId, ref: "User" },
        internal: {
            examiner: { type: ObjectId, ref: "User" },
            date: Date,
            venue: String,
        },
        external: {
            examiner: { type: ObjectId, ref: "User" },
            date: Date,
            venue: String,
        },
        acceptanceLetter: {
            name: String,
            issueDate: Date,
        },
        meetings: [
            {
                purpose: String,
                date: Date,
                isAttended: Boolean,
            },
        ],
        estimatedDeadline: Date,
    },
});

module.exports = mongoose.model("Project", projectSchema);
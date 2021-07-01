const mongoose = require("mongoose");
let uuidv1 = require('uuidv1');
const crypto = require('crypto');
const { ObjectId } = mongoose.Schema;


const userSchema = new mongoose.Schema({

      name: {
            type: String,
            trim: true
      },
      email: {
            type: String,
            trim: true,
            require: true
      },
      hashed_password: {
            type: String
      },
      salt: String,
      created: {
            type: Date,
            default: Date.now
      },
      updated: Date,
      photo: {
            data: Buffer,
            contentType: String
      },
      roles: {
            type: Array,
            default: ["Student"]
      },
      resetPasswordLink: {
            type: String,
            default: ''
      },
      emailVerficationCode: {
            type: String,
            unique: true
      },
      department: {
            type: String
      },
      status: {
            type: String,
            enum: ['Pending', 'Active'],
            default: 'Pending'
      },
      student_details: {
            isEligible: { type: Boolean, default: false },
            batch: String,
            regNo: String,
      },
      ugpc_details: {
            position: String,
            committeeType: String,
            committees: [String],
            designation: String,
            projects: [{
                  project: { type: ObjectId, ref: "Project" },
                  title: String
            }]
      },
      supervisor_details: {
            projects: [{
                  project: { type: ObjectId, ref: "Project" },
                  title: String
            }],
            position: String
      },
      chariman_details: {
            settings: {
                  marksDistribution: {
                        proposal: String,
                        supervisor: String,
                        internal: String,
                        external: String
                  },
                  batches: [],
                  degrees: [],
                  chairmanName: String,
                  committeeHeadName: String
            }
      }
});


//virtual field
userSchema.virtual('password')
      .set(function (password) {
            //create temporary variable called _password
            this._password = password
            //generate a timestamp
            this.salt = uuidv1()
            //  encryptPassword()
            this.hashed_password = this.encryptPassword(this._password)
      })
      .get(function () {
            return this._password
      })

//methods
userSchema.methods = {


      encryptPassword: function (password) {
            if (!password) return "";
            try {
                  return crypto.createHmac('sha1', this.salt)
                        .update(password)
                        .digest('hex');
            } catch (err) {
                  return "";
            }
      },
      authenticate: function (plainText) {
            return this.encryptPassword(plainText) === this.hashed_password
      }

}


module.exports = mongoose.model("User", userSchema);
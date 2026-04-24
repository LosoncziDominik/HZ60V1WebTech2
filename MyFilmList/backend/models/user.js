const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true, lowercase: true, trim: true , maxlength: 254},
        passwordHash: { type: String, required: true },
    },
    { timestamps: true}
);

userSchema.index({ email: 1 }, { unique: true});

module.exports = mongoose.model("User", userSchema);
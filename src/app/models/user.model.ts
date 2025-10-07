import bcrypt from 'bcryptjs';
import { Model, model, Schema } from "mongoose";
import { IAddress, IUser, UserInstanceMethods } from "../interfaces/user.interface";

const addressSchema = new Schema<IAddress>({
    city: { type: String },
    street: { type: String },
    zip: { type: Number }
}, {
    _id: false
})

const userSchema = new Schema<IUser, Model<IUser>, UserInstanceMethods>({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        min: 18,
        max: 60,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
            },
            message: function(props) {
                return `Email ${props.value} is not valid email!`
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        uppercase: true,
        enum: ['USER', 'ADMIN', 'SUPER_ADMIN'],
        default: 'USER'
    },
    address: {
        type: addressSchema
    }
}, {
    versionKey: false,
    timestamps: true
})

userSchema.method("hashPassword", async function hashPassword(plainPassword: string) {
    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(plainPassword, salt)
    this.password = password
    // return password;
})

export const User = model('User', userSchema)
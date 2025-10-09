import bcrypt from 'bcryptjs';
import { Model, model, Schema } from "mongoose";
import { IAddress, IUser, UserInstanceMethods } from "../interfaces/user.interface";
import { Note } from './note.model';

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
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

userSchema.method("hashPassword", async function hashPassword(plainPassword: string) {
    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(plainPassword, salt)
    this.password = password
    // return password;
})

userSchema.static("hashPassword", async function hashPassword(plainPassword: string) {
    const password = await bcrypt.hash(plainPassword, 10);
    return password;
})

userSchema.pre('save', async function(next) {
    const password = await bcrypt.hash(this.password, 10);
    this.password = password
    next()
})

userSchema.pre('find', function(next) {
    console.log('This is pre find hook')
    next()
})

userSchema.post('findOneAndDelete', async function(doc, next) {
    if(doc) {
        console.log("doc ------> ",doc)
        await Note.deleteMany({ user: doc._id})
    }
    next()
})

userSchema.post('save', function( dock, next) {
    console.log('Inside post save hook')
    console.log(this)
    next()
})

userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`
})

export const User = model('User', userSchema)
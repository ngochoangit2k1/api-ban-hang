import mongoose, {Schema, ObjectId} from "mongoose";

export default mongoose.model('Auth', 
    new Schema({
        id: {type: ObjectId},
        name: {type: String, required: true},
        email: {type: String,
             required: true, // NOT NULL 
             validate:{
                    validator: (value) => value.length > 5,
                    messages: 'Username must be at least 5 characters long'
             }
        },
        password: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: false
        }
    })
)
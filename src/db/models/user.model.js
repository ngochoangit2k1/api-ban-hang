import mongoose, {Schema, ObjectId} from "mongoose";

const User = mongoose.model('User', 
    new Schema({
        id: {type: ObjectId},
        name: {type: String,
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
        },
        gender: {
            type: String,
            enum:{
                values: ["Male", "Female"],
                messages: '{VALUE} is not supported'
            },
            require: true
        },
        language:{
            type: [String]
        }
    },{
        autoCreate: false,
        autoIndex: true,
    })
)

export default User
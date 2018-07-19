import mongoose from 'mongoose';

mongoose.connect("mongodb://localhost/app", function(err) {
    if(err) 
        console.log("error in connection mongodb::::"+ err);
    else
        console.log("we are connected to db")
});

const { Schema, model } = mongoose;

const postschema = Schema({
    id: { type: Number, required: true, index: true },
    rollno: { type:Number, required: true },
    userID: { type:String, required: true },
    userIntro: { type: String, required: true },
    text: { type: String },
    pics: [ String ],
    time: { type: Date, default: Date.now , required: true },
    likes: { type: Number, required: true, unique: false },
    liked_by: [ String ],
    comment : [ Object ]
});

export const Posts = mongoose.model("Post", postschema, "posts");

const studentschema = Schema({
    rollno: { type:Number },
    year : { type:Number, required: true },
    userID: { type:String, required: true, index: true },
    gender: { type:String, required: true }, //true == Male
    f_name: { type:String, required: true },
    m_name: { type:String },
    l_name: { type:String, required: true },
    dob : { type: Date, required: true },
    m_no : { type: Number , required: true },
    mail : { type: String, required: true },
    p_pic: { type:String },
    password: { type: String, required: true },
    h_town: { type:String , required: true },
    userIntro: { type: String, required: true }, //short intro like 2nd yr IT
    self: { type: String }, //write about yourself
    created_at : { type: Date, required: true },
    h_posts : [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    last_logged_in: { type: Date },
    is_auth: { type: Boolean , required: true }
});

export const Students = mongoose.model("Student", studentschema, 'students')

const brancheschema = Schema({
    name : { type: String , required: true },
    year: { type: Number , required: true },
    t_stu : { type: Number , required: true },
    A : [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    B : [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    no_A : { type: Number , required: true },
    no_B : { type: Number , required: true },
    no_of_post : { type: Number , required: true }
});

export const Branchs = mongoose.model("Branch", brancheschema, 'branches');
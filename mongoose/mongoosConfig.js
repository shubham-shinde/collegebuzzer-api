import mongoose from 'mongoose';

mongoose.connect("mongodb://localhost/app2", function(err) {
    if(err) 
        console.log("error in connection mongodb::::"+ err);
    else
        console.log("we are connected to db")
});

const { Schema } = mongoose;

const postschema = Schema({
    name: { type:String, required: true },
    p_pic : { type: String, required: true },
    n_pics: { type:Number, required: true },
    n_videos: { type: Number },
    userIntro: { type: String }, 
    Id : { type: Schema.Types.ObjectId, ref: 'students' },
    text: { type: String },
    likes: [{ type: Schema.Types.ObjectId, ref: 'students' }],
    is_auth: { type: Boolean , required: true },
    only_for_stu: { type: Boolean , required: true },
});

export const STU_POSTS = mongoose.model("stu_post", postschema, "stu_posts");

export const CLUB_POSTS = mongoose.model("club_post", postschema, "club_posts");

const studentschema = Schema({
    clgId: { type:String, unique: true },
    year : { type:Number, required: true },
    branch : { type: String, required: true },
    sec : { type: String, required: true },
    gen: { type:String, required: true }, //true == Male
    name: { type:String, required: true },
    theme: { type: String },
    dob : { type: Date, required: true },
    mail : { type: String, required: true },
    p_pic: { type:String },
    password: { type: String, required: true },
    userIntro: { type: String, required: true }, //short intro like 2nd yr IT
    bio: { type: String }, //write about yourself
    h_posts : [{ type: Schema.Types.ObjectId, ref: 'stu_posts' }],
    last_logged_in: { type: Date },
    is_auth: { type: Boolean , required: true }
});

studentschema.index({f_name: 'text', m_name: 'text', l_name: 'text'})

export const Students = mongoose.model("Student", studentschema, 'students')

const guestschema = Schema({
    name: { type:String, required: true },
    mail : { type: String, required: true },
    password: { type: String, required: true },
    last_logged_in: { type: Date },
    is_auth: { type: Boolean , required: true }
});

export const Guests = mongoose.model("Guest", guestschema, 'guests')

const clubSchema = Schema({
    name : { type: String , required: true },
    password: { type: String, required: true },
    h_posts : [{ type: Schema.Types.ObjectId, ref: 'club_posts' }],
    mail : { type: String, required: true },
    p_pic : { type:String },
    bio :  { type: String },
    heads : [{
        Id : { type: String, required: true },
        name : { type: String, required: true },
        p_pic : { type: String, required: true },
        userIntro : { type: String, required: true },
    }],
    theme :  { type: String },
    is_auth: { type: Boolean , required: true }
});

clubSchema.index({f_name: 'text', m_name: 'text'})

export const Clubs = mongoose.model("Club", clubSchema, 'clubs');

const confSchema = Schema({
    text: { type: String, required: true },
    theme: { type: String, required: true },
    is_auth: { type: Boolean , required: true },
    year : { type:Number, required: true },
    branch : { type: String, required: true },
    time: { type: Date, default: Date.now , required: true },
    auth_by: { type: String }
});

export const Confessions = mongoose.model("Conf", confSchema, 'confs');

const adminSchema = Schema({
    name : { type: String , required: true },
    password: { type: String, required: true },
    mail : { type: String, required: true },
    is_auth: { type: Boolean , required: true }
});

export const Admins = mongoose.model("Admin", adminSchema, 'admins');

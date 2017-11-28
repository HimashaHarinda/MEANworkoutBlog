const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

let titleLengthChecker = (title) =>{
    if(!title){
        return false;
    }else{
        if (title.length < 5 || title.length >50) {
            return false;
        }else{
            return true;
        }
    }
};

let alphaNumericTitleChecker = (title) =>{
    if (!title) {
        return false;
    }
    else{
        const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
        return regExp.test(title);
    }
};

const titleValidators = [
    {
        validator: titleLengthChecker, 
        message: 'Title must be atleast 5 characters but no more than 50'
    },
    {
        validator: alphaNumericTitleChecker,
        message: 'Must be alphanumeric'
    }
];

let bodyLengthChecker = (body) =>{
    if (!body) {
        return false;
    }else{
        if (body.length < 5  ||  body.length > 500) {
            return false;
        }
        else{
            return true;
        }
    }
};

const bodyValidators = [
    {
        validator: bodyLengthChecker,
        message:'Body must be more than 5 characters but no more than 500'
    }
];

let commentLengthChecker = (comment) =>{
    if (!comment[0]) {
        return false;
    }else{
        if (comment[0].length < 1  ||  comment[0].length > 200) {
            return false;
        }
        else{
            return true;
        }
    }
};

const commentValidators = [
    {
        validator: commentLengthChecker,
        message:'comments must be no more than 200 characters'
    }
];

let distanceCharacterChecker = (distance) =>{
    if (!distance) {
        return false;
    }
    else{
        const regExp = new RegExp(/^[0-9]*$/);
        return regExp.test(distance);
    }
}

const distanceValidators = [
    {
        validator: distanceCharacterChecker,
        message:'Distance must be digits'
    }
]

let hrateCharacterChecker = (hrate) =>{
    if (!hrate) {
        return false;
    }
    else{
        const regExp = new RegExp(/^[0-9]*$/);
        return regExp.test(hrate);
    }
}

const hrateValidators = [
    {
        validator: hrateCharacterChecker,
        message:'Heart rate must be digits'
    }
]

const blogSchema = new Schema({
  title: {type:String, required:true, validate:titleValidators},
  body: {type: String, required:true, validate:bodyValidators},
  route: { type: String},
  distance: { type: String, validate:distanceValidators},
  hrate: { type: String, validate:hrateCharacterChecker},
  pace: { type: String},
  createdAt: {type:Date, default:Date.now()},
  createdBy: {type:String},
  likes: { type:Number, default:0},
  likedBy: {type:Array },
  dislikes:{ type:Number, default:0},
  dislikedBy: {type:Array },
  comments: [
      {
          comment: { type:String, validate:commentValidators },
          commentator: { type:String}
      }
  ]

});


module.exports = mongoose.model('Blog', blogSchema);
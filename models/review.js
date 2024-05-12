const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new schema({
    comment: String,
     rating :{
        type : Number,
        min :1,
        max :5
     },
     createdAt :{
        type :Date,
        defalut :Date.now()
     }
});

 modoule.exports = mongoose.model("review",reviewSchema);
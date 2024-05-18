  const express = require("express");
  const router = express.Router({ mergeParams:true });
  const wrapAsync = require("../utils/wrapAsync.js");
  const ExpressError = require("../utils/ExpressError.js");
  const {reviewSchema}= require("../schema.js");
  const Review = require("../models/review.js");
  const Listing = require("../models/listing.js");

    const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.error);
    if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, error)
    } else {
        next();
    }
}
 //review/post route

 router.post("/", validateReview, wrapAsync(async (req, res) => {
    const { id } = req.params;
    console.log(id);
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success","new review created!")
    console.log("new review saved");
    res.redirect(`/listings/${listing._id}`)
}));
    
    //DELETE REVIEW ROUTE
    
    router.delete("/:reviewId", wrapAsync(async(req,res)=>{
    
    let{id,reviewId} =req.params;
    
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted!")
    
    res.redirect(`/listings/${id}`)
    }));
    module.exports = router;
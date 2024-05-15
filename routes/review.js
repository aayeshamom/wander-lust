  const express = require("express");
  const router = express.Router();
  const wrapAsync = require("../utils/wrapAsync.js");
  const ExpressError = require("../utils/expresserr.js");
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

    router.post("/",validateReview,wrapasync(async(req,res)=>{

    let Listing = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    Listing.reviews.push(newReview);
    
    await newReview.save();
    await Listing.save();
    
    
    console.log("new review saved");
    
  
    res.redirect(`/listings/${Listing._id}`)
    }));
    
    
    //DELETE REVIEW ROUTE
    
    router.delete("/:reviewId",wrapasync(async(req,res)=>{
    
    let{id,reviewId} =req.params;
    
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
   
    
    res.redirect(`/listings/${id}`)
    }));
    module.exports = router;
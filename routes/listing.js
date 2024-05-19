const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if(error){
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400,errMsg);
    }else {
      next();
    }
  };

 //Index Route
 router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }));
  
  //New Route
  router.get("/new", 
  isLoggedIn,
  (req, res) => {
    res.render("listings/new.ejs");
  });
  
  //Show Route
  router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
      req.flash("error","listing does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  }));
  
  //Create Route
  router.post("/",
   isLoggedIn,
   validateListing,
   wrapAsync(async (req, res, next) => {
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","new listing created!");
    res.redirect("/listings");
    })
  );
  
  //Edit Route
  router.get("/:id/edit", 
  isLoggedIn,
   wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","listing does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  }));
  
  //Update Route
   router.put("/:id",
   isLoggedIn,
  validateListing,
   wrapAsync(async (req, res) => {
    let { id } = req.params;
    const prevListing = await Listing.findById(id);
    const { title, description, image, price, country, location } = req.body.listing;
    prevListing.image.url = image;

    const updatedListing = await Listing.findByIdAndUpdate(id, {
      title,
      description,
      image: {
        filename: prevListing.image.filename,
        url: prevListing.image.url,
      },
      price,
      country,
      location,
    });

    console.log(updatedListing);

    res.redirect(`/listings/${id}`);
  })
);
  
  //Delete Route
  router.delete("/:id",
  isLoggedIn, 
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","deleted");
    res.redirect("/listings");
  }));

  

  module.exports = router;
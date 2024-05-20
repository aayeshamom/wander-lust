const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  };

  module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
  };

  module.exports.showLising = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            }
        })
        .populate("owner")

    if (!listing) {
        req.flash("error", "Linsting you requesting for is not available");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
    
  const newListing = new Listing(req.body.listing);
  
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success","new listing created!");
  res.redirect("/listings");
  };

  module.exports.renderListingForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","listing does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  };

  module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
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
  };

 module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success","deleted");
  res.redirect("/listings");
};
const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
    touristUsername: {
      type: String,
      required: true
    },
    productId: {
      type: String,
      required: true
    },
    productIds: {
      type: Array,
      required: false
    },
    productName: {
        type: String,
        required: true
    },
    purchaseDate: {
      type: Date,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default:1
    },
    totalPrice:{
        type: Number,
        required: true
    },
    status:{
        type: String,
        enum:["Pending","Completed","Canceled"],
        default: "Pending"
    },
  });  

const Purchase = mongoose.model("Purchase", purchaseSchema); 

module.exports = Purchase;
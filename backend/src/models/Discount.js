import mongoose from 'mongoose';

const discountSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  expires: {
    type: Date,
    required: true,
  },
});

const Discount = mongoose.model('Discount', discountSchema);
export default Discount;

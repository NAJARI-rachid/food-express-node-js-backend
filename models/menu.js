import mongoose from 'mongoose'
const menuSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    restaurantId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
},
 { timestamps: true })

const Menu = mongoose.model('Menu', menuSchema)
  
export default mongoose.model('Menu', menuSchema)


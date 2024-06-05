const router = require('express').Router()
const authorize = require('../middlewares/authorize')
const Product = require('../models/Product')
const Employee = require('../models/Employee')
const upload = require('../middlewares/upload')




router.post('/create-product', authorize(['user', 'admin']), upload.single('image'),async (req,res) => {
    const { name, price, description,createdBy } = req.body
    if(!name || !price) {
        res.status(400).json({Error: "Fill in the required fields"})
    }

    const newProduct = {
        name,
        price,
        description,
        createdBy:req.user.name,
        image: req.file.path
    }
    try {
        const product = await Product.create(newProduct)
        res.status(201).json({product})
        
    } catch (error) {
        res.status(400).json({Error: error.message})
    }
})


//Route to get all profucts by logged in user
router.get('/all-products',authorize(['user','admin']), async (req,res) => {
    const products = await Product.find()
    
    return res.status(200).json(products)
})

//Route to get products created by a particular user
router.get('/my-products', authorize(['user','admin']), async (req,res) => {
    const myProducts = await Product.find({createdBy: req.user.name})
    return res.status(200).json(myProducts)
    
})

//Route to update product only posted by that logged in user
router.put('/my-products/update/:id', authorize(['user','admin']),async (req,res) => {
    const { id } = req.params
    const { name, price, description } = req.body
    const updatedProduct = await Product.findOneAndUpdate({
        _id: id,
        createdBy: req.user.name
    },{name, description, price}, { new: true})

    if(!updatedProduct) {
       return res.status(403).json({Error: "Not authorized to update this product"})
    }

    return res.status(200).json(updatedProduct)
    
})

//Route to delete product only posted by that logged in user
router.delete('/my-products/:id', authorize(['user','admin']), async (req,res) => {
    const { id } = req.params
    const deletedProduct = await Product.findOneAndDelete({_id: id, createdBy: req.user.name})
    if(!deletedProduct) {
        res.status(403).json({Error: "Not authorized to delete this product"})
    }
    return res.status(200).json({message: "Product deleted successfully!!"})
    
})



module.exports = router;
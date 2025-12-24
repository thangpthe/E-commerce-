const express = require("express");
const Product = require("../models/Product");
const {protect,admin} = require("../middleware/authMiddleware");
const router = express.Router();
router.post("/",protect,admin, async (req,res) => {
    try {
        const {name,description,price,discountPrice,countInStock,category,brand,sizes,colors,collections,material,gender,images,isFeatured,isPublished,tags,dimensions,weight,sku} = req.body;
        const product = new Product ({
            name,description,price,discountPrice,countInStock,category,brand,sizes,colors,collections,material,gender,images,isFeatured,isPublished,tags,dimensions,weight,sku,user: req.user._id,
        })
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
})

router.put("/:id",protect, admin, async (req,res) => {
    // try {
    //     const {name,description,price,discountPrice,countInStock,category,brand,sizes,colors,collections,material,gender,images,isFeatured,isPublished,tags,dimensions,weight,sku} = req.body; 
    //     const product = await Product.findById(req.params.id);
    //     if(product){
    //         product.name = name || product.name;
    //         product.description = description || product.description;
    //         product.price = price || product.price;
    //         product.discountPrice = discountPrice || product.discountPrice;
    //         product.countInStock = countInStock || product.countInStock;
    //         product.category = category || product.category;
    //         product.brand = brand || product.brand;
    //         product.sizes = sizes || product.sizes;
    //         product.colors = colors || product.colors;
    //         product.collections = collections || product.collections;
    //         product.material = material || product.material;
    //         product.gender = gender || product.gender;
    //         product.images= images || product.images;
    //         product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
    //         product.isPublished = isPublished !== undefined ? isPublished : product.isPublished;
    //         product.tags = tags || product.tags;
    //         product.dimensions = dimensions || product.dimensions;
    //         product.weight = weight || product.weight;
    //         product.sku = sku || product.sku;

    //         const updatedProduct = await product.save();
    //         res.json(updatedProduct);
    //     } else{
    //         res.status(404).json({message: "Product not found"});
    //     }
    // } catch (error) {
    //     console.log(error);
    //     res.status(500).send("Server Error");
    // }
     try {
        console.log("📝 Updating product:", req.params.id);
        console.log("📝 Request body:", req.body);
        console.log("📝 Images received:", req.body.images);
        console.log("📝 Images count:", req.body.images?.length);
        
        const {
            name, description, price, discountPrice, countInStock,
            category, brand, sizes, colors, collections, material,
            gender, images, isFeatured, isPublished, tags,
            dimensions, weight, sku
        } = req.body;
        
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            console.log("❌ Product not found:", req.params.id);
            return res.status(404).json({message: "Product not found"});
        }

        console.log("📝 Old images count:", product.images?.length);

        // Update all fields (đảm bảo images được update)
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price !== undefined ? price : product.price;
        product.discountPrice = discountPrice !== undefined ? discountPrice : product.discountPrice;
        product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
        product.category = category || product.category;
        product.brand = brand || product.brand;
        product.sizes = sizes || product.sizes;
        product.colors = colors || product.colors;
        product.collections = collections || product.collections;
        product.material = material || product.material;
        product.gender = gender || product.gender;
        
        // QUAN TRỌNG: Update images (cả khi là array rỗng)
        if (images !== undefined) {
            product.images = images;
            console.log("📝 New images count:", product.images.length);
        }
        
        product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
        product.isPublished = isPublished !== undefined ? isPublished : product.isPublished;
        product.tags = tags || product.tags;
        product.dimensions = dimensions || product.dimensions;
        product.weight = weight || product.weight;
        product.sku = sku || product.sku;

        const updatedProduct = await product.save();
        console.log("✅ Product updated successfully");
        console.log("✅ Final images count:", updatedProduct.images.length);
        
        res.json(updatedProduct);
    } catch (error) {
        console.error("❌ Update error:", error);
        res.status(500).json({message: "Server Error", error: error.message});
    }
});


router.delete("/:id",protect,admin,async (req,res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(product){
            await product.deleteOne();
            res.json({message:"Product removed"});
        }else{
            res.status(404).json({message:"Product not found"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
})

router.get("/",async (req,res) => {
    try {
        const {collection,size,color,gender,minPrice,maxPrice,sortBy,search,category,material,brand,limit} = req.query;
        let query = {};
        if(collection && collection.toLocaleLowerCase() !== "all"){
            query.collections = collection;
        }

        if (category) {
            query.category = category;
        }


        if(material){
            query.material = {$in: material.split(",")};
        }

        if(brand){
            query.brand = {$in: brand.split(",")};
        }

        if(size){
            query.sizes = {$in: size.split(",")};
        }

        if(color){
            query.colors = {$in: [color]};
        }

        if(gender){
            query.gender = gender;
        }

        if(minPrice || maxPrice){
            query.price = {};
            if(minPrice) query.price.$gte = Number(minPrice);
            if(maxPrice) query.price.$lte = Number(maxPrice);
        }

        if(search){
            query.$or = [
                {name:{$regex: search, $options: "i"}},
                {description:{$regex: search, $options: "i"}}
            ];
        }
        let sort = {};
        if(sortBy){
            switch(sortBy){
                case "priceAsc":
                    sort = {price: 1};
                    break;
                case "priceDesc":
                    sort = {price: -1};
                    break;
                case "popularity":
                    sort = {rating: -1};
                    break;
                default:
                    break;
            }
        }

        //fetch product
        let products = await Product.find(query).sort(sort).limit(Number(limit) || 0);
        res.json(products);
    
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
});



router.get("/similar/:id",async (req,res) => {
    const {id} = req.params;
    try {
        const product = await Product.findById(id);
        if(!product){
            return res.status(404).json({message: "Product not found"});
        }
        const similarProduct = await Product.find({
            _id: {$ne: id},
            gender: product.gender,
            category: product.category,
        }).limit(4);

        res.json(similarProduct);
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
})

router.get("/best-seller",async (req,res) => {
    try {
        const bestSeller = await Product.findOne().sort({rating: -1});
        if(bestSeller){
            res.json(bestSeller);
        }
        else{
            res.status(404).json({message: "No best seller found"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
});

router.get("/new-arrivals",async (req,res) => {
    try {
        const newArrivals = await Product.find().sort({createaAt: -1}).limit(8);
        res.json(newArrivals);
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
})

router.get("/:id",async (req,res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(product){
            res.json(product);
        } else {
            res.status(404).json({message: "Product Not Found"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
});
module.exports = router;
const Category = require("../models/Category");
const { createError } = require("../utils/error");

exports.getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find().lean();
        const response = { 
            count: categories.length,
            categories: categories.map((category) => {
                const { __v, ...details } = category;
                
                return details;
            })
        };
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }  
};

exports.getCategory = async (req, res, next) => {
    try {
        const id = req.params.id;
        const category = await Category.findById(id).lean();
        const { __v, ...details } = category;
        res.status(200).json(details);
    } catch (error) {
        next(error);
    }
};

exports.createCategory = async (req, res, next) => {
    const { name, description } = req.body;
    
    if (!name || !description ) {
        next(createError(400, "Name and Description are required."));
    }

    const newCategory = new Category(req.body);

    try {
        const category = await newCategory.save();
        const { __v, ...details } = category._doc;
        res.status(201).json(details);
    } catch (error) {
        next(error);
    }
};

exports.updateCategory = async (req, res, next) => {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        ).lean();
        const { __v, ...details } = updatedCategory;
        res.status(200).json(details);
    } catch (error) {
        next(error);
    }
};

exports.deleteCategory = async (req, res, next) => {
    const id = req.params.id;

    try {
        await Category.findByIdAndDelete(id);
        res.status(200).json("Deleted category");
    } catch (error) {
        next(error);
    }
};
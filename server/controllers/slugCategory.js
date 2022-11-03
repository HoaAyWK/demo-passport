const SlugCategory = require("../models/SlugCategory");
const { createError } = require("../utils/error");
const { generateSlug } = require("../utils/slug");

exports.getSlugCategories = async (req, res, next) => {
    try {
        const slugCategories = await SlugCategory.find().lean();
        const response = { 
            count: slugCategories.length,
            slugCategories: slugCategories.map((category) => {
                const { __v, ...details } = category;
                
                return details;
            })
        };
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }  
};

exports.getSlugCategory = async (req, res, next) => {
    try {
        const slug = req.params.slug;
        const slugCategory = await SlugCategory.findOne({ slug }).lean();
        const { __v, ...details } = slugCategory;
        res.status(200).json(details);
    } catch (error) {
        next(error);
    }
};

exports.createSlugCategory = async (req, res, next) => {
    let { name, description, slug } = req.body;
    
    if (!name || !description ) {
        next(createError(400, "Name and Description are required."));
    }

    if (!slug) {
        slug = generateSlug(name);
    }

    res.status(200).json(slug);

    // const newCategory = new SlugCategory({name, description, slug });

    // try {
    //     const category = await newCategory.save();
    //     const { __v, ...details } = category._doc;
    //     res.status(201).json(details);
    // } catch (error) {
    //     next(error);
    // }
};

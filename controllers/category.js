    const Category = require('../models/category');

    exports.addCategory = async (req, res, next) => {
        // console.log(req.body);
        // console.log(req.userId);
        
        try {
            const { categoryName } = req.body; 
        
            const category = new Category({
                categoryName
            });

            // save cateory into the database    
            const newCategory = await category.save();
            res.status(201).json(newCategory);
        }
        catch(error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
        }
    }

    exports.deleteCategory = (req, res, next) => {
        console.log(req.userId)
        // console.log(req.params)
        const id = req.params.id;
        // console.log(id);
        let loadedCategory;
        Category.findOne({
            _id: id
        })
        .then(cat => {
            if(!cat) {
                const error = new Error('A category with this ID doesnot exist.')
                error.statusCode = 401;
                throw error;
            }
            loadedCategory = cat;
            Category.deleteOne(
                {
                    _id: loadedCategory._id
                })
                .then(() => {
                    res.status(200).json({
                        message: 'Category Deleted',
                    })
                })
        })
        .catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
    }
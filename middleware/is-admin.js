    const User = require('../models/user');

    module.exports = async (req,res,next) => {
        // console.log(req.userId);
        const user = await User.findOne({_id: req.userId})
            
        if (!user) {
            return res.status(404).json({ error: 'No user with this Id exists' });
        }
        // console.log(user)
        if (user) {
            const isAdmin = user.roles.includes('admin');
            if (!isAdmin) {
                return res.status(403).json({ error: 'Only admin can add a new product' });
            }
            // console.log("admin", isAdmin)
        }
        // else {
        //     console.log("applicant");
        //     return res.status(403).json({ error: 'Only admin can add a new product' });
        // }
        next();
    }
const Sauces = require('../models/Sauces');
const fs = require('fs');


// Route Creation 
exports.createSauce = (req, res, next) => {
    const saucesObject = JSON.parse(req.body.sauce);
    delete saucesObject._id;
    const sauces = new Sauces({
        ...saucesObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauces.save().then(
        () => {
            res.status(201).json({
                message: 'Sauce enregistrée !'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.getAllSauces = (req, res, next) => {
    Sauces.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.getOneSauce = (req, res, next) => {
    Sauces.findOne({
            _id: req.params.id
        })
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(404).json({
            error
        }));
};

exports.modifySauce = (req, res, next) => {
    const saucesObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
        ...req.body
    };
    Sauces.updateOne({
            _id: req.params.id
        }, {
            ...saucesObject,
            _id: req.params.id
        })
        .then(() => res.status(200).json({
            message: 'Sauce modifiée !'
        }))
        .catch(error => res.status(400).json({
            error
        }));
};

exports.deleteSauce = (req, res, next) => {
    Sauces.findOne({
            _id: req.params.id
        })
        .then(sauces => {
            const filename = sauces.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauces.deleteOne({
                        _id: req.params.id
                    })
                    .then(() => res.status(200).json({
                        message: 'Sauce supprimée !'
                    }))
                    .catch(error => res.status(400).json({
                        error
                    }));
            });
        })
        .catch(error => res.status(400).json({
            error
        }));
};

exports.likeAndDislikeSauce = (req, res, next) => {
    const like = req.body.like;
    const userId = req.body.userId;
    Sauces.findOne({
            _id: req.params.id
        }).then(sauces => {
            if (like === 1 && !sauces.usersLiked.includes(userId)) {
                sauces.likes++;
                sauces.usersLiked.push(userId)
            } else if (like === -1 && !sauces.usersDisliked.includes(userId)) {
                sauces.dislikes++;
                sauces.usersDisliked.push(userId)
            } else if (like === 0 && sauces.usersLiked.includes(userId)) {
                sauces.likes--;
                let findUser = sauces.usersLiked.indexOf(userId);
                sauces.usersLiked.splice(findUser, 1);
            } else if (like === 0 && sauces.usersDisliked.includes(userId)) {
                sauces.dislikes--;
                let findUser = sauces.usersDisliked.indexOf(userId);
                sauces.usersDisliked.splice(findUser, 1);
            }
            Sauces.updateOne({
                    _id: req.params.id
                }, {
                    usersLiked: sauces.usersLiked,
                    likes: sauces.likes,
                    usersDisliked: sauces.usersDisliked,
                    dislikes: sauces.dislikes,
                    _id: req.params.id
                })
                .then(() => res.status(200).json({
                    message: 'Sauce likée/dislikée !'
                }))
                .catch(error => res.status(400).json({
                    error
                }));
        })
        .catch(error => res.status(400).json({
            error
        }));
}
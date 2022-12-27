var express = require('express');
var router = express.Router();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const uniqid = require('uniqid');

router.post('/uploadPic', async (req, res) => {

    // sauvegarde temporaire de la photo sur le backend récupérée via la props photoFromFront à définir côté frontend à l'envoi du POST
    // on génère un nom unique des fois que plusieurs utilisateurs utilisent en même temps l'app et écrasent la photo avant qu'elle n'ait été envoyée
    const photoPath = `./tmp/${uniqid()}.jpg`;
    const resultMove = await req.files.photoFromFront.mv(photoPath); 
    
    if(!resultMove) {
        // si la copie s'est bien passée, on envoie la photo sur cloudinary et on efface la photo temporaire avec fs
        const resultCloudinary = await cloudinary.uploader.upload(photoPath, {folder : "lemulot/"});
        fs.unlinkSync(photoPath);
        // console.log(photoPath);
        // console.log(resultCloudinary);
        res.json({ result: true, url: resultCloudinary.secure_url });
    } else {
        res.json({ result: false, error: resultCopy });
    }
});
//

module.exports = router;

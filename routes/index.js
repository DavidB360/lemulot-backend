var express = require('express');
var router = express.Router();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const uniqid = require('uniqid');

router.post('/uploadPic', async (req, res) => {
    console.log('route uploadPic lancée');
    // sauvegarde temporaire de la photo sur le backend récupérée via la props photoFromFront à définir côté frontend à l'envoi du POST
    // on génère un nom unique pour prévoir le cas où plusieurs utilisateurs utilisent en même temps l'app et écrasent la photo avant qu'elle n'ait été envoyée
    // const photoPath = `./tmp/${uniqid()}.jpg`; // valable pour serveur local seulement
    // 01/10/2023 !!! pour déploiement Vercel, changer ./tmp par /tmp !!! c'est le seul dossier temporaire qui n'est pas en lecture seule et il n'est pas situé à la racine
    const photoPath = `/tmp/${uniqid()}.jpg`;
    const resultMove = await req.files.photoFromFront.mv(photoPath); 
    
    if(!resultMove) {
        // si la copie s'est bien passée, on envoie la photo sur cloudinary et on efface la photo temporaire avec fs
        const resultCloudinary = await cloudinary.uploader.upload(photoPath, {folder : "lemulot/"});
        fs.unlinkSync(photoPath);
        // console.log(photoPath);
        // console.log(resultCloudinary);
        res.json({ result: true, url: resultCloudinary.secure_url });
    } else {
        res.json({ result: false, error: resultMove });
    }
});
//

module.exports = router;

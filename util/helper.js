const path = require("path");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
// const redis = require("../config/redis");
const fs = require("fs");
const sharp = require("sharp");
const { encode } = require("blurhash");
const db = require("../models");
exports.filename = (file, folder) => {


    return `${folder}/${this.randomString()}${path.extname(file.originalname)}`

}

exports.encodeImageToBlurhash = path =>
    new Promise((resolve, reject) => {
        path = this.getImageUrlFromHttp(path);

        sharp(path)
            .raw()
            .ensureAlpha()
            .resize(32, 32, { fit: "inside" })
            .toBuffer((err, buffer, { width, height }) => {
                if (err) return reject(err);
                resolve(encode(new Uint8ClampedArray(buffer), width, height, 4, 4));
            });
    });
exports.rename = async (oldpath, folder) => {

    await db.temp.destroy({ where: { url: oldpath } })

    oldpath = this.getImageUrlFromHttp(oldpath);
    let newpath = `${folder}/${this.randomString()}${path.extname(oldpath)}`;
    fs.renameSync(oldpath, path.resolve(newpath))
    return process.env.APP_URL + newpath;
}


exports.handleValidation = (req, res, next) => {


    let error = validationResult(req);
    if (!error.isEmpty()) {
        error = error.array().map(object => object.msg)
        return res.error(422, "validation error", error)
    }

    next()
}


exports.generateToken = async (id, secret, time) => {


    let token = jwt.sign({ id }, secret, { expiresIn: Number.parseInt(time) });
    if (secret != process.env.ADMIN_REFRESH_TOKEN_KEY) { //cache only token ... not refresh token


        // await redis.set(token, id);
        // await redis.expire(token, time);

    }
    return token;

}



exports.randomString = () => {

    let code = `${Math.round(Math.random() * 10000000)}${Date.now()}`;
    return code;
}

exports.randomcode = () => {


    let code = `${1000 + Math.round(Math.random() * 8999)}`;
    return code;

}


exports.logout = async (req) => {


    let token = req.get("Authorization").split(" ")[1];
    // await redis.del(token)
}


exports.getImageUrlFromHttp = (image) => {

    console.log(image)
    let url = image.replace(process.env.APP_URL, "");

    return path.resolve(url)

}

// exports.removeFile=(folder,file)=>{

//     let paths=path.resolve(folder,file);
//     fs.unlinkSync(paths);   

// }
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");

const User = require("../models/user");
const { ctrlWrapper } = require("../helpers");

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const updateAvatar = ctrlWrapper(async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const fileName = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, fileName);

  await Jimp.read(tempUpload)
    .then((image) => {
      return image.resize(250, 250).write(resultUpload);
    })
    .catch((error) => {
      throw new Error(`Failed to resize avatar: ${error}`);
    });

  await fs.unlink(tempUpload);

  const avatarUrl = path.join("avatars", fileName);
  await User.findByIdAndUpdate(_id, { avatarUrl });
  res.json({ avatarUrl });
});

module.exports = updateAvatar;

const User = require("../models/user");
const { HttpError, ctrlWrapper } = require("../helpers");

const verifyEmail = ctrlWrapper(async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.json({
    message: "Email verify success",
  });
});

module.exports = verifyEmail;

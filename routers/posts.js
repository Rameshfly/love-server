const express = require("express");
const router = express.Router();
const { Posts } = require("../models/posts");
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

//The disk storage engine gives you full control on storing files to disk
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    //   const isValid = FILE_TYPE_MAP[file.mimetype]; //MIME(Multipurpose Internet Mail Extensions) standard that indicates the nature and format of a document.
    //   let uploadError = new Error("invalid image type");
  
    //   if (isValid) {
    //     uploadError = null;
    //   }

    cb(null, "public/uploads");
    },
    filename: function (req, file, cb) {
      const fileName = file.originalname.split(" ").join("-");
      const extension = FILE_TYPE_MAP[file.mimetype];
      const extension1 = "jpeg"; // change
      cb(null, `${fileName}-${Date.now()}.${extension1}`);
    },
});
  
const uploadOptions = multer({ storage: storage });

router.post('/createposts', uploadOptions.array("addMedia", 10), async(req, res) => {
    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    if (files) {
        files.map((file) => {
            imagesPaths.push(`${basePath}${file.filename}`);
        });
    }

    let posts = new Posts({
        memoryText: req.body.memoryText,
        hashTags: req.body.hashTags,
        dateOfTheEvent: req.body.dateOfTheEvent,
        timeOfTheEvent: req.body.timeOfTheEvent,
        tagConnections: req.body.tagConnections,
        addMedia: imagesPaths,
        userId: req.body.userId,
      });
    
    posts = await posts.save();

    if(!posts) {
      return res.status(400).send("posts not uploaded successfully");
    }

    return res.status(200).send(posts);
})

router.get(`/`, async (req, res) => {

  const postsList = await Posts.find().populate('userId', 'name').sort({'dateCreated': -1});

  if(!postsList) {
    res.status(500).json({
      success: false
    })
  }

  return res.status(200).send(postsList);
})

//get user posts
router.get(`/get/userposts/:userid`, async(req, res) => {
  const userPostsList = await Posts.find({
    userId: req.params.userid
  }).populate('userId', 'name').sort({'dateCreated': -1});

  if(!userPostsList) {
      res.status(500).json({
          success: false
      })
  }
  res.send(userPostsList);
})

module.exports = router;
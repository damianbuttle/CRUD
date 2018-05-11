var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'sewing-uploadsdb',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + ".jpg")
    }
  })
})

app.post('/upload', upload.single('upload'), function(req, res, next) {
res.send('Successfully uploaded ' + req.file.length + ' file!')
})

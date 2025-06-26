const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const multer = require('multer')

const port = 6545;

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'filestorage/');
    },
    filename: (req, file, cb) => {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
    },
});

const upload = multer({ storage });

app.use('/uploads', express.static(path.join(__dirname, 'filestorage')));

app.get('/', (req, res) => {
    res.render('index')
});

app.post('/upload', upload.single('file'), (req, res) => {
    res.redirect('/')
});

app.delete('/delete/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, 'filestorage', fileName);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.send(`File "${fileName}" has been deleted!`);
    } else {
        res.status(404).send(`File "${fileName}" not found !!!`)
    }
});

app.get('/view', (req, res) => {
    const uploadDirectory = path.join(__dirname, 'filestorage');
    fs.readdir(uploadDirectory, (err, files) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error reading the upload directory.");
        } else {
            res.json({ files })
        }
    })
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})
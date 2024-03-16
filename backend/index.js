const express = require('express')
const app = express();
const multer = require('multer');
const unzipper = require('unzipper');
const path = require('path');
const fs = require('fs');
let cors = require('cors')
app.use(cors())

const PORT = 3000;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },

    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random());
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    }
});

const upload = multer({ storage: storage });

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.post('/', upload.single('file'), async (req, res) => {
    try {
        const zipFilePath = path.join('uploads', req.file.filename);
        const extractDir = path.join('uploads', path.parse(req.file.filename).name);

        if (!fs.existsSync(extractDir)) {
            fs.mkdirSync(extractDir);
        }

        console.log('unzipping...')

        await fs.createReadStream(zipFilePath)
            .pipe(unzipper.Extract({ path: extractDir }))
            .promise();

        const jsonDir = path.join(extractDir, 'connections', 'followers_and_following');

        console.log('reading followers json...')

        const followersData = await fs.promises.readFile(path.join(jsonDir, 'followers_1.json'), 'utf8');

        console.log('reading followings json...')

        const followingsData = await fs.promises.readFile(path.join(jsonDir, 'following.json'), 'utf8');

        console.log('parsing json...')

        let followersObj = await JSON.parse(followersData);
        let followingsObj = await JSON.parse(followingsData);

        let followersArr = followersObj.map((item) => {
            return item.string_list_data[0].value;
        })

        let followingsArr = followingsObj.relationships_following.map((item) => {
            return item.string_list_data[0].value;
        })

        let merged = [...followersArr, ...followingsArr];

        console.log('getting non-followers...')

        function nonIntersection(array1, array2) {
            return [...array1.filter(item => !array2.includes(item)), ...array2.filter(item => !array1.includes(item))];
        }

        let nonFollowers = nonIntersection(merged, followersArr)

        // delete the file after it has been processed
        console.log(extractDir, zipFilePath)
        await fs.promises.rm(extractDir, { recursive: true });
        await fs.promises.rm(zipFilePath);

        res.status(200).send(nonFollowers);

    } catch (error) {
        console.error('Error uploading or extracting file:', error);
        res.status(500).send('Failed to upload, extract, or process file');
    }
});

app.listen(PORT, () => {
    console.log('listening on port 3000')
})
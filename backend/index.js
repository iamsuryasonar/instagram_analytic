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

        function findMutual(followers, followings) {
            let common = [];
            for (let i = 0; i < followers.length; i++) {
                if (followings.includes(followers[i])) {
                    common.push(followers[i]);
                }
            }
            return common;
        }

        function findNonMutual(mergedArr, mutualFollowers) {
            return mergedArr.filter(item => !mutualFollowers.includes(item));
        }

        function findUsersIDontFollow(nonMutual, followingsArr) {
            return nonMutual.filter(item => !followingsArr.includes(item));
        }

        function findUsersWhoDontFollowMeBack(nonMutual, followersArr) {
            return nonMutual.filter(item => !followersArr.includes(item));
        }

        console.log('getting non-followers...')

        // mathematically intersection
        const mutualFollowers = findMutual(followersArr, followingsArr)

        // mathematically union
        const mergedArr = [...followersArr, ...followingsArr]

        // mathematically difference
        const nonMutual = findNonMutual(mergedArr, mutualFollowers)

        // mathematically difference
        const nonFollowers = findUsersWhoDontFollowMeBack(nonMutual, followersArr);

        // mathematically difference
        const notFollowing = findUsersIDontFollow(nonMutual, followingsArr);

        // delete the file after it has been processed
        await fs.promises.rm(extractDir, { recursive: true });
        await fs.promises.rm(zipFilePath);

        res.status(200).send({
            followers: followersArr,
            followings: followingsArr,
            nonFollowers,
            notFollowing,
            mutualFollowers,
        });

    } catch (error) {
        console.error('Error uploading or extracting file:', error);
        res.status(500).send(`Something went wrong, ${error}`);
    }
});

app.listen(PORT, () => {
    console.log('listening on port 3000')
})
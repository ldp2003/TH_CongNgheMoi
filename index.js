
const express = require('express');
const PORT = 3000;
const app = express();
let courses = require('./data');
const bodyParser = require('body-parser');
const SubjectModel = require('./data.model');
const fileService = require('./file.service');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./views'));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', './views');

const multer = require('multer');

const storage = multer.memoryStorage({
    destination: function (req, file, callback) {
        callback(null, '');
    }
});

const upload = multer({ storage: storage, limits: { fileSize: 1024*1024*10 } });




app.get('/', async (req, res) => {
    try {
        const data = await SubjectModel.getSubjects();
        res.render('index', { courses: data });
    } catch (err) {
        console.error('Error: ', err);
        res.status(500).send('Request failed');
    }
});

app.post('/save', upload.single('file'), async (req, res) => {
    try {
        const id = Number(req.body.id);
        const name = req.body.name;
        const course_type = req.body.course_type;
        const semester = req.body.semester;
        const department = req.body.department;

        const image = req.body.file;

        console.log(req.body);
        console.log(image);
        const url = await fileService.uploadFile(image);


        const params = {
            "id": id,
            "name": name,
            "course_type": course_type,
            "semester": semester,
            "department": department,
            "image": url
        }

        await SubjectModel.createSubject(params);
        return res.redirect('/');
    } catch (err) {
        console.error('Error: ', err);
        res.status(500).send('Request failed');
    }
})

app.post('/delete', async (req, res) => {
    const courseIds = req.body.courseIds;
    console.log(courseIds);
    if (Array.isArray(courseIds)) {
        courseIds.forEach(id => {
            const index = courses.findIndex(course => course.id === id);
            if (index !== -1) {
                courses.splice(index, 1);
            }
        });
    } else if (courseIds) {
        const index = courses.findIndex(course => course.id === courseIds);
        if (index !== -1) {
            courses.splice(index, 1);
        }
    }
    res.redirect('/');
});

app.post('/delete/:id/:name', async (req, res)  => {
    const courseId = parseInt(req.params.id, 10);
    const name = req.params.name;
    console.log(courseId);
    console.log(name);
    if (courseId) {
        await SubjectModel.deleteSubject(courseId, name);
        res.redirect('/');
    } else {
        res.status(404).send('Course not found');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
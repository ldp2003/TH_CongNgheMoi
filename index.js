
const express = require('express');
const PORT = 3000;
const app = express();
let courses = require('./data');
const bodyParser = require('body-parser');
const SubjectModel = require('./data.model');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./views'));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', './views');



app.get('/', async (req, res) => {
    try {
        const data = await SubjectModel.getSubjects();
        res.render('index', { courses: data });
    } catch (err) {
        console.error('Error: ', err);
        res.status(500).send('Request failed');
    }
});

app.post('/save', async (req, res) => {
    try {
        const id = Number(req.body.id);
        const name = req.body.name;
        const course_type = req.body.course_type;
        const semester = req.body.semester;
        const department = req.body.department;

        const params = {
            "id": id,
            "name": name,
            "course_type": course_type,
            "semester": semester,
            "department": department
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

app.get('/delete/:id', (req, res) => {
    const courseId = req.params.id;
    console.log(courseId);
    const index = courses.findIndex(course => course.id === courseId);
    if (index !== -1) {
        courses.splice(index, 1);
        res.redirect('/');
    } else {
        res.status(404).send('Course not found');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
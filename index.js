const express = require('express');
const PORT = 3000;
const app = express();
let courses = require('./data');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./views'));

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
    return res.render('index', { courses });
});

app.post('/save', (req, res) => {
    const id = Number(req.body.id);
    const name = req.body.name;
    const course_type = req.body.course_type;
    const semester = req.body.semester;
    const department = req.body.department;

    const params ={
        "id": id,
        "name": name,
        "course_type": course_type,
        "semester": semester,
        "department": department
    }

    courses.push(params);

    return res.redirect('/');
})

app.post('/delete', (req, res) => {
    console.log('Data received: ', req.body);
    const listChecked = Object.values(req.body.courseIds);
    console.log('List checked: ', listChecked);
    if(listChecked.length <= 0) {
        return res.redirect('/');
    }

    function onDeleteItem(length){
        const idToDelete = Number(listChecked[length]);

        courses = courses.filter(course => course.id !== idToDelete);
        if(length > 0) {
            console.log('Data deleted:: ', JSON.stringify(courses));
            onDeleteItem(length - 1);
        }else {
            return res.redirect('/');
        }
    }

    onDeleteItem(listChecked.length - 1);
});

app.get('/delete/:id', (req, res) => {
    const id = Number(req.params.id);
    courses = courses.filter(course => course.id !== id);
    return res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
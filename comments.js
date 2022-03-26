const form = document.querySelector("form");
const fileupload = document.querySelector('#course');
const allinputs = document.querySelectorAll('input');
const coursetitle = allinputs[1];
const assignment1 = allinputs[2];
const skill1 = allinputs[3];
const assignment2 = allinputs[4];
const skill2 = allinputs[5];
const isFinal = allinputs[6];
const sampleComment = document.querySelector('#sample');

class Student {
    constructor(stuName, gender, mark, assignment1, assignment2, improvement) {
        this.stuName = stuName;
        this.gender = gender;
        this.mark = mark; //their midterm or final mark
        this.ass1 = assignment1; // highlight performance on an assignment
        this.ass2 = assignment2; // highlight an area of improvement 
        this.improvement = improvement;
        this.pronouns = ["they", "their"];
        this.descriptors = ["good", "solid"];
    }

    findImprovementsentence() {
        let thingsToImprove = {
            "responsibility": ["fulfilling responsibilities and commitments within the learning environment",
                "completing and submitting class work, homework, and assignments according to agreed-upon timelines",
                `taking responsibility for and managing ${this.pronouns[1]} own behaviour`],
            "organization": [`devising and following a plan and process for completing work and tasks`,
                `establishing priorities and managing time to complete tasks and achieve goals`,
                `identifying, gathering, evaluating, and using information, technology, and resources to complete tasks`],
            "independent work": [`independently monitoring, assessing, and revising plans to complete tasks and meet goals`,
                `using class time appropriately to complete tasks`,
                `following instructions with minimal supervision`],
            "collaboration": [`accepting various roles and an equitable share of work in a group`,
                `responding positively to the ideas, opinions, values, and traditions of others`,
                `building healthy peer-to-peer relationships through personal and media-assisted interactions`,
                `working with others to resolve conflicts and build consensus to achieve group goals`,
                `sharing information, resources, and expertise and promoting critical thinking to solve problems and make decisions`],
            "initiative": [`looking for and acting on new ideas and opportunities for learning`,
                `demonstrating the capacity for innovation and a willingness to take risks`,
                `demonstrating curiosity and interest in learning`,
                `approaching new tasks with a positive attitude`,
                `recognizing and advocating appropriately for the rights of ${this.pronouns[1]}self and others`],
            "self-regulation": [`settings ${this.pronouns[1]} own individual goals and monitors progress towards achieving them`,
                `seeking clarification or assistance when needed`,
            `assessing and reflecting critically on ${this.pronouns[1]} own strengths, needs, and interests`,
            `identifying learning opportunities, choices, and strategies to meet ${this.pronouns[1]} needs and achieve goals`,
                `persevering and making an effort when responding to challenges`]
        }

        let randomIndex = Math.floor(Math.random() * thingsToImprove[this.improvement].length);
        let improvementSentence = thingsToImprove[this.improvement][randomIndex];

        return improvementSentence;
    }
}

class CourseInfo {
    constructor(title, ass1, skill1, ass2, skill2, final) {
        this.title = title;
        this.ass1 = ass1;
        this.ass2 = ass2;
        this.skill1 = skill1;
        this.skill2 = skill2;
        this.final = final;
        this.stuList = [];
    }

    chooseDescriptors(stu) {
        if (stu.gender.toLowerCase() == "m") { //choosing student pronouns
            stu.pronouns[0] = "he";
            stu.pronouns[1] = "his";
        } else if (stu.gender.toLowerCase() == "f") {
            stu.pronouns[0] = "she";
            stu.pronouns[1] = "her";
        }

        if (stu.mark >= 90) {  // choosing description of performance
            stu.descriptors = ["excellent", "consistently"];
        } else if (stu.mark >= 80) {
            stu.descriptors = ["strong", "consistently"];
        } else if (stu.mark >= 75) {
            stu.descriptors = ["considerable", "usually"];
        } else if (stu.mark >= 60) {
            stu.descriptors = ["some", "sometimes"];
        } else if (stu.mark >= 50) {
            stu.descriptors = ["limited", "occasionally"];
        } else {
            stu.descriptors = ["little", "rarely"];
        }

    }
    createComment(stu) {
        this.chooseDescriptors(stu);

        let descriptor1 = stu.descriptors[0];
        let descriptor2 = stu.descriptors[1];
        let pronoun1 = stu.pronouns[0];
        let pronoun2 = stu.pronouns[1];
        let improve = stu.findImprovementsentence();

        let sentence1 = `${stu.stuName} is achieving ${descriptor1} success in our ${this.title} course. `
        let sentence2 = `On ${pronoun2} ${this.ass1}, ${stu.stuName} showed that ${pronoun1} could ${descriptor2} ${this.skill1}. `
        let sentence3 = `On ${pronoun2} ${this.ass2}, ${pronoun1} showed that ${pronoun1} could ${this.skill2} with ${descriptor1} success. `
        let sentence4 = `${stu.stuName} ${descriptor2} fulfils ${pronoun2} responsibilities in the classroom and will benefit from ${improve}.`
        let comment = sentence1.concat(sentence2, sentence3, sentence4);

        if (this.final === true) {
            comment = comment.concat(` I wish ${stu.stuName} all the best in ${pronoun2} future studies.`);
        }

        return comment;
    }
}

// creates array of objects containing student attributes
function csvToArray(str, delimiter = ",") {
    const rows = str.split("\r\n");
    const students = rows.slice(1, rows.length - 1);
    const data = [];

    for (let i = 0; i < students.length; i++) {
        let studentInfo = students[i].split(delimiter); // creates list of student attributes

        let stuName = studentInfo[0]; //laying out all student attributes for coding clarity
        let stuGen = studentInfo[1];
        let stuGrade = studentInfo[2];
        let stuAss1 = studentInfo[3];
        let stuAss2 = studentInfo[4];
        let stuImprovement = studentInfo[5];

        let newStudent = new Student(stuName, stuGen, stuGrade, stuAss1, stuAss2, stuImprovement); //creates student object
        newStudent.findImprovementsentence();
        data.push(newStudent); // adds student object to data list
    }
    return data; //returns list of student objects
}

form.addEventListener('submit', function (e) { // event listener for generating comments when submit is clicked
    e.preventDefault();

    const newCourse = new CourseInfo(coursetitle.value, assignment1.value, skill1.value, assignment2.value, skill2.value, isFinal.checked);
    const file = fileupload.files[0];
    const reader = new FileReader();

    reader.readAsText(file);
    reader.onload = function (e) {
        const text = e.target.result;
        const studentData = csvToArray(text);
        newCourse.stuList = studentData;

        const classList = document.querySelector('ol');
        while (classList.childNodes.length != 0) { // if comments were already generated, this clears previous comments
            classList.removeChild(classList.lastChild);
        }

        for (let student of newCourse.stuList) { //creates list of comments
            let comment = newCourse.createComment(student);
            let stuComment = document.createElement('li');
            stuComment.innerText = comment;
            classList.appendChild(stuComment);
        }
    }
});

let sampleStudent = new Student("Elon","none","75","A","C","responsibility")
let sampleCourse = new CourseInfo(coursetitle.placeholder,assignment1.placeholder, 
    skill1.placeholder, ass2.placeholder, 
    skill2.placeholder, isFinal);
sampleCourse.stuList = [sampleStudent];
sampleCourse.chooseDescriptors(sampleStudent);
sampleComment.textContent = sampleCourse.createComment(sampleStudent);
// sampleComment.addEventListener()
// === STUDENT LIST ===
const students = [
  "Ainebyoona Paul","Isingoma Melvin","Kitsamba Timothy","Shammah Lukwago",
  "Murungi Ellah","Mbabazi Ethania Eugene","Kasirye Daniel","Akena Benjamin",
  "Mukisa Henry Newton","Walugembe Victor","Akampa Owen","Ahurira Joel Kakuru",
  "Nabwire Daizy","Okello Martin","Namugisha Faith","Ssenoga Peter",
  "Kato Brian","Nansubuga Sarah","Mugisha Alex","Tumusiime Ruth",
  "Nalwanga Grace","Bukenya John","Mutebi Joseph","Baluku Dennis","Kyomuhendo Anna"
];

// === TEACHERS PER SUBJECT ===
const teachers = {
  ENG: "Mr. Okello",
  MTC: "Ms. Namatovu",
  BIO: "Dr. Musoke",
  CHEM: "Mr. Kaggwa",
  HISTORY: "Mrs. Kabonesa",
  CRE: "Rev. Ssewagudde",
  HYT: "Mr. Byaruhanga",
  ESSAY: "Ms. Cathy"
};

// === DATABASE ===
let records = {};  // { studentName: { subject: score, ... } }

// === INITIAL LOAD ===
window.onload = function() {
  populateStudents();
  showTeacher();
  updateLeaderboard();
};

// Populate student dropdown
function populateStudents() {
  const select = document.getElementById("studentSelect");
  select.innerHTML = "";
  students.sort().forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });
}

// Show teacher when subject selected
function showTeacher() {
  const subject = document.getElementById("subjectSelect").value;
  document.getElementById("teacherDisplay").textContent = teachers[subject];
  if (subject === "ESSAY") {
    document.getElementById("promptBox").classList.add("hidden");
    document.getElementById("essayBox").classList.remove("hidden");
  } else {
    document.getElementById("promptBox").classList.remove("hidden");
    document.getElementById("essayBox").classList.add("hidden");
  }
}

// Switch pages
function showSection(section) {
  document.querySelectorAll(".page-section").forEach(s => s.classList.add("hidden"));
  document.getElementById(section).classList.remove("hidden");
}

// Mark and grade
function markAndGrade() {
  const subject = document.getElementById("subjectSelect").value;
  const student = document.getElementById("studentSelect").value;
  const level = document.getElementById("markingLevel").value;

  let score = 0, total = 0, feedback = "";

  if (subject === "ESSAY") {
    const essay = document.getElementById("studentWork").value.trim();
    const title = document.getElementById("essayTitle").value.trim();
    if (!title || !essay) {
      alert("Enter essay title and content!");
      return;
    }
    // Simple judging criteria
    score = gradeEssay(essay);
    total = 100;
    feedback = "Essay graded based on criteria.";
  } else {
    const prompt = document.getElementById("answerPrompt").value.trim().split("\n");
    const work = document.getElementById("studentWork").value.trim().split("\n");
    total = prompt.length;
    let correct = 0;
    let errors = [];

    work.forEach((ans, i) => {
      const correctAns = prompt[i] ? prompt[i].trim() : "";
      if (compareAnswers(ans.trim(), correctAns, level)) {
        correct++;
      } else {
        errors.push(`Q${i+1}: Your answer = "${ans}", Correct = "${correctAns}"`);
      }
    });

    score = Math.round((correct / total) * 100);
    feedback = errors.length ? errors.join("<br>") : "Excellent work!";
  }

  // Save record
  if (!records[student]) records[student] = {};
  records[student][subject] = score;

  // Grade letter
  let grade = "E", comment = "Needs serious improvement.";
  if (score >= 80) { grade = "A"; comment = "Excellent work!"; }
  else if (score >= 70) { grade = "B"; comment = "Very good performance."; }
  else if (score >= 60) { grade = "C"; comment = "Good, but keep improving."; }
  else if (score >= 50) { grade = "D"; comment = "Fair, needs more effort."; }

  document.getElementById("resultBox").innerHTML = `
    <h3>Results for ${student} (${subject})</h3>
    <p><strong>Score:</strong> ${score}/${total} = ${score}%</p>
    <p><strong>Grade:</strong> ${grade}</p>
    <p><strong>Comment:</strong> ${comment}</p>
    <p><strong>Details:</strong><br>${feedback}</p>
  `;

  updateLeaderboard();
}

// Compare answers with forgiveness
function compareAnswers(given, correct, level) {
  if (given === correct) return true;
  if (!given || !correct) return false;

  if (level === "lenient") {
    return Math.abs(parseFloat(given) - parseFloat(correct)) <= 2;
  } else if (level === "medium") {
    return Math.abs(parseFloat(given) - parseFloat(correct)) <= 1;
  } else {
    return false;
  }
}

// Essay grading criteria (simple demo)
function gradeEssay(essay) {
  let score = 50; // base
  if (essay.length > 200) score += 20;
  if (essay.match(/introduction|curious|attention/i)) score += 15;
  if (essay.match(/conclusion|summary|insight/i)) score += 15;
  return Math.min(100, score);
}

// Leaderboard
function updateLeaderboard() {
  const tbody = document.querySelector("#leaderboardTable tbody");
  tbody.innerHTML = "";

  let averages = [];
  for (let student in records) {
    const subs = Object.keys(records[student]);
    const avg = subs.reduce((a,b)=>a+records[student][b],0)/subs.length;
    averages.push({ student, subjects: subs.length, avg });
  }

  averages.sort((a,b) => b.avg - a.avg);

  averages.forEach((r,i) => {
    const row = `<tr>
      <td>${i+1}</td>
      <td>${r.student}</td>
      <td>${r.subjects}</td>
      <td>${r.avg.toFixed(1)}</td>
    </tr>`;
    tbody.innerHTML += row;
  });
}
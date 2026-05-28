
const MAX_SLOTS = 5;

const timeSlots = [
    "9-10",
    "10-11",
    "11-12",
    "12-1",
    "1-2"
];

let rooms = [];
let teachers = [];

let roomSlots = [];
let teacherSlots = [];
let timetable = [];

// ======================
// PAGE NAVIGATION
// ======================

function showPage(pageId) {

    let pages =
        document.querySelectorAll(".page");

    pages.forEach(page => {
        page.classList.remove("active");
    });

    document
        .getElementById(pageId)
        .classList.add("active");

    updateDropdowns();
}

// ======================
// ADD ROOM
// ======================

function addRoom() {

    let roomName =
        document.getElementById(
            "roomInput"
        ).value.trim();

    if (roomName === "") {
        alert("Enter room name");
        return;
    }

    rooms.push(roomName);

    roomSlots.push(
        new Array(MAX_SLOTS).fill(0)
    );

    timetable.push(
        new Array(MAX_SLOTS).fill(-1)
    );

    document.getElementById(
        "roomInput"
    ).value = "";

    updateDashboard();
    updateDropdowns();
}

// ======================
// ADD TEACHER
// ======================

function addTeacher() {

    let teacherName =
        document.getElementById(
            "teacherInput"
        ).value.trim();

    if (teacherName === "") {
        alert("Enter teacher name");
        return;
    }

    teachers.push(teacherName);

    teacherSlots.push(
        new Array(MAX_SLOTS).fill(0)
    );

    document.getElementById(
        "teacherInput"
    ).value = "";

    updateDashboard();
    updateDropdowns();
}

// ======================
// UPDATE DROPDOWNS
// ======================

function updateDropdowns() {

    const teacherSelect =
        document.getElementById(
            "teacherSelect"
        );

    const roomSelect =
        document.getElementById(
            "roomSelect"
        );

    const slotSelect =
        document.getElementById(
            "slotSelect"
        );

    const roomCheck =
        document.getElementById(
            "checkRoom"
        );

    const roomSlotCheck =
        document.getElementById(
            "checkRoomSlot"
        );

    const teacherCheck =
        document.getElementById(
            "checkTeacher"
        );

    const teacherSlotCheck =
        document.getElementById(
            "checkTeacherSlot"
        );

    // reset
    teacherSelect.innerHTML = "";
    roomSelect.innerHTML = "";
    slotSelect.innerHTML = "";

    roomCheck.innerHTML = "";
    roomSlotCheck.innerHTML = "";

    teacherCheck.innerHTML = "";
    teacherSlotCheck.innerHTML = "";

    teachers.forEach((teacher, i) => {

        teacherSelect.innerHTML +=
            `<option value="${i}">
                ${teacher}
            </option>`;

        teacherCheck.innerHTML +=
            `<option value="${i}">
                ${teacher}
            </option>`;
    });

    rooms.forEach((room, i) => {

        roomSelect.innerHTML +=
            `<option value="${i}">
                ${room}
            </option>`;

        roomCheck.innerHTML +=
            `<option value="${i}">
                ${room}
            </option>`;
    });

    timeSlots.forEach((slot, i) => {

        slotSelect.innerHTML +=
            `<option value="${i}">
                ${slot}
            </option>`;

        roomSlotCheck.innerHTML +=
            `<option value="${i}">
                ${slot}
            </option>`;

        teacherSlotCheck.innerHTML +=
            `<option value="${i}">
                ${slot}
            </option>`;
    });
}

// ======================
// DETECT CONFLICT
// ======================

function detectConflict(
    teacherIndex,
    roomIndex,
    slot
) {

    if (
        roomSlots[roomIndex][slot]
        === 1
    ) {
        return "Room already occupied";
    }

    if (
        teacherSlots[
            teacherIndex
        ][slot] === 1
    ) {
        return "Teacher already busy";
    }

    return null;
}

// ======================
// BOOK CLASS
// ======================

function bookClass() {

    const teacher =
        document.getElementById(
            "teacherSelect"
        ).value;

    const room =
        document.getElementById(
            "roomSelect"
        ).value;

    const slot =
        document.getElementById(
            "slotSelect"
        ).value;

    const conflict =
        detectConflict(
            teacher,
            room,
            slot
        );

    if (conflict) {

        document.getElementById(
            "bookMsg"
        ).innerHTML =
            conflict;

        return;
    }

    roomSlots[room][slot] = 1;
    teacherSlots[
        teacher
    ][slot] = 1;

    timetable[room][slot] =
        teacher;

    document.getElementById(
        "bookMsg"
    ).innerHTML =
        "Booking Successful";

    updateDashboard();
    renderTimetable();
    renderFinal();
}

// ======================
// ROOM CHECK
// ======================

function checkRoom() {

    const room =
        document.getElementById(
            "checkRoom"
        ).value;

    const slot =
        document.getElementById(
            "checkRoomSlot"
        ).value;

    let message =
        roomSlots[room][slot] === 0
        ? "Room is FREE"
        : "Room is OCCUPIED";

    document.getElementById(
        "roomMsg"
    ).innerHTML = message;
}

// ======================
// TEACHER CHECK
// ======================

function checkTeacher() {

    const teacher =
        document.getElementById(
            "checkTeacher"
        ).value;

    const slot =
        document.getElementById(
            "checkTeacherSlot"
        ).value;

    let message =
        teacherSlots[
            teacher
        ][slot] === 0
        ? "Teacher is FREE"
        : "Teacher is BUSY";

    document.getElementById(
        "teacherMsg"
    ).innerHTML = message;
}

// ======================
// TIMETABLE
// ======================

function renderTimetable() {

    let table =
        document.getElementById(
            "fullTable"
        );

    let html = `
    <tr>
        <th>Room</th>
    `;

    timeSlots.forEach(slot => {
        html += `<th>${slot}</th>`;
    });

    html += `</tr>`;

    rooms.forEach((room, r) => {

        html += `
        <tr>
        <td>${room}</td>
        `;

        for (
            let s = 0;
            s < MAX_SLOTS;
            s++
        ) {

            if (
                roomSlots[r][s]
                === 0
            ) {

                html +=
                    `<td>Free</td>`;

            } else {

                html += `
                <td>
                    ${
                        teachers[
                            timetable[r][s]
                        ]
                    }
                </td>`;
            }
        }

        html += "</tr>";
    });

    table.innerHTML = html;

    document.getElementById(
        "dashboardTable"
    ).innerHTML = html;
}

// ======================
// FINAL TIMETABLE
// ======================

function renderFinal() {

    let container =
        document.getElementById(
            "finalSchedule"
        );

    container.innerHTML = "";

    for (
        let r = 0;
        r < rooms.length;
        r++
    ) {

        for (
            let s = 0;
            s < MAX_SLOTS;
            s++
        ) {

            if (
                roomSlots[r][s]
                === 1
            ) {

                let teacher =
                    timetable[r][s];

                container.innerHTML += `
                <div class="final-item">
                    ${rooms[r]}
                    →
                    ${timeSlots[s]}
                    →
                    ${teachers[teacher]}
                </div>
                `;
            }
        }
    }
}

// ======================
// DASHBOARD
// ======================

function updateDashboard() {

    document.getElementById(
        "roomCount"
    ).innerHTML =
        rooms.length;

    document.getElementById(
        "teacherCount"
    ).innerHTML =
        teachers.length;

    let booked = 0;

    roomSlots.forEach(room => {
        room.forEach(slot => {

            if (slot === 1) {
                booked++;
            }
        });
    });

    let total =
        rooms.length *
        MAX_SLOTS;

    document.getElementById(
        "bookedCount"
    ).innerHTML = booked;

    document.getElementById(
        "freeCount"
    ).innerHTML =
        total - booked;

    renderTimetable();
}


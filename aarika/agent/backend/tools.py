from agents import function_tool
from .data import STUDENTS, TASKS, POLICIES

@function_tool
def get_class_attendance(class_name: str) -> str:
    """Return attendance and academic indicators for students in a class."""
    rows = [s for s in STUDENTS if s["class_name"].lower() == class_name.lower()]
    if not rows:
        return f"No students found for {class_name}."
    return "\n".join(
        f'{s["id"]} | {s["name"]} | attendance={s["attendance"]}% | maths={s["math"]}%'
        for s in rows
    )

@function_tool
def get_student_profile(student_id: str) -> str:
    """Return the AARIKA profile summary for one student."""
    for s in STUDENTS:
        if s["id"].lower() == student_id.lower():
            return str(s)
    return f"Student {student_id} was not found."

@function_tool
def search_school_policy(topic: str) -> str:
    """Retrieve the most relevant school policy/SOP for a topic."""
    t = topic.lower()
    if any(x in t for x in ["attendance", "absent", "absence", "75"]):
        return POLICIES["attendance"]
    if any(x in t for x in ["academic", "marks", "math", "learning", "intervention"]):
        return POLICIES["academic"]
    if any(x in t for x in ["parent", "message", "communication"]):
        return POLICIES["parent"]
    return "\n\n".join(POLICIES.values())

@function_tool
def create_followup_task(owner: str, title: str, details: str) -> str:
    """Create a follow-up task after the user explicitly asks for it."""
    task = {
        "id": f"TASK-{len(TASKS)+1:03d}",
        "owner": owner,
        "title": title,
        "details": details,
        "status": "OPEN",
    }
    TASKS.append(task)
    return f"Task created successfully: {task}"

@function_tool
def list_open_tasks() -> str:
    """Return currently open AARIKA tasks."""
    open_tasks = [t for t in TASKS if t["status"] == "OPEN"]
    return str(open_tasks) if open_tasks else "No open tasks."

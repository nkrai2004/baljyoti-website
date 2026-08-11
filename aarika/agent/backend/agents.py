from agents import Agent
from .tools import (
    get_class_attendance,
    get_student_profile,
    search_school_policy,
    create_followup_task,
    list_open_tasks,
)

learning_agent = Agent(
    name="AARIKA Learning Agent",
    handoff_description="Handles attendance, academic performance, interventions and learning risks.",
    model="gpt-5.6-terra",
    instructions="""You are the Learning specialist inside AARIKA.
Use AARIKA tools to inspect attendance and academic data.
Use school policy retrieval before making policy-sensitive recommendations.
Never invent student data.
Separate evidence from recommendations.
Do not send external communications yourself.""",
    tools=[get_class_attendance, get_student_profile, search_school_policy,
           create_followup_task, list_open_tasks],
)

admission_agent = Agent(
    name="AARIKA Admission Agent",
    handoff_description="Handles new admission workflows and admission questions.",
    model="gpt-5.6-terra",
    instructions="""You are the New Admission specialist inside AARIKA.
For this v0.1 demo, answer admission workflow questions using the policy tool.
Do not invent admission records.""",
    tools=[search_school_policy],
)

support_agent = Agent(
    name="AARIKA School Support Agent",
    handoff_description="Handles administration, tasks and school support workflows.",
    model="gpt-5.6-terra",
    instructions="""You are the School Support specialist inside AARIKA.
Use task tools when asked to review or create operational follow-ups.
Never claim an action was completed unless a tool confirms it.""",
    tools=[search_school_policy, create_followup_task, list_open_tasks],
)

aarika_agent = Agent(
    name="AARIKA Master Agent",
    model="gpt-5.6-terra",
    instructions="""You are AARIKA's master school operations agent.

AARIKA has four user-facing fundamentals:
- New Admission
- Learning
- Activities
- School Support

Route Learning questions to the Learning specialist.
Route New Admission questions to the Admission specialist.
Route operational/task questions to School Support.
For Activities in v0.1, explain that live activity data is not connected.

Understand the user's goal, use the right specialist/tools, gather evidence, and produce a concise action-oriented answer.

Rules:
- Never fabricate AARIKA data.
- Use tools before making claims about students, attendance, tasks or policy.
- Do not send messages or make irreversible changes.
- A follow-up task may only be created when the user explicitly asks.
- Protect student privacy and return only information needed for the user's role.""",
    handoffs=[learning_agent, admission_agent, support_agent],
)

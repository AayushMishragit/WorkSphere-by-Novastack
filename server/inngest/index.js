import sendEmail from "../configs/nodemailer.js";
import { prisma } from "../configs/prisma.js";
import { Inngest } from "inngest";

export const inngest = new Inngest({ id: "project-management" });

const getName = (d) => `${d.first_name ?? ""} ${d.last_name ?? ""}`.trim();
//function for creating user in database
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk", triggers: { event: "clerk/user.created" } },
  async ({ event }) => {
    const { data } = event;
    await prisma.user.create({
      data: {
        id: data.id,
        email: data.email_addresses[0]?.email_address,
        name: getName(data),
        image: data.image_url,
      },
    });
  },
);
//function for delete user in database
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk", triggers: { event: "clerk/user.deleted" } },
  async ({ event }) => {
    const { data } = event;
    await prisma.user.delete({ where: { id: data.id } });
  },
);
//function for updating user in database
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk", triggers: { event: "clerk/user.updated" } },
  async ({ event }) => {
    const { data } = event;
    await prisma.user.update({
      where: { id: data.id },
      data: {
        email: data.email_addresses[0]?.email_address,
        name: getName(data),
        image: data.image_url,
      },
    });
  },
);

const syncWorkspaceCreation = inngest.createFunction(
  {
    id: "sync-workspace-from-clerk",
    triggers: { event: "clerk/organization.created" },
  },
  async ({ event }) => {
    const { data } = event;
    await prisma.workspace.create({
      data: {
        id: data.id,
        name: data.name,
        slug: data.slug,
        ownerId: data.created_by,
        image_url: data.image_url,
        members: { create: { userId: data.created_by, role: "ADMIN" } }, // creator = admin, one atomic call
      },
    });
  },
);

const syncWorkspaceUpdation = inngest.createFunction(
  {
    id: "update-workspace-from-clerk",
    triggers: { event: "clerk/organization.updated" },
  },
  async ({ event }) => {
    const { data } = event;
    await prisma.workspace.update({
      where: { id: data.id },
      data: { name: data.name, slug: data.slug, image_url: data.image_url },
    });
  },
);

const syncWorkspaceDeletion = inngest.createFunction(
  {
    id: "delete-workspace-with-clerk",
    triggers: { event: "clerk/organization.deleted" },
  },
  async ({ event }) => {
    const { data } = event;
    await prisma.workspace.deleteMany({ where: { id: data.id } }); // doesn't throw if already gone
  },
);

const syncWorkspaceMemberCreation = inngest.createFunction(
  {
    id: "sync-workspace-member-from-clerk",
    triggers: { event: "clerk/organizationInvitation.accepted" },
  },
  async ({ event }) => {
    const { data } = event;
    const isAdmin = /admin/i.test(data.role_name ?? data.role ?? "");
    await prisma.workspaceMember.create({
      data: {
        userId: data.user_id,
        workspaceId: data.organization_id,
        role: isAdmin ? "ADMIN" : "MEMBER",
      },
    });
  },
);

//function for sending email on task creation
const sendTaskAssignmentEmail = inngest.createFunction(
  {
    id: "send-task-assignment-email",
    triggers: { event: "app/task.assigned" },
  },

  async ({ event, step }) => {
    const { taskId, origin } = event.data;
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { assignee: true, project: true },
    });

    await sendEmail({
      to: task.assignee.email,
      subject: `New Task Assignment in  ${task.project.name}`,
      body: `<div style="background-color:#f3f4f6;padding:24px;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background-color:#ffffff;border:1px solid #e5e7eb;border-top:4px solid #4f46e5;border-radius:12px;padding:32px;">

    <h2 style="margin:0 0 20px;font-size:20px;line-height:1.3;color:#111827;">
      Hello ${esc(task.assignee.name)}👋
    </h2>
    <b> <p style="margin:0;font-size:14px;line-height:1.6;color:#374151;"> ${esc(task.title)}</p></b>
         
    <div style="background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:20px;">
      <p style="margin:0 0 6px;font-size:12px;font-weight:bold;letter-spacing:0.5px;text-transform:uppercase;color:#6b7280;">
        Description
      </p>
      <p style="margin:0;font-size:14px;line-height:1.6;color:#374151;">
        ${esc(task.description)}
      </p>
    </div>

    <p style="margin:0 0 28px;font-size:14px;color:#374151;">
      ${new Date(task.due_date).toLocaleDateString()}
    </p>

    <a href="${origin}" style="display:inline-block;background-color:#4f46e5;color:#ffffff;font-size:14px;font-weight:bold;text-decoration:none;padding:12px 24px;border-radius:8px;">
      View Task
    </a>

  </div>
</div>`,
    });
    if (
      new Date(task.due_date).toLocaleDateString() != new Date().toDateString()
    ) {
      await step.sleepUntil("wait-for-the-due-date", new Date(task.due_date));

      //if new date comes
      await step.run("check-if-task-is-complted", async () => {
        const task = await prisma.task.findUnique({
          where: { id: taskId },
          include: { assignee: true, project: true },
        });
        if (!task) return;
        if (task.status !== "DONE") {
          await step.run("send-task-remainder-email", async () => {
            await sendEmail({
              to: task.assignee.email,
              subject: `Remainder for ${task.project.name}`,
              body: `Reminder: ${latest.title} is due`,
              body: `
<div style="background-color:#f3f4f6;padding:24px;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background-color:#ffffff;border:1px solid #e5e7eb;border-top:4px solid #f59e0b;border-radius:12px;padding:32px;">

    <p style="margin:0 0 8px;font-size:12px;font-weight:bold;letter-spacing:0.5px;text-transform:uppercase;color:#d97706;">
      Task Reminder
    </p>

    <h2 style="margin:0 0 20px;font-size:20px;line-height:1.3;color:#111827;">
      Hello ${esc(latest.assignee.name)}: ${esc(latest.title)}
    </h2>

    <div style="background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:20px;">
      <p style="margin:0 0 6px;font-size:12px;font-weight:bold;letter-spacing:0.5px;text-transform:uppercase;color:#6b7280;">
        Description
      </p>
      <p style="margin:0;font-size:14px;line-height:1.6;color:#374151;">
        ${esc(latest.description)}
      </p>
    </div>

    <p style="margin:0 0 28px;font-size:14px;color:#374151;">
      <strong>Due date:</strong> ${new Date(latest.due_date).toLocaleDateString()}
    </p>

    <a href="${origin}" style="display:inline-block;background-color:#f59e0b;color:#111827;font-size:14px;font-weight:bold;text-decoration:none;padding:12px 24px;border-radius:8px;">
      View Task
    </a>

  </div>
</div>`,
            });
          });
        }
      });
    }
  },
);
export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
  syncWorkspaceCreation,
  syncWorkspaceDeletion,
  syncWorkspaceUpdation,
  syncWorkspaceMemberCreation,
  sendTaskAssignmentEmail,
];

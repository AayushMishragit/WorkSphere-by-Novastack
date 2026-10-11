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
export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
  syncWorkspaceCreation,
  syncWorkspaceDeletion,
  syncWorkspaceUpdation,
  syncWorkspaceMemberCreation,
];

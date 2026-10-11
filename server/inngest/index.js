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
        email: data.email_addresses[0]?.email_addressess,
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

export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdation];

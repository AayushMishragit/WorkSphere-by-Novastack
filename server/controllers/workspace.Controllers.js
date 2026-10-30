import prisma from "../configs/prisma.js";

//function to return the workspaces of a particular user
export const getUserWorkspaces = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const workspaces = await prisma.workspace.findMany({
      where: {
        members: { some: { userId } },
      },
      include: {
        owner: true,
        members: { include: { user: true } },
        projects: {
          include: {
            members: { include: { user: true } },
            tasks: {
              include: {
                assignee: true,
                comments: { include: { user: true } },
              },
            },
            owner: true,
          },
        },
      },
    });
    res.json({ workspaces });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.code || error.message });
  }
};
//add member to workspace

export const addMember = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { email, role, workspaceId, message } = req.body();
    //check user exist or not
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "user doesn't exists" });
    }

    if (!workspaceId || !role) {
      return res.status(404).json({ message: "missing required parameters" });
    }

    if (!["ADMIN", "MEMBERS"].includes(role)) {
      return res.status(404).json({ message: "Role not exists" });
    }
    //fetch workspace
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: { members: true },
    });
    if (!workspace) {
      return res.status(404).json({ message: "worspace not found" });
    }

    // creator has the admin role
    if (
      !workspace.members.find(
        (member) => member.userId === userId && member.role === "ADMIN",
      )
    ) {
      return res.status(404).json({ message: "creater is not an admin" });
    }

    //user is already a member
    const existingMember = workspace.members.find(
      (member) => member.userId === userId,
    );
    if (existingMember) {
      return res.status(404).json({ message: "User is already a member" });
    }

    const member = await prisma.workspaceMember.create({
      data: {
        userId: userId,
        workspaceId: workspaceId,
        role,
        message,
      },
    });

    res.json({ member, message: "Member has been added Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.code || error.message });
  }
};

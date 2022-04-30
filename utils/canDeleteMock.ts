import { CollaboratorRoleEnum, Mock, Project } from "./types";

const canDeleteMock = (
  userEmail: string | undefined | null,
  projectData: Project | undefined,
  mockData: Mock | undefined
): boolean => {
  if (!userEmail || !projectData || !mockData) {
    return false;
  }

  const projectCollaborators = projectData.collaborators;
  const projectAdminEmails = Object.keys(projectCollaborators).filter(
    (email) => projectCollaborators[email].role === CollaboratorRoleEnum.ADMIN
  );
  const isMockAuthor = mockData.authorEmail === userEmail;
  return isMockAuthor || projectAdminEmails.includes(userEmail);
};

export default canDeleteMock;

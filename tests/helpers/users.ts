
export type UserType = {
  id: number
  username: string
  email: string
  password: string
  onboarded: boolean
  role: {
    id: number
  }
}

export default async function useUser(user) {

  const existingUsers = await findUsersByEmail(user.email);

  if (existingUsers.length === 0) {
    const newUser = await createUser(user);
    const jwt = issueJwt(newUser.id);
    return {
      jwt,
      user: newUser,
    };
  }

  const jwt = issueJwt(existingUsers[0].id);
  return {
    jwt,
    user: existingUsers[0],
  };
}

async function findUsersByEmail(email) {
  return await strapi.entityService.findMany('plugin::users-permissions.user', {
    filters: {
      email,
    },
  });
}


async function createUser(user) {
  return await strapi.plugins["users-permissions"].services.user.add({
    ...user,
    provider: 'local',
  });
}

function issueJwt(userId) {
  return strapi.plugins['users-permissions'].services.jwt.issue({
    id: userId,
  });
}
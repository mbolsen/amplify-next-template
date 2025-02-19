import { CognitoIdentityProviderClient, ListUsersCommand, ListUsersInGroupCommand } from "@aws-sdk/client-cognito-identity-provider";
import { env } from "$amplify/env/userGroups";
import { Schema } from "../../../data/resource";

const client = new CognitoIdentityProviderClient();

type IUsersAndGroups = {
  [key: string]: {
    groups: string[];
    email: string;
    status: string;
  };
}

export const handler: Schema['userGroups']['functionHandler'] = async (event): Promise<any> => {
  let result: IUsersAndGroups = {};

  // Fetch all users from the user pool
  const allUsersResponse = await client.send(new ListUsersCommand({
    UserPoolId: env.AMPLIFY_AUTH_USERPOOL_ID,
  }));

  console.log('ALL USERS', allUsersResponse.Users);

  const allUsers = allUsersResponse.Users || [];

  // Fetch users in each group
  const groupPromises = ['EVERYONE', "ADMIN", "STAFF_PAY", "STAFF"].map(async (GroupName) => {
    const { Users } = await client.send(new ListUsersInGroupCommand({
      GroupName: GroupName,
      UserPoolId: env.AMPLIFY_AUTH_USERPOOL_ID,
    }));

    if (!Users) {
      console.log('NO USERS IN GROUP', GroupName);
      return;
    }

    Users.forEach((user) => {
      if (user.Username) {
        if (!result[user.Username]) {
          const emailAttribute = user.Attributes?.find(attr => attr.Name === 'email');
          const statusAttribute = user.UserStatus;

          result[user.Username] = {
            email: emailAttribute?.Value || "",
            status: statusToString(statusAttribute),
            groups: []
          };
        }
        result[user.Username].groups.push(GroupName);
      }
    });
  });

  await Promise.all(groupPromises);

  // Add users without a group to the result
  allUsers.forEach((user) => {
    if (user.Username && !result[user.Username]) {
      const emailAttribute = user.Attributes?.find(attr => attr.Name === 'email');
      const statusAttribute = statusToString(user.UserStatus);

      result[user.Username] = {
        email: emailAttribute?.Value || "",
        status: statusAttribute || "",
        groups: []
      };
    }
  });

  return result;
};

function statusToString(status: string | undefined): string {
  switch (status) {
    case 'FORCE_CHANGE_PASSWORD':
      return 'Invited / Changed Password';
    case 'CONFIRMED':
      return 'Confirmed';
    case 'UNCONFIRMED':
      return 'Unconfirmed';
    case 'ARCHIVED':
      return 'Archived';
    case 'COMPROMISED':
      return 'Compromised';
    case 'UNKNOWN':
    default:
      return status?.toString() || 'Unknown';
  }
}
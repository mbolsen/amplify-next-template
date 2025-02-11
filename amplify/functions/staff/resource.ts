import { a } from "@aws-amplify/backend";
import { GROUPS } from "../../auth/resource";
import { defineFunction } from "@aws-amplify/backend";

export const addStaff = defineFunction({
  name: 'addStaff', // this will default to the directory name, so in this case is optional
  entry: './handler.ts', // this will default to ./handler.ts so really it is optional
  environment: {
    GROUP_NAME: 'EVERYONE',
    STAFF_TABLE_NAME: 'Staff'
  }
})

export const addStaffMutation = a
  .mutation()
  .arguments({
    name: a.string(),
    email: a.string(),
    orgGroup: a.string(),
    profileOwner: a.string(),
  })
  .authorization((allow) => [allow.groups([GROUPS.everyone])])
  .returns(a.string())
  .handler(a.handler.function(addStaff));
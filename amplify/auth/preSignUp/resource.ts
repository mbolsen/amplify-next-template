import { defineFunction } from "@aws-amplify/backend";

export const preSignUp = defineFunction({
  name: 'preSignUp',
  // optionally define an environment variable for your group name
  environment: {
    GROUP_NAME: 'EVERYONE',
    STAFF_TABLE_NAME: 'Staff'
  }
})
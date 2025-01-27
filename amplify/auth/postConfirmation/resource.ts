import { defineFunction } from "@aws-amplify/backend";

export const postConfirmation = defineFunction({
  name: 'postConfirmation',
  // optionally define an environment variable for your group name
  environment: {
    GROUP_NAME: 'EVERYONE'
  }
})
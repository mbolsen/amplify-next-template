'use client'

// import { Button } from "@aws-amplify/ui-react";
// import type { Schema } from "@/amplify/data/resource";
// import { generateClient } from "aws-amplify/data";
// const client = generateClient<Schema>();
import { Button, FormControl, FormHelperText, Grid2 as Grid, Input, InputLabel, keyframes } from "@mui/material"
import Checkbox from '@mui/material/Checkbox';
import './page.css'
import React from "react";
import type { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
Amplify.configure(outputs);
const client = generateClient<Schema>();

export default function Page() {
  const [userGroupList, setUserGroupList] = React.useState<any>([])
  const [email, setEmail] = React.useState<string>('');
  const [emailError, setEmailError] = React.useState<string>('');

  const handleInviteNewUser = () => {
    if (!validateEmail(email)) {
      setEmailError('Invalid email address');
      return;
    }
    setEmailError('');
    console.log('Inviting user with email:', email);
    // Add your invite logic here
    client.mutations.inviteNewUser({ email }, { authMode: "userPool" })
      .then((result) => {
        console.log('Invite result:', result);
        // Handle success or error
      })
      .catch((error) => {
        console.error('Error inviting user:', error);
        // Handle error
      });
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleClick = () => {
    console.log('click')
    client.mutations.addStaff({}, { authMode: "userPool" })
  }

  async function handleGetUserGroups() {
    const { data } = await client.mutations.userGroups({}, { authMode: "userPool" })
    const result = JSON.parse(data as string)
    const resultGroupList = Object.entries(result).map(([key, value]) => ({id: key, groups: value}))
    setUserGroupList(resultGroupList)
    console.log('RESULT', resultGroupList)
  }

  React.useEffect(() => {
    handleGetUserGroups()
  },[])

  return (
    <div className="wrapper">
      <h1>Admin Set User Permissions Page</h1>
      <p>TODO: This page will list all the users.  Show their name and checkboxes for which user groups they belong to.  When they click on a checkbox it will be a different color from the default checkbox color.  When a person clicks 'save' it will go to the api and all the users to particular groups, returning the changes, then the check boxes turn to the default color.  Success or fail alert at the top of page too.</p>
      <hr />
      <h2>Invite a new user</h2>
      <FormControl>
        <InputLabel htmlFor="my-input">Email address</InputLabel>
        <Input id="my-input" aria-describedby="my-helper-text"
          value={email}
          onChange={(e) => { setEmail(e.target.value) }}
          type="email"
          placeholder="Enter email address"
          error={email !== '' && !!emailError}
        />
        <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>
        <Button variant="contained" color="primary" onClick={handleInviteNewUser}>
          Invite
      </Button>
      </FormControl>
      {
        userGroupList.map((user: any) => (<div>{user.id} - {user.groups}</div>))
      }

      <Button onClick={handleClick}>Test add to DB</Button>
    </div>
  )
}

// This page will list the admin functions available.  
// + Change user group will have a list of users and checkboxes for which groups they are apart
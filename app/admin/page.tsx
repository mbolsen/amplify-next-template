'use client'

// import { Button } from "@aws-amplify/ui-react";
// import type { Schema } from "@/amplify/data/resource";
// import { generateClient } from "aws-amplify/data";
// const client = generateClient<Schema>();
import { Grid2 as Grid, keyframes } from "@mui/material"
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

  const handleClick = () => {
    console.log('click')
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
      {
        userGroupList.map((user: any) => (<div>{user.id} - {user.groups}</div>))
      }
    </div>
  )
}

// This page will list the admin functions available.  
// + Change user group will have a list of users and checkboxes for which groups they are apart
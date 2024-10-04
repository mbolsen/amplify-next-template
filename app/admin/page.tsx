'use client'

// import { Button } from "@aws-amplify/ui-react";
// import type { Schema } from "@/amplify/data/resource";
// import { generateClient } from "aws-amplify/data";
// const client = generateClient<Schema>();
import { Grid2 as Grid } from "@mui/material"
import Checkbox from '@mui/material/Checkbox';
import './page.css'

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

// export default function Checkboxes() {
//   return (
//     <div>
//       <Checkbox {...label} defaultChecked />
//       <Checkbox {...label} />
//       <Checkbox {...label} disabled />
//       <Checkbox {...label} disabled checked />
//     </div>
//   );
// }

const testUsers = [
  { name: 'Matt O', groups: ["Admin", "Everyone", "Others"] },
  { name: 'Ben O', groups: ["", "Everyone", "Others"] },
  {name: 'Merida D', groups: ["", "Everyone", ""]}  
]

export default function Page() {

  const handleClick = () => {
    console.log('click')
  }

  return (
    <div className="wrapper">
      <div>Test</div>
      {/* <Button>Make admin</Button> */}
      <Grid container spacing={2}>
            <Grid size={4}>
              Name
            </Grid>
            <Grid size={1}>
              Admin
            </Grid>
            <Grid size={1}>
              Everyone
            </Grid>
            <Grid size={1}>
              Others
            </Grid>
      </Grid>
      <hr/>
      {testUsers.length > 0 && testUsers.map((person) => (
        <div>
          <Grid container spacing={2}>
            <Grid size={4}>
              <div>{person.name}</div>
            </Grid>
            <Grid size={1}>
              <Checkbox {...label} checked={person.groups.includes("Admin")} onClick={handleClick} />
            </Grid>
            <Grid size={1}>
              <Checkbox {...label} checked={person.groups.includes("Everyone")} />
            </Grid>
            <Grid size={1}>
              <Checkbox {...label} checked={person.groups.includes("Others")} />
            </Grid>
          </Grid>
        </div>
      ))}
    </div>
  )
}

// This page will list the admin functions available.  
// + Change user group will have a list of users and checkboxes for which groups they are apart
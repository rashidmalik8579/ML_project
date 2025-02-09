import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";

export const createListItem = (p) => {
    return (
      <div>
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt="Summoner" src={p.profileicon} />
          </ListItemAvatar>
          <ListItemText
            primary={
              <React.Fragment>
                <Typography variant="h6" align="center">
                  {p.name}
                </Typography>
              </React.Fragment>
            }
            secondary={
              <React.Fragment>
                <Typography align="center">{p.champ}</Typography>
              </React.Fragment>
            }
          ></ListItemText>
          <Avatar alt="Champ" src={p.champicon} />
        </ListItem>
        <Divider variant="middle" />
      </div>
    );
  };
  
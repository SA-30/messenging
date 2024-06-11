import React from "react";
import { IconButton } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useSelector } from "react-redux";

const CreateGroup = () => {
  const lightTheme = useSelector((state) => state.themeKey);

  return (
    <div className={"creategroup-container" + (lightTheme ? "" : " dark")}>
      <input placeholder="Enter Group Name here..." className="search-box" />
      <IconButton>
        <AddBoxIcon />
      </IconButton>
    </div>
  );
};

export default CreateGroup;

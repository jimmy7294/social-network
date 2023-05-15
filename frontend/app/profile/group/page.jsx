import React from "react";

const GroupPage = (data) => {
  return (
    <div>
      GroupPage
      <h2>Group name: {data.group_name}</h2>
      <h2>Group description: {data.group_description}</h2>
      <h2>Group members: {data.group_members}</h2>
      <h2>Posts: {data.group_posts}</h2>
    </div>
  );
};

export default GroupPage;

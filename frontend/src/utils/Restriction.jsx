import React from "react";

const Restriction = ({ flag }) => {
  return <div className={flag ? "restrict-user" : "restrict-user__none"}></div>;
};

export default Restriction;

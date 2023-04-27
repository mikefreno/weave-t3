import React from "react";

const DMPages = (props: { selectedInnerTab: string }) => {
  const { selectedInnerTab } = props;
  if (selectedInnerTab == "friends") {
    return <div className="pt-12 text-center text-lg">Direct Messages will appear here</div>;
  } else {
    return <div className="pt-12 text-center text-lg">DM Requests (in and out) will appear here</div>;
  }
};

export default DMPages;

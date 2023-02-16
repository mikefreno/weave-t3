import LoginModal from "@/src/components/loginModal";
import React from "react";

const LoginPage = () => {
  return (
    <div>
      <div className="mt-24 text-center text-3xl">
        You must be logged in to use that page
      </div>
      <LoginModal onClose={undefined} loginRef={undefined} />
    </div>
  );
};

export default LoginPage;

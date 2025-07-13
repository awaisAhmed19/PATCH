import { useState } from "react";
import { SignInPage } from "@/components/auth/SignInPage";
import { Dashboard } from "@/components/dashboard/Dashboard";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <>
      {isLoggedIn ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <SignInPage onLogin={handleLogin} />
      )}
    </>
  );
};

export default Index;

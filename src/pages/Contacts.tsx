
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Contacts = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the clients page immediately
    console.log("Redirecting from /contacts to /clients");
    navigate("/clients", { replace: true });
  }, [navigate]);
  
  // Show a loading message while redirecting
  return (
    <div className="flex items-center justify-center h-96">
      <p className="text-lg">Redirecting to clients page...</p>
    </div>
  );
};

export default Contacts;

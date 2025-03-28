
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Contacts = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the new Clients List page
    navigate("/clients", { replace: true });
  }, [navigate]);
  
  return (
    <div className="flex items-center justify-center h-96">
      <p>Redirecting to clients page...</p>
    </div>
  );
};

export default Contacts;

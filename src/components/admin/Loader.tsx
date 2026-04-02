import { Activity } from "lucide-react";
import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen ">
      <Activity className="animate-spin text-brand-gold w-10 h-10 opacity-40" />
    </div>
  );
};

export default Loader;

import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Contacts from "@/components/pages/Contacts";
import Deals from "@/components/pages/Deals";
import Tasks from "@/components/pages/Tasks";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="deals" element={<Deals />} />
        <Route path="tasks" element={<Tasks />} />
      </Route>
    </Routes>
  );
}

export default App;
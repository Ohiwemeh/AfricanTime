"use client";
import SubsTableItem from "@/Components/AdminComponents/SubsTableItem";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const page = () => {
  const [emails, setEmails] = useState([]);

  const fetchEmails = async () => {
    const reponse = await axios.get("/api/email");
    setEmails(reponse.data.emails);
  };

  const handleDelete = async (mongoId) => {
    try {
      const response = await axios.delete("/api/email", {
        params: { id: mongoId },
      });
      if (response.data.success) {
        setEmails(emails.filter((email) => email._id !== mongoId));
        toast.success("Email deleted successfully!");
      } else {
        console.error("Failed to delete email:", response.data.msg);
        toast.error("Failed to delete email.");
      }
    } catch (error) {
      console.error("Error deleting email:", error);
      toast.error("Error deleting email.");
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);
  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16">
      <h1>All Subscription</h1>
      <div className="relative h-[80vh] max-x-[600px] overflow-x-auto mt-4 border border-gray-400 scrollbar-hide">
        <table className="w-full text-sm text-gray-500 ">
          <thead className="text-xs text-gray-700 bg-gray-50 text-left uppercase">
            <tr>
              <th scope="col" className=" px-6 py-3 ">
                Email
              </th>
              <th scope="col" className=" px-6 py-3 ">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {emails.map((item, index) => {
              return (
                <SubsTableItem
                  key={index}
                  mongoId={item._id}
                  date={item.date}
                  email={item.email}
                  handleDelete={handleDelete}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default page;

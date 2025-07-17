import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import { format } from "date-fns";

const ContactTable = ({ contacts, onEdit, onDelete, onView, className }) => {
  return (
    <div className={cn("bg-white rounded-lg shadow-sm border border-gray-200", className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left p-4 text-sm font-semibold text-gray-900">Name</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-900">Company</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-900">Email</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-900">Status</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-900">Last Activity</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
{contacts.map((contact) => (
              <tr key={contact.Id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <ApperIcon name="User" size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{contact.Name}</p>
                      <p className="text-sm text-gray-500">{contact.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-gray-900">{contact.company}</p>
                </td>
                <td className="p-4">
                  <p className="text-gray-900">{contact.email}</p>
                </td>
                <td className="p-4">
                  <StatusBadge status={contact.status} />
                </td>
                <td className="p-4">
                  <p className="text-gray-900">
                    {format(new Date(contact.lastActivity), "MMM d, yyyy")}
                  </p>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(contact)}
                    >
                      <ApperIcon name="Eye" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(contact)}
                    >
                      <ApperIcon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(contact.Id)}
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactTable;
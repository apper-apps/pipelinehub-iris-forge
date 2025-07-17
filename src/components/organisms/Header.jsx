import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ onMenuToggle, searchValue, onSearchChange, className }) => {
  return (
    <header className={cn("bg-white border-b border-gray-200 px-6 py-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          
          <div className="hidden md:block">
            <SearchBar
              placeholder="Search contacts, deals, tasks..."
              value={searchValue}
              onChange={onSearchChange}
              className="w-80"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <ApperIcon name="Bell" size={20} />
          </Button>
          
          <Button variant="ghost" size="sm">
            <ApperIcon name="Settings" size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
import React, { useContext } from "react";
    import { useSelector } from "react-redux";
    import { cn } from "@/utils/cn";
    import ApperIcon from "@/components/ApperIcon";
    import Button from "@/components/atoms/Button";
    import SearchBar from "@/components/molecules/SearchBar";
    import { AuthContext } from "@/App";
    
    const Header = ({ onMenuToggle, searchValue, onSearchChange, className }) => {
      const { logout } = useContext(AuthContext);
      const { user } = useSelector((state) => state.user);
      
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
              
              {user && (
                <div className="flex items-center space-x-3">
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.emailAddress}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="text-red-600 hover:text-red-700"
                  >
                    <ApperIcon name="LogOut" size={20} />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>
      );
    };
    
    export default Header;
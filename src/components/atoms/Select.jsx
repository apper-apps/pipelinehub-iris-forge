import React from 'react'
import { cn } from '@/utils/cn'

const Select = React.forwardRef(({ 
  className, 
  children, 
  ...props 
}, ref) => {
  return (
<select
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 relative z-[70] focus:z-[80] active:z-[80] hover:z-[80]",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
})

Select.displayName = "Select"

export default Select
import React from 'react';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

export function StatusBadge({ status, label }) {
  const baseClasses = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium';

  if (status === 'available') {
    return (
      <div className={`${baseClasses} bg-green-100 text-green-800`}>
        <CheckCircle size={16} />
        {label || 'Available'}
      </div>
    );
  }

  if (status === 'active') {
    return (
      <div className={`${baseClasses} bg-indigo-100 text-indigo-800`}>
        <CheckCircle size={16} />
        {label || 'Active'}
      </div>
    );
  }

  if (status === 'unavailable') {
    return (
      <div className={`${baseClasses} bg-amber-100 text-amber-800`}>
        <AlertCircle size={16} />
        {label || 'Unavailable'}
      </div>
    );
  }

  if (status === 'overdue') {
    return (
      <div className={`${baseClasses} bg-red-100 text-red-800`}>
        <AlertCircle size={16} />
        {label || 'Overdue'}
      </div>
    );
  }

  if (status === 'inactive') {
    return (
      <div className={`${baseClasses} bg-gray-100 text-gray-800`}>
        <Clock size={16} />
        {label || 'Inactive'}
      </div>
    );
  }

  return <div className={`${baseClasses} bg-gray-100 text-gray-800`}>{label}</div>;
}

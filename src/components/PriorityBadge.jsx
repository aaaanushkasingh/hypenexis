import React from 'react';
import { AlertTriangle, AlertCircle, ShieldAlert } from 'lucide-react';

export default function PriorityBadge({ priority = 'Medium' }) {
  const getPrioStyle = () => {
    switch (priority) {
      case 'High':
        return {
          icon: AlertCircle,
          className: 'badge-high',
          label: 'High Priority'
        };
      case 'Low':
        return {
          icon: ShieldAlert,
          className: 'badge-low',
          label: 'Low Priority'
        };
      default:
        return {
          icon: AlertTriangle,
          className: 'badge-medium',
          label: 'Medium Priority'
        };
    }
  };

  const config = getPrioStyle();
  const Icon = config.icon;

  return (
    <div className="priority-badge-wrapper">
      <span className={`priority-badge ${config.className}`}>
        <Icon size={13} className="priority-icon" />
        <span>{config.label}</span>
      </span>
    </div>
  );
}

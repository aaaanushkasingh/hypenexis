import React from 'react';
import { Clock, Search, Wrench, CheckCircle2 } from 'lucide-react';

export default function StatusBadge({ status, size = 'normal' }) {
  const getStatusConfig = (st) => {
    switch (st) {
      case 'Submitted':
        return {
          label: 'Submitted',
          icon: Clock,
          className: 'badge-submitted',
          dotColor: '#38BDF8'
        };
      case 'Under Review':
        return {
          label: 'Under Review',
          icon: Search,
          className: 'badge-review',
          dotColor: '#FBBF24'
        };
      case 'In Progress':
        return {
          label: 'In Progress',
          icon: Wrench,
          className: 'badge-progress',
          dotColor: '#A78BFA'
        };
      case 'Resolved':
        return {
          label: 'Resolved',
          icon: CheckCircle2,
          className: 'badge-resolved',
          dotColor: '#A1DC6A'
        };
      default:
        return {
          label: status || 'Pending',
          icon: Clock,
          className: 'badge-submitted',
          dotColor: '#94A3B8'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span className={`status-badge ${config.className} ${size === 'small' ? 'badge-sm' : ''}`}>
      <span className="status-dot" style={{ backgroundColor: config.dotColor }}></span>
      <Icon size={size === 'small' ? 12 : 14} className="badge-icon" />
      <span>{config.label}</span>
    </span>
  );
}

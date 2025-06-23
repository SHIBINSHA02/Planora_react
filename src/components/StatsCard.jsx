// components/StatsCard.jsx
import React from 'react';

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  bgColor, 
  textColor, 
  valueColor, 
  iconColor 
}) => {
  return (
    <div className={`${bgColor} p-6 rounded-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-lg font-semibold ${textColor}`}>{title}</h3>
          <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
        </div>
        <Icon className={`h-8 w-8 ${iconColor}`} />
      </div>
    </div>
  );
};

export default StatsCard;
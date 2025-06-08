import React from "react";
import { Card, CardBody, Typography, IconButton } from "@material-tailwind/react";
import { EllipsisHorizontalIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";

export default function KpiCard({ 
  title, 
  value, 
  percentage, 
  comparisonLabel 
}) {
  // Determine arrow and text color based on percentage sign
  const isPositive = percentage >= 0;
  const ArrowIcon = isPositive ? ArrowUpIcon : ArrowDownIcon;
  const arrowColor = isPositive ? "text-green-500" : "text-red-500";

  return (
    <Card className="shadow-sm">
      <CardBody>
        {/* Title and Menu */}
        <div className="flex items-center justify-between mb-2">
          <Typography variant="h6" className="text-blue-gray-800">
            {title}
          </Typography>
        </div>
        
        {/* Main Value */}
        <Typography variant="h2" className="font-bold text-blue-gray-900">
          {value}
        </Typography>
        
        {/* Comparison Section */}
        {/* <div className="flex items-center gap-2">
          <ArrowIcon className={`w-4 h-4 ${arrowColor}`} />
          <Typography variant="small" className={`text-sm ${arrowColor}`}>
            {Math.abs(percentage)}%
          </Typography>
          <Typography variant="small" className="text-blue-gray-500">
            vs {comparisonLabel}
          </Typography>
        </div> */}
      </CardBody>
    </Card>
  );
}

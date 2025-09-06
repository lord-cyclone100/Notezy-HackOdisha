interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  trendValue?: string | number;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

export const StatCard = ({ title, value, icon, trend, trendValue, color = "blue" }: StatCardProps) => {
  const colorClasses = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
      icon: "text-blue-600 dark:text-blue-400",
      value: "text-blue-900 dark:text-blue-100"
    },
    green: {
      bg: "bg-green-50 dark:bg-green-900/20",
      border: "border-green-200 dark:border-green-800",
      icon: "text-green-600 dark:text-green-400",
      value: "text-green-900 dark:text-green-100"
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      border: "border-purple-200 dark:border-purple-800",
      icon: "text-purple-600 dark:text-purple-400",
      value: "text-purple-900 dark:text-purple-100"
    },
    orange: {
      bg: "bg-orange-50 dark:bg-orange-900/20",
      border: "border-orange-200 dark:border-orange-800",
      icon: "text-orange-600 dark:text-orange-400",
      value: "text-orange-900 dark:text-orange-100"
    }
  };

  const currentColor = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`${currentColor.bg} ${currentColor.border} border rounded-xl p-6 hover:shadow-lg transition-shadow duration-300`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            {title}
          </p>
          <p className={`text-3xl font-bold ${currentColor.value}`}>
            {value}
          </p>
          {trend && (
            <div className="flex items-center mt-2">
              <svg 
                className={`w-4 h-4 mr-1 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {trend === 'up' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                )}
              </svg>
              <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={`${currentColor.icon} p-3 rounded-lg bg-white dark:bg-slate-800 shadow-sm`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

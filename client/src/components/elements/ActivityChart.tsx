type ActivityChartProps = {
  data: { label: string; value: number }[];
  title: string;
};

export const ActivityChart = ({ data, title }: ActivityChartProps) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
        {title}
      </h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {item.label}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-32 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 w-8 text-right">
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

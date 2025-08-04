import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { type CompetitorWithPlans } from "@shared/schema";
import { useState } from "react";

interface PricingChartProps {
  competitors: CompetitorWithPlans[];
}

export function PricingChart({ competitors }: PricingChartProps) {
  const [billingFilter, setBillingFilter] = useState("monthly");

  const getChartData = () => {
    const data: Array<{ name: string; price: number; color: string }> = [];
    
    competitors.forEach(competitor => {
      // Get the most representative plan for each competitor
      let selectedPlan = competitor.plans.find(plan => 
        plan.billingPeriod === billingFilter && plan.price && plan.price > 0
      );
      
      // Fallback to any paid plan if no matching billing period
      if (!selectedPlan) {
        selectedPlan = competitor.plans.find(plan => plan.price && plan.price > 0);
      }
      
      if (selectedPlan) {
        const displayPrice = selectedPlan.isPromo ? selectedPlan.price : selectedPlan.price;
        data.push({
          name: competitor.name.split(' ')[0], // Use first word for brevity
          price: Math.round((displayPrice || 0) / 100),
          color: getCompetitorColor(competitor.name),
        });
      }
    });
    
    return data;
  };

  const getCompetitorColor = (name: string) => {
    if (name.includes("Heidi")) return "#3b82f6";
    if (name.includes("Freed")) return "#10b981";
    if (name.includes("Sunoh")) return "#ef4444";
    return "#6b7280";
  };

  const chartData = getChartData();
  const lowestPrice = Math.min(...chartData.map(d => d.price));
  const highestPrice = Math.max(...chartData.map(d => d.price));
  const averagePrice = Math.round(chartData.reduce((sum, d) => sum + d.price, 0) / chartData.length);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" data-testid="pricing-chart">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Price Comparison</h3>
        <div className="flex items-center space-x-2">
          <Select value={billingFilter} onValueChange={setBillingFilter}>
            <SelectTrigger className="w-32" data-testid="billing-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="annual">Annual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        {chartData.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: `${item.color}10` }}>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="font-medium text-gray-900">{item.name}</span>
            </div>
            <span className="font-bold" style={{ color: item.color }}>${item.price}</span>
          </div>
        ))}
      </div>
      
      <div className="h-48 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${value}`, 'Price']} />
            <Bar dataKey="price" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="space-y-3 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm" data-testid="price-stats-lowest">
          <span className="text-gray-600">Lowest Price</span>
          <span className="font-medium text-green-600">
            {chartData.find(d => d.price === lowestPrice)?.name} - ${lowestPrice}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm" data-testid="price-stats-highest">
          <span className="text-gray-600">Highest Price</span>
          <span className="font-medium text-red-600">
            {chartData.find(d => d.price === highestPrice)?.name} - ${highestPrice}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm" data-testid="price-stats-average">
          <span className="text-gray-600">Average Price</span>
          <span className="font-medium text-gray-900">${averagePrice}</span>
        </div>
      </div>
    </div>
  );
}

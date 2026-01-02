import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Activity, LogOut, User, Target } from 'lucide-react';

// Mock data (replace with tRPC calls in production)
const mockData = {
  overview: {
    totalShares: 11200000,
    sharePrice: 460,
    portfolioValue: 5152000000,
    company: 'MCB Group Ltd',
    ticker: 'MCBMU',
    sharesSold: 200000,
    sharesRemaining: 11000000,
  },
  users: [
    { name: 'Patrick Ian Bernard', shares: 5600000, email: 'pbernardproxy@gmail.com' },
    { name: 'Marie Audrey Laura Brutus', shares: 5600000, email: 'audrey.l.brutus@gmail.com' },
  ],
  allocations: [
    { entity: 'Swan Securities Ltd', shares: 60000, percentage: 30 },
    { entity: 'DTOS Capital Markets Ltd', shares: 40000, percentage: 20 },
    { entity: 'DMH Stockbroking Ltd', shares: 100000, percentage: 50 },
  ],
  dividends: [
    { year: 2020, dps: 9.00, entitlement: 100800000 },
    { year: 2021, dps: 10.50, entitlement: 117600000 },
    { year: 2022, dps: 11.00, entitlement: 123200000 },
    { year: 2023, dps: 12.00, entitlement: 134400000 },
    { year: 2024, dps: 13.00, entitlement: 145600000 },
    { year: '2024 (2nd)', dps: 10.50, entitlement: 117600000 },
  ],
  sale: {
    sharesSold: 200000,
    settlementAmount: 117200300.21,
    finalized: '7 December 2025',
    payment: '31 December 2025',
    clearance: '10 January 2026',
  },
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentUser] = useState(mockData.users[0]);

  const formatCurrency = (value: number) => {
    return `Rs ${(value / 1000000).toFixed(2)}M`;
  };

  const formatLargeCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `Rs ${(value / 1000000000).toFixed(3)}B`;
    }
    return formatCurrency(value);
  };

  // Chart data
  const pieData = [
    { name: 'Sold', value: mockData.overview.sharesSold },
    { name: 'Retained', value: mockData.overview.sharesRemaining },
  ];

  const barData = [
    { name: 'Sold', value: mockData.overview.sharesSold * mockData.overview.sharePrice },
    { name: 'Retained', value: mockData.overview.sharesRemaining * mockData.overview.sharePrice },
  ];

  const lineData = mockData.dividends.map(d => ({
    year: d.year,
    dps: d.dps,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">SEMDEX</h1>
                <p className="text-xs text-slate-500">Shareholder Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-900">{currentUser.name}</p>
                <p className="text-xs text-slate-500">{currentUser.email}</p>
              </div>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <LogOut className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'shareholding', label: 'Shareholding' },
              { id: 'sale', label: 'Sale Breakdown' },
              { id: 'dividends', label: 'Dividend History' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                icon={<Activity className="w-6 h-6" />}
                title="Total Shares"
                value={mockData.overview.totalShares.toLocaleString()}
                subtitle={mockData.overview.ticker}
                color="blue"
              />
              <MetricCard
                icon={<DollarSign className="w-6 h-6" />}
                title="Share Price"
                value={`Rs ${mockData.overview.sharePrice}`}
                subtitle="Reference"
                color="green"
              />
              <MetricCard
                icon={<TrendingUp className="w-6 h-6" />}
                title="Portfolio Value"
                value={formatLargeCurrency(mockData.overview.portfolioValue)}
                subtitle={mockData.overview.company}
                color="purple"
              />
              <MetricCard
                icon={<Target className="w-6 h-6" />}
                title="Shares Sold"
                value={mockData.overview.sharesSold.toLocaleString()}
                subtitle="Court Approved"
                color="amber"
              />
            </div>

            {/* Quick Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Summary</h2>
              <div className="space-y-3">
                <SummaryRow label="Combined Holdings" value={`${mockData.overview.totalShares.toLocaleString()} shares`} />
                <SummaryRow label="Shares Sold" value={`${mockData.overview.sharesSold.toLocaleString()} shares`} />
                <SummaryRow label="Remaining in Custody" value={`${mockData.overview.sharesRemaining.toLocaleString()} shares`} />
                <SummaryRow label="Settlement Amount" value={`Rs ${mockData.sale.settlementAmount.toLocaleString()}`} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'shareholding' && (
          <div className="space-y-6">
            {/* Shareholding Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Combined Shareholding</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {mockData.users.map((user, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg p-6 border border-blue-100">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{user.name}</h3>
                        <p className="text-sm text-slate-600">{user.email}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Shares Owned</span>
                        <span className="font-semibold text-slate-900">{user.shares.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Percentage</span>
                        <span className="font-semibold text-slate-900">50%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Value</span>
                        <span className="font-semibold text-slate-900">{formatLargeCurrency(user.shares * mockData.overview.sharePrice)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pie Chart */}
              <div className="bg-slate-50 rounded-lg p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Sold vs Retained Shares</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => value.toLocaleString()} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sale' && (
          <div className="space-y-6">
            {/* Sale Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Court-Approved Sale Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <InfoCard label="Shares Sold" value={mockData.sale.sharesSold.toLocaleString()} />
                <InfoCard label="Settlement Amount" value={`Rs ${mockData.sale.settlementAmount.toLocaleString()}`} />
                <InfoCard label="Sale Finalized" value={mockData.sale.finalized} />
                <InfoCard label="Payment Window" value={mockData.sale.payment} />
                <InfoCard label="Bank Clearance" value={mockData.sale.clearance} />
                <InfoCard label="Status" value="Finalized" />
              </div>

              {/* Allocation Table */}
              <h3 className="font-semibold text-slate-900 mb-3">Broker Allocation</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-y border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Entity</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">Shares</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">Percentage</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {mockData.allocations.map((alloc, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm text-slate-900">{alloc.entity}</td>
                        <td className="px-4 py-3 text-sm text-right text-slate-900">{alloc.shares.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-right text-slate-900">{alloc.percentage}%</td>
                        <td className="px-4 py-3 text-sm text-right font-medium text-slate-900">
                          {formatCurrency(alloc.shares * mockData.overview.sharePrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Value Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => formatLargeCurrency(value)} />
                  <Tooltip formatter={(value: number) => formatLargeCurrency(value)} />
                  <Bar dataKey="value" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'dividends' && (
          <div className="space-y-6">
            {/* Dividend Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Dividend History</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-y border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Year</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">DPS (Rs)</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">Total Entitlement</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">Projected (11M shares)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {mockData.dividends.map((div, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm text-slate-900">{div.year}</td>
                        <td className="px-4 py-3 text-sm text-right text-slate-900">{div.dps.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-right text-slate-900">{formatCurrency(div.entitlement)}</td>
                        <td className="px-4 py-3 text-sm text-right font-medium text-slate-900">
                          {formatCurrency(11000000 * div.dps)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Line Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Dividend Trend (2020-2024)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `Rs ${value.toFixed(2)}`} />
                  <Legend />
                  <Line type="monotone" dataKey="dps" stroke="#0088FE" strokeWidth={2} name="DPS (Rs)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Helper Components
function MetricCard({ icon, title, value, subtitle, color }: any) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    amber: 'from-amber-500 to-amber-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-sm font-medium text-slate-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-slate-900 mb-1">{value}</p>
      <p className="text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
      <span className="text-slate-600">{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded-lg p-4">
      <p className="text-sm text-slate-600 mb-1">{label}</p>
      <p className="text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
    }

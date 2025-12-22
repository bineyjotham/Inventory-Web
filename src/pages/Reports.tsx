// src/pages/Reports.tsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import SearchBar from '../components/common/SearchBar';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ReportGenerator from '../components/reports/ReportGenerator';
import ReportPreview from '../components/reports/ReportPreview';
import { 
  DocumentArrowDownIcon,
  DocumentChartBarIcon,
  DocumentTextIcon,
  CalendarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  FunnelIcon,
  PrinterIcon,
  EyeIcon,
  ClockIcon,
  UserIcon,
  CubeIcon,
  ArrowsRightLeftIcon,
  CurrencyDollarIcon,
  ServerIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { Report } from '../types';

const Reports: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [reportType, setReportType] = useState<'all' | 'inventory' | 'movement' | 'financial'>('all');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'quarter' | 'year'>('month');
  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [loadingReport, setLoadingReport] = useState<string | null>(null);

  // Mock reports data
  const reports: Report[] = [
    {
      id: '1',
      title: 'Monthly Inventory Summary',
      type: 'inventory',
      generatedAt: new Date('2024-01-15T14:30:00'),
      period: 'January 2024',
      downloadUrl: '#'
    },
    {
      id: '2',
      title: 'Stock Movement Analysis',
      type: 'movement',
      generatedAt: new Date('2024-01-14T10:15:00'),
      period: 'Jan 1-14, 2024',
      downloadUrl: '#'
    },
    {
      id: '3',
      title: 'Quarterly Financial Report',
      type: 'financial',
      generatedAt: new Date('2024-01-10T16:45:00'),
      period: 'Q4 2023',
      downloadUrl: '#'
    },
    {
      id: '4',
      title: 'Low Stock Alert Report',
      type: 'inventory',
      generatedAt: new Date('2024-01-09T09:20:00'),
      period: 'Weekly',
      downloadUrl: '#'
    },
    {
      id: '5',
      title: 'Supplier Performance Analysis',
      type: 'movement',
      generatedAt: new Date('2024-01-08T11:30:00'),
      period: 'December 2023',
      downloadUrl: '#'
    },
    {
      id: '6',
      title: 'Annual Audit Report',
      type: 'financial',
      generatedAt: new Date('2024-01-05T15:00:00'),
      period: '2023',
      downloadUrl: '#'
    }
  ];

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.period.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = reportType === 'all' || report.type === reportType;
    
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'inventory': return <CubeIcon className="w-5 h-5" />;
      case 'movement': return <ArrowsRightLeftIcon className="w-5 h-5" />;
      case 'financial': return <CurrencyDollarIcon className="w-5 h-5" />;
      default: return <DocumentTextIcon className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'inventory': return 'bg-blue-100 text-blue-800';
      case 'movement': return 'bg-green-100 text-green-800';
      case 'financial': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleGenerateReport = () => {
    setShowGenerator(true);
  };

  const handlePreviewReport = (report: Report) => {
    setSelectedReport(report);
    setLoadingReport(report.id);
    
    // Simulate loading
    setTimeout(() => {
      setLoadingReport(null);
      setShowPreview(true);
    }, 800);
  };

  const handleDownloadReport = (report: Report) => {
    setLoadingReport(report.id);
    
    // Simulate download
    setTimeout(() => {
      setLoadingReport(null);
      // In real app, trigger file download
      console.log('Downloading report:', report.title);
    }, 1000);
  };

  // Report statistics
  const reportStats = {
    total: reports.length,
    inventory: reports.filter(r => r.type === 'inventory').length,
    movement: reports.filter(r => r.type === 'movement').length,
    financial: reports.filter(r => r.type === 'financial').length,
    generatedThisMonth: 12,
    averageSize: '2.4 MB'
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Generate and view detailed inventory reports and analytics</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            onClick={handleGenerateReport}
            icon={<DocumentChartBarIcon className="w-4 h-4" />}
          >
            Generate Report
          </Button>
          <Button
            variant="outline"
            icon={<PrinterIcon className="w-4 h-4" />}
          >
            Print
          </Button>
        </div>
      </div>

      {/* Report Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{reportStats.total}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <DocumentTextIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inventory Reports</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{reportStats.inventory}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CubeIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Movement Reports</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{reportStats.movement}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <ArrowsRightLeftIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Financial Reports</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{reportStats.financial}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Size</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{reportStats.averageSize}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <ServerIcon className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Report Generation</h3>
            <ChartBarIcon className="w-6 h-6" />
          </div>
          <div className="text-3xl font-bold mb-2">{reportStats.generatedThisMonth}</div>
          <div className="text-blue-100">Reports generated this month</div>
          <div className="flex items-center text-sm mt-2">
            <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
            15% increase from last month
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Most Active Period</h3>
            <ClockIcon className="w-6 h-6 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">Months End</div>
          <div className="text-gray-600">Highest report generation activity</div>
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <CalendarIcon className="w-4 h-4 mr-1" />
            Last 30 days: 42 reports
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Top Report Types</h3>
            <DocumentChartBarIcon className="w-6 h-6 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Inventory Reports</span>
              <span className="font-medium text-gray-900">45%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Movement Reports</span>
              <span className="font-medium text-gray-900">35%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Financial Reports</span>
              <span className="font-medium text-gray-900">20%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Reports</label>
            <SearchBar
              placeholder="Search by report title or period..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <div className="flex gap-2 flex-wrap">
              {['all', 'inventory', 'movement', 'financial'].map((type) => (
                <button
                  key={type}
                  onClick={() => setReportType(type as any)}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    reportType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'today', label: 'Today' },
                { value: 'week', label: 'This Week' },
                { value: 'month', label: 'This Month' },
                { value: 'quarter', label: 'This Quarter' },
                { value: 'year', label: 'This Year' }
              ].map((range) => (
                <button
                  key={range.value}
                  onClick={() => setDateRange(range.value as any)}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    dateRange === range.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Generated
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        {getTypeIcon(report.type)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{report.title}</div>
                        <div className="text-sm text-gray-500">
                          {report.id} • PDF • {reportStats.averageSize}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(report.type)}`}>
                      {getTypeIcon(report.type)}
                      {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                      {report.period}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {new Date(report.generatedAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(report.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePreviewReport(report)}
                        disabled={loadingReport === report.id}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {loadingReport === report.id ? (
                          <>
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Loading...
                          </>
                        ) : (
                          <>
                            <EyeIcon className="w-4 h-4" />
                            Preview
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDownloadReport(report)}
                        disabled={loadingReport === report.id}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <DocumentArrowDownIcon className="w-4 h-4" />
                        Download
                      </button>
                      <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors">
                        <PrinterIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <DocumentChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
            <Button
              variant="primary"
              onClick={handleGenerateReport}
              icon={<DocumentChartBarIcon className="w-4 h-4" />}
            >
              Generate Your First Report
            </Button>
          </div>
        )}
      </div>

      {/* Pre-defined Report Templates */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Report Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Stock Level Summary',
              description: 'Current inventory levels across all categories',
              type: 'inventory',
              icon: CubeIcon,
              color: 'blue'
            },
            {
              title: 'Movement Log',
              description: 'All inventory transactions for selected period',
              type: 'movement',
              icon: ArrowsRightLeftIcon,
              color: 'green'
            },
            {
              title: 'Financial Summary',
              description: 'Revenue, costs, and profit analysis',
              type: 'financial',
              icon: CurrencyDollarIcon,
              color: 'purple'
            },
            {
              title: 'Supplier Performance',
              description: 'Supplier delivery and quality metrics',
              type: 'movement',
              icon: BuildingOfficeIcon,
              color: 'orange'
            }
          ].map((template) => {
            const Icon = template.icon;
            return (
              <button
                key={template.title}
                onClick={() => {
                  // Set template and open generator
                  setShowGenerator(true);
                }}
                className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all text-left group"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 bg-${template.color}-50 group-hover:bg-${template.color}-100`}>
                  <Icon className={`w-6 h-6 text-${template.color}-600`} />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{template.title}</h3>
                <p className="text-sm text-gray-600">{template.description}</p>
                <div className="mt-3 text-xs text-gray-500">Click to generate</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scheduled Reports Section (Admin Only) */}
      {user?.role === 'admin' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Scheduled Reports</h2>
            <Button variant="outline" size="sm" icon={<CalendarIcon className="w-4 h-4" />}>
              Schedule New
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Report</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Frequency</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next Run</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipients</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-4 text-sm text-gray-900">Daily Inventory Snapshot</td>
                  <td className="px-4 py-4 text-sm text-gray-600">Daily</td>
                  <td className="px-4 py-4 text-sm text-gray-600">Tomorrow, 8:00 AM</td>
                  <td className="px-4 py-4 text-sm text-gray-600">Managers (3)</td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button className="text-sm text-blue-600 hover:text-blue-800">Edit</button>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4 text-sm text-gray-900">Weekly Financial Report</td>
                  <td className="px-4 py-4 text-sm text-gray-600">Weekly (Mon)</td>
                  <td className="px-4 py-4 text-sm text-gray-600">Next Monday, 9:00 AM</td>
                  <td className="px-4 py-4 text-sm text-gray-600">Admin, Finance (2)</td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button className="text-sm text-blue-600 hover:text-blue-800">Edit</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report Generator Modal */}
      <Modal
        isOpen={showGenerator}
        onClose={() => setShowGenerator(false)}
        title="Generate New Report"
        size="xl"
      >
        <ReportGenerator onClose={() => setShowGenerator(false)} />
      </Modal>

      {/* Report Preview Modal */}
      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title={selectedReport?.title || 'Report Preview'}
        size="full"
      >
        {selectedReport && (
          <ReportPreview 
            report={selectedReport} 
            onClose={() => setShowPreview(false)} 
          />
        )}
      </Modal>
    </div>
  );
};

export default Reports;
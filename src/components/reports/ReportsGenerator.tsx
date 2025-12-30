// src/components/reports/ReportGenerator.tsx
import React, { useState } from 'react';
import Button from '../common/Button';
import { 
  CubeIcon,
  CurrencyDollarIcon,
  ArrowsRightLeftIcon,
  ChartBarIcon,
  DocumentTextIcon,
  TableCellsIcon,
  DocumentArrowDownIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface ReportGeneratorProps {
  onClose: () => void;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [reportType, setReportType] = useState<'inventory' | 'movement' | 'financial' | 'custom'>('inventory');
  const [reportName, setReportName] = useState('');
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [filters, setFilters] = useState({
    categories: [] as string[],
    suppliers: [] as string[],
    lowStockOnly: false,
    includeDetails: true,
    includeCharts: true
  });
  const [format, setFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [schedule, setSchedule] = useState({
    enabled: false,
    frequency: 'weekly' as 'daily' | 'weekly' | 'monthly',
    recipients: [] as string[]
  });
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    {
      id: 'inventory',
      title: 'Inventory Report',
      description: 'Stock levels, values, and status across all items',
      icon: CubeIcon
    },
    {
      id: 'movement',
      title: 'Movement Report',
      description: 'Inbound, outbound, and adjustment transactions',
      icon: ArrowsRightLeftIcon
    },
    {
      id: 'financial',
      title: 'Financial Report',
      description: 'Inventory valuation, costs, and profitability',
      icon: CurrencyDollarIcon
    },
    {
      id: 'custom',
      title: 'Custom Report',
      description: 'Build your own report with specific metrics',
      icon: ChartBarIcon
    }
  ];

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleGenerate();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    
    // Simulate report generation
    setTimeout(() => {
      console.log('Generating report:', {
        reportType,
        reportName,
        dateRange,
        filters,
        format,
        schedule
      });
      setLoading(false);
      onClose();
    }, 2000);
  };

  const categories = ['Electronics', 'Office Supplies', 'Raw Materials', 'Finished Goods', 'Packaging'];
  const suppliers = ['TechParts Inc.', 'Office Supply Co.', 'Global Electronics', 'Quality Furniture Ltd.'];

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex justify-between items-center mb-8">
        {[1, 2, 3, 4].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              stepNumber === step
                ? 'bg-blue-600 text-white'
                : stepNumber < step
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-400'
            }`}>
              {stepNumber < step ? '✓' : stepNumber}
            </div>
            {stepNumber < 4 && (
              <div className={`w-12 h-1 ${
                stepNumber < step ? 'bg-green-100' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="space-y-2 mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          {step === 1 && 'Select Report Type'}
          {step === 2 && 'Configure Report Parameters'}
          {step === 3 && 'Set Output Format'}
          {step === 4 && 'Schedule & Generate'}
        </h3>
        <p className="text-sm text-gray-600">
          {step === 1 && 'Choose the type of report you want to generate'}
          {step === 2 && 'Customize the report with specific filters and parameters'}
          {step === 3 && 'Select the output format and additional options'}
          {step === 4 && 'Set up scheduling and generate the report'}
        </p>
      </div>

      {/* Step 1: Report Type Selection */}
      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setReportType(type.id as any)}
                className={`p-6 rounded-xl border-2 text-left transition-all ${
                  reportType === type.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-3 rounded-lg ${
                    reportType === type.id ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      reportType === type.id ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <div className={`font-medium ${
                      reportType === type.id ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {type.title}
                    </div>
                    <div className={`text-sm ${
                      reportType === type.id ? 'text-blue-700' : 'text-gray-500'
                    }`}>
                      {type.description}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Step 2: Report Parameters */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Name
            </label>
            <input
              type="text"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              placeholder="Enter a descriptive name for this report"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories (Optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <label key={category} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters({...filters, categories: [...filters.categories, category]});
                        } else {
                          setFilters({...filters, categories: filters.categories.filter(c => c !== category)});
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Suppliers (Optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {suppliers.map((supplier) => (
                  <label key={supplier} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.suppliers.includes(supplier)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters({...filters, suppliers: [...filters.suppliers, supplier]});
                        } else {
                          setFilters({...filters, suppliers: filters.suppliers.filter(s => s !== supplier)});
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{supplier}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.lowStockOnly}
                  onChange={(e) => setFilters({...filters, lowStockOnly: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Include only low stock items</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.includeDetails}
                  onChange={(e) => setFilters({...filters, includeDetails: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Include detailed item information</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.includeCharts}
                  onChange={(e) => setFilters({...filters, includeCharts: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Include charts and graphs</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Output Format */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Select Output Format
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'pdf', label: 'PDF Document', description: 'Best for printing and sharing', icon: DocumentTextIcon },
                { id: 'excel', label: 'Excel Spreadsheet', description: 'Best for data analysis', icon: TableCellsIcon },
                { id: 'csv', label: 'CSV File', description: 'Best for data import/export', icon: DocumentArrowDownIcon }
              ].map((formatOption) => {
                const Icon = formatOption.icon;
                return (
                  <button
                    key={formatOption.id}
                    onClick={() => setFormat(formatOption.id as any)}
                    className={`p-6 rounded-xl border-2 text-left transition-all ${
                      format === formatOption.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-3 rounded-lg ${
                        format === formatOption.id ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          format === formatOption.id ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                      </div>
                      <div>
                        <div className={`font-medium ${
                          format === formatOption.id ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {formatOption.label}
                        </div>
                        <div className={`text-sm ${
                          format === formatOption.id ? 'text-blue-700' : 'text-gray-500'
                        }`}>
                          {formatOption.description}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Options
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Include company logo</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Password protect PDF</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Compress file size</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Schedule & Generate */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Schedule This Report</div>
              <div className="text-sm text-gray-600">Automatically generate and send this report</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={schedule.enabled}
                onChange={(e) => setSchedule({...schedule, enabled: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {schedule.enabled && (
            <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency
                </label>
                <select
                  value={schedule.frequency}
                  onChange={(e) => setSchedule({...schedule, frequency: e.target.value as any})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipients
                </label>
                <div className="space-y-2">
                  {['admin@company.com', 'manager@company.com', 'finance@company.com'].map((email) => (
                    <label key={email} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={schedule.recipients.includes(email)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSchedule({...schedule, recipients: [...schedule.recipients, email]});
                          } else {
                            setSchedule({...schedule, recipients: schedule.recipients.filter(r => r !== email)});
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{email}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <InformationCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-blue-900">Report Summary</div>
                <div className="text-sm text-blue-700 mt-1">
                  {reportName || 'Untitled Report'} • {reportType.charAt(0).toUpperCase() + reportType.slice(1)} • {format.toUpperCase()}
                  <br />
                  Period: {dateRange.start} to {dateRange.end}
                  {schedule.enabled && ` • Scheduled: ${schedule.frequency}`}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <div>
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
            >
              ← Back
            </Button>
          )}
        </div>
        
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleNext}
            loading={loading}
          >
            {step === 4 ? 'Generate Report' : 'Continue →'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;
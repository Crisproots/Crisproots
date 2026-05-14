"use client";

import React, { useState } from 'react';
import { formatCurrency } from '../../utils/formatUtils';
import {
  Activity,
  Heart,
  AlertTriangle,
  Calendar,
  Thermometer,
  Plus,
  Search,
  Download,
  Syringe,
  Pill,
  ShieldCheck,
  User,
  FileText,
  TrendingUp,
  Bell
} from 'lucide-react';

interface HealthRecord {
  id: string;
  animalId: string;
  animalTag: string;
  animalName: string;
  date: string;
  type: 'Vaccination' | 'Treatment' | 'Checkup' | 'Surgery' | 'Emergency';
  condition?: string;
  symptoms: string[];
  diagnosis: string;
  treatment: string;
  medication: string[];
  veterinarian: string;
  temperature?: number;
  heartRate?: number;
  respiratoryRate?: number;
  weight?: number;
  followUpDate?: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Follow-up Required';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  cost: number;
  notes: string;
  images?: string[];
}

interface VaccinationSchedule {
  id: string;
  animalId: string;
  animalTag: string;
  vaccineType: string;
  lastGiven: string;
  nextDue: string;
  status: 'Due' | 'Overdue' | 'Completed' | 'Scheduled';
  veterinarian?: string;
}

const HealthMonitoringSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'records' | 'vaccinations' | 'alerts' | 'analytics'>('records');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Sample health records
  const [healthRecords] = useState<HealthRecord[]>([
    {
      id: '1',
      animalId: 'A001',
      animalTag: 'A001',
      animalName: 'Ganga',
      date: '2024-01-15',
      type: 'Vaccination',
      symptoms: [],
      diagnosis: 'Routine FMD Vaccination',
      treatment: 'FMD Vaccine Administration',
      medication: ['FMD Vaccine 5ml'],
      veterinarian: 'Dr. Rajesh Kumar',
      temperature: 101.2,
      heartRate: 72,
      respiratoryRate: 18,
      weight: 550,
      followUpDate: '2024-07-15',
      status: 'Completed',
      severity: 'Low',
      cost: 150,
      notes: 'Animal responded well to vaccination. No adverse reactions observed.',
      images: ['/api/placeholder/300/200']
    },
    {
      id: '2',
      animalId: 'B002',
      animalTag: 'B002',
      animalName: 'Yamuna',
      date: '2024-01-20',
      type: 'Treatment',
      condition: 'Mastitis',
      symptoms: ['Swollen udder', 'Reduced milk production', 'Fever'],
      diagnosis: 'Clinical Mastitis - Mild',
      treatment: 'Antibiotic therapy and anti-inflammatory',
      medication: ['Amoxicillin 500mg', 'Ibuprofen 200mg'],
      veterinarian: 'Dr. Priya Sharma',
      temperature: 102.8,
      heartRate: 85,
      respiratoryRate: 22,
      weight: 480,
      followUpDate: '2024-01-27',
      status: 'Follow-up Required',
      severity: 'Medium',
      cost: 850,
      notes: 'Monitor udder condition daily. Milk withdrawal period: 72 hours.',
      images: ['/api/placeholder/300/200']
    },
    {
      id: '3',
      animalId: 'C003',
      animalTag: 'C003',
      animalName: 'Nandi',
      date: '2024-01-25',
      type: 'Checkup',
      symptoms: [],
      diagnosis: 'Routine Health Assessment',
      treatment: 'General examination and health assessment',
      medication: [],
      veterinarian: 'Dr. Amit Patel',
      temperature: 100.8,
      heartRate: 68,
      respiratoryRate: 16,
      weight: 650,
      status: 'Completed',
      severity: 'Low',
      cost: 300,
      notes: 'Excellent overall health. All parameters within normal range.',
      images: []
    }
  ]);

  // Sample vaccination schedule
  const [vaccinationSchedule] = useState<VaccinationSchedule[]>([
    {
      id: '1',
      animalId: 'A001',
      animalTag: 'A001',
      vaccineType: 'FMD (Foot and Mouth Disease)',
      lastGiven: '2024-01-15',
      nextDue: '2024-07-15',
      status: 'Scheduled'
    },
    {
      id: '2',
      animalId: 'B002',
      animalTag: 'B002',
      vaccineType: 'Brucellosis',
      lastGiven: '2023-12-10',
      nextDue: '2024-02-15',
      status: 'Overdue'
    },
    {
      id: '3',
      animalId: 'C003',
      animalTag: 'C003',
      vaccineType: 'Anthrax',
      lastGiven: '2023-11-20',
      nextDue: '2024-02-01',
      status: 'Due'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Follow-up Required': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Scheduled': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Due': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderHealthRecords = () => {
    const filteredRecords = healthRecords.filter(record => {
      const matchesSearch = record.animalTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           record.animalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'All' || record.type === filterType;
      const matchesStatus = filterStatus === 'All' || record.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });

    return (
      <div className="space-y-6">
        {filteredRecords.map((record) => (
          <div key={record.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                    {record.type === 'Vaccination' && <Syringe className="w-6 h-6 text-white" />}
                    {record.type === 'Treatment' && <Pill className="w-6 h-6 text-white" />}
                    {record.type === 'Checkup' && <Activity className="w-6 h-6 text-white" />}
                    {record.type === 'Surgery' && <Activity className="w-6 h-6 text-white" />}
                    {record.type === 'Emergency' && <AlertTriangle className="w-6 h-6 text-white" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{record.animalName} ({record.animalTag})</h3>
                    <p className="text-gray-600">{record.diagnosis}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                    {new Date(record.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2 text-green-500" />
                    {record.veterinarian}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Heart className="w-4 h-4 mr-2 text-red-500" />
                    Type: {record.type}
                  </div>
                </div>

                {record.symptoms.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Symptoms:</h4>
                    <div className="flex flex-wrap gap-2">
                      {record.symptoms.map((symptom, index) => (
                        <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {record.medication.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Medication:</h4>
                    <div className="flex flex-wrap gap-2">
                      {record.medication.map((med, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {med}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(record.temperature || record.heartRate || record.respiratoryRate) && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {record.temperature && (
                      <div className="flex items-center text-sm">
                        <Thermometer className="w-4 h-4 mr-2 text-orange-500" />
                        <span className="font-medium">Temp:</span>
                        <span className="ml-1">{record.temperature}°F</span>
                      </div>
                    )}
                    {record.heartRate && (
                      <div className="flex items-center text-sm">
                        <Heart className="w-4 h-4 mr-2 text-red-500" />
                        <span className="font-medium">HR:</span>
                        <span className="ml-1">{record.heartRate} bpm</span>
                      </div>
                    )}
                    {record.respiratoryRate && (
                      <div className="flex items-center text-sm">
                        <Activity className="w-4 h-4 mr-2 text-green-500" />
                        <span className="font-medium">RR:</span>
                        <span className="ml-1">{record.respiratoryRate} /min</span>
                      </div>
                    )}
                  </div>
                )}

                {record.notes && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-1">Notes:</h4>
                    <p className="text-sm text-gray-700">{record.notes}</p>
                  </div>
                )}
              </div>

              <div className="ml-6 text-right">
                <div className="flex flex-col space-y-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(record.status)}`}>
                    {record.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(record.severity)}`}>
                    {record.severity}
                  </span>
                  <div className="text-sm font-bold text-gray-900">
                    ₹{formatCurrency(record.cost)}
                  </div>
                  {record.followUpDate && (
                    <div className="text-xs text-gray-600">
                      Follow-up: {new Date(record.followUpDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-600">
                Treatment: {record.treatment}
              </div>
              <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderVaccinationSchedule = () => {
    return (
      <div className="space-y-4">
        {vaccinationSchedule.map((vaccine) => (
          <div key={vaccine.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{vaccine.animalTag}</h3>
                  <p className="text-gray-600">{vaccine.vaccineType}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(vaccine.status)}`}>
                  {vaccine.status}
                </span>
                <div className="mt-2 text-sm text-gray-600">
                  <div>Last: {new Date(vaccine.lastGiven).toLocaleDateString()}</div>
                  <div>Next: {new Date(vaccine.nextDue).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderAlerts = () => {
    const alerts = [
      { type: 'Vaccination Due', count: 3, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
      { type: 'Follow-up Required', count: 1, color: 'text-orange-600', bgColor: 'bg-orange-100' },
      { type: 'Critical Cases', count: 0, color: 'text-red-600', bgColor: 'bg-red-100' },
      { type: 'Upcoming Checkups', count: 5, color: 'text-blue-600', bgColor: 'bg-blue-100' }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {alerts.map((alert, index) => (
          <div key={index} className={`${alert.bgColor} rounded-xl p-6 border`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{alert.type}</h3>
                <p className={`text-3xl font-bold ${alert.color} mt-2`}>{alert.count}</p>
              </div>
              <Bell className={`w-8 h-8 ${alert.color}`} />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderAnalytics = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Health Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Overall Health Score</span>
              <div className="flex items-center">
                <div className="w-24 h-2 bg-gray-200 rounded-full mr-3">
                  <div className="w-20 h-2 bg-green-500 rounded-full"></div>
                </div>
                <span className="font-bold text-green-600">85%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Vaccination Coverage</span>
              <div className="flex items-center">
                <div className="w-24 h-2 bg-gray-200 rounded-full mr-3">
                  <div className="w-22 h-2 bg-blue-500 rounded-full"></div>
                </div>
                <span className="font-bold text-blue-600">92%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Treatment Success Rate</span>
              <div className="flex items-center">
                <div className="w-24 h-2 bg-gray-200 rounded-full mr-3">
                  <div className="w-23 h-2 bg-purple-500 rounded-full"></div>
                </div>
                <span className="font-bold text-purple-600">96%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Monthly Costs</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Veterinary Services</span>
              <span className="font-bold text-gray-900">₹12,500</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Medications</span>
              <span className="font-bold text-gray-900">₹8,200</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Vaccinations</span>
              <span className="font-bold text-gray-900">₹3,800</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-lg font-bold text-green-600">₹24,500</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Health Monitoring System</h1>
            <p className="text-gray-600">Comprehensive animal health management</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-200">
              <Plus className="w-5 h-5 mr-2" />
              Add Health Record
            </button>
            <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200">
              <Download className="w-5 h-5 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-white rounded-xl p-1 shadow-lg">
          {[
            { id: 'records', label: 'Health Records', icon: FileText },
            { id: 'vaccinations', label: 'Vaccinations', icon: Syringe },
            { id: 'alerts', label: 'Alerts', icon: Bell },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'records' | 'vaccinations' | 'alerts' | 'analytics')}
                className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Filters */}
        {activeTab === 'records' && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by animal tag, name, or diagnosis..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Types</option>
                  <option value="Vaccination">Vaccination</option>
                  <option value="Treatment">Treatment</option>
                  <option value="Checkup">Checkup</option>
                  <option value="Surgery">Surgery</option>
                  <option value="Emergency">Emergency</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Statuses</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Follow-up Required">Follow-up Required</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div>
          {activeTab === 'records' && renderHealthRecords()}
          {activeTab === 'vaccinations' && renderVaccinationSchedule()}
          {activeTab === 'alerts' && renderAlerts()}
          {activeTab === 'analytics' && renderAnalytics()}
        </div>
      </div>
    </div>
  );
};

export default HealthMonitoringSystem;

"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { formatCurrency } from '../../utils/formatUtils';
import { 
  Plus, 
  Search, 
  Download, 
  TrendingUp, 
  TrendingDown,
  Heart,
  Activity,
  AlertTriangle,
  Droplets,
  Baby,
  Bell,
  QrCode,
  DollarSign,
  PawPrint,
  BarChart3
} from 'lucide-react';

// Import the new components
import CattleAnalyticsDashboard from './CattleAnalyticsDashboard';
import HealthMonitoringSystem from './HealthMonitoringSystem';

// Enhanced Types
interface Animal {
  id: string;
  tagNumber: string;
  name: string;
  breed: string;
  gender: 'Male' | 'Female';
  birthDate: string;
  weight: number;
  color: string;
  markings: string;
  status: 'Active' | 'Pregnant' | 'Sick' | 'Sold' | 'Deceased';
  category: 'Dairy Cow' | 'Bull' | 'Heifer' | 'Calf' | 'Dry Cow';
  milkProduction: {
    daily: number;
    monthly: number;
    lactationPeriod: number;
  };
  health: {
    lastCheckup: string;
    vaccinations: HealthRecord[];
    treatments: HealthRecord[];
    nextAppointment?: string;
  };
  breeding: {
    lastBreeding?: string;
    pregnancyStatus: 'Not Pregnant' | 'Pregnant' | 'Recently Calved';
    calvingHistory: CalvingRecord[];
    expectedCalving?: string;
  };
  location: {
    paddock: string;
    barn: string;
    gpsCoordinates?: { lat: number; lng: number };
  };
  parentage: {
    sire?: string;
    dam?: string;
  };
  economicData: {
    purchasePrice: number;
    currentValue: number;
    totalCost: number;
    totalRevenue: number;
    roi: number;
  };
  notes: string;
  images: string[];
  qrCode: string;
  createdAt: string;
  updatedAt: string;
}

interface HealthRecord {
  id: string;
  date: string;
  type: 'Vaccination' | 'Treatment' | 'Checkup' | 'Surgery';
  description: string;
  veterinarian: string;
  medication?: string[];
  cost: number;
  nextDue?: string;
  notes: string;
}

interface CalvingRecord {
  id: string;
  date: string;
  calfId?: string;
  complications: boolean;
  assistanceRequired: boolean;
  calfWeight: number;
  notes: string;
}

interface FarmMetrics {
  totalAnimals: number;
  healthyAnimals: number;
  sickAnimals: number;
  pregnantAnimals: number;
  dailyMilkProduction: number;
  monthlyMilkProduction: number;
  averageMilkPerCow: number;
  vaccinationsDue: number;
  calvingsDue: number;
  totalFarmValue: number;
  monthlyRevenue: number;
  monthlyCosts: number;
  profitMargin: number;
}

const EnhancedCattleManagement: React.FC = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [filteredAnimals, setFilteredAnimals] = useState<Animal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'tagNumber' | 'name' | 'age' | 'milkProduction'>('tagNumber');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'cards'>('cards');
  const [activeMainTab, setActiveMainTab] = useState<'animals' | 'health' | 'analytics'>('animals');

  // Farm metrics calculation
  const farmMetrics: FarmMetrics = useMemo(() => {
    const totalAnimals = animals.length;
    const healthyAnimals = animals.filter(a => a.status === 'Active').length;
    const sickAnimals = animals.filter(a => a.status === 'Sick').length;
    const pregnantAnimals = animals.filter(a => a.status === 'Pregnant').length;
    const dailyMilkProduction = animals.reduce((sum, a) => sum + a.milkProduction.daily, 0);
    const monthlyMilkProduction = animals.reduce((sum, a) => sum + a.milkProduction.monthly, 0);
    const totalFarmValue = animals.reduce((sum, a) => sum + a.economicData.currentValue, 0);
    const monthlyRevenue = animals.reduce((sum, a) => sum + a.economicData.totalRevenue, 0);
    const monthlyCosts = animals.reduce((sum, a) => sum + a.economicData.totalCost, 0);

    return {
      totalAnimals,
      healthyAnimals,
      sickAnimals,
      pregnantAnimals,
      dailyMilkProduction,
      monthlyMilkProduction,
      averageMilkPerCow: totalAnimals > 0 ? dailyMilkProduction / totalAnimals : 0,
      vaccinationsDue: animals.filter(a => a.health.nextAppointment && new Date(a.health.nextAppointment) <= new Date()).length,
      calvingsDue: animals.filter(a => a.breeding.expectedCalving && new Date(a.breeding.expectedCalving) <= new Date()).length,
      totalFarmValue,
      monthlyRevenue,
      monthlyCosts,
      profitMargin: monthlyRevenue > 0 ? ((monthlyRevenue - monthlyCosts) / monthlyRevenue) * 100 : 0
    };
  }, [animals]);

  // Initialize with sample data
  useEffect(() => {
    initializeSampleData();
  }, []);

  // Filter and sort animals
  useEffect(() => {
    const filtered = animals.filter(animal => {
      const matchesSearch = animal.tagNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           animal.breed.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || animal.category === selectedCategory;
      const matchesStatus = selectedStatus === 'All' || animal.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort animals
    filtered.sort((a, b) => {
      let aValue: string | number, bValue: string | number;
      switch (sortBy) {
        case 'tagNumber':
          aValue = a.tagNumber;
          bValue = b.tagNumber;
          break;
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'age':
          aValue = new Date().getTime() - new Date(a.birthDate).getTime();
          bValue = new Date().getTime() - new Date(b.birthDate).getTime();
          break;
        case 'milkProduction':
          aValue = a.milkProduction.daily;
          bValue = b.milkProduction.daily;
          break;
        default:
          aValue = a.tagNumber;
          bValue = b.tagNumber;
      }

      return aValue > bValue ? 1 : -1;
    });

    setFilteredAnimals(filtered);
  }, [animals, searchTerm, selectedCategory, selectedStatus, sortBy]);

  const initializeSampleData = () => {
    const sampleAnimals: Animal[] = [
      {
        id: '1',
        tagNumber: 'A001',
        name: 'Ganga',
        breed: 'Holstein Friesian',
        gender: 'Female',
        birthDate: '2020-03-15',
        weight: 550,
        color: 'Black and White',
        markings: 'White blaze on face',
        status: 'Active',
        category: 'Dairy Cow',
        milkProduction: { daily: 28, monthly: 840, lactationPeriod: 305 },
        health: {
          lastCheckup: '2024-01-15',
          vaccinations: [
            {
              id: 'v1',
              date: '2024-01-15',
              type: 'Vaccination',
              description: 'FMD Vaccine',
              veterinarian: 'Dr. Rajesh Kumar',
              cost: 150,
              nextDue: '2024-07-15',
              notes: 'Annual FMD vaccination completed'
            }
          ],
          treatments: [],
          nextAppointment: '2024-07-15'
        },
        breeding: {
          pregnancyStatus: 'Not Pregnant',
          calvingHistory: [
            {
              id: 'c1',
              date: '2023-02-10',
              complications: false,
              assistanceRequired: false,
              calfWeight: 35,
              notes: 'Healthy calf born'
            }
          ]
        },
        location: { paddock: 'North Field', barn: 'Barn A', gpsCoordinates: { lat: 28.6139, lng: 77.2090 } },
        parentage: { sire: 'Bull-001', dam: 'Cow-025' },
        economicData: {
          purchasePrice: 45000,
          currentValue: 55000,
          totalCost: 15000,
          totalRevenue: 35000,
          roi: 15.5
        },
        notes: 'High milk producer, excellent health record',
        images: ['/api/placeholder/400/300'],
        qrCode: 'QR-A001',
        createdAt: '2020-03-15',
        updatedAt: '2024-01-15'
      },
      {
        id: '2',
        tagNumber: 'B002',
        name: 'Yamuna',
        breed: 'Sahiwal',
        gender: 'Female',
        birthDate: '2019-08-22',
        weight: 480,
        color: 'Red',
        markings: 'Dark red patches',
        status: 'Pregnant',
        category: 'Dairy Cow',
        milkProduction: { daily: 22, monthly: 660, lactationPeriod: 290 },
        health: {
          lastCheckup: '2024-01-10',
          vaccinations: [],
          treatments: [],
          nextAppointment: '2024-06-10'
        },
        breeding: {
          pregnancyStatus: 'Pregnant',
          expectedCalving: '2024-08-15',
          calvingHistory: []
        },
        location: { paddock: 'South Field', barn: 'Barn B' },
        parentage: {},
        economicData: {
          purchasePrice: 38000,
          currentValue: 48000,
          totalCost: 12000,
          totalRevenue: 28000,
          roi: 12.3
        },
        notes: 'Indigenous breed, good adaptation to local climate',
        images: ['/api/placeholder/400/300'],
        qrCode: 'QR-B002',
        createdAt: '2019-08-22',
        updatedAt: '2024-01-10'
      },
      {
        id: '3',
        tagNumber: 'C003',
        name: 'Nandi',
        breed: 'Gir',
        gender: 'Male',
        birthDate: '2018-12-05',
        weight: 650,
        color: 'White with red patches',
        markings: 'Large red patch on left side',
        status: 'Active',
        category: 'Bull',
        milkProduction: { daily: 0, monthly: 0, lactationPeriod: 0 },
        health: {
          lastCheckup: '2024-01-20',
          vaccinations: [],
          treatments: [],
          nextAppointment: '2024-07-20'
        },
        breeding: {
          pregnancyStatus: 'Not Pregnant',
          calvingHistory: []
        },
        location: { paddock: 'Bull Paddock', barn: 'Bull Barn' },
        parentage: {},
        economicData: {
          purchasePrice: 85000,
          currentValue: 95000,
          totalCost: 20000,
          totalRevenue: 15000,
          roi: 5.2
        },
        notes: 'Breeding bull, excellent genetic traits',
        images: ['/api/placeholder/400/300'],
        qrCode: 'QR-C003',
        createdAt: '2018-12-05',
        updatedAt: '2024-01-20'
      }
    ];
    setAnimals(sampleAnimals);
  };

  const calculateAge = (birthDate: string): string => {
    const birth = new Date(birthDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - birth.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    return `${years}y ${months}m`;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pregnant': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Sick': return 'bg-red-100 text-red-800 border-red-200';
      case 'Sold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Deceased': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(animals, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `cattle-data-${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const generateQRCode = (animal: Animal): void => {
    // In a real app, this would generate and download a QR code
    alert(`QR Code for ${animal.name} (${animal.tagNumber}) would be generated here`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-green-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                <PawPrint className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Smart Cattle Management</h1>
                <p className="text-gray-600">Comprehensive Farm Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Animal
              </button>
              <button
                onClick={exportData}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
              >
                <Download className="w-5 h-5 mr-2" />
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 mb-8 bg-white rounded-xl p-1 shadow-lg">
          {[
            { id: 'animals', label: 'Animal Management', icon: PawPrint },
            { id: 'health', label: 'Health Monitoring', icon: Activity },
            { id: 'analytics', label: 'Analytics Dashboard', icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveMainTab(tab.id as 'animals' | 'health' | 'analytics')}
                className={`flex-1 flex items-center justify-center px-6 py-4 rounded-lg font-medium transition-all duration-200 ${
                  activeMainTab === tab.id
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content based on active tab */}
      {activeMainTab === 'animals' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Animals"
              value={farmMetrics.totalAnimals.toString()}
              icon={PawPrint}
              color="from-green-500 to-green-600"
              trend={+5}
            />
            <MetricCard
              title="Daily Milk Production"
              value={`${farmMetrics.dailyMilkProduction.toFixed(1)}L`}
              icon={Droplets}
              color="from-blue-500 to-blue-600"
              trend={+8}
            />
            <MetricCard
              title="Healthy Animals"
              value={farmMetrics.healthyAnimals.toString()}
              icon={Heart}
              color="from-red-500 to-pink-600"
              trend={+2}
            />
            <MetricCard
              title="Farm Value"
              value={`₹${(farmMetrics.totalFarmValue / 100000).toFixed(1)}L`}
              icon={DollarSign}
              color="from-purple-500 to-purple-600"
              trend={+12}
            />
          </div>

          {/* Alerts Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-yellow-500">
            <div className="flex items-center mb-4">
              <Bell className="w-6 h-6 text-yellow-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Farm Alerts</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                  <span className="font-semibold text-red-800">{farmMetrics.vaccinationsDue} Vaccinations Due</span>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center">
                  <Baby className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="font-semibold text-purple-800">{farmMetrics.calvingsDue} Calvings Expected</span>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center">
                  <Activity className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="font-semibold text-yellow-800">{farmMetrics.sickAnimals} Animals Need Attention</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by tag number, name, or breed..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="All">All Categories</option>
                  <option value="Dairy Cow">Dairy Cow</option>
                  <option value="Bull">Bull</option>
                  <option value="Heifer">Heifer</option>
                  <option value="Calf">Calf</option>
                  <option value="Dry Cow">Dry Cow</option>
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Pregnant">Pregnant</option>
                  <option value="Sick">Sick</option>
                  <option value="Sold">Sold</option>
                  <option value="Deceased">Deceased</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'tagNumber' | 'name' | 'age' | 'milkProduction')}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="tagNumber">Tag Number</option>
                  <option value="name">Name</option>
                  <option value="age">Age</option>
                  <option value="milkProduction">Milk Production</option>
                </select>
                <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`px-3 py-2 ${viewMode === 'cards' ? 'bg-green-500 text-white' : 'bg-white text-gray-700'}`}
                  >
                    Cards
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-2 ${viewMode === 'table' ? 'bg-green-500 text-white' : 'bg-white text-gray-700'}`}
                  >
                    Table
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Animals Display */}
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAnimals.map((animal) => (
                <AnimalCard
                  key={animal.id}
                  animal={animal}
                  onSelect={setSelectedAnimal}
                  onGenerateQR={generateQRCode}
                  calculateAge={calculateAge}
                  getStatusColor={getStatusColor}
                />
              ))}
            </div>
          ) : (
            <AnimalTable
              animals={filteredAnimals}
              onSelect={setSelectedAnimal}
              calculateAge={calculateAge}
              getStatusColor={getStatusColor}
            />
          )}

          {/* Animal Detail Modal */}
          {selectedAnimal && (
            <AnimalDetailModal
              animal={selectedAnimal}
              onClose={() => setSelectedAnimal(null)}
              calculateAge={calculateAge}
            />
          )}

          {/* Add Animal Modal */}
          {showAddModal && (
            <AddAnimalModal
              onClose={() => setShowAddModal(false)}
              onSave={(newAnimal) => {
                setAnimals([...animals, { ...newAnimal, id: Date.now().toString() }]);
                setShowAddModal(false);
              }}
            />
          )}
        </div>
      )}

      {(activeMainTab as string) === 'health' && (
        <HealthMonitoringSystem />
      )}

      {(activeMainTab as string) === 'analytics' && (
        <CattleAnalyticsDashboard />
      )}
    </div>
  );
};

// Metric Card Component
const MetricCard: React.FC<{
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
  trend: number;
}> = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <div className="flex items-center mt-2">
          {trend > 0 ? (
            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
          )}
          <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(trend)}%
          </span>
          <span className="text-sm text-gray-500 ml-1">vs last month</span>
        </div>
      </div>
      <div className={`w-16 h-16 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
    </div>
  </div>
);

// Animal Card Component
const AnimalCard: React.FC<{
  animal: Animal;
  onSelect: (animal: Animal) => void;
  onGenerateQR: (animal: Animal) => void;
  calculateAge: (birthDate: string) => string;
  getStatusColor: (status: string) => string;
}> = ({ animal, onSelect, onGenerateQR, calculateAge, getStatusColor }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
    <div className="aspect-w-16 aspect-h-12 bg-gray-200">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={animal.images[0] || '/api/placeholder/400/300'}
        alt={animal.name}
        className="w-full h-48 object-cover"
      />
      <div className="absolute top-4 right-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(animal.status)}`}>
          {animal.status}
        </span>
      </div>
    </div>
    <div className="p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-bold text-gray-900">{animal.name}</h3>
        <button
          onClick={() => onGenerateQR(animal)}
          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
        >
          <QrCode className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium">Tag:</span>
          <span className="ml-2 bg-gray-100 px-2 py-1 rounded">{animal.tagNumber}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium">Breed:</span>
          <span className="ml-2">{animal.breed}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium">Age:</span>
          <span className="ml-2">{calculateAge(animal.birthDate)}</span>
        </div>
        {animal.category === 'Dairy Cow' && (
          <div className="flex items-center text-sm text-gray-600">
            <Droplets className="w-4 h-4 mr-1 text-blue-500" />
            <span className="font-medium">{animal.milkProduction.daily}L/day</span>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <button
          onClick={() => onSelect(animal)}
          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium"
        >
          View Details
        </button>
        <div className="ml-3 flex space-x-1">
          {animal.health.nextAppointment && new Date(animal.health.nextAppointment) <= new Date() && (
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" title="Vaccination Due" />
          )}
          {animal.breeding.expectedCalving && new Date(animal.breeding.expectedCalving) <= new Date() && (
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" title="Calving Expected" />
          )}
        </div>
      </div>
    </div>
  </div>
);

// Animal Table Component
const AnimalTable: React.FC<{
  animals: Animal[];
  onSelect: (animal: Animal) => void;
  calculateAge: (birthDate: string) => string;
  getStatusColor: (status: string) => string;
}> = ({ animals, onSelect, calculateAge, getStatusColor }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Animal</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Production</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Health</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {animals.map((animal) => (
            <tr key={animal.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="h-12 w-12 rounded-full object-cover" src={animal.images[0] || '/api/placeholder/100/100'} alt="" />
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{animal.name}</div>
                    <div className="text-sm text-gray-500">{animal.tagNumber}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{animal.breed}</div>
                <div className="text-sm text-gray-500">{calculateAge(animal.birthDate)} • {animal.gender}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {animal.category === 'Dairy Cow' ? (
                  <div className="text-sm text-gray-900">
                    <div>{animal.milkProduction.daily}L/day</div>
                    <div className="text-gray-500">{animal.milkProduction.monthly}L/month</div>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">N/A</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {animal.health.nextAppointment && new Date(animal.health.nextAppointment) <= new Date() ? (
                    <div className="flex items-center text-red-600">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      <span className="text-sm">Due</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-green-600">
                      <Heart className="w-4 h-4 mr-1" />
                      <span className="text-sm">Good</span>
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(animal.status)}`}>
                  {animal.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onSelect(animal)}
                  className="text-green-600 hover:text-green-900 transition-colors"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Animal Detail Modal Component
const AnimalDetailModal: React.FC<{
  animal: Animal;
  onClose: () => void;
  calculateAge: (birthDate: string) => string;
}> = ({ animal, onClose, calculateAge }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={animal.images[0] || '/api/placeholder/100/100'}
              alt={animal.name}
              className="w-16 h-16 rounded-full object-cover mr-4"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{animal.name}</h2>
              <p className="text-gray-600">{animal.tagNumber} • {animal.breed}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex border-b border-gray-200">
          {['overview', 'health', 'breeding', 'economics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium capitalize ${
                activeTab === tab
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Basic Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Age:</span> {calculateAge(animal.birthDate)}</div>
                    <div><span className="font-medium">Gender:</span> {animal.gender}</div>
                    <div><span className="font-medium">Weight:</span> {animal.weight} kg</div>
                    <div><span className="font-medium">Color:</span> {animal.color}</div>
                    <div><span className="font-medium">Category:</span> {animal.category}</div>
                  </div>
                </div>
                
                {animal.category === 'Dairy Cow' && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Milk Production</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Daily:</span> {animal.milkProduction.daily}L</div>
                      <div><span className="font-medium">Monthly:</span> {animal.milkProduction.monthly}L</div>
                      <div><span className="font-medium">Lactation Period:</span> {animal.milkProduction.lactationPeriod} days</div>
                    </div>
                  </div>
                )}

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Paddock:</span> {animal.location.paddock}</div>
                    <div><span className="font-medium">Barn:</span> {animal.location.barn}</div>
                    {animal.location.gpsCoordinates && (
                      <div><span className="font-medium">GPS:</span> {animal.location.gpsCoordinates.lat}, {animal.location.gpsCoordinates.lng}</div>
                    )}
                  </div>
                </div>
              </div>

              {animal.notes && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
                  <p className="text-sm text-gray-700">{animal.notes}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'health' && (
            <div className="space-y-6">
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Health Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Last Checkup:</span> {new Date(animal.health.lastCheckup).toLocaleDateString()}</div>
                  {animal.health.nextAppointment && (
                    <div><span className="font-medium">Next Appointment:</span> {new Date(animal.health.nextAppointment).toLocaleDateString()}</div>
                  )}
                </div>
              </div>

              {animal.health.vaccinations.length > 0 && (
                <div className="bg-white border border-gray-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-4">Vaccination History</h3>
                  <div className="space-y-3">
                    {animal.health.vaccinations.map((vaccination) => (
                      <div key={vaccination.id} className="border-l-4 border-green-500 pl-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{vaccination.description}</h4>
                            <p className="text-sm text-gray-600">by {vaccination.veterinarian}</p>
                            <p className="text-sm text-gray-500">{new Date(vaccination.date).toLocaleDateString()}</p>
                          </div>
                          {vaccination.nextDue && (
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">Next Due:</p>
                              <p className="text-sm text-gray-600">{new Date(vaccination.nextDue).toLocaleDateString()}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'breeding' && (
            <div className="space-y-6">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Breeding Status</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Status:</span> {animal.breeding.pregnancyStatus}</div>
                  {animal.breeding.expectedCalving && (
                    <div><span className="font-medium">Expected Calving:</span> {new Date(animal.breeding.expectedCalving).toLocaleDateString()}</div>
                  )}
                  {animal.breeding.lastBreeding && (
                    <div><span className="font-medium">Last Breeding:</span> {new Date(animal.breeding.lastBreeding).toLocaleDateString()}</div>
                  )}
                </div>
              </div>

              {animal.breeding.calvingHistory.length > 0 && (
                <div className="bg-white border border-gray-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-4">Calving History</h3>
                  <div className="space-y-3">
                    {animal.breeding.calvingHistory.map((calving) => (
                      <div key={calving.id} className="border-l-4 border-purple-500 pl-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{new Date(calving.date).toLocaleDateString()}</p>
                            <p className="text-sm text-gray-600">Calf Weight: {calving.calfWeight} kg</p>
                            <p className="text-sm text-gray-500">{calving.complications ? 'Complications' : 'Normal delivery'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'economics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Financial Overview</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Purchase Price:</span> ₹{formatCurrency(animal.economicData.purchasePrice)}</div>
                    <div><span className="font-medium">Current Value:</span> ₹{formatCurrency(animal.economicData.currentValue)}</div>
                    <div><span className="font-medium">Total Costs:</span> ₹{formatCurrency(animal.economicData.totalCost)}</div>
                    <div><span className="font-medium">Total Revenue:</span> ₹{formatCurrency(animal.economicData.totalRevenue)}</div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">ROI Analysis</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">ROI:</span> {animal.economicData.roi.toFixed(1)}%</div>
                    <div><span className="font-medium">Net Profit:</span> ₹{formatCurrency(animal.economicData.totalRevenue - animal.economicData.totalCost)}</div>
                    <div><span className="font-medium">Value Appreciation:</span> ₹{formatCurrency(animal.economicData.currentValue - animal.economicData.purchasePrice)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Add Animal Modal Component
const AddAnimalModal: React.FC<{
  onClose: () => void;
  onSave: (animal: Omit<Animal, 'id'>) => void;
}> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState<{
    tagNumber: string;
    name: string;
    breed: string;
    gender: 'Male' | 'Female';
    birthDate: string;
    weight: number;
    color: string;
    markings: string;
    status: 'Active' | 'Pregnant' | 'Sick' | 'Sold' | 'Deceased';
    category: 'Dairy Cow' | 'Bull' | 'Heifer' | 'Calf' | 'Dry Cow';
    paddock: string;
    barn: string;
    notes: string;
  }>({
    tagNumber: '',
    name: '',
    breed: '',
    gender: 'Female',
    birthDate: '',
    weight: 0,
    color: '',
    markings: '',
    status: 'Active',
    category: 'Dairy Cow',
    paddock: '',
    barn: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAnimal: Omit<Animal, 'id'> = {
      ...formData,
      milkProduction: { daily: 0, monthly: 0, lactationPeriod: 0 },
      health: {
        lastCheckup: new Date().toISOString().split('T')[0],
        vaccinations: [],
        treatments: []
      },
      breeding: {
        pregnancyStatus: 'Not Pregnant',
        calvingHistory: []
      },
      location: { paddock: formData.paddock, barn: formData.barn },
      parentage: {},
      economicData: {
        purchasePrice: 0,
        currentValue: 0,
        totalCost: 0,
        totalRevenue: 0,
        roi: 0
      },
      images: ['/api/placeholder/400/300'],
      qrCode: `QR-${formData.tagNumber}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onSave(newAnimal);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Add New Animal</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tag Number</label>
              <input
                type="text"
                required
                value={formData.tagNumber}
                onChange={(e) => setFormData({ ...formData, tagNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Breed</label>
              <select
                required
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Breed</option>
                <option value="Holstein Friesian">Holstein Friesian</option>
                <option value="Sahiwal">Sahiwal</option>
                <option value="Gir">Gir</option>
                <option value="Red Sindhi">Red Sindhi</option>
                <option value="Tharparkar">Tharparkar</option>
                <option value="Kankrej">Kankrej</option>
                <option value="Ongole">Ongole</option>
                <option value="Hariana">Hariana</option>
                <option value="Cross Breed">Cross Breed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                required
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date</label>
              <input
                type="date"
                required
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
              <input
                type="number"
                required
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <input
                type="text"
                required
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as 'Dairy Cow' | 'Bull' | 'Heifer' | 'Calf' | 'Dry Cow' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="Dairy Cow">Dairy Cow</option>
                <option value="Bull">Bull</option>
                <option value="Heifer">Heifer</option>
                <option value="Calf">Calf</option>
                <option value="Dry Cow">Dry Cow</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Paddock</label>
              <input
                type="text"
                value={formData.paddock}
                onChange={(e) => setFormData({ ...formData, paddock: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Barn</label>
              <input
                type="text"
                value={formData.barn}
                onChange={(e) => setFormData({ ...formData, barn: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
            >
              Add Animal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Export missing component for TypeScript
const X: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default EnhancedCattleManagement;

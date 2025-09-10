"use client"

import { useState } from 'react';
import CRMHeader from '@/components/CRMHeader';
import { 
  Users, 
  Settings, 
  Database, 
  FileText, 
  Shield, 
  Bell, 
  ChevronRight,
  Activity,
  UserCheck,
  Building2,
  Mail,
  Home,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Mail as MailIcon,
  UserX,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  TrendingUp,
  Save,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [auditSearchTerm, setAuditSearchTerm] = useState('');
  const [auditUserFilter, setAuditUserFilter] = useState('all');
  const [auditActionFilter, setAuditActionFilter] = useState('all');
  const [auditDateFilter, setAuditDateFilter] = useState('all');
  const [selectedDimensionTable, setSelectedDimensionTable] = useState('contact_type');
  const [showPassword, setShowPassword] = useState(false);
  const [roleSearchTerm, setRoleSearchTerm] = useState('');
  const [roleTypeFilter, setRoleTypeFilter] = useState('all');
  const [roleStatusFilter, setRoleStatusFilter] = useState('all');
  const [databaseStatusFilter, setDatabaseStatusFilter] = useState('Active');
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  const sidebarItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'users', label: 'Manage Users', icon: Users },
    { id: 'roles', label: 'Manage Roles', icon: Shield },
    { id: 'communications', label: 'Communications', icon: Mail },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'audit-log', label: 'Audit Log', icon: Activity },
    { id: 'database', label: 'Manage Database', icon: Database },
  ];

  // Mock user data
  const users = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@pomera.com',
      userType: 'Internal',
      role: 'Admin',
      status: 'Active',
      lastLogin: '2024-01-15 10:30',
      createdAt: '2023-06-15',
      avatar: null
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@pomera.com',
      userType: 'Internal',
      role: 'Manager',
      status: 'Active',
      lastLogin: '2024-01-14 16:45',
      createdAt: '2023-08-22',
      avatar: null
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike.chen@pomera.com',
      userType: 'Client',
      role: 'User',
      status: 'Inactive',
      lastLogin: '2024-01-10 09:15',
      createdAt: '2023-11-03',
      avatar: null
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@pomera.com',
      userType: 'Client',
      role: 'Manager',
      status: 'Pending',
      lastLogin: null,
      createdAt: '2024-01-12',
      avatar: null
    },
    {
      id: 5,
      name: 'David Wilson',
      email: 'david.wilson@pomera.com',
      userType: 'Applicant',
      role: 'User',
      status: 'Active',
      lastLogin: '2024-01-15 14:20',
      createdAt: '2023-09-18',
      avatar: null
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-50';
      case 'Inactive': return 'text-red-600 bg-red-50';
      case 'Pending': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Mock audit log data
  const auditLogs = [
    {
      id: 1,
      datetime: '2024-01-15 14:32:15',
      user: 'John Smith',
      action: 'User Login',
      details: 'Successful login from IP 192.168.1.100',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: 2,
      datetime: '2024-01-15 14:28:42',
      user: 'Sarah Johnson',
      action: 'Company Created',
      details: 'Created new company: Acme Corporation',
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    },
    {
      id: 3,
      datetime: '2024-01-15 14:25:18',
      user: 'Mike Chen',
      action: 'Contact Updated',
      details: 'Updated contact: Jane Doe (jane.doe@acme.com)',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: 4,
      datetime: '2024-01-15 14:20:33',
      user: 'Emily Davis',
      action: 'User Permission Changed',
      details: 'Changed permissions for user: David Wilson (Manager → User)',
      ipAddress: '192.168.1.108',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    },
    {
      id: 5,
      datetime: '2024-01-15 14:15:07',
      user: 'System',
      action: 'Database Backup',
      details: 'Automated daily backup completed successfully',
      ipAddress: '127.0.0.1',
      userAgent: 'System Process'
    },
    {
      id: 6,
      datetime: '2024-01-15 14:10:22',
      user: 'John Smith',
      action: 'User Logout',
      details: 'User logged out from session',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: 7,
      datetime: '2024-01-15 14:05:45',
      user: 'Sarah Johnson',
      action: 'Report Generated',
      details: 'Generated monthly sales report for December 2023',
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    },
    {
      id: 8,
      datetime: '2024-01-15 14:00:12',
      user: 'Mike Chen',
      action: 'Failed Login Attempt',
      details: 'Failed login attempt for user: admin (invalid password)',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: 9,
      datetime: '2024-01-15 13:55:38',
      user: 'Emily Davis',
      action: 'Settings Updated',
      details: 'Updated system notification preferences',
      ipAddress: '192.168.1.108',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    },
    {
      id: 10,
      datetime: '2024-01-15 13:50:21',
      user: 'David Wilson',
      action: 'User Created',
      details: 'Created new user account: test.user@pomera.com',
      ipAddress: '192.168.1.110',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  ];

  const renderAuditLog = () => (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search audit logs..."
              value={auditSearchTerm}
              onChange={(e) => setAuditSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={auditUserFilter}
              onChange={(e) => setAuditUserFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Pomera Admin">Pomera Admin</option>
              <option value="Pomera CRM">Pomera CRM</option>
              <option value="Pomera ATS">Pomera ATS</option>
              <option value="Client Admin">Client Admin</option>
              <option value="Client Viewer">Client Viewer</option>
              <option value="Applicant">Applicant</option>
            </select>
            <select
              value={auditActionFilter}
              onChange={(e) => setAuditActionFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Actions</option>
              <option value="User Login">User Login</option>
              <option value="User Logout">User Logout</option>
              <option value="User Created">User Created</option>
              <option value="User Permission Changed">User Permission Changed</option>
              <option value="Company Created">Company Created</option>
              <option value="Contact Updated">Contact Updated</option>
              <option value="Report Generated">Report Generated</option>
              <option value="Settings Updated">Settings Updated</option>
              <option value="Database Backup">Database Backup</option>
              <option value="Failed Login Attempt">Failed Login Attempt</option>
            </select>
            <select
              value={auditDateFilter}
              onChange={(e) => setAuditDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <FileText className="h-4 w-4" />
          <span>Export Logs</span>
        </button>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ backgroundColor: 'hsl(var(--secondary) / 0.25)' }}>
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ backgroundColor: 'hsl(var(--secondary) / 0.25)' }}>
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ backgroundColor: 'hsl(var(--secondary) / 0.25)' }}>
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ backgroundColor: 'hsl(var(--secondary) / 0.25)' }}>
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ backgroundColor: 'hsl(var(--secondary) / 0.25)' }}>
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.datetime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.action}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                    <div className="truncate" title={log.details}>
                      {log.details}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of <span className="font-medium">10</span> results
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
            Previous
          </button>
          <button className="px-3 py-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-lg hover:bg-primary/90">
            1
          </button>
          <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
            Next
          </button>
        </div>
      </div>
    </div>
  );

  // Mock roles data
  const roles = [
    {
      id: 1,
      name: 'Super Admin',
      description: 'Full system access with all permissions',
      userType: 'Super Admin',
      status: 'Active',
      userCount: 2,
      permissions: ['All Permissions'],
      createdAt: '2023-01-15'
    },
    {
      id: 2,
      name: 'Pomera Admin',
      description: 'Administrative access to Pomera systems',
      userType: 'Pomera Admin',
      status: 'Active',
      userCount: 5,
      permissions: ['User Management', 'System Settings', 'Reports'],
      createdAt: '2023-02-01'
    },
    {
      id: 3,
      name: 'Pomera CRM',
      description: 'Full access to CRM module and client data',
      userType: 'Pomera CRM',
      status: 'Active',
      userCount: 8,
      permissions: ['CRM Access', 'Client Management', 'Contact Management'],
      createdAt: '2023-02-15'
    },
    {
      id: 4,
      name: 'Pomera ATS',
      description: 'Access to Applicant Tracking System',
      userType: 'Pomera ATS',
      status: 'Active',
      userCount: 6,
      permissions: ['ATS Access', 'Job Management', 'Candidate Management'],
      createdAt: '2023-03-01'
    },
    {
      id: 5,
      name: 'Client Admin',
      description: 'Administrative access for client organizations',
      userType: 'Client Admin',
      status: 'Active',
      userCount: 12,
      permissions: ['Client Portal', 'User Management', 'Reports'],
      createdAt: '2023-03-15'
    },
    {
      id: 6,
      name: 'Client Viewer',
      description: 'Read-only access for client users',
      userType: 'Client Viewer',
      status: 'Active',
      userCount: 25,
      permissions: ['View Only', 'Basic Reports'],
      createdAt: '2023-04-01'
    },
    {
      id: 7,
      name: 'Applicant',
      description: 'Limited access for job applicants',
      userType: 'Applicant',
      status: 'Active',
      userCount: 150,
      permissions: ['Apply Jobs', 'View Applications'],
      createdAt: '2023-04-15'
    }
  ];

  const getRoleTypeColor = (userType: string) => {
    switch (userType) {
      case 'Super Admin': return 'text-red-600 bg-red-50';
      case 'Pomera Admin': return 'text-purple-600 bg-purple-50';
      case 'Pomera CRM': return 'text-blue-600 bg-blue-50';
      case 'Pomera ATS': return 'text-green-600 bg-green-50';
      case 'Client Admin': return 'text-orange-600 bg-orange-50';
      case 'Client Viewer': return 'text-gray-600 bg-gray-50';
      case 'Applicant': return 'text-indigo-600 bg-indigo-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const renderManageRoles = () => (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search roles..."
              value={roleSearchTerm}
              onChange={(e) => setRoleSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={roleTypeFilter}
              onChange={(e) => setRoleTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All User Types</option>
              <option value="Internal">Internal</option>
              <option value="Client">Client</option>
              <option value="Applicant">Applicant</option>
            </select>
            <select
              value={roleStatusFilter}
              onChange={(e) => setRoleStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          <span>Create Role</span>
        </button>
      </div>

      {/* Roles Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ backgroundColor: 'hsl(var(--secondary) / 0.25)' }}>
                  Role
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ backgroundColor: 'hsl(var(--secondary) / 0.25)' }}>
                  Status
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ backgroundColor: 'hsl(var(--secondary) / 0.25)' }}>
                  Users
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ backgroundColor: 'hsl(var(--secondary) / 0.25)' }}>
                  Permissions
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ backgroundColor: 'hsl(var(--secondary) / 0.25)' }}>
                  Created
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ backgroundColor: 'hsl(var(--secondary) / 0.25)' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {roles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{role.name}</div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">{role.description}</div>
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(role.status)}`}>
                      {role.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                    {role.userCount} users
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 max-w-xs">
                    <div className="truncate" title={role.permissions.join(', ')}>
                      {role.permissions.length > 1 
                        ? `${role.permissions[0]} +${role.permissions.length - 1} more`
                        : role.permissions[0]
                      }
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {role.createdAt}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 p-1">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 p-1">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">1</span> to <span className="font-medium">7</span> of <span className="font-medium">7</span> results
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
            Previous
          </button>
          <button className="px-3 py-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-lg hover:bg-primary/90">
            1
          </button>
          <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
            Next
          </button>
        </div>
      </div>
    </div>
  );

  // Mock communications data
  const communications = [
    {
      id: 1,
      name: 'Primary SMTP',
      type: 'SMTP',
      host: 'smtp.gmail.com',
      port: 587,
      username: 'noreply@pomera.com',
      status: 'Active',
      lastTested: '2024-01-15 10:30'
    },
    {
      id: 2,
      name: 'WhatsApp Business',
      type: 'WhatsApp',
      phone: '+1-555-0123',
      status: 'Active',
      lastTested: '2024-01-15 09:15'
    },
    {
      id: 3,
      name: 'SMS Gateway',
      type: 'SMS',
      provider: 'Twilio',
      phone: '+1-555-0456',
      status: 'Inactive',
      lastTested: '2024-01-10 14:20'
    }
  ];

  // Mock reports data
  const reports = [
    {
      id: 1,
      title: 'User Activity Report',
      description: 'Monthly user login and activity statistics',
      type: 'Bar Chart',
      data: [
        { name: 'Week 1', value: 45 },
        { name: 'Week 2', value: 52 },
        { name: 'Week 3', value: 38 },
        { name: 'Week 4', value: 61 }
      ],
      lastGenerated: '2024-01-15 14:30'
    },
    {
      id: 2,
      title: 'System Performance',
      description: 'Database performance and response times',
      type: 'Line Chart',
      data: [
        { name: 'Mon', value: 120 },
        { name: 'Tue', value: 95 },
        { name: 'Wed', value: 110 },
        { name: 'Thu', value: 88 },
        { name: 'Fri', value: 105 }
      ],
      lastGenerated: '2024-01-15 12:15'
    },
    {
      id: 3,
      title: 'Feature Usage',
      description: 'Most used features and modules',
      type: 'Pie Chart',
      data: [
        { name: 'CRM', value: 45 },
        { name: 'Admin', value: 25 },
        { name: 'Reports', value: 20 },
        { name: 'Settings', value: 10 }
      ],
      lastGenerated: '2024-01-15 11:45'
    }
  ];

  // Mock dimension tables data
  const dimensionTables = [
    { id: 'contact_type', name: 'Contact Type', friendlyName: 'Contact Type' },
    { id: 'lead_score', name: 'Lead Score', friendlyName: 'Lead Score' },
    { id: 'company_status', name: 'Company Status', friendlyName: 'Company Status' },
    { id: 'communication_type', name: 'Communication Type', friendlyName: 'Communication Type' },
    { id: 'user_role', name: 'User Role', friendlyName: 'User Role' }
  ];

  const dimensionTableData = {
    contact_type: [
      { id: 1, name: 'Primary Contact', description: 'Main point of contact', is_active: true, sort_order: 1 },
      { id: 2, name: 'Decision Maker', description: 'Key decision maker', is_active: true, sort_order: 2 },
      { id: 3, name: 'Technical Contact', description: 'Technical liaison', is_active: true, sort_order: 3 },
      { id: 4, name: 'Billing Contact', description: 'Billing and payments', is_active: false, sort_order: 4 }
    ],
    lead_score: [
      { id: 1, name: 'Hot', description: 'High priority lead', score: 90, color: '#ef4444', is_active: true, sort_order: 1 },
      { id: 2, name: 'Warm', description: 'Medium priority lead', score: 60, color: '#f59e0b', is_active: true, sort_order: 2 },
      { id: 3, name: 'Cold', description: 'Low priority lead', score: 30, color: '#3b82f6', is_active: true, sort_order: 3 }
    ],
    company_status: [
      { id: 1, name: 'Prospect', description: 'Potential client', is_active: true, sort_order: 1 },
      { id: 2, name: 'Active', description: 'Current client', is_active: true, sort_order: 2 },
      { id: 3, name: 'Inactive', description: 'Former client', is_active: true, sort_order: 3 }
    ]
  };

  // Filter data based on status filter
  const getFilteredData = () => {
    const data = dimensionTableData[selectedDimensionTable as keyof typeof dimensionTableData] || [];
    if (databaseStatusFilter === 'Select All') {
      return data;
    }
    return data.filter(item => {
      const itemStatus = item.is_active ? 'Active' : 'Inactive';
      return databaseStatusFilter === itemStatus;
    });
  };

  // Handle drag and drop
  const handleDragStart = (e: React.DragEvent, itemId: number) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetItemId: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === targetItemId) return;

    const data = dimensionTableData[selectedDimensionTable as keyof typeof dimensionTableData] || [];
    const draggedIndex = data.findIndex(item => item.id === draggedItem);
    const targetIndex = data.findIndex(item => item.id === targetItemId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Create new array with reordered items
    const newData = [...data];
    const [draggedItemData] = newData.splice(draggedIndex, 1);
    newData.splice(targetIndex, 0, draggedItemData);

    // Update sort_order values
    newData.forEach((item, index) => {
      item.sort_order = index + 1;
    });

    // Update the data (in a real app, this would be an API call)
    console.log('Reordered data:', newData);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const renderCommunications = () => (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-900">Communication Channels</h2>
            <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              <span>Add Channel</span>
            </button>
      </div>

      {/* Communications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communications.map((comm) => (
          <div key={comm.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{comm.name}</h3>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                comm.status === 'Active' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
              }`}>
                {comm.status}
              </span>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Type</label>
                <p className="text-sm text-gray-900">{comm.type}</p>
              </div>
              
              {comm.host && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Host</label>
                  <p className="text-sm text-gray-900">{comm.host}:{comm.port}</p>
                </div>
              )}
              
              {comm.username && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Username</label>
                  <p className="text-sm text-gray-900">{comm.username}</p>
                </div>
              )}
              
              {comm.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-sm text-gray-900">{comm.phone}</p>
                </div>
              )}
              
              {comm.provider && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Provider</label>
                  <p className="text-sm text-gray-900">{comm.provider}</p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-gray-500">Last Tested</label>
                <p className="text-sm text-gray-900">{comm.lastTested}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-200">
              <button className="flex items-center space-x-1 px-3 py-1 text-sm text-primary hover:text-primary/80">
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-1 text-sm text-secondary hover:text-secondary/80">
                <RefreshCw className="h-4 w-4" />
                <span>Test</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Channel Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Communication Channel</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Channel Name</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., Secondary SMTP" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>SMTP</option>
              <option>WhatsApp</option>
              <option>SMS</option>
              <option>Slack</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Host/Provider</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="smtp.gmail.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
            <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="587" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="username@domain.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="••••••••" />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
            <Save className="h-4 w-4" />
            <span>Save Channel</span>
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-900">System Reports</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          <span>Create Report</span>
        </button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reports.map((report) => (
          <div key={report.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
              <div className="flex items-center space-x-2">
                {report.type === 'Bar Chart' && <BarChart3 className="h-5 w-5 text-blue-600" />}
                {report.type === 'Line Chart' && <TrendingUp className="h-5 w-5 text-green-600" />}
                {report.type === 'Pie Chart' && <PieChart className="h-5 w-5 text-purple-600" />}
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">{report.description}</p>
            
            {/* Mock Chart */}
            <div className="h-32 bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-end justify-between h-full space-x-2">
                {report.data.map((item, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div 
                      className="rounded-t w-full mb-1"
                      style={{ 
                        height: `${(item.value / Math.max(...report.data.map(d => d.value))) * 80}px`,
                        backgroundColor: 'hsl(var(--secondary) / 0.5)'
                      }}
                    ></div>
                    <div className="text-xs text-gray-600">{item.name}</div>
                    <div className="text-xs font-medium text-gray-800">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>Last generated: {report.lastGenerated}</span>
              <span className="text-green-600">Ready</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800">
                <Eye className="h-4 w-4" />
                <span>View</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-1 text-sm text-green-600 hover:text-green-800">
                <FileText className="h-4 w-4" />
                <span>Export</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800">
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderManageDatabase = () => (
    <div className="space-y-4">
      {/* Table Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <select
            value={selectedDimensionTable}
            onChange={(e) => setSelectedDimensionTable(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {dimensionTables.map((table) => (
              <option key={table.id} value={table.id}>
                {table.friendlyName}
              </option>
            ))}
          </select>
          <select
            value={databaseStatusFilter}
            onChange={(e) => setDatabaseStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent min-w-[150px]"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Select All">Select All</option>
          </select>
        </div>
      </div>

      {/* Table Data */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {dimensionTables.find(t => t.id === selectedDimensionTable)?.friendlyName} Values
          </h3>
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            <span>Add New Value</span>
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16" style={{ backgroundColor: 'hsl(var(--secondary) / 0.25)' }}>
                  ID
                </th>
                <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32" style={{ backgroundColor: 'hsl(var(--secondary) / 0.25)' }}>
                  Name
                </th>
                <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48" style={{ backgroundColor: 'hsl(var(--secondary) / 0.25)' }}>
                  Description
                </th>
                {selectedDimensionTable === 'lead_score' && (
                  <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20" style={{ backgroundColor: 'hsl(var(--secondary) / 0.25)' }}>
                    Score
                  </th>
                )}
                {selectedDimensionTable === 'lead_score' && (
                  <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24" style={{ backgroundColor: 'hsl(var(--secondary) / 0.25)' }}>
                    Color
                  </th>
                )}
                <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20" style={{ backgroundColor: 'hsl(var(--secondary) / 0.25)' }}>
                  Active
                </th>
                <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16" style={{ backgroundColor: 'hsl(var(--secondary) / 0.25)' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {getFilteredData().map((item, index) => (
                <tr 
                  key={item.id} 
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 cursor-move ${draggedItem === item.id ? 'opacity-50' : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, item.id)}
                  onDragEnd={handleDragEnd}
                >
                  <td className="border border-gray-300 px-3 py-2 text-center text-sm font-mono text-gray-600">
                    {item.id}
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <div className="cursor-move text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"></path>
                        </svg>
                      </div>
                      <input
                        type="text"
                        defaultValue={item.name}
                        className="w-full px-2 py-1 border-0 bg-transparent text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                    </div>
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input
                      type="text"
                      defaultValue={item.description}
                      className="w-full px-2 py-1 border-0 bg-transparent text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </td>
                  {selectedDimensionTable === 'lead_score' && (
                    <td className="border border-gray-300 px-3 py-2">
                      <input
                        type="number"
                        defaultValue={item.score}
                        className="w-full px-2 py-1 border-0 bg-transparent text-sm focus:ring-2 focus:ring-primary focus:outline-none text-center"
                      />
                    </td>
                  )}
                  {selectedDimensionTable === 'lead_score' && (
                    <td className="border border-gray-300 px-3 py-2">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded border border-gray-300"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <input
                          type="text"
                          defaultValue={item.color}
                          className="w-full px-2 py-1 border-0 bg-transparent text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                      </div>
                    </td>
                  )}
                  <td className="border border-gray-300 px-3 py-2">
                    <select
                      defaultValue={item.is_active ? 'true' : 'false'}
                      className="w-full px-2 py-1 border-0 bg-transparent text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    <button className="text-primary hover:text-primary/80 p-1" title="Save">
                      <Save className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderManageUsers = () => (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={userTypeFilter}
              onChange={(e) => setUserTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="internal">Internal</option>
              <option value="external">External</option>
              <option value="client">Client</option>
            </select>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          <span>Invite User</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ backgroundColor: 'hsl(var(--secondary) / 0.25)' }}>
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ backgroundColor: 'hsl(var(--secondary) / 0.25)' }}>
                  User Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ backgroundColor: 'hsl(var(--secondary) / 0.25)' }}>
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ backgroundColor: 'hsl(var(--secondary) / 0.25)' }}>
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ backgroundColor: 'hsl(var(--secondary) / 0.25)' }}>
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ backgroundColor: 'hsl(var(--secondary) / 0.25)' }}>
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ backgroundColor: 'hsl(var(--secondary) / 0.25)' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.userType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin || 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 p-1">
                        <MailIcon className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 p-1">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">5</span> results
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
            Previous
          </button>
          <button className="px-3 py-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-lg hover:bg-primary/90">
            1
          </button>
          <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
            Next
          </button>
        </div>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => setActiveSection('users')}
              className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="h-8 w-8 text-blue-600 mb-2" />
              <h4 className="font-medium text-gray-900">Invite New User</h4>
              <p className="text-sm text-gray-500">Send invitation to new user</p>
            </button>
            <button 
              onClick={() => setActiveSection('users')}
              className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <UserCheck className="h-8 w-8 text-green-600 mb-2" />
              <h4 className="font-medium text-gray-900">Manage Users</h4>
              <p className="text-sm text-gray-500">View and manage existing users</p>
            </button>
            <button 
              onClick={() => setActiveSection('reports')}
              className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="h-8 w-8 text-purple-600 mb-2" />
              <h4 className="font-medium text-gray-900">View Reports</h4>
              <p className="text-sm text-gray-500">Access system reports and analytics</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return renderHome();
      case 'users':
        return renderManageUsers();
      case 'roles':
        return renderManageRoles();
      case 'communications':
        return renderCommunications();
      case 'reports':
        return renderReports();
      case 'audit-log':
        return renderAuditLog();
      case 'database':
        return renderManageDatabase();
      default:
        return (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Settings className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {sidebarItems.find(item => item.id === activeSection)?.label}
            </h3>
            <p className="text-gray-500">This section is under development</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Demo Watermark */}
      <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
        <div className="text-red-500 text-8xl font-bold opacity-10 transform -rotate-12 select-none">
          DEMO ONLY
        </div>
      </div>
      
      <CRMHeader />
      <div className="flex">
        {/* Sidebar */}
        <div className="w-56 bg-white shadow-sm border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Admin Portal</h2>
            <nav className="space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                  <ChevronRight className="h-3 w-3 ml-auto" />
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                {activeSection === 'home' ? 'Admin Portal' : sidebarItems.find(item => item.id === activeSection)?.label}
              </h1>
            </div>
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
}
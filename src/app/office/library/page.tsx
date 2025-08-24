"use client";

import { useState } from "react";
import {
  Search,
  Upload,
  FileText,
  Video,
  Link,
  Calendar,
  Download,
  Trash2,
  RefreshCw,
  Plus,
  Filter,
  MoreHorizontal
} from "lucide-react";

type DocumentType = 'pdf' | 'doc' | 'video' | 'link' | 'gdrive' | 'gdocs';
type RefreshInterval = 'manual' | 'hourly' | 'daily' | 'weekly' | 'monthly';

type Document = {
  id: string;
  title: string;
  type: DocumentType;
  size: string;
  tokens: number;
  lastFetched: string;
  refreshInterval: RefreshInterval;
  url?: string;
  status: 'active' | 'processing' | 'error';
};

const documents: Document[] = [
  {
    id: "1",
    title: "Company Handbook 2024",
    type: "pdf",
    size: "2.4 MB",
    tokens: 15420,
    lastFetched: "2024-01-15 14:30",
    refreshInterval: "manual",
    status: "active"
  },
  {
    id: "2",
    title: "Product Requirements Document",
    type: "gdocs",
    size: "1.8 MB",
    tokens: 12350,
    lastFetched: "2024-01-15 12:15",
    refreshInterval: "daily",
    url: "https://docs.google.com/document/d/abc123",
    status: "active"
  },
  {
    id: "3",
    title: "AI Training Best Practices",
    type: "video",
    size: "45 min",
    tokens: 8920,
    lastFetched: "2024-01-14 16:45",
    refreshInterval: "weekly",
    url: "https://youtube.com/watch?v=xyz789",
    status: "active"
  },
  {
    id: "4",
    title: "Technical Architecture Guide",
    type: "link",
    size: "3.2 MB",
    tokens: 18750,
    lastFetched: "2024-01-14 09:20",
    refreshInterval: "weekly",
    url: "https://wiki.company.com/tech-guide",
    status: "processing"
  },
  {
    id: "5",
    title: "Marketing Strategy Q1 2024",
    type: "gdrive",
    size: "5.1 MB",
    tokens: 22100,
    lastFetched: "2024-01-13 11:30",
    refreshInterval: "monthly",
    status: "error"
  }
];

function getDocumentIcon(type: DocumentType) {
  switch (type) {
    case 'pdf':
    case 'doc':
      return FileText;
    case 'video':
      return Video;
    case 'link':
    case 'gdrive':
    case 'gdocs':
      return Link;
    default:
      return FileText;
  }
}

function getDocumentColor(type: DocumentType) {
  switch (type) {
    case 'pdf':
      return 'text-red-400 bg-red-400/10';
    case 'doc':
      return 'text-blue-400 bg-blue-400/10';
    case 'video':
      return 'text-purple-400 bg-purple-400/10';
    case 'link':
      return 'text-green-400 bg-green-400/10';
    case 'gdrive':
      return 'text-yellow-400 bg-yellow-400/10';
    case 'gdocs':
      return 'text-cyan-400 bg-cyan-400/10';
    default:
      return 'text-slate-400 bg-slate-400/10';
  }
}

function getStatusColor(status: Document['status']) {
  switch (status) {
    case 'active':
      return 'text-green-400 bg-green-400/10';
    case 'processing':
      return 'text-yellow-400 bg-yellow-400/10';
    case 'error':
      return 'text-red-400 bg-red-400/10';
    default:
      return 'text-slate-400 bg-slate-400/10';
  }
}

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<'all' | DocumentType>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | Document['status']>('all');

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalTokens = documents.reduce((sum, doc) => sum + doc.tokens, 0);
  const activeDocuments = documents.filter(doc => doc.status === 'active').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-['Press_Start_2P'] text-2xl text-white mb-2">
            Knowledge Library
          </h1>
          <p className="text-slate-300">
            Upload, manage, and search your knowledge documents and sources.
          </p>
        </div>
        
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button className="flex items-center space-x-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors">
            <Plus className="h-4 w-4" />
            <span>Add Document</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20">
            <Upload className="h-4 w-4" />
            <span>Upload</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Total Documents</p>
              <p className="text-2xl font-bold text-white mt-1">{documents.length}</p>
            </div>
            <FileText className="h-6 w-6 text-cyan-400" />
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Active</p>
              <p className="text-2xl font-bold text-white mt-1">{activeDocuments}</p>
            </div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Total Tokens</p>
              <p className="text-2xl font-bold text-white mt-1">{totalTokens.toLocaleString()}</p>
            </div>
            <div className="w-6 h-6 bg-purple-400/20 rounded flex items-center justify-center">
              <span className="text-purple-400 text-xs font-bold">T</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Auto-Refresh</p>
              <p className="text-2xl font-bold text-white mt-1">
                {documents.filter(d => d.refreshInterval !== 'manual').length}
              </p>
            </div>
            <RefreshCw className="h-6 w-6 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            />
          </div>
          
          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as typeof selectedType)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="all">All Types</option>
            <option value="pdf">PDF</option>
            <option value="doc">Document</option>
            <option value="video">Video</option>
            <option value="link">Link</option>
            <option value="gdrive">Google Drive</option>
            <option value="gdocs">Google Docs</option>
          </select>
          
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as typeof selectedStatus)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="processing">Processing</option>
            <option value="error">Error</option>
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Documents ({filteredDocuments.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-slate-300 font-medium">Document</th>
                <th className="text-left p-4 text-slate-300 font-medium">Type</th>
                <th className="text-left p-4 text-slate-300 font-medium">Size</th>
                <th className="text-left p-4 text-slate-300 font-medium">Tokens</th>
                <th className="text-left p-4 text-slate-300 font-medium">Last Updated</th>
                <th className="text-left p-4 text-slate-300 font-medium">Refresh</th>
                <th className="text-left p-4 text-slate-300 font-medium">Status</th>
                <th className="text-left p-4 text-slate-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center">
                    <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-400">No documents found matching your criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((doc) => {
                  const Icon = getDocumentIcon(doc.type);
                  const typeColor = getDocumentColor(doc.type);
                  const statusColor = getStatusColor(doc.status);
                  
                  return (
                    <tr key={doc.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${typeColor}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{doc.title}</p>
                            {doc.url && (
                              <p className="text-slate-400 text-sm truncate max-w-xs">{doc.url}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-white/10 text-slate-300 text-xs rounded-full capitalize">
                          {doc.type}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300">{doc.size}</td>
                      <td className="p-4 text-slate-300">{doc.tokens.toLocaleString()}</td>
                      <td className="p-4 text-slate-300 text-sm">{doc.lastFetched}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-white/10 text-slate-300 text-xs rounded-full capitalize">
                          {doc.refreshInterval}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs rounded-full capitalize ${statusColor}`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-slate-400 hover:text-cyan-400 transition-colors">
                            <RefreshCw className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-slate-400 hover:text-green-400 transition-colors">
                            <Download className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-slate-400 hover:text-red-400 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-slate-400 hover:text-white transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
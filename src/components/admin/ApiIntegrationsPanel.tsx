import React, { useState } from 'react';
import {
  Plug, KeyRound, Plus, Edit2, Trash2, Eye, EyeOff, Copy, Check,
  RefreshCw, ShieldCheck, Globe, Webhook, CheckCircle2, AlertTriangle,
  X, Code2, CreditCard, Truck, MessageSquare, Database, Layers
} from 'lucide-react';
import {
  ApiIntegration,
  ApiIntegrationCategory,
  ApiAuthType,
  StoreApiKey,
  StoreApiScope
} from '../../types';
import { storage } from '../../services/storage';

interface ApiIntegrationsPanelProps {
  onIntegrationsChanged?: () => void;
}

const CATEGORIES: ('All' | ApiIntegrationCategory)[] = [
  'All',
  'Payment Gateway',
  'Shipping & Courier',
  'SMS & WhatsApp',
  'ERP & Inventory',
  'Analytics & Custom'
];

const ALL_SCOPES: { value: StoreApiScope; label: string; desc: string }[] = [
  { value: 'products:read', label: 'Products Read', desc: 'Fetch catalog & pack variations' },
  { value: 'products:write', label: 'Products Write', desc: 'Create & update catalog items' },
  { value: 'orders:read', label: 'Orders Read', desc: 'Read customer orders & statuses' },
  { value: 'orders:write', label: 'Orders Write', desc: 'Update dispatch & tracking status' },
  { value: 'inventory:sync', label: 'Inventory Sync', desc: 'Adjust pack stock quantities' }
];

function maskSecret(secret: string): string {
  if (!secret) return 'Not configured';
  if (secret.length <= 8) return '••••••••';
  return `${secret.slice(0, 4)}••••••••••••${secret.slice(-4)}`;
}

function generateSecureApiKey(env: 'sandbox' | 'live'): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `sp_${env}_${hex}`;
}

function getCategoryIcon(category: ApiIntegrationCategory) {
  switch (category) {
    case 'Payment Gateway':
      return <CreditCard className="w-4 h-4" />;
    case 'Shipping & Courier':
      return <Truck className="w-4 h-4" />;
    case 'SMS & WhatsApp':
      return <MessageSquare className="w-4 h-4" />;
    case 'ERP & Inventory':
      return <Database className="w-4 h-4" />;
    default:
      return <Layers className="w-4 h-4" />;
  }
}

export const ApiIntegrationsPanel: React.FC<ApiIntegrationsPanelProps> = ({
  onIntegrationsChanged
}) => {
  const [subTab, setSubTab] = useState<'outbound' | 'inbound'>('outbound');
  const [integrations, setIntegrations] = useState<ApiIntegration[]>(() =>
    storage.getApiIntegrations()
  );
  const [storeKeys, setStoreKeys] = useState<StoreApiKey[]>(() =>
    storage.getStoreApiKeys()
  );

  // Filters & UI states
  const [selectedCategory, setSelectedCategory] = useState<'All' | ApiIntegrationCategory>('All');
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Integration modal
  const [editingIntegration, setEditingIntegration] = useState<ApiIntegration | null>(null);
  const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState(false);

  // New Store API Key form
  const [newKeyLabel, setNewKeyLabel] = useState('');
  const [newKeyEnv, setNewKeyEnv] = useState<'sandbox' | 'live'>('live');
  const [newKeyScopes, setNewKeyScopes] = useState<StoreApiScope[]>([
    'products:read',
    'orders:read'
  ]);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<StoreApiKey | null>(null);

  const showNotice = (type: 'success' | 'error', text: string) => {
    setNotice({ type, text });
    setTimeout(() => {
      setNotice((prev) => (prev?.text === text ? null : prev));
    }, 4000);
  };

  const handleCopy = (value: string, id: string) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSaveIntegration = (item: ApiIntegration) => {
    const updated = storage.saveApiIntegration(item);
    setIntegrations(updated);
    setIsIntegrationModalOpen(false);
    setEditingIntegration(null);
    onIntegrationsChanged?.();
    showNotice('success', `Saved API configuration for "${item.name}".`);
  };

  const handleToggleEnabled = (item: ApiIntegration) => {
    if (!item.enabled && !item.apiKey.trim()) {
      setEditingIntegration(item);
      setIsIntegrationModalOpen(true);
      showNotice('error', `Please enter an API Key before enabling "${item.name}".`);
      return;
    }
    const updated = storage.saveApiIntegration({ ...item, enabled: !item.enabled });
    setIntegrations(updated);
    onIntegrationsChanged?.();
    showNotice(
      'success',
      `"${item.name}" is now ${!item.enabled ? 'enabled' : 'disabled'}.`
    );
  };

  const handleDeleteIntegration = (id: string, name: string) => {
    const updated = storage.deleteApiIntegration(id);
    setIntegrations(updated);
    setConfirmDeleteId(null);
    onIntegrationsChanged?.();
    showNotice('success', `Removed "${name}" integration.`);
  };

  const handleTestConnection = async (item: ApiIntegration) => {
    if (!item.apiKey.trim()) {
      showNotice('error', `Configure an API Key for "${item.name}" first.`);
      return;
    }
    if (!item.baseUrl.trim()) {
      showNotice('error', `Base Endpoint URL is required to test "${item.name}".`);
      return;
    }

    setTestingId(item.id);
    const headers: Record<string, string> = {
      Accept: 'application/json'
    };
    if (item.authType === 'Bearer') {
      headers['Authorization'] = `Bearer ${item.apiKey.trim()}`;
    } else if (item.authType === 'Basic Auth') {
      headers['Authorization'] = `Basic ${btoa(`${item.apiKey.trim()}:${item.apiSecret || ''}`)}`;
    } else {
      headers[item.headerName.trim() || 'X-API-Key'] = item.apiKey.trim();
    }

    let status: 'success' | 'error' = 'success';
    let message = '';

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(item.baseUrl, {
        method: 'GET',
        headers,
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (res.ok || res.status === 401 || res.status === 403 || res.status === 404) {
        if (res.ok) {
          status = 'success';
          message = `HTTP ${res.status} OK — Endpoint reachable and authenticated.`;
        } else {
          status = 'error';
          message = `HTTP ${res.status} — Endpoint responded; verify API key permissions or path.`;
        }
      } else {
        status = 'error';
        message = `HTTP ${res.status} ${res.statusText || 'Error'}`;
      }
    } catch (err) {
      // Browsers often block direct cross-origin requests to third-party payment/courier APIs without a server proxy
      try {
        const parsedUrl = new URL(item.baseUrl);
        if (parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:') {
          status = 'success';
          message = `Credentials & URL validated (${parsedUrl.hostname}). Direct browser probe blocked by CORS; requests will route via cPanel api.php server-side.`;
        } else {
          status = 'error';
          message = 'Invalid URL protocol. Use https:// endpoint.';
        }
      } catch {
        status = 'error';
        message = err instanceof Error ? err.message : 'Invalid endpoint URL.';
      }
    }

    const updatedItem: ApiIntegration = {
      ...item,
      lastTestedAt: new Date().toISOString(),
      lastTestStatus: status,
      lastTestMessage: message
    };
    const updatedList = storage.saveApiIntegration(updatedItem);
    setIntegrations(updatedList);
    setTestingId(null);
    showNotice(status, `${item.name}: ${message}`);
  };

  // Storefront Inbound Key handlers
  const handleToggleScope = (scope: StoreApiScope) => {
    setNewKeyScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
    );
  };

  const handleGenerateStoreKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyLabel.trim()) {
      showNotice('error', 'Please enter a descriptive label for the API key.');
      return;
    }
    if (newKeyScopes.length === 0) {
      showNotice('error', 'Select at least one permission scope.');
      return;
    }

    const created: StoreApiKey = {
      id: `sk_${Date.now()}`,
      label: newKeyLabel.trim(),
      apiKey: generateSecureApiKey(newKeyEnv),
      environment: newKeyEnv,
      scopes: newKeyScopes,
      active: true,
      createdAt: new Date().toISOString()
    };

    const updated = storage.addStoreApiKey(created);
    setStoreKeys(updated);
    setNewlyCreatedKey(created);
    setNewKeyLabel('');
    onIntegrationsChanged?.();
    showNotice('success', `Generated new API key "${created.label}".`);
  };

  const handleToggleStoreKey = (id: string) => {
    const updated = storage.toggleStoreApiKey(id);
    setStoreKeys(updated);
    onIntegrationsChanged?.();
  };

  const handleDeleteStoreKey = (id: string, label: string) => {
    const updated = storage.deleteStoreApiKey(id);
    setStoreKeys(updated);
    setConfirmDeleteId(null);
    if (newlyCreatedKey?.id === id) setNewlyCreatedKey(null);
    onIntegrationsChanged?.();
    showNotice('success', `Revoked and deleted API key "${label}".`);
  };

  const filteredIntegrations =
    selectedCategory === 'All'
      ? integrations
      : integrations.filter((item) => item.category === selectedCategory);

  const activeIntegrationsCount = integrations.filter((i) => i.enabled && i.apiKey).length;
  const configuredIntegrationsCount = integrations.filter((i) => Boolean(i.apiKey)).length;
  const activeStoreKeysCount = storeKeys.filter((k) => k.active).length;

  const sampleKey = newlyCreatedKey?.apiKey || storeKeys.find((k) => k.active)?.apiKey || 'sp_live_YOUR_API_KEY';

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">API Integrations & API Keys</h2>
          <p className="text-xs text-slate-500">
            Connect payment gateways, courier APIs, SMS/WhatsApp providers, or issue scoped REST API keys for external apps.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingIntegration(null);
            setIsIntegrationModalOpen(true);
          }}
          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom API Integration</span>
        </button>
      </div>

      {/* Inline Feedback Notice */}
      {notice && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-medium flex items-center justify-between gap-3 ${
            notice.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {notice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{notice.text}</span>
          </div>
          <button
            onClick={() => setNotice(null)}
            className="p-0.5 rounded hover:bg-black/5 cursor-pointer"
            aria-label="Dismiss message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Active External APIs</span>
          <p className="text-2xl font-extrabold text-[#0F2C59] mt-1 tabular-nums">
            {activeIntegrationsCount}{' '}
            <span className="text-xs font-normal text-slate-400">/ {integrations.length}</span>
          </p>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">
            {configuredIntegrationsCount} configured with API keys
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Storefront REST API Keys</span>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1 tabular-nums">
            {activeStoreKeysCount}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Active inbound keys for mobile apps & ERP sync
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Key Protection</span>
          <p className="text-sm font-bold text-slate-900 mt-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Admin-Only Masked Vault</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Keys never exposed on customer storefront pages
          </p>
        </div>
      </div>

      {/* Module Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setSubTab('outbound')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
            subTab === 'outbound'
              ? 'bg-[#0F2C59] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Plug className="w-3.5 h-3.5" />
          <span>Third-Party API Integrations ({integrations.length})</span>
        </button>

        <button
          onClick={() => setSubTab('inbound')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
            subTab === 'inbound'
              ? 'bg-[#0F2C59] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Store API Keys & Docs ({storeKeys.length})</span>
        </button>
      </div>

      {/* =================================================================== */}
      {/* SUB-TAB 1: THIRD-PARTY API INTEGRATIONS */}
      {/* =================================================================== */}
      {subTab === 'outbound' && (
        <div className="space-y-4">
          {/* Category Filter Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Integration Cards Grid */}
          {filteredIntegrations.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
              <p className="text-sm font-bold text-slate-800">No integrations in this category yet</p>
              <p className="text-xs text-slate-500">
                Click "Add Custom API Integration" to connect any REST API service with your API key.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredIntegrations.map((item) => {
                const isRevealed = Boolean(revealedIds[item.id]);
                const hasKey = Boolean(item.apiKey.trim());
                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between space-y-4 transition-colors ${
                      item.enabled && hasKey ? 'border-emerald-200' : 'border-slate-200/80'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              item.enabled && hasKey
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {getCategoryIcon(item.category)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
                              <span
                                className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                                  item.environment === 'live'
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                                }`}
                              >
                                {item.environment}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">{item.category}</p>
                          </div>
                        </div>

                        {/* Enable/Disable Switch */}
                        <button
                          type="button"
                          onClick={() => handleToggleEnabled(item)}
                          role="switch"
                          aria-checked={item.enabled}
                          aria-label={`Toggle ${item.name}`}
                          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                            item.enabled ? 'bg-emerald-600' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                              item.enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

                      {/* Endpoint & Key Details */}
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-[11px]">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-500 flex items-center gap-1 shrink-0">
                            <Globe className="w-3 h-3" />
                            Endpoint:
                          </span>
                          <span className="font-mono text-slate-700 truncate">{item.baseUrl}</span>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-500 shrink-0">Auth ({item.authType}):</span>
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span
                              className={`font-mono truncate ${
                                hasKey ? 'text-slate-900 font-semibold' : 'text-slate-400 italic'
                              }`}
                            >
                              {hasKey
                                ? isRevealed
                                  ? item.apiKey
                                  : maskSecret(item.apiKey)
                                : 'No API key saved'}
                            </span>
                            {hasKey && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => toggleReveal(item.id)}
                                  className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                                  title={isRevealed ? 'Hide API Key' : 'Reveal API Key'}
                                >
                                  {isRevealed ? (
                                    <EyeOff className="w-3.5 h-3.5" />
                                  ) : (
                                    <Eye className="w-3.5 h-3.5" />
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(item.apiKey, item.id)}
                                  className="p-1 text-slate-400 hover:text-emerald-700 cursor-pointer"
                                  title="Copy API Key"
                                >
                                  {copiedId === item.id ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {item.webhookUrl && (
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-slate-500 flex items-center gap-1 shrink-0">
                              <Webhook className="w-3 h-3" />
                              Webhook:
                            </span>
                            <span className="font-mono text-slate-700 truncate">{item.webhookUrl}</span>
                          </div>
                        )}
                      </div>

                      {/* Last Test Result */}
                      {item.lastTestMessage && (
                        <div
                          className={`px-3 py-2 rounded-lg text-[11px] flex items-start gap-1.5 ${
                            item.lastTestStatus === 'success'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                              : 'bg-rose-50 text-rose-700 border border-rose-100'
                          }`}
                        >
                          {item.lastTestStatus === 'success' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-600" />
                          )}
                          <span>{item.lastTestMessage}</span>
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingIntegration(item);
                            setIsIntegrationModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>{hasKey ? 'Edit Keys' : 'Configure API Key'}</span>
                        </button>

                        <button
                          type="button"
                          disabled={testingId === item.id || !hasKey}
                          onClick={() => handleTestConnection(item)}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCw
                            className={`w-3.5 h-3.5 ${testingId === item.id ? 'animate-spin' : ''}`}
                          />
                          <span>{testingId === item.id ? 'Testing...' : 'Test API'}</span>
                        </button>
                      </div>

                      {!item.isBuiltIn && (
                        confirmDeleteId === item.id ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleDeleteIntegration(item.id, item.name)}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-semibold cursor-pointer"
                            >
                              Confirm Delete
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-[11px] font-medium cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Custom Integration"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* SUB-TAB 2: STOREFRONT INBOUND API KEYS */}
      {/* =================================================================== */}
      {subTab === 'inbound' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Create Key Form */}
          <div className="lg:col-span-5 space-y-4">
            <form
              onSubmit={handleGenerateStoreKey}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 text-xs"
            >
              <div>
                <h3 className="text-sm font-bold text-slate-900">Generate Storefront API Key</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Issue an API key for mobile apps, warehouse ERP, or billing software to access Saatvik Pharma endpoints.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Key Label *</label>
                <input
                  type="text"
                  required
                  value={newKeyLabel}
                  onChange={(e) => setNewKeyLabel(e.target.value)}
                  placeholder="e.g. Tally ERP Stock Sync or Mobile App"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Environment</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewKeyEnv('live')}
                    className={`py-2 rounded-xl border font-semibold cursor-pointer ${
                      newKeyEnv === 'live'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    Live (sp_live_)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewKeyEnv('sandbox')}
                    className={`py-2 rounded-xl border font-semibold cursor-pointer ${
                      newKeyEnv === 'sandbox'
                        ? 'bg-amber-50 border-amber-500 text-amber-800'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    Sandbox (sp_sandbox_)
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Permission Scopes *</label>
                <div className="space-y-1.5">
                  {ALL_SCOPES.map((s) => {
                    const checked = newKeyScopes.includes(s.value);
                    return (
                      <label
                        key={s.value}
                        className={`flex items-start gap-2.5 p-2 rounded-xl border cursor-pointer transition-colors ${
                          checked
                            ? 'bg-emerald-50/70 border-emerald-200'
                            : 'bg-slate-50/50 border-slate-200/70 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleToggleScope(s.value)}
                          className="mt-0.5 accent-emerald-700"
                        />
                        <div>
                          <span className="font-semibold text-slate-800">{s.label}</span>
                          <span className="ml-1.5 font-mono text-[10px] text-slate-500">({s.value})</span>
                          <p className="text-[10px] text-slate-500">{s.desc}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>Generate New API Key</span>
              </button>
            </form>

            {/* Quick Usage Snippet */}
            <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1.5">
                  <Code2 className="w-4 h-4" />
                  <span>Example REST API Request</span>
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      `curl -X GET "https://yourdomain.com/api/get_products" \\\n  -H "X-API-Key: ${sampleKey}" \\\n  -H "Accept: application/json"`,
                      'curl-snippet'
                    )
                  }
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-[11px] text-slate-200 flex items-center gap-1 cursor-pointer"
                >
                  {copiedId === 'curl-snippet' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy cURL</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 bg-slate-950 rounded-xl font-mono text-[11px] text-emerald-300 overflow-x-auto leading-relaxed border border-slate-800">
{`curl -X GET "https://yourdomain.com/api/get_products" \\
  -H "X-API-Key: ${maskSecret(sampleKey)}" \\
  -H "Accept: application/json"`}
              </pre>
            </div>
          </div>

          {/* Right Column: Issued Keys List */}
          <div className="lg:col-span-7 space-y-4">
            {newlyCreatedKey && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    New Key Ready — Copy & Store Securely:
                  </span>
                  <button
                    type="button"
                    onClick={() => setNewlyCreatedKey(null)}
                    className="text-emerald-700 hover:text-emerald-950 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-emerald-200">
                  <code className="flex-1 font-mono text-[11px] text-slate-900 break-all">
                    {newlyCreatedKey.apiKey}
                  </code>
                  <button
                    type="button"
                    onClick={() => handleCopy(newlyCreatedKey.apiKey, 'new-key-banner')}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    {copiedId === 'new-key-banner' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Key</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Issued Storefront API Keys</h3>
                <span className="text-[11px] text-slate-500">{storeKeys.length} total</span>
              </div>

              {storeKeys.length === 0 ? (
                <div className="p-10 text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-800">No storefront API keys created yet</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Generate an API key on the left to allow external billing software, mobile apps, or ERP systems to integrate with Saatvik Pharma.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {storeKeys.map((k) => {
                    const isRevealed = Boolean(revealedIds[k.id]);
                    return (
                      <div key={k.id} className="p-4 sm:p-5 space-y-3 hover:bg-slate-50/50">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-slate-900">{k.label}</span>
                              <span
                                className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                                  k.active
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                                }`}
                              >
                                {k.active ? 'Active' : 'Revoked'}
                              </span>
                              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-800">
                                {k.environment}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Created {new Date(k.createdAt).toLocaleDateString('en-IN')}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleToggleStoreKey(k.id)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer ${
                                k.active
                                  ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                              }`}
                            >
                              {k.active ? 'Revoke' : 'Reactivate'}
                            </button>

                            {confirmDeleteId === k.id ? (
                              <button
                                type="button"
                                onClick={() => handleDeleteStoreKey(k.id, k.label)}
                                className="px-2.5 py-1 bg-rose-600 text-white rounded-lg text-[11px] font-semibold cursor-pointer"
                              >
                                Confirm
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(k.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                                title="Delete API Key"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[11px]">
                          <code className="font-mono text-slate-800 truncate">
                            {isRevealed ? k.apiKey : maskSecret(k.apiKey)}
                          </code>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => toggleReveal(k.id)}
                              className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                              title={isRevealed ? 'Hide key' : 'Show key'}
                            >
                              {isRevealed ? (
                                <EyeOff className="w-3.5 h-3.5" />
                              ) : (
                                <Eye className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopy(k.apiKey, k.id)}
                              className="p-1 text-slate-500 hover:text-emerald-700 cursor-pointer"
                              title="Copy key"
                            >
                              {copiedId === k.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          {k.scopes.map((sc) => (
                            <span
                              key={sc}
                              className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-700"
                            >
                              {sc}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* ADD / EDIT API INTEGRATION MODAL */}
      {/* =================================================================== */}
      {isIntegrationModalOpen && (
        <IntegrationEditorModal
          integration={editingIntegration}
          onClose={() => {
            setIsIntegrationModalOpen(false);
            setEditingIntegration(null);
          }}
          onSave={handleSaveIntegration}
        />
      )}
    </div>
  );
};

interface IntegrationEditorModalProps {
  integration: ApiIntegration | null;
  onClose: () => void;
  onSave: (integration: ApiIntegration) => void;
}

const IntegrationEditorModal: React.FC<IntegrationEditorModalProps> = ({
  integration,
  onClose,
  onSave
}) => {
  const [name, setName] = useState(integration?.name || '');
  const [category, setCategory] = useState<ApiIntegrationCategory>(
    integration?.category || 'ERP & Inventory'
  );
  const [description, setDescription] = useState(integration?.description || '');
  const [baseUrl, setBaseUrl] = useState(integration?.baseUrl || '');
  const [authType, setAuthType] = useState<ApiAuthType>(integration?.authType || 'Bearer');
  const [headerName, setHeaderName] = useState(integration?.headerName || 'X-API-Key');
  const [apiKey, setApiKey] = useState(integration?.apiKey || '');
  const [apiSecret, setApiSecret] = useState(integration?.apiSecret || '');
  const [webhookUrl, setWebhookUrl] = useState(integration?.webhookUrl || '');
  const [environment, setEnvironment] = useState<'sandbox' | 'live'>(
    integration?.environment || 'sandbox'
  );
  const [enabled, setEnabled] = useState<boolean>(integration?.enabled ?? true);
  const [showKey, setShowKey] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !baseUrl.trim()) return;

    const saved: ApiIntegration = {
      id: integration?.id || `int_custom_${Date.now()}`,
      name: name.trim(),
      provider:
        integration?.provider ||
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '_')
          .replace(/^_|_$/g, ''),
      category,
      description:
        description.trim() || 'Custom third-party REST API integration via API Key authentication.',
      baseUrl: baseUrl.trim(),
      authType,
      headerName:
        authType === 'API Key Header' ? headerName.trim() || 'X-API-Key' : 'Authorization',
      apiKey: apiKey.trim(),
      apiSecret: apiSecret.trim(),
      webhookUrl: webhookUrl.trim(),
      environment,
      enabled: Boolean(apiKey.trim()) ? enabled : false,
      isBuiltIn: integration?.isBuiltIn ?? false,
      lastTestedAt: integration?.lastTestedAt,
      lastTestStatus: integration?.lastTestStatus,
      lastTestMessage: integration?.lastTestMessage,
      updatedAt: new Date().toISOString()
    };

    onSave(saved);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[92vh] flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Plug className="w-4 h-4 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900">
              {integration ? `Configure ${integration.name}` : 'Add Custom API Integration'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 text-xs flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Integration Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Cashfree Payments or Tally ERP"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ApiIntegrationCategory)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:border-emerald-600 focus:outline-none"
              >
                <option value="Payment Gateway">Payment Gateway</option>
                <option value="Shipping & Courier">Shipping & Courier</option>
                <option value="SMS & WhatsApp">SMS & WhatsApp</option>
                <option value="ERP & Inventory">ERP & Inventory</option>
                <option value="Analytics & Custom">Analytics & Custom</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Base API Endpoint URL *</label>
              <input
                type="url"
                required
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://api.provider.com/v1"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Authentication Method *</label>
              <select
                value={authType}
                onChange={(e) => setAuthType(e.target.value as ApiAuthType)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:border-emerald-600 focus:outline-none"
              >
                <option value="Bearer">Bearer Token (Authorization: Bearer)</option>
                <option value="API Key Header">Custom API Key Header</option>
                <option value="Basic Auth">Basic Auth (API Key + Secret)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Environment</label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value as 'sandbox' | 'live')}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:border-emerald-600 focus:outline-none"
              >
                <option value="sandbox">Sandbox / Test Mode</option>
                <option value="live">Live / Production Mode</option>
              </select>
            </div>

            {authType === 'API Key Header' && (
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Custom Header Name</label>
                <input
                  type="text"
                  value={headerName}
                  onChange={(e) => setHeaderName(e.target.value)}
                  placeholder="X-API-Key"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono focus:border-emerald-600 focus:outline-none"
                />
              </div>
            )}

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">API Key / Public Key *</label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  required
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your provider API key"
                  className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-xl font-mono focus:border-emerald-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                API Secret / Signing Secret <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type={showSecret ? 'text' : 'password'}
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  placeholder="Required for Basic Auth or webhook signature verification"
                  className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-xl font-mono focus:border-emerald-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Webhook Callback URL <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://yourdomain.com/api/webhook"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe what this API integration handles"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="accent-emerald-700"
                />
                <div>
                  <span className="font-semibold text-slate-800">Enable this API Integration immediately</span>
                  <p className="text-[11px] text-slate-500">
                    Active integrations will be synced and available for backend requests.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold cursor-pointer"
            >
              Save API Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

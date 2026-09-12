import React, { useState } from 'react';
import { PageTransition, FadeIn } from '../components/common/animations';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import { useMockStore } from '../store/useMockStore';
import { Building2, Plus, Search } from 'lucide-react';

export default function Organizations() {
  const { organizations, addOrganization } = useMockStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOrg, setNewOrg] = useState({ name: '', code: '' });

  const filteredOrgs = organizations.filter(org => 
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    org.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    if (newOrg.name && newOrg.code) {
      addOrganization(newOrg);
      setNewOrg({ name: '', code: '' });
      setIsModalOpen(false);
    }
  };

  return (
    <PageTransition className="space-y-8 pb-12">
      <FadeIn delay={0.05}>
        <PageHeader 
          title="Organizations" 
          subtitle="Manage root entities that Admins and Users belong to."
          actions={
            <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>
              New Organization
            </Button>
          }
        />
      </FadeIn>

      <FadeIn delay={0.15}>
        <div className="premium-card bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search organizations..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {filteredOrgs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">ID / Code</th>
                    <th className="px-6 py-4">Organization Name</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Admins</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrgs.map((org) => (
                    <tr key={org.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs font-bold text-slate-700">{org.id}</div>
                        <div className="text-slate-500 text-xs mt-0.5">{org.code}</div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900">{org.name}</td>
                      <td className="px-6 py-4">
                        <Badge variant={org.status === 'ACTIVE' ? 'strong' : 'default'}>
                          {org.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right tabular-nums text-slate-600 font-medium">
                        {org.admins}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState 
              title="No Organizations Found"
              description="There are no organizations matching your search criteria."
              icon={Building2}
            />
          )}
        </div>
      </FadeIn>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Organization"
        subtitle="Establish a new root entity."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave} disabled={!newOrg.name || !newOrg.code}>Create Organization</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Organization Name</label>
            <input 
              type="text" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
              placeholder="e.g. Ministry of Statistics"
              value={newOrg.name}
              onChange={(e) => setNewOrg({...newOrg, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Short Code</label>
            <input 
              type="text" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 uppercase" 
              placeholder="e.g. MOSPI"
              value={newOrg.code}
              onChange={(e) => setNewOrg({...newOrg, code: e.target.value.toUpperCase()})}
            />
          </div>
        </div>
      </Modal>
    </PageTransition>
  );
}

import React, { useState } from 'react';
import { PageTransition, FadeIn } from '../components/common/animations';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import { useMockStore } from '../store/useMockStore';
import { Shield, Plus, Search } from 'lucide-react';

export default function Admins() {
  const { admins, organizations, addAdmin } = useMockStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', organizationId: '' });

  const filteredAdmins = admins.filter(admin => 
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    if (newAdmin.name && newAdmin.email && newAdmin.organizationId) {
      addAdmin(newAdmin);
      setNewAdmin({ name: '', email: '', organizationId: '' });
      setIsModalOpen(false);
    }
  };

  return (
    <PageTransition className="space-y-8 pb-12">
      <FadeIn delay={0.05}>
        <PageHeader 
          title="Organization Admins" 
          subtitle="Manage Headmasters assigned to organizations."
          actions={
            <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>
              New Admin
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
                placeholder="Search admins by name or email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {filteredAdmins.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Name & Email</th>
                    <th className="px-6 py-4">Organization</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAdmins.map((admin) => {
                    const org = organizations.find(o => o.id === admin.organizationId);
                    return (
                      <tr key={admin.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs font-bold text-slate-700">{admin.id}</td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900">{admin.name}</div>
                          <div className="text-slate-500 text-xs mt-0.5">{admin.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                              {org?.code}
                            </span>
                            <span className="text-slate-700 font-medium">{org?.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Badge variant={admin.status === 'ACTIVE' ? 'strong' : 'default'}>
                            {admin.status}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState 
              title="No Admins Found"
              description="There are no administrators matching your search criteria."
              icon={Shield}
            />
          )}
        </div>
      </FadeIn>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Provision New Admin"
        subtitle="Create an administrator and assign them to an organization."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave} disabled={!newAdmin.name || !newAdmin.email || !newAdmin.organizationId}>Create Admin</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Full Name</label>
            <input 
              type="text" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
              value={newAdmin.name}
              onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
              value={newAdmin.email}
              onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Organization</label>
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              value={newAdmin.organizationId}
              onChange={(e) => setNewAdmin({...newAdmin, organizationId: e.target.value})}
            >
              <option value="">Select Organization...</option>
              {organizations.map(org => (
                <option key={org.id} value={org.id}>{org.name} ({org.code})</option>
              ))}
            </select>
          </div>
        </div>
      </Modal>
    </PageTransition>
  );
}

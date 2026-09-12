import React, { useState } from 'react';
import { PageTransition, FadeIn } from '../components/common/animations';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import { useMockStore } from '../store/useMockStore';
import { Users as UsersIcon, Plus, Search } from 'lucide-react';

export default function Users() {
  const { users, organizations, addUser } = useMockStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', organizationId: '', role: 'Data Analyst' });

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    if (newUser.name && newUser.email && newUser.organizationId) {
      addUser(newUser);
      setNewUser({ name: '', email: '', organizationId: '', role: 'Data Analyst' });
      setIsModalOpen(false);
    }
  };

  return (
    <PageTransition className="space-y-8 pb-12">
      <FadeIn delay={0.05}>
        <PageHeader 
          title="Platform Users" 
          subtitle="Manage all end-users across organizations."
          actions={
            <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>
              New User
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
                placeholder="Search users by name or email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Name & Email</th>
                    <th className="px-6 py-4">Organization</th>
                    <th className="px-6 py-4 text-right">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => {
                    const org = organizations.find(o => o.id === user.organizationId);
                    return (
                      <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs font-bold text-slate-700">{user.id}</td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900">{user.name}</div>
                          <div className="text-slate-500 text-xs mt-0.5">{user.email}</div>
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
                          <Badge variant={user.role === 'Survey Director' ? 'igot' : 'default'}>
                            {user.role}
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
              title="No Users Found"
              description="There are no users matching your search criteria."
              icon={UsersIcon}
            />
          )}
        </div>
      </FadeIn>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Provision New User"
        subtitle="Create an end-user and assign them to an organization."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave} disabled={!newUser.name || !newUser.email || !newUser.organizationId}>Create User</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Full Name</label>
            <input 
              type="text" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
              value={newUser.name}
              onChange={(e) => setNewUser({...newUser, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Organization</label>
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              value={newUser.organizationId}
              onChange={(e) => setNewUser({...newUser, organizationId: e.target.value})}
            >
              <option value="">Select Organization...</option>
              {organizations.map(org => (
                <option key={org.id} value={org.id}>{org.name} ({org.code})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Role</label>
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              value={newUser.role}
              onChange={(e) => setNewUser({...newUser, role: e.target.value})}
            >
              <option value="Data Analyst">Data Analyst</option>
              <option value="Survey Director">Survey Director</option>
              <option value="Field Officer">Field Officer</option>
            </select>
          </div>
        </div>
      </Modal>
    </PageTransition>
  );
}

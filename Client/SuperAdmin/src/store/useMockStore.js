import { create } from 'zustand';

export const useMockStore = create((set) => ({
  organizations: [
    { id: 'ORG-1001', name: 'Delhi Statistical Office', code: 'DSO', status: 'ACTIVE', admins: 2 },
    { id: 'ORG-1002', name: 'Mumbai Data Hub', code: 'MDH', status: 'ACTIVE', admins: 1 },
  ],
  admins: [
    { id: 'ADM-2001', name: 'Rajesh Kumar', email: 'rajesh@mospi.gov.in', organizationId: 'ORG-1001', status: 'ACTIVE' },
    { id: 'ADM-2002', name: 'Anita Sharma', email: 'anita@mospi.gov.in', organizationId: 'ORG-1002', status: 'ACTIVE' },
  ],
  users: [
    { id: 'USR-3001', name: 'Amit Patel', email: 'amit@mospi.gov.in', organizationId: 'ORG-1001', role: 'Data Analyst' },
    { id: 'USR-3002', name: 'Priya Singh', email: 'priya@mospi.gov.in', organizationId: 'ORG-1001', role: 'Survey Director' },
    { id: 'USR-3003', name: 'Vikram Gupta', email: 'vikram@mospi.gov.in', organizationId: 'ORG-1002', role: 'Data Analyst' },
  ],

  addOrganization: (org) => set((state) => ({
    organizations: [...state.organizations, { ...org, id: `ORG-${Math.floor(1000 + Math.random() * 9000)}`, admins: 0, status: 'ACTIVE' }]
  })),

  addAdmin: (admin) => set((state) => ({
    admins: [...state.admins, { ...admin, id: `ADM-${Math.floor(2000 + Math.random() * 9000)}`, status: 'ACTIVE' }]
  })),

  addUser: (user) => set((state) => ({
    users: [...state.users, { ...user, id: `USR-${Math.floor(3000 + Math.random() * 9000)}` }]
  })),
}));

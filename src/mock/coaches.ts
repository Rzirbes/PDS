
export const mockCoaches = [
  {
    id: 1,
    uuid: 'abc123-coach-001',
    createdAt: new Date('2024-01-10T09:00:00Z'),
    updatedAt: new Date('2024-04-15T12:00:00Z'),
    name: 'Carlos Silva',
    email: 'carlos@ctexemplo.com',
    isEnabled: true,
    role: 'personal_trainer',
    phone: '+55 51 99999-8888',
    schedulerColor: '#DC2626',
    addressId: 1,
    address: {
      street: 'Rua das Palmeiras',
      number: '123',
      city: 'Porto Alegre',
      state: 'RS',
      zipcode: '91000-000',
    },
  },
  {
    id: 2,
    uuid: 'abc123-coach-002',
    createdAt: new Date('2024-01-15T09:00:00Z'),
    updatedAt: new Date('2024-04-18T12:00:00Z'),
    name: 'Camila',
    email: 'camila@ctexemplo.com',
    isEnabled: true,
    role: 'fisioterapeuta',
    phone: '+55 51 98888-7777',
    schedulerColor: '#059669',
    addressId: 2,
    address: {
      street: 'Av. Ipiranga',
      number: '456',
      city: 'Canoas',
      state: 'RS',
      zipcode: '92000-000',
    },
  },
]


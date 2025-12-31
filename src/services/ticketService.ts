// Ticket Service - Handles all ticket operations

export interface Ticket {
  id: string;
  pnrNumber: string;
  trainNumber: string;
  trainName: string;
  source: string;
  destination: string;
  journeyDate: string;
  departureTime: string;
  arrivalTime: string;
  seatNumber: string;
  class: 'Sleeper' | '3A' | '2A' | '1A' | 'General' | 'CC';
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  status: 'PENDING' | 'VERIFIED' | 'AVAILABLE' | 'BOOKED' | 'REJECTED';
  price: number;
  originalPrice?: number;
  buyerId?: string;
  buyerName?: string;
  buyerPhone?: string;
  passengerDetails?: {
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
  };
  createdAt: string;
  verifiedAt?: string;
  bookedAt?: string;
}

export interface TicketUploadData {
  pnrNumber: string;
  trainNumber: string;
  trainName: string;
  source: string;
  destination: string;
  journeyDate: string;
  departureTime: string;
  arrivalTime: string;
  seatNumber: string;
  class: Ticket['class'];
  price: number;
  originalPrice?: number;
}

// Initialize with some demo tickets
const initializeTickets = () => {
  const tickets = localStorage.getItem('tickets');
  if (!tickets) {
    const demoTickets: Ticket[] = [
      {
        id: 'ticket-001',
        pnrNumber: '2847563291',
        trainNumber: '12301',
        trainName: 'Rajdhani Express',
        source: 'New Delhi',
        destination: 'Mumbai Central',
        journeyDate: '2025-01-05',
        departureTime: '16:55',
        arrivalTime: '08:35',
        seatNumber: 'A1-45',
        class: '2A',
        ownerId: 'seller-001',
        ownerName: 'Rajesh Kumar',
        ownerPhone: '9876543210',
        status: 'AVAILABLE',
        price: 800,
        originalPrice: 1500,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        verifiedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'ticket-002',
        pnrNumber: '3928471563',
        trainNumber: '12951',
        trainName: 'Mumbai Rajdhani',
        source: 'Mumbai Central',
        destination: 'New Delhi',
        journeyDate: '2025-01-08',
        departureTime: '17:00',
        arrivalTime: '08:35',
        seatNumber: 'B2-22',
        class: '3A',
        ownerId: 'seller-001',
        ownerName: 'Rajesh Kumar',
        ownerPhone: '9876543210',
        status: 'AVAILABLE',
        price: 600,
        originalPrice: 1200,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        verifiedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'ticket-003',
        pnrNumber: '5647382910',
        trainNumber: '12002',
        trainName: 'Shatabdi Express',
        source: 'New Delhi',
        destination: 'Chandigarh',
        journeyDate: '2025-01-03',
        departureTime: '07:40',
        arrivalTime: '10:55',
        seatNumber: 'CC-18',
        class: 'CC',
        ownerId: 'seller-001',
        ownerName: 'Rajesh Kumar',
        ownerPhone: '9876543210',
        status: 'VERIFIED',
        price: 300,
        originalPrice: 550,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        verifiedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
    ];
    localStorage.setItem('tickets', JSON.stringify(demoTickets));
  }
};

// Upload new ticket
export const uploadTicket = (
  uploadData: TicketUploadData,
  ownerId: string,
  ownerName: string,
  ownerPhone: string
): Ticket => {
  initializeTickets();
  
  const tickets: Ticket[] = JSON.parse(localStorage.getItem('tickets') || '[]');
  
  const newTicket: Ticket = {
    id: `ticket-${Date.now()}`,
    ...uploadData,
    ownerId,
    ownerName,
    ownerPhone,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  };
  
  tickets.push(newTicket);
  localStorage.setItem('tickets', JSON.stringify(tickets));
  
  return newTicket;
};

// Get all tickets
export const getAllTickets = (): Ticket[] => {
  initializeTickets();
  return JSON.parse(localStorage.getItem('tickets') || '[]');
};

// Get available tickets (for buyers)
export const getAvailableTickets = (filters?: {
  source?: string;
  destination?: string;
  journeyDate?: string;
  class?: string;
}): Ticket[] => {
  initializeTickets();
  let tickets: Ticket[] = JSON.parse(localStorage.getItem('tickets') || '[]');
  
  // Filter only AVAILABLE and VERIFIED tickets
  tickets = tickets.filter(t => t.status === 'AVAILABLE' || t.status === 'VERIFIED');
  
  // Apply filters
  if (filters) {
    if (filters.source) {
      tickets = tickets.filter(t => 
        t.source.toLowerCase().includes(filters.source!.toLowerCase())
      );
    }
    if (filters.destination) {
      tickets = tickets.filter(t => 
        t.destination.toLowerCase().includes(filters.destination!.toLowerCase())
      );
    }
    if (filters.journeyDate) {
      tickets = tickets.filter(t => t.journeyDate === filters.journeyDate);
    }
    if (filters.class && filters.class !== 'all') {
      tickets = tickets.filter(t => t.class === filters.class);
    }
  }
  
  return tickets.sort((a, b) => 
    new Date(a.journeyDate).getTime() - new Date(b.journeyDate).getTime()
  );
};

// Get tickets by owner
export const getTicketsByOwner = (ownerId: string): Ticket[] => {
  initializeTickets();
  const tickets: Ticket[] = JSON.parse(localStorage.getItem('tickets') || '[]');
  return tickets.filter(t => t.ownerId === ownerId);
};

// Get tickets bought by user
export const getTicketsByBuyer = (buyerId: string): Ticket[] => {
  initializeTickets();
  const tickets: Ticket[] = JSON.parse(localStorage.getItem('tickets') || '[]');
  return tickets.filter(t => t.buyerId === buyerId);
};

// Get ticket by ID
export const getTicketById = (ticketId: string): Ticket | null => {
  initializeTickets();
  const tickets: Ticket[] = JSON.parse(localStorage.getItem('tickets') || '[]');
  return tickets.find(t => t.id === ticketId) || null;
};

// Verify ticket (admin only)
export const verifyTicket = (ticketId: string, approve: boolean): void => {
  const tickets: Ticket[] = JSON.parse(localStorage.getItem('tickets') || '[]');
  const ticketIndex = tickets.findIndex(t => t.id === ticketId);
  
  if (ticketIndex !== -1) {
    tickets[ticketIndex].status = approve ? 'AVAILABLE' : 'REJECTED';
    tickets[ticketIndex].verifiedAt = new Date().toISOString();
    localStorage.setItem('tickets', JSON.stringify(tickets));
  }
};

// Book ticket
export const bookTicket = (
  ticketId: string,
  buyerId: string,
  buyerName: string,
  buyerPhone: string,
  passengerDetails: {
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
  }
): { success: boolean; message: string } => {
  const tickets: Ticket[] = JSON.parse(localStorage.getItem('tickets') || '[]');
  const ticketIndex = tickets.findIndex(t => t.id === ticketId);
  
  if (ticketIndex === -1) {
    return { success: false, message: 'Ticket not found' };
  }
  
  if (tickets[ticketIndex].status !== 'AVAILABLE' && tickets[ticketIndex].status !== 'VERIFIED') {
    return { success: false, message: 'Ticket is not available' };
  }
  
  tickets[ticketIndex].status = 'BOOKED';
  tickets[ticketIndex].buyerId = buyerId;
  tickets[ticketIndex].buyerName = buyerName;
  tickets[ticketIndex].buyerPhone = buyerPhone;
  tickets[ticketIndex].passengerDetails = passengerDetails;
  tickets[ticketIndex].bookedAt = new Date().toISOString();
  
  localStorage.setItem('tickets', JSON.stringify(tickets));
  
  return { success: true, message: 'Ticket booked successfully' };
};

// Get pending tickets (admin)
export const getPendingTickets = (): Ticket[] => {
  initializeTickets();
  const tickets: Ticket[] = JSON.parse(localStorage.getItem('tickets') || '[]');
  return tickets.filter(t => t.status === 'PENDING');
};
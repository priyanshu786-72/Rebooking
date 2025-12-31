// Transaction Service - Handles all payment and transaction operations

export interface Transaction {
  id: string;
  ticketId: string;
  ticketDetails: {
    pnrNumber: string;
    trainNumber: string;
    trainName: string;
    source: string;
    destination: string;
    journeyDate: string;
  };
  sellerId: string;
  sellerName: string;
  buyerId: string;
  buyerName: string;
  amount: number;
  paymentStatus: 'PENDING' | 'SUCCESS' | 'FAILED';
  paymentMethod: 'WALLET' | 'UPI' | 'CARD' | 'NET_BANKING';
  transactionRef?: string;
  createdAt: string;
  completedAt?: string;
}

// Initialize transactions
const initializeTransactions = () => {
  const transactions = localStorage.getItem('transactions');
  if (!transactions) {
    localStorage.setItem('transactions', JSON.stringify([]));
  }
};

// Create new transaction
export const createTransaction = (
  ticketId: string,
  ticketDetails: Transaction['ticketDetails'],
  sellerId: string,
  sellerName: string,
  buyerId: string,
  buyerName: string,
  amount: number,
  paymentMethod: Transaction['paymentMethod']
): Transaction => {
  initializeTransactions();
  
  const transactions: Transaction[] = JSON.parse(localStorage.getItem('transactions') || '[]');
  
  const newTransaction: Transaction = {
    id: `txn-${Date.now()}`,
    ticketId,
    ticketDetails,
    sellerId,
    sellerName,
    buyerId,
    buyerName,
    amount,
    paymentStatus: 'PENDING',
    paymentMethod,
    transactionRef: `REF${Date.now()}${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
  };
  
  transactions.push(newTransaction);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  
  return newTransaction;
};

// Complete transaction
export const completeTransaction = (
  transactionId: string,
  success: boolean
): { success: boolean; message: string } => {
  const transactions: Transaction[] = JSON.parse(localStorage.getItem('transactions') || '[]');
  const transactionIndex = transactions.findIndex(t => t.id === transactionId);
  
  if (transactionIndex === -1) {
    return { success: false, message: 'Transaction not found' };
  }
  
  transactions[transactionIndex].paymentStatus = success ? 'SUCCESS' : 'FAILED';
  transactions[transactionIndex].completedAt = new Date().toISOString();
  
  localStorage.setItem('transactions', JSON.stringify(transactions));
  
  return { success: true, message: success ? 'Payment successful' : 'Payment failed' };
};

// Get all transactions
export const getAllTransactions = (): Transaction[] => {
  initializeTransactions();
  const transactions: Transaction[] = JSON.parse(localStorage.getItem('transactions') || '[]');
  return transactions.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

// Get transactions by seller
export const getTransactionsBySeller = (sellerId: string): Transaction[] => {
  initializeTransactions();
  const transactions: Transaction[] = JSON.parse(localStorage.getItem('transactions') || '[]');
  return transactions
    .filter(t => t.sellerId === sellerId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Get transactions by buyer
export const getTransactionsByBuyer = (buyerId: string): Transaction[] => {
  initializeTransactions();
  const transactions: Transaction[] = JSON.parse(localStorage.getItem('transactions') || '[]');
  return transactions
    .filter(t => t.buyerId === buyerId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Get transaction by ID
export const getTransactionById = (transactionId: string): Transaction | null => {
  initializeTransactions();
  const transactions: Transaction[] = JSON.parse(localStorage.getItem('transactions') || '[]');
  return transactions.find(t => t.id === transactionId) || null;
};

// Get transaction statistics
export interface TransactionStats {
  totalTransactions: number;
  successfulTransactions: number;
  totalRevenue: number;
  pendingAmount: number;
}

export const getTransactionStats = (): TransactionStats => {
  const transactions = getAllTransactions();
  
  return {
    totalTransactions: transactions.length,
    successfulTransactions: transactions.filter(t => t.paymentStatus === 'SUCCESS').length,
    totalRevenue: transactions
      .filter(t => t.paymentStatus === 'SUCCESS')
      .reduce((sum, t) => sum + t.amount, 0),
    pendingAmount: transactions
      .filter(t => t.paymentStatus === 'PENDING')
      .reduce((sum, t) => sum + t.amount, 0),
  };
};

import { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, Users, Package, IndianRupee, Train, User, LogOut, Ban, Clock, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { getAllTickets, getPendingTickets, verifyTicket, Ticket } from '../../services/ticketService';
import { getAllTransactions, getTransactionStats, Transaction } from '../../services/transactionService';
import { getAllUsers, toggleBlockUser } from '../../services/authService';
import { toast } from 'sonner';

interface UserType {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'seller' | 'buyer' | 'admin';
  walletBalance: number;
  createdAt: string;
  isBlocked?: boolean;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [pendingTickets, setPendingTickets] = useState<Ticket[]>([]);
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setPendingTickets(getPendingTickets());
    setAllTickets(getAllTickets());
    setAllUsers(getAllUsers() as UserType[]);
    setTransactions(getAllTransactions());
  };

  const handleVerifyTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowVerifyDialog(true);
  };

  const confirmVerify = (approve: boolean) => {
    if (!selectedTicket) return;

    verifyTicket(selectedTicket.id, approve);
    toast.success(approve ? 'Ticket approved successfully' : 'Ticket rejected');
    setShowVerifyDialog(false);
    loadData();
  };

  const handleToggleBlockUser = (userId: string, userName: string, isBlocked?: boolean) => {
    const action = isBlocked ? 'unblock' : 'block';
    if (confirm(`Are you sure you want to ${action} ${userName}?`)) {
      toggleBlockUser(userId);
      toast.success(`User ${action}ed successfully`);
      loadData();
    }
  };

  const stats = getTransactionStats();
  const dashboardStats = {
    totalUsers: allUsers.length,
    totalTickets: allTickets.length,
    pendingTickets: pendingTickets.length,
    availableTickets: allTickets.filter(t => t.status === 'AVAILABLE' || t.status === 'VERIFIED').length,
    bookedTickets: allTickets.filter(t => t.status === 'BOOKED').length,
    totalRevenue: stats.totalRevenue,
    totalTransactions: stats.totalTransactions,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="size-8 text-purple-600" />
              <div>
                <h1 className="font-bold text-xl text-gray-900">TicketShare Admin</h1>
                <p className="text-sm text-gray-600">System Administration Panel</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                <User className="size-5 text-gray-600" />
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">{user?.name}</div>
                  <div className="text-gray-600 text-xs">Administrator</div>
                </div>
              </div>
              <Button variant="outline" onClick={logout} size="sm">
                <LogOut className="mr-2 size-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border-2 bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="flex items-center justify-between mb-2">
              <Users className="size-8 text-blue-600" />
              <span className="text-3xl font-bold text-gray-900">{dashboardStats.totalUsers}</span>
            </div>
            <p className="text-sm text-gray-600">Total Users</p>
          </Card>

          <Card className="p-6 border-2 bg-gradient-to-br from-green-50 to-green-100">
            <div className="flex items-center justify-between mb-2">
              <Package className="size-8 text-green-600" />
              <span className="text-3xl font-bold text-gray-900">{dashboardStats.totalTickets}</span>
            </div>
            <p className="text-sm text-gray-600">Total Tickets</p>
          </Card>

          <Card className="p-6 border-2 bg-gradient-to-br from-yellow-50 to-yellow-100">
            <div className="flex items-center justify-between mb-2">
              <Clock className="size-8 text-yellow-600" />
              <span className="text-3xl font-bold text-gray-900">{dashboardStats.pendingTickets}</span>
            </div>
            <p className="text-sm text-gray-600">Pending Verification</p>
          </Card>

          <Card className="p-6 border-2 bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="size-8 text-purple-600" />
              <span className="text-3xl font-bold text-gray-900">₹{dashboardStats.totalRevenue}</span>
            </div>
            <p className="text-sm text-gray-600">Platform Revenue</p>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-4 border-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Available Tickets</p>
                <p className="text-2xl font-bold text-green-600">{dashboardStats.availableTickets}</p>
              </div>
              <Package className="size-10 text-green-600 opacity-20" />
            </div>
          </Card>
          <Card className="p-4 border-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Booked Tickets</p>
                <p className="text-2xl font-bold text-purple-600">{dashboardStats.bookedTickets}</p>
              </div>
              <CheckCircle className="size-10 text-purple-600 opacity-20" />
            </div>
          </Card>
          <Card className="p-4 border-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
                <p className="text-2xl font-bold text-blue-600">{dashboardStats.totalTransactions}</p>
              </div>
              <IndianRupee className="size-10 text-blue-600 opacity-20" />
            </div>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="size-4" />
              Pending Verification
              {pendingTickets.length > 0 && (
                <Badge variant="secondary" className="ml-1 bg-yellow-100 text-yellow-700">
                  {pendingTickets.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="tickets" className="gap-2">
              <Package className="size-4" />
              All Tickets
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="size-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="transactions" className="gap-2">
              <IndianRupee className="size-4" />
              Transactions
            </TabsTrigger>
          </TabsList>

          {/* Pending Verification Tab */}
          <TabsContent value="pending" className="space-y-6">
            <Card className="border-2">
              <div className="p-6 border-b bg-yellow-50">
                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                  <Clock className="size-5 text-yellow-600" />
                  Tickets Awaiting Verification ({pendingTickets.length})
                </h3>
                <p className="text-sm text-gray-600 mt-1">Review and approve or reject uploaded tickets</p>
              </div>
              <div className="p-6">
                {pendingTickets.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="size-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No pending tickets</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingTickets.map((ticket) => (
                      <Card key={ticket.id} className="p-6 border-2">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h4 className="font-bold text-lg text-gray-900">{ticket.trainName}</h4>
                              <Badge variant="secondary">{ticket.class}</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                              <div>
                                <p className="text-gray-600">Train: <span className="font-semibold text-gray-900">{ticket.trainNumber}</span></p>
                                <p className="text-gray-600">PNR: <span className="font-semibold text-gray-900">{ticket.pnrNumber}</span></p>
                                <p className="text-gray-600">Seat: <span className="font-semibold text-gray-900">{ticket.seatNumber}</span></p>
                              </div>
                              <div>
                                <p className="text-gray-600">Route: <span className="font-semibold text-gray-900">{ticket.source} → {ticket.destination}</span></p>
                                <p className="text-gray-600">Date: <span className="font-semibold text-gray-900">{new Date(ticket.journeyDate).toLocaleDateString()}</span></p>
                                <p className="text-gray-600">Time: <span className="font-semibold text-gray-900">{ticket.departureTime}</span></p>
                              </div>
                            </div>
                            <div className="pt-3 border-t">
                              <p className="text-sm text-gray-600">
                                Uploaded by: <span className="font-semibold text-gray-900">{ticket.ownerName}</span> ({ticket.ownerPhone})
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Uploaded on: {new Date(ticket.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="ml-6 text-right">
                            <div className="text-2xl font-bold text-green-600 mb-4">
                              ₹{ticket.price}
                            </div>
                            <div className="space-y-2">
                              <Button
                                onClick={() => handleVerifyTicket(ticket)}
                                className="w-full bg-green-600 hover:bg-green-700"
                                size="sm"
                              >
                                <CheckCircle className="mr-2 size-4" />
                                Verify
                              </Button>
                              <Button
                                onClick={() => confirmVerify(false)}
                                variant="outline"
                                className="w-full text-red-600 border-red-300 hover:bg-red-50"
                                size="sm"
                              >
                                <XCircle className="mr-2 size-4" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* All Tickets Tab */}
          <TabsContent value="tickets" className="space-y-6">
            <Card className="border-2">
              <div className="p-6 border-b">
                <h3 className="font-bold text-lg text-gray-900">All Tickets ({allTickets.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PNR</TableHead>
                      <TableHead>Train</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allTickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-mono text-sm">{ticket.pnrNumber}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold">{ticket.trainName}</p>
                            <p className="text-sm text-gray-600">#{ticket.trainNumber}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {ticket.source} → {ticket.destination}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(ticket.journeyDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-sm">{ticket.ownerName}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              ticket.status === 'BOOKED' ? 'default' :
                              ticket.status === 'AVAILABLE' || ticket.status === 'VERIFIED' ? 'secondary' :
                              'outline'
                            }
                            className={
                              ticket.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                              ticket.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                              ticket.status === 'BOOKED' ? 'bg-purple-600' :
                              'bg-green-100 text-green-700'
                            }
                          >
                            {ticket.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-green-600">₹{ticket.price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="border-2">
              <div className="p-6 border-b">
                <h3 className="font-bold text-lg text-gray-900">All Users ({allUsers.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Wallet</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allUsers.map((u) => (
                      <TableRow key={u.id} className={u.isBlocked ? 'bg-red-50' : ''}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {u.isBlocked && <Ban className="size-4 text-red-600" />}
                            <span className={u.isBlocked ? 'text-gray-500' : 'font-semibold'}>{u.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{u.email}</TableCell>
                        <TableCell className="text-sm">{u.phone}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={
                              u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                              u.role === 'seller' ? 'bg-blue-100 text-blue-700' :
                              'bg-green-100 text-green-700'
                            }
                          >
                            {u.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-green-600">₹{u.walletBalance}</TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {u.role !== 'admin' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleBlockUser(u.id, u.name, u.isBlocked)}
                              className={u.isBlocked ? 'text-green-600' : 'text-red-600'}
                            >
                              {u.isBlocked ? 'Unblock' : 'Block'}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card className="border-2">
              <div className="p-6 border-b">
                <h3 className="font-bold text-lg text-gray-900">All Transactions ({transactions.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Train</TableHead>
                      <TableHead>Seller</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((txn) => (
                      <TableRow key={txn.id}>
                        <TableCell className="font-mono text-sm">{txn.transactionRef}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold">{txn.ticketDetails.trainName}</p>
                            <p className="text-sm text-gray-600">
                              {txn.ticketDetails.source} → {txn.ticketDetails.destination}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{txn.sellerName}</TableCell>
                        <TableCell className="text-sm">{txn.buyerName}</TableCell>
                        <TableCell className="font-semibold text-green-600">₹{txn.amount}</TableCell>
                        <TableCell>
                          <Badge
                            variant={txn.paymentStatus === 'SUCCESS' ? 'default' : 'secondary'}
                            className={
                              txn.paymentStatus === 'SUCCESS' ? 'bg-green-600' :
                              txn.paymentStatus === 'FAILED' ? 'bg-red-600' :
                              'bg-yellow-600'
                            }
                          >
                            {txn.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {new Date(txn.createdAt).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Verify Dialog */}
      <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Ticket</DialogTitle>
            <DialogDescription>
              Review the ticket details before approving
            </DialogDescription>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-4">
              <Card className="p-4 bg-gray-50">
                <div className="space-y-2 text-sm">
                  <p><strong>Train:</strong> {selectedTicket.trainName} (#{selectedTicket.trainNumber})</p>
                  <p><strong>PNR:</strong> {selectedTicket.pnrNumber}</p>
                  <p><strong>Route:</strong> {selectedTicket.source} → {selectedTicket.destination}</p>
                  <p><strong>Date:</strong> {new Date(selectedTicket.journeyDate).toLocaleDateString()}</p>
                  <p><strong>Seat:</strong> {selectedTicket.seatNumber} ({selectedTicket.class})</p>
                  <p><strong>Price:</strong> ₹{selectedTicket.price}</p>
                  <p><strong>Owner:</strong> {selectedTicket.ownerName} ({selectedTicket.ownerPhone})</p>
                </div>
              </Card>
              <p className="text-sm text-gray-600">
                Please verify that all details are correct and the PNR is valid before approving.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVerifyDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setSelectedTicket(null);
                confirmVerify(false);
              }}
              variant="outline"
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <XCircle className="mr-2 size-4" />
              Reject
            </Button>
            <Button onClick={() => confirmVerify(true)} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="mr-2 size-4" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

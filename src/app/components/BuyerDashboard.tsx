import { useState, useEffect } from 'react';
import { Search, Train, MapPin, Calendar, Clock, IndianRupee, User, LogOut, Wallet, ShoppingBag, Filter } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { getAvailableTickets, bookTicket, getTicketsByBuyer, Ticket } from '../../services/ticketService';
import { createTransaction, completeTransaction, getTransactionsByBuyer, Transaction } from '../../services/transactionService';
import { updateWalletBalance, getCurrentUser } from '../../services/authService';
import { toast } from 'sonner';

export default function BuyerDashboard() {
  const { user, logout, refreshUser } = useAuth();
  const [availableTickets, setAvailableTickets] = useState<Ticket[]>([]);
  const [myTickets, setMyTickets] = useState<Ticket[]>([]);
  const [myTransactions, setMyTransactions] = useState<Transaction[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  // Search filters
  const [filters, setFilters] = useState({
    source: '',
    destination: '',
    journeyDate: '',
    class: 'all',
  });

  // Passenger details
  const [passengerDetails, setPassengerDetails] = useState({
    name: '',
    age: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    paymentMethod: 'WALLET' as 'WALLET' | 'UPI' | 'CARD',
  });

  useEffect(() => {
    loadTickets();
    loadMyTickets();
    loadTransactions();
  }, [user]);

  const loadTickets = () => {
    const tickets = getAvailableTickets(filters);
    setAvailableTickets(tickets);
  };

  const loadMyTickets = () => {
    if (user) {
      const tickets = getTicketsByBuyer(user.id);
      setMyTickets(tickets);
    }
  };

  const loadTransactions = () => {
    if (user) {
      const transactions = getTransactionsByBuyer(user.id);
      setMyTransactions(transactions);
    }
  };

  const handleSearch = () => {
    loadTickets();
  };

  const handleBookTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowBookingDialog(true);
    setPassengerDetails({
      name: user?.name || '',
      age: '',
      gender: 'Male',
      paymentMethod: 'WALLET',
    });
  };

  const confirmBooking = async () => {
    if (!selectedTicket || !user) return;

    // Validation
    if (!passengerDetails.name || !passengerDetails.age) {
      toast.error('Please fill in all passenger details');
      return;
    }

    const age = parseInt(passengerDetails.age);
    if (age < 1 || age > 120) {
      toast.error('Please enter a valid age');
      return;
    }

    // Check wallet balance
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    if (passengerDetails.paymentMethod === 'WALLET' && currentUser.walletBalance < selectedTicket.price) {
      toast.error('Insufficient wallet balance');
      return;
    }

    setIsBooking(true);

    try {
      // Create transaction
      const transaction = createTransaction(
        selectedTicket.id,
        {
          pnrNumber: selectedTicket.pnrNumber,
          trainNumber: selectedTicket.trainNumber,
          trainName: selectedTicket.trainName,
          source: selectedTicket.source,
          destination: selectedTicket.destination,
          journeyDate: selectedTicket.journeyDate,
        },
        selectedTicket.ownerId,
        selectedTicket.ownerName,
        user.id,
        user.name,
        selectedTicket.price,
        passengerDetails.paymentMethod
      );

      // Book ticket
      const result = bookTicket(
        selectedTicket.id,
        user.id,
        user.name,
        user.phone,
        {
          name: passengerDetails.name,
          age: parseInt(passengerDetails.age),
          gender: passengerDetails.gender,
        }
      );

      if (result.success) {
        // Deduct from buyer wallet
        updateWalletBalance(user.id, -selectedTicket.price);
        
        // Add to seller wallet
        updateWalletBalance(selectedTicket.ownerId, selectedTicket.price);

        // Complete transaction
        completeTransaction(transaction.id, true);

        toast.success('Ticket booked successfully!');
        setShowBookingDialog(false);
        loadTickets();
        loadMyTickets();
        loadTransactions();
        refreshUser();
      } else {
        toast.error(result.message);
        completeTransaction(transaction.id, false);
      }
    } catch (error) {
      toast.error('An error occurred while booking');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Train className="size-8 text-blue-600" />
              <div>
                <h1 className="font-bold text-xl text-gray-900">TicketShare</h1>
                <p className="text-sm text-gray-600">Buyer Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg border border-green-200">
                <Wallet className="size-5 text-green-600" />
                <div className="text-sm">
                  <div className="text-gray-600">Wallet</div>
                  <div className="font-bold text-green-600">₹{user?.walletBalance.toFixed(2)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                <User className="size-5 text-gray-600" />
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">{user?.name}</div>
                  <div className="text-gray-600 text-xs">{user?.email}</div>
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
        <Tabs defaultValue="search" className="space-y-6">
          <TabsList>
            <TabsTrigger value="search" className="gap-2">
              <Search className="size-4" />
              Search Tickets
            </TabsTrigger>
            <TabsTrigger value="my-tickets" className="gap-2">
              <ShoppingBag className="size-4" />
              My Tickets
              {myTickets.length > 0 && (
                <Badge variant="secondary" className="ml-1">{myTickets.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="transactions" className="gap-2">
              <IndianRupee className="size-4" />
              Transactions
            </TabsTrigger>
          </TabsList>

          {/* Search Tickets Tab */}
          <TabsContent value="search" className="space-y-6">
            {/* Search Filters */}
            <Card className="p-6 shadow-lg border-2">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="size-5 text-blue-600" />
                <h2 className="font-bold text-gray-900">Search Train Tickets</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label>From</Label>
                  <Input
                    placeholder="Source station"
                    value={filters.source}
                    onChange={(e) => setFilters({ ...filters, source: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>To</Label>
                  <Input
                    placeholder="Destination station"
                    value={filters.destination}
                    onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Journey Date</Label>
                  <Input
                    type="date"
                    value={filters.journeyDate}
                    onChange={(e) => setFilters({ ...filters, journeyDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Class</Label>
                  <Select value={filters.class} onValueChange={(value) => setFilters({ ...filters, class: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Classes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      <SelectItem value="Sleeper">Sleeper</SelectItem>
                      <SelectItem value="3A">3A</SelectItem>
                      <SelectItem value="2A">2A</SelectItem>
                      <SelectItem value="1A">1A</SelectItem>
                      <SelectItem value="CC">CC</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={handleSearch} className="w-full bg-blue-600 hover:bg-blue-700">
                    <Search className="mr-2 size-4" />
                    Search
                  </Button>
                </div>
              </div>
            </Card>

            {/* Available Tickets */}
            <div>
              <h3 className="font-bold text-xl text-gray-900 mb-4">
                Available Tickets ({availableTickets.length})
              </h3>
              {availableTickets.length === 0 ? (
                <Card className="p-12 text-center border-2">
                  <Train className="size-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No tickets available matching your search</p>
                  <p className="text-sm text-gray-500 mt-2">Try adjusting your filters</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {availableTickets.map((ticket) => (
                    <Card key={ticket.id} className="p-6 border-2 hover:border-blue-300 transition-all shadow-md">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-lg text-gray-900">{ticket.trainName}</h4>
                          <p className="text-sm text-gray-600">Train #{ticket.trainNumber}</p>
                        </div>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          {ticket.class}
                        </Badge>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="size-4 text-gray-400" />
                          <span className="text-gray-900">{ticket.source}</span>
                          <span className="text-gray-400">→</span>
                          <span className="text-gray-900">{ticket.destination}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="size-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{new Date(ticket.journeyDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="size-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{ticket.departureTime}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div>
                            <p className="text-sm text-gray-600">Seat: {ticket.seatNumber}</p>
                            <p className="text-xs text-gray-500">PNR: {ticket.pnrNumber}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-2xl font-bold text-green-600">
                              <IndianRupee className="size-5" />
                              {ticket.price}
                            </div>
                            {ticket.originalPrice && (
                              <p className="text-sm text-gray-500 line-through">₹{ticket.originalPrice}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <Button 
                        onClick={() => handleBookTicket(ticket)} 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        Book This Ticket
                      </Button>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* My Tickets Tab */}
          <TabsContent value="my-tickets" className="space-y-6">
            <div>
              <h3 className="font-bold text-xl text-gray-900 mb-4">
                My Booked Tickets ({myTickets.length})
              </h3>
              {myTickets.length === 0 ? (
                <Card className="p-12 text-center border-2">
                  <ShoppingBag className="size-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">You haven't booked any tickets yet</p>
                  <p className="text-sm text-gray-500 mt-2">Start searching for available tickets</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {myTickets.map((ticket) => (
                    <Card key={ticket.id} className="p-6 border-2 shadow-md bg-green-50 border-green-200">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-lg text-gray-900">{ticket.trainName}</h4>
                          <p className="text-sm text-gray-600">Train #{ticket.trainNumber}</p>
                        </div>
                        <Badge className="bg-green-600">Booked</Badge>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="size-4 text-gray-400" />
                          <span className="text-gray-900">{ticket.source}</span>
                          <span className="text-gray-400">→</span>
                          <span className="text-gray-900">{ticket.destination}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="size-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{new Date(ticket.journeyDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="size-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{ticket.departureTime}</span>
                          </div>
                        </div>

                        {ticket.passengerDetails && (
                          <div className="pt-3 border-t bg-white rounded-lg p-3">
                            <p className="text-sm font-semibold text-gray-900 mb-2">Passenger Details:</p>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p><strong>Name:</strong> {ticket.passengerDetails.name}</p>
                              <p><strong>Age:</strong> {ticket.passengerDetails.age} | <strong>Gender:</strong> {ticket.passengerDetails.gender}</p>
                              <p><strong>Seat:</strong> {ticket.seatNumber} | <strong>Class:</strong> {ticket.class}</p>
                              <p className="font-mono text-xs mt-2 text-blue-600"><strong>PNR:</strong> {ticket.pnrNumber}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <div>
              <h3 className="font-bold text-xl text-gray-900 mb-4">
                Transaction History ({myTransactions.length})
              </h3>
              {myTransactions.length === 0 ? (
                <Card className="p-12 text-center border-2">
                  <IndianRupee className="size-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No transactions yet</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {myTransactions.map((txn) => (
                    <Card key={txn.id} className="p-6 border-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-bold text-gray-900">{txn.ticketDetails.trainName}</h4>
                            <Badge
                              variant={txn.paymentStatus === 'SUCCESS' ? 'default' : 'secondary'}
                              className={txn.paymentStatus === 'SUCCESS' ? 'bg-green-600' : ''}
                            >
                              {txn.paymentStatus}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {txn.ticketDetails.source} → {txn.ticketDetails.destination}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(txn.createdAt).toLocaleString()} | Ref: {txn.transactionRef}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-xl font-bold text-gray-900">
                            <IndianRupee className="size-4" />
                            {txn.amount}
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{txn.paymentMethod}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Book Ticket</DialogTitle>
            <DialogDescription>
              Enter passenger details to complete booking
            </DialogDescription>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-6">
              {/* Ticket Summary */}
              <Card className="p-4 bg-blue-50 border-blue-200">
                <h4 className="font-bold text-gray-900 mb-2">{selectedTicket.trainName}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="text-gray-600">Train: {selectedTicket.trainNumber}</p>
                  <p className="text-gray-600">Class: {selectedTicket.class}</p>
                  <p className="text-gray-600">Seat: {selectedTicket.seatNumber}</p>
                  <p className="text-gray-600">Date: {new Date(selectedTicket.journeyDate).toLocaleDateString()}</p>
                  <p className="text-gray-900 font-semibold col-span-2">
                    {selectedTicket.source} → {selectedTicket.destination}
                  </p>
                </div>
              </Card>

              {/* Passenger Details Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="passenger-name">Passenger Name *</Label>
                  <Input
                    id="passenger-name"
                    value={passengerDetails.name}
                    onChange={(e) => setPassengerDetails({ ...passengerDetails, name: e.target.value })}
                    placeholder="Full name as per ID"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="passenger-age">Age *</Label>
                    <Input
                      id="passenger-age"
                      type="number"
                      value={passengerDetails.age}
                      onChange={(e) => setPassengerDetails({ ...passengerDetails, age: e.target.value })}
                      placeholder="Age"
                      min="1"
                      max="120"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passenger-gender">Gender *</Label>
                    <Select
                      value={passengerDetails.gender}
                      onValueChange={(value: any) => setPassengerDetails({ ...passengerDetails, gender: value })}
                    >
                      <SelectTrigger id="passenger-gender">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment-method">Payment Method *</Label>
                  <Select
                    value={passengerDetails.paymentMethod}
                    onValueChange={(value: any) => setPassengerDetails({ ...passengerDetails, paymentMethod: value })}
                  >
                    <SelectTrigger id="payment-method">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WALLET">Wallet (₹{user?.walletBalance.toFixed(2)})</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="CARD">Credit/Debit Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Payment Summary */}
              <Card className="p-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total Amount:</span>
                  <span className="text-2xl font-bold text-green-600 flex items-center gap-1">
                    <IndianRupee className="size-5" />
                    {selectedTicket.price}
                  </span>
                </div>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBookingDialog(false)} disabled={isBooking}>
              Cancel
            </Button>
            <Button onClick={confirmBooking} disabled={isBooking} className="bg-blue-600 hover:bg-blue-700">
              {isBooking ? 'Processing...' : 'Confirm Booking'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
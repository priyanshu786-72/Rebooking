import { useState, useEffect } from 'react';
import { Upload, Train, MapPin, Calendar, Clock, IndianRupee, User, LogOut, Wallet, Package, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { uploadTicket, getTicketsByOwner, Ticket } from '../../services/ticketService';
import { getTransactionsBySeller, Transaction } from '../../services/transactionService';
import { toast } from 'sonner';

export default function SellerDashboard() {
  const { user, logout, refreshUser } = useAuth();
  const [myTickets, setMyTickets] = useState<Ticket[]>([]);
  const [myTransactions, setMyTransactions] = useState<Transaction[]>([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Upload form state
  const [uploadData, setUploadData] = useState({
    pnrNumber: '',
    trainNumber: '',
    trainName: '',
    source: '',
    destination: '',
    journeyDate: '',
    departureTime: '',
    arrivalTime: '',
    seatNumber: '',
    class: 'Sleeper' as 'Sleeper' | '3A' | '2A' | '1A' | 'General' | 'CC',
    originalPrice: '',
    price: '',
  });

  useEffect(() => {
    loadMyTickets();
    loadTransactions();
  }, [user]);

  const loadMyTickets = () => {
    if (user) {
      const tickets = getTicketsByOwner(user.id);
      setMyTickets(tickets);
    }
  };

  const loadTransactions = () => {
    if (user) {
      const transactions = getTransactionsBySeller(user.id);
      setMyTransactions(transactions);
    }
  };

  const handleUploadTicket = async () => {
    // Validation
    if (!uploadData.pnrNumber || !uploadData.trainNumber || !uploadData.trainName || 
        !uploadData.source || !uploadData.destination || !uploadData.journeyDate ||
        !uploadData.departureTime || !uploadData.arrivalTime || !uploadData.seatNumber ||
        !uploadData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    const price = parseFloat(uploadData.price);
    if (isNaN(price) || price <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    setIsUploading(true);

    try {
      const ticket = uploadTicket(
        {
          pnrNumber: uploadData.pnrNumber,
          trainNumber: uploadData.trainNumber,
          trainName: uploadData.trainName,
          source: uploadData.source,
          destination: uploadData.destination,
          journeyDate: uploadData.journeyDate,
          departureTime: uploadData.departureTime,
          arrivalTime: uploadData.arrivalTime,
          seatNumber: uploadData.seatNumber,
          class: uploadData.class,
          price: price,
          originalPrice: uploadData.originalPrice ? parseFloat(uploadData.originalPrice) : undefined,
        },
        user!.id,
        user!.name,
        user!.phone
      );

      toast.success('Ticket uploaded successfully! Waiting for admin verification.');
      setShowUploadDialog(false);
      resetUploadForm();
      loadMyTickets();
    } catch (error) {
      toast.error('An error occurred while uploading');
    } finally {
      setIsUploading(false);
    }
  };

  const resetUploadForm = () => {
    setUploadData({
      pnrNumber: '',
      trainNumber: '',
      trainName: '',
      source: '',
      destination: '',
      journeyDate: '',
      departureTime: '',
      arrivalTime: '',
      seatNumber: '',
      class: 'Sleeper',
      originalPrice: '',
      price: '',
    });
  };

  const getStatusBadge = (status: Ticket['status']) => {
    const statusConfig = {
      PENDING: { label: 'Pending Verification', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      VERIFIED: { label: 'Verified', className: 'bg-blue-100 text-blue-700 border-blue-200' },
      AVAILABLE: { label: 'Available', className: 'bg-green-100 text-green-700 border-green-200' },
      BOOKED: { label: 'Booked', className: 'bg-purple-100 text-purple-700 border-purple-200' },
      REJECTED: { label: 'Rejected', className: 'bg-red-100 text-red-700 border-red-200' },
    };
    const config = statusConfig[status];
    return <Badge className={`${config.className} border`}>{config.label}</Badge>;
  };

  const stats = {
    totalTickets: myTickets.length,
    pendingTickets: myTickets.filter(t => t.status === 'PENDING').length,
    availableTickets: myTickets.filter(t => t.status === 'AVAILABLE' || t.status === 'VERIFIED').length,
    soldTickets: myTickets.filter(t => t.status === 'BOOKED').length,
    totalEarnings: myTransactions
      .filter(t => t.paymentStatus === 'SUCCESS')
      .reduce((sum, t) => sum + t.amount, 0),
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
                <p className="text-sm text-gray-600">Seller Dashboard</p>
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
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="p-6 border-2">
            <div className="flex items-center justify-between mb-2">
              <Package className="size-8 text-blue-600" />
              <span className="text-3xl font-bold text-gray-900">{stats.totalTickets}</span>
            </div>
            <p className="text-sm text-gray-600">Total Tickets</p>
          </Card>
          <Card className="p-6 border-2 bg-yellow-50">
            <div className="flex items-center justify-between mb-2">
              <Clock className="size-8 text-yellow-600" />
              <span className="text-3xl font-bold text-gray-900">{stats.pendingTickets}</span>
            </div>
            <p className="text-sm text-gray-600">Pending</p>
          </Card>
          <Card className="p-6 border-2 bg-green-50">
            <div className="flex items-center justify-between mb-2">
              <Package className="size-8 text-green-600" />
              <span className="text-3xl font-bold text-gray-900">{stats.availableTickets}</span>
            </div>
            <p className="text-sm text-gray-600">Available</p>
          </Card>
          <Card className="p-6 border-2 bg-purple-50">
            <div className="flex items-center justify-between mb-2">
              <Package className="size-8 text-purple-600" />
              <span className="text-3xl font-bold text-gray-900">{stats.soldTickets}</span>
            </div>
            <p className="text-sm text-gray-600">Sold</p>
          </Card>
          <Card className="p-6 border-2 bg-blue-50">
            <div className="flex items-center justify-between mb-2">
              <IndianRupee className="size-8 text-blue-600" />
              <span className="text-3xl font-bold text-gray-900">{stats.totalEarnings}</span>
            </div>
            <p className="text-sm text-gray-600">Total Earnings</p>
          </Card>
        </div>

        <Tabs defaultValue="tickets" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="tickets" className="gap-2">
                <Package className="size-4" />
                My Tickets
                {myTickets.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{myTickets.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="earnings" className="gap-2">
                <IndianRupee className="size-4" />
                Earnings
              </TabsTrigger>
            </TabsList>
            <Button onClick={() => setShowUploadDialog(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 size-4" />
              Upload New Ticket
            </Button>
          </div>

          {/* My Tickets Tab */}
          <TabsContent value="tickets" className="space-y-6">
            <div>
              {myTickets.length === 0 ? (
                <Card className="p-12 text-center border-2">
                  <Upload className="size-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">You haven't uploaded any tickets yet</p>
                  <p className="text-sm text-gray-500 mt-2">Click "Upload New Ticket" to get started</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {myTickets.map((ticket) => (
                    <Card key={ticket.id} className="p-6 border-2 shadow-md">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-lg text-gray-900">{ticket.trainName}</h4>
                          <p className="text-sm text-gray-600">Train #{ticket.trainNumber}</p>
                        </div>
                        <div className="text-right space-y-2">
                          {getStatusBadge(ticket.status)}
                          <Badge variant="secondary" className="block">{ticket.class}</Badge>
                        </div>
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

                        {ticket.status === 'BOOKED' && ticket.buyerName && (
                          <div className="pt-3 border-t bg-purple-50 rounded-lg p-3">
                            <p className="text-sm font-semibold text-gray-900 mb-1">Buyer Information:</p>
                            <p className="text-sm text-gray-600">{ticket.buyerName}</p>
                            <p className="text-sm text-gray-600">{ticket.buyerPhone}</p>
                          </div>
                        )}
                      </div>

                      {ticket.status === 'PENDING' && (
                        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <p className="text-sm text-yellow-800">
                            ⏳ Waiting for admin verification
                          </p>
                        </div>
                      )}

                      {ticket.status === 'REJECTED' && (
                        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                          <p className="text-sm text-red-800">
                            ❌ Ticket was rejected by admin
                          </p>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-6">
            <div>
              <h3 className="font-bold text-xl text-gray-900 mb-4">
                Transaction History ({myTransactions.length})
              </h3>
              {myTransactions.length === 0 ? (
                <Card className="p-12 text-center border-2">
                  <IndianRupee className="size-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No earnings yet</p>
                  <p className="text-sm text-gray-500 mt-2">Upload tickets to start earning</p>
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
                          <p className="text-sm text-gray-600 mb-1">
                            Buyer: {txn.buyerName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(txn.createdAt).toLocaleString()} | Ref: {txn.transactionRef}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-xl font-bold text-green-600">
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

      {/* Upload Ticket Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload Train Ticket</DialogTitle>
            <DialogDescription>
              Fill in the ticket details to upload for sharing
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Ticket Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pnr">PNR Number *</Label>
                <Input
                  id="pnr"
                  placeholder="10-digit PNR"
                  value={uploadData.pnrNumber}
                  onChange={(e) => setUploadData({ ...uploadData, pnrNumber: e.target.value })}
                  maxLength={10}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="train-number">Train Number *</Label>
                <Input
                  id="train-number"
                  placeholder="e.g., 12301"
                  value={uploadData.trainNumber}
                  onChange={(e) => setUploadData({ ...uploadData, trainNumber: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="train-name">Train Name *</Label>
              <Input
                id="train-name"
                placeholder="e.g., Rajdhani Express"
                value={uploadData.trainName}
                onChange={(e) => setUploadData({ ...uploadData, trainName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source">Source Station *</Label>
                <Input
                  id="source"
                  placeholder="e.g., New Delhi"
                  value={uploadData.source}
                  onChange={(e) => setUploadData({ ...uploadData, source: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destination Station *</Label>
                <Input
                  id="destination"
                  placeholder="e.g., Mumbai Central"
                  value={uploadData.destination}
                  onChange={(e) => setUploadData({ ...uploadData, destination: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="journey-date">Journey Date *</Label>
                <Input
                  id="journey-date"
                  type="date"
                  value={uploadData.journeyDate}
                  onChange={(e) => setUploadData({ ...uploadData, journeyDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="departure-time">Departure Time *</Label>
                <Input
                  id="departure-time"
                  type="time"
                  value={uploadData.departureTime}
                  onChange={(e) => setUploadData({ ...uploadData, departureTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="arrival-time">Arrival Time *</Label>
                <Input
                  id="arrival-time"
                  type="time"
                  value={uploadData.arrivalTime}
                  onChange={(e) => setUploadData({ ...uploadData, arrivalTime: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="seat-number">Seat Number *</Label>
                <Input
                  id="seat-number"
                  placeholder="e.g., A1-45"
                  value={uploadData.seatNumber}
                  onChange={(e) => setUploadData({ ...uploadData, seatNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Class *</Label>
                <Select
                  value={uploadData.class}
                  onValueChange={(value: any) => setUploadData({ ...uploadData, class: value })}
                >
                  <SelectTrigger id="class">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sleeper">Sleeper</SelectItem>
                    <SelectItem value="3A">3A (AC Three Tier)</SelectItem>
                    <SelectItem value="2A">2A (AC Two Tier)</SelectItem>
                    <SelectItem value="1A">1A (AC First Class)</SelectItem>
                    <SelectItem value="CC">CC (Chair Car)</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="original-price">Original Price (₹)</Label>
                <Input
                  id="original-price"
                  type="number"
                  placeholder="Optional"
                  value={uploadData.originalPrice}
                  onChange={(e) => setUploadData({ ...uploadData, originalPrice: e.target.value })}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="selling-price">Your Selling Price (₹) *</Label>
                <Input
                  id="selling-price"
                  type="number"
                  placeholder="Enter price"
                  value={uploadData.price}
                  onChange={(e) => setUploadData({ ...uploadData, price: e.target.value })}
                  min="0"
                />
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> Your ticket will be reviewed by our admin team before it becomes available for buyers. 
                This usually takes 1-2 hours.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)} disabled={isUploading}>
              Cancel
            </Button>
            <Button onClick={handleUploadTicket} disabled={isUploading} className="bg-blue-600 hover:bg-blue-700">
              {isUploading ? 'Uploading...' : 'Upload Ticket'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

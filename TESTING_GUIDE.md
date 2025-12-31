# 🚀 Quick Start Guide - TicketShare Platform

## How to Test the Application

### Step 1: Initial Load
When you first open the application, you'll see the **Landing Page** with:
- Hero section explaining the platform
- Statistics (1000+ tickets shared)
- "How It Works" sections for both sellers and buyers
- Key features and benefits
- Call-to-action buttons

### Step 2: Demo Accounts Available

The platform comes with 3 pre-configured demo accounts:

#### 1️⃣ Buyer Account (Priya Sharma)
```
Email: priya@example.com
Password: buyer123
Initial Wallet: ₹5000
```
**What you can do:**
- Search for available tickets
- Filter by route, date, class
- Book tickets and add passenger details
- View your booked tickets
- Check transaction history

#### 2️⃣ Seller Account (Rajesh Kumar)
```
Email: rajesh@example.com
Password: seller123
Initial Wallet: ₹1500
Has 3 demo tickets uploaded
```
**What you can do:**
- Upload new train tickets
- View your uploaded tickets and their status
- Track earnings from sold tickets
- See transaction history

#### 3️⃣ Admin Account
```
Email: admin@ticketshare.com
Password: admin123
```
**What you can do:**
- Verify pending tickets
- View all platform tickets
- Manage users (block/unblock)
- View all transactions
- See platform statistics

---

## 🎯 Complete Testing Workflow

### Scenario 1: Complete Ticket Lifecycle

#### A. As Seller (Upload Ticket)
1. Click "Get Started" on landing page
2. Go to "Login" tab
3. Login as: `rajesh@example.com` / `seller123`
4. Click "Upload New Ticket" button
5. Fill in ticket details:
   - PNR: 1234567890
   - Train Number: 12345
   - Train Name: Shatabdi Express
   - Source: Delhi
   - Destination: Agra
   - Journey Date: (select future date)
   - Departure Time: 06:00
   - Arrival Time: 08:00
   - Seat Number: A1-10
   - Class: CC (Chair Car)
   - Selling Price: 500
6. Click "Upload Ticket"
7. ✅ **Result**: Ticket uploaded with "PENDING" status

#### B. As Admin (Verify Ticket)
1. Logout from seller account
2. Login as: `admin@ticketshare.com` / `admin123`
3. You'll see "Pending Verification" tab with your uploaded ticket
4. Click "Verify" button on the ticket
5. Review details and click "Approve"
6. ✅ **Result**: Ticket status changes to "AVAILABLE"

#### C. As Buyer (Book Ticket)
1. Logout from admin account
2. Login as: `priya@example.com` / `buyer123`
3. Go to "Search Tickets" tab
4. You'll see the newly approved ticket in available tickets
5. Click "Book This Ticket"
6. Fill passenger details:
   - Name: Priya Sharma
   - Age: 28
   - Gender: Female
   - Payment Method: Wallet
7. Click "Confirm Booking"
8. ✅ **Result**: 
   - Ticket booked successfully
   - ₹500 deducted from buyer's wallet (₹5000 → ₹4500)
   - ₹500 added to seller's wallet (₹1500 → ₹2000)
   - Transaction recorded

#### D. Verify Results
**As Buyer:**
- Go to "My Tickets" tab → See your booked ticket with passenger details
- Go to "Transactions" tab → See the payment record

**As Seller (Login again):**
- See ticket status changed to "BOOKED"
- Check wallet balance increased
- View transaction in "Earnings" tab

**As Admin (Login again):**
- Go to "Transactions" tab → See the completed transaction
- Check updated platform statistics

---

## 🧪 Quick Test Scenarios

### Test 1: Register New User
1. Click "Get Started"
2. Go to "Register" tab
3. Fill details:
   - Name: Your Name
   - Email: test@example.com
   - Phone: 9876543210
   - Password: test123
   - Confirm Password: test123
   - Role: Buyer or Seller
4. Click "Create Account"
5. ✅ You're logged in automatically

### Test 2: Search & Filter Tickets
1. Login as Buyer
2. Use search filters:
   - From: Mumbai
   - To: Delhi
   - Try different classes
3. Click "Search"
4. ✅ See filtered results

### Test 3: Admin User Management
1. Login as Admin
2. Go to "Users" tab
3. See list of all users
4. Click "Block" on any non-admin user
5. Logout and try logging in as that user
6. ✅ You'll see "Account blocked" message
7. Login as admin again and "Unblock" the user

### Test 4: Seller Dashboard
1. Login as Seller
2. View dashboard statistics:
   - Total Tickets
   - Pending Tickets
   - Available Tickets
   - Sold Tickets
   - Total Earnings
3. View "My Tickets" with different statuses
4. Check "Earnings" tab for transaction history

---

## 🎨 UI Features to Notice

### Landing Page
- Professional gradient background
- Animated hover effects on cards
- Responsive grid layouts
- Call-to-action buttons
- Footer with links

### Authentication
- Tabbed interface (Login/Register)
- Form validation with error messages
- Password confirmation
- Role selection with visual cards
- Demo credentials displayed

### Dashboards
- Sticky headers with user info
- Real-time wallet balance
- Statistics cards with icons
- Color-coded status badges
- Responsive tables
- Modal dialogs for actions

### Ticket Cards
- Clean card layouts
- Status badges (color-coded)
- Price display with currency symbol
- Route visualization (→)
- Time and date formatting
- Class badges

---

## 💡 Tips for Best Experience

1. **Test in sequence**: Start with viewing demo tickets as buyer, then switch to seller to upload, then admin to verify
2. **Watch wallet balances**: They update in real-time after transactions
3. **Check all tabs**: Each dashboard has multiple tabs with different functionalities
4. **Try filtering**: Use the search filters on buyer dashboard
5. **Verify tickets**: As admin, verify seller's tickets to make them available
6. **Mobile view**: Try resizing the browser to see responsive design

---

## 🐛 Known Behaviors (Not Bugs)

1. **LocalStorage Data**: All data persists in browser localStorage
2. **Demo Tickets**: Pre-loaded with 3 sample tickets
3. **Instant Transactions**: Payments process immediately (simulated)
4. **No Email/SMS**: Notifications shown as toast messages only
5. **Date Validation**: You can upload tickets with any future date

---

## 🔄 Reset Data

To reset all data to initial state:
1. Open browser console (F12)
2. Type: `localStorage.clear()`
3. Press Enter
4. Refresh the page
5. ✅ All data reset to demo accounts and tickets

---

## 📊 What to Showcase in Demo

### For Teachers/Evaluators:
1. **Full User Journey**: Show complete flow from ticket upload to booking
2. **Role-Based Access**: Demonstrate three different user types
3. **Admin Controls**: Show verification and user management
4. **Payment System**: Demonstrate wallet transactions
5. **Responsive Design**: Show mobile and desktop views
6. **Clean Code**: Explain the service layer architecture

### Key Talking Points:
- ✅ **Solves Real Problem**: Ticket wastage in Indian Railways
- ✅ **Complete Solution**: Not just UI, but full business logic
- ✅ **Security**: Role-based access, admin verification
- ✅ **Scalability**: Service-oriented architecture
- ✅ **User Experience**: Clean, intuitive interface
- ✅ **Production-Ready**: Error handling, validation, feedback

---

## 🎓 Viva Questions & Answers

**Q: How does authentication work?**
A: We use JWT-based authentication stored in localStorage. When a user logs in, a token is generated and stored, which is validated on each request.

**Q: Where is the data stored?**
A: Currently in browser localStorage simulating a database. In production, this would be MongoDB with proper backend APIs.

**Q: How do you prevent fraud?**
A: Admin verification of all tickets, user blocking capability, transaction tracking, and status management.

**Q: Can you add real payment gateway?**
A: Yes, the architecture supports integration with Razorpay or Stripe. The payment flow is already designed for it.

**Q: Is it scalable?**
A: Yes, the service layer architecture separates concerns. Can easily migrate to real backend with minimal changes to UI.

---

**Happy Testing! 🚂**

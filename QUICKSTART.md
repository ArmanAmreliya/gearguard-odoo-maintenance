# 🚀 GearGuard - Quick Start Guide

Welcome to **GearGuard**, the production-grade maintenance management system. This guide will get you up and running in minutes.

## ⚡ 5-Minute Setup

### 1. Install Dependencies
```bash
pnpm install
# or
npm install
```

### 2. Setup Database
```bash
# Create SQLite database and run migrations
npx prisma migrate dev --name init

# Seed with demo data
pnpm run seed
```

### 3. Start Development Server
```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Demo Accounts

Use these credentials to test different roles:

### Admin Account
- **Email**: `admin@example.com`
- **Password**: `Admin123!`
- **Access**: Full system access, all settings

### Technician Account
- **Email**: `tech@example.com`
- **Password**: `Tech123!`
- **Access**: View/manage assigned requests, equipment

### Regular User
- **Email**: `user@example.com`
- **Password**: `User123!`
- **Access**: Create and view own requests

## 📋 What You Can Do

### Dashboard
- View maintenance request statistics
- Check pending, in-progress, and completed items
- See equipment health overview
- Quick access to all major features

### Maintenance Requests
- Create new maintenance requests
- Assign to technicians
- Track status (NEW → IN_PROGRESS → COMPLETED)
- Set scheduled dates and duration
- Three request types: Preventive, Corrective, Emergency

### Equipment Management
- Register equipment with serial numbers
- Track warranty dates
- Assign to maintenance teams
- Monitor health status
- Archive or scrap equipment

### Analytics & Reports
- View 4 interactive charts:
  - Monthly maintenance volume
  - Cost trends
  - Equipment health distribution
  - Response time trends
- Export data as CSV or Excel
- Generate team performance reports
- Equipment health assessment

### Notifications
- Real-time notification system
- Notification types:
  - Overdue alerts
  - Due-soon warnings
  - Assignment notifications
  - Completion confirmations
- Customize notification preferences
- Email integration (optional)
- Quiet hours configuration

### Teams
- Create maintenance teams
- Assign technicians
- Track team performance
- View team-specific requests

## ⚙️ Configuration

### Email Integration (Optional)

To enable email notifications, update `.env.local`:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@gearguard.com
```

**For Gmail:**
1. Enable 2-Factor Authentication
2. Create an [App Password](https://myaccount.google.com/apppasswords)
3. Use the generated password above

### Timezone Settings

Go to **Settings** (Admin only) → **Timezone & Date Format** to configure:
- Default timezone (UTC, EST, CST, MST, PST)
- Date format (MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD)

## 🎯 Key Features

### Notification System
- **Bell icon** in header shows unread notifications
- Click to see all notifications with type indicators
- Mark as read, delete, or mark all as read
- Preferences: Email toggles, push settings, frequency, quiet hours

### Analytics Dashboard
- **4 Interactive Charts** with dark theme
- **Key Metrics** with trending indicators
- **Real-time Data** calculation
- **Responsive Design** works on all screens

### Reports & Export
- **CSV Export** for spreadsheet analysis
- **Excel Export** with formatting and multiple sheets
- **Summary Report** with statistics
- **Team Performance** metrics
- **Equipment Health** assessment

### System Settings (Admin Only)
- **General Settings**: Organization info, timezone
- **Email Configuration**: SMTP setup and testing
- **Integrations**: Slack, Teams, Jira, Google Drive
- **Data Management**: Backups, retention policies
- **Security**: 2FA, session timeout, audit logs

## 📱 Navigation

### Main Menu (Hamburger Icon)
- 📊 Dashboard
- 📦 Equipment
- 📋 Requests
- 👥 Teams
- 📈 Analytics
- 📄 Reports
- 🔔 Notifications (settings)
- ⚙️ Settings (Admin only)
- 🔐 Admin Panel (Admin only)

### Quick Actions
- **New Request** button: Create maintenance request
- **Refresh** button: Update dashboard data
- **Notification Bell**: View and manage notifications

## 🎨 Customization

### Dark Theme
GearGuard uses a dark theme by default (perfect for 24/7 operations).

Color scheme:
- **Primary**: Teal & Green gradients
- **Background**: Dark Slate
- **Accent**: Blue, Orange, Red (status-dependent)

To adjust theme colors, edit `lib/utils.ts` and Tailwind config.

### Layout
- **Responsive**: Works on desktop, tablet, mobile
- **Collapsible Sidebar**: More screen space
- **Modal Dialogs**: Focused data entry

## 🔍 Common Tasks

### Create a Maintenance Request
1. Click **New Request** button
2. Fill in details:
   - Equipment to maintain
   - Request type (Preventive/Corrective/Emergency)
   - Assign to technician
   - Set scheduled date
3. Click **Create**

### View Analytics
1. Click menu (hamburger icon)
2. Select **Analytics**
3. See 4 charts with real-time data
4. Metrics auto-calculate

### Export Data
1. Click menu → **Reports**
2. Select report type
3. Choose date range
4. Select format (CSV/Excel)
5. Click **Download Report**

### Manage Notifications
1. Click menu → **Notifications**
2. Toggle email alerts for:
   - Overdue items
   - Due soon items
   - Completed items
   - Assigned items
3. Set frequency (Immediate/Daily/Weekly)
4. Configure quiet hours
5. Click **Save**

## 🐛 Troubleshooting

### Database Issues
```bash
# Reset database
rm prisma/dev.db

# Recreate
npx prisma migrate dev --name init
pnpm run seed
```

### Port Already In Use
```bash
# Run on different port
pnpm run dev -- -p 3001
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Email Not Sending
- Check `.env.local` has correct SMTP credentials
- Go to Settings → Email Configuration
- Click "Test Email Configuration"
- Check spam folder
- Ensure app password (not regular password) for Gmail

## 📚 Documentation

For detailed information, see:
- `README.md` - Project overview
- `IMPLEMENTATION.md` - Feature documentation
- `prisma/schema.prisma` - Database schema

## 🆘 Getting Help

### Common Issues

**Q: How do I reset a user's password?**
A: Use Admin Panel → Users → Reset Password

**Q: Can I delete a maintenance request?**
A: Yes, from the request details or list view

**Q: How do I export team performance?**
A: Reports → Team Performance → Download

**Q: Why isn't email working?**
A: Check email settings in Settings → Email Configuration

## 🚀 Production Deployment

Before deploying to production:

1. **Environment Variables**
   ```bash
   # Use strong credentials
   EMAIL_PASSWORD=secure-app-password
   DATABASE_URL=production-database-url
   ```

2. **Database**
   ```bash
   # Run migrations
   npx prisma migrate deploy
   ```

3. **Build**
   ```bash
   pnpm run build
   pnpm start
   ```

4. **Security**
   - Enable 2FA for admin accounts
   - Set appropriate session timeout
   - Configure CORS for API
   - Use HTTPS in production

## 📞 Support

For issues, questions, or feature requests:
- Check existing documentation
- Review error messages in console
- Test with demo accounts first
- Check `.env.local` configuration

---

**Ready to manage maintenance like a pro? Let's go! 🚀**

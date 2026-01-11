# SafeAlert - Emergency Response System

A comprehensive IoT-enabled emergency response web application with GPS tracking, offline data storage, emergency categorization, and real-time alert transmission.

## Features

### User Application
- **Sign Up & Login**: Secure authentication system
- **Emergency Panel**: 6 emergency categories (Crime/Threat, Medical, Fire, Accident, Natural Disaster, Home Emergency)
- **GPS Tracking**: Real-time location tracking with accuracy monitoring
- **Contact Management**: Add and manage emergency contacts
- **Alert History**: View all past emergency alerts with filtering
- **Offline Support**: Local data caching with automatic sync when online

### Responder Dashboard
- **Real-time Alert Monitoring**: Live feed of all emergency alerts
- **Map Visualization**: Geographic view of all alerts
- **Statistics & Analytics**: Comprehensive charts and performance metrics
- **Alert Management**: Mark alerts as resolved or cancelled
- **Quick Actions**: Navigate to location, call users directly

## Demo Credentials

### User Account
1. Go to `/signup` to create a new user account
2. Fill in your details and create an account
3. Use those credentials to log in at `/login`

### Responder Portal
- Email: `responder@safealert.com`
- Password: `responder123`
- Access at: `/responder/login`

## Emergency Categories

1. **Crime/Threat** - Robbery, assault, or threatening situation
2. **Medical Emergency** - Health crisis, injury, medical assistance
3. **Fire** - Fire outbreak or smoke detection
4. **Accident** - Vehicle accident or collision
5. **Natural Disaster** - Earthquake, flood, or natural calamity
6. **Home Emergency** - Break-in, gas leak, or home safety issue

## Technical Features

### GPS Integration
- Real-time location tracking using browser Geolocation API
- Accuracy monitoring (Excellent/Good/Fair/Poor)
- Location caching for offline access
- Auto-refresh every 30 seconds

### Offline Capability
- LocalStorage for data persistence
- Offline alert queuing
- Automatic sync when connection restored
- Cached location history

### Data Storage
- User profiles and authentication
- Emergency contacts
- Alert history with full details
- Location cache (last 10 locations)

## How It Works

1. **User Registration**: Users sign up with personal details
2. **Add Emergency Contacts**: Users add trusted contacts to notify
3. **Emergency Occurs**: User selects appropriate emergency category
4. **Alert Sent**: 
   - Current GPS location captured
   - Alert sent to all emergency contacts
   - Alert queued for responders
   - Alert saved to history
5. **Responder Action**:
   - Responders see alert in real-time
   - View location on map
   - Navigate to scene
   - Mark as resolved when handled

## Browser Permissions

For full functionality, please allow:
- **Location Access**: Required for GPS tracking
- **Notifications**: (Optional) For alert updates

## Mobile Optimization

This web application is fully responsive and optimized for mobile devices. You can:
- Add to home screen for app-like experience
- Use on any device with a modern browser
- Access all features on mobile, tablet, or desktop

## Privacy & Security

**Note**: This is a demonstration system. In production:
- Use proper authentication (OAuth, JWT)
- Encrypt sensitive data
- Implement proper database (not localStorage)
- Add server-side validation
- Use HTTPS only
- Implement rate limiting
- Add GDPR compliance

**Do not use for collecting PII or securing sensitive data without proper security measures.**

## Technology Stack

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS v4
- **Routing**: React Router
- **Charts**: Recharts
- **Icons**: Lucide React
- **Maps**: Google Maps Embed API
- **Storage**: Browser LocalStorage (demo only)

## Future Enhancements

- Backend integration with Supabase or Firebase
- Real-time WebSocket notifications
- SMS/Email alert integration
- IoT panic button device integration
- Advanced analytics and reporting
- Multi-language support
- Voice command activation
- Wearable device integration

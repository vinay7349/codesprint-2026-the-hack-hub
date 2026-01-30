# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

### Added
- Initial release of SankatMitra Disaster Alert System
- Real-time alert reporting with AI severity classification
- Live alerts dashboard with Socket.IO integration
- Emergency action guidelines by disaster type (Flood, Cyclone, Earthquake, Fire, General)
- Smart evacuation route calculator (SankatMitra)
- Area risk monitoring dashboard
- Admin dashboard with statistics
- PWA support with service worker and notifications
- Auto-location detection using browser Geolocation API
- Rate limiting (1 alert per 10 seconds per IP)
- Modern responsive UI with sidebar navigation
- Browser notifications for new alerts
- MongoDB integration for alert storage
- Flask-SocketIO for real-time updates

### Features
- **Live Alerts**: Real-time community-reported disaster alerts
- **Emergency Actions**: Categorized safety guidelines with expandable accordion
- **Smart Evacuation**: Safe route calculation avoiding flooded roads and traffic
- **Area Risk Monitoring**: Risk assessment by geographic area
- **Admin Dashboard**: Comprehensive statistics and alert management

### Technical Stack
- Frontend: React 18, React Router, Socket.IO Client
- Backend: Flask 3.0, Flask-SocketIO, MongoDB, Flask-CORS
- PWA: Service Worker, Web App Manifest

---

## [Unreleased]

### Planned
- User authentication and accounts
- Email notifications
- SMS alerts integration
- Map visualization for alerts
- Multi-language support
- Advanced filtering and search
- Export alerts to PDF/CSV
- Mobile app (React Native)

---

[1.0.0]: https://github.com/yourusername/sankatmitra/releases/tag/v1.0.0


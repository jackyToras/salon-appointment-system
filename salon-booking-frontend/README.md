# Salon Booking System - Frontend

A modern React + TypeScript frontend for a microservices-based salon booking system. Built with Vite, Tailwind CSS, and Zustand for state management.

## 🚀 Features

- **Modern Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS
- **Role-Based Access**: Customer, Salon Owner, and Admin dashboards
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **State Management**: Zustand for efficient state management
- **API Integration**: Axios with interceptors for seamless backend communication
- **Protected Routes**: Route guards based on user roles
- **Production Ready**: Optimized build with Vite

## 📋 Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components
│   └── layout/          # Layout components
├── pages/
│   ├── auth/           # Login, Register
│   ├── customer/       # Customer dashboard
│   ├── salon/          # Salon owner dashboard
│   ├── admin/          # Admin dashboard
│   ├── HomePage.tsx
│   ├── SalonsPage.tsx
│   └── SalonDetailsPage.tsx
├── services/           # API client
├── store/              # Zustand stores
├── types/              # TypeScript interfaces
├── styles/             # Global styles
├── App.tsx            # Main app component
└── main.tsx           # Entry point
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd salon-booking-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure API URL** (if needed)
   Edit `.env`:
   ```
   VITE_API_BASE_URL=http://localhost:8080
   VITE_API_GATEWAY_URL=http://localhost:8765
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   The app will open at `http://localhost:5173`

## 🏗️ Architecture

### Components
- **Navbar**: Navigation with role-based links
- **Footer**: Site footer with links
- **SalonCard**: Display salon information
- **ServiceCard**: Display service details
- **BookingCard**: Display booking information
- **ProtectedRoute**: Route guard component

### State Management (Zustand)
- **authStore**: User authentication state
- **salonStore**: Salon and services data
- **bookingStore**: Bookings data and operations

### Services
- **apiClient**: Centralized API communication with axios

## 📱 Pages

### Public Pages
- `/` - Home page with featured salons
- `/salons` - Browse all salons with search
- `/salons/:id` - Salon details and services

### Auth Pages
- `/login` - Customer/Salon owner login
- `/register` - New user registration

### Customer Routes
- `/customer/dashboard` - View bookings and stats
- `/customer/bookings` - Manage bookings

### Salon Owner Routes
- `/salon/dashboard` - Manage services and bookings

### Admin Routes
- `/admin/dashboard` - View all users, salons, and bookings

## 🔄 API Integration

The frontend expects the backend to provide these endpoints:

### Auth
- `POST /auth/login` - Login user
- `POST /auth/register` - Register new user

### Salons
- `GET /salons` - Get all salons
- `GET /salons/:id` - Get salon details
- `GET /salons/:id/services` - Get salon services

### Bookings
- `POST /bookings` - Create booking
- `GET /bookings/my` - Get user's bookings
- `GET /bookings/:id` - Get booking details
- `PUT /bookings/:id/cancel` - Cancel booking

### Admin
- `GET /admin/users` - Get all users
- `GET /admin/salons` - Get all salons
- `GET /admin/bookings` - Get all bookings

## 🎨 Styling

Built with **Tailwind CSS** for rapid UI development:
- Responsive grid system
- Custom color scheme
- Smooth transitions and animations
- Dark mode ready

## 🔐 Security Features

- JWT token-based authentication
- Protected routes with role-based access
- Token stored securely in localStorage
- Automatic logout on 401 response
- CSRF protection ready

## 📦 Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

## 🧪 Development

### Hot Reload
Vite provides instant hot module reload during development for a smooth experience.

### Type Safety
Full TypeScript support with type definitions for all API responses and components.

### Linting
```bash
npm run lint
```

## 📚 Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI library |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| Tailwind CSS | Styling |
| Zustand | State management |
| Axios | HTTP client |
| React Router | Client-side routing |

## 🐛 Troubleshooting

### Port Already in Use
If port 5173 is already in use:
```bash
npm run dev -- --port 3000
```

### API Connection Issues
- Check `.env` file has correct API URL
- Ensure backend is running on the specified port
- Check browser console for CORS errors

### Build Issues
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📄 License

MIT License - feel free to use this project for your portfolio

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

**Made with ❤️ for your resume**

# Wanderlust – React Frontend

A modern, responsive **React + Vite frontend** for Wanderlust, a full-stack property discovery and booking platform.

Wanderlust provides an Airbnb-inspired experience for discovering stays, viewing property details, creating listings, managing bookings, writing reviews, and managing host profiles.

The frontend communicates with a secure **Spring Boot REST API** using Axios and JWT authentication.

---

## Project Description

**Wanderlust** is a full-stack travel and property booking application where users can discover stays, view detailed property information, book available properties, and manage their own listings.

### Frontend responsibilities

- Responsive React user interface
- Property discovery and browsing
- Search, filtering and sorting
- Property details and image gallery
- User registration and login
- JWT authentication handling
- Property creation and management
- Multiple property image uploads
- Booking management
- Host booking management
- Reviews and ratings
- Host profiles
- Profile photo upload
- Responsive mobile navigation
- Active navbar highlighting
- Form validation
- Loading and error states

---

## Technology Stack

| Technology | Purpose |
|---|---|
| React | UI development |
| Vite | Development/build tool |
| JavaScript | Application logic |
| React Router | Client-side routing |
| Axios | REST API communication |
| CSS | Responsive styling |
| LocalStorage | JWT/user session persistence |
| Spring Boot | Backend REST API |
| Cloudinary | Image hosting |

---

## Architecture

```text
User
  |
  v
React UI
  |
  +-- Components
  +-- Pages
  +-- React Router
  +-- Axios API Service
  |
  v
Spring Boot REST API
  |
  +-- MySQL
  +-- Cloudinary
```

The frontend never communicates directly with MySQL.

---

## Main Features

### Authentication

Users can:

- Register
- Login
- Logout
- Stay authenticated using JWT
- Access protected functionality
- Create properties after login
- Manage bookings
- Write eligible reviews

Authentication data is stored in:

```text
localStorage
```

---

## Registration

Registration supports:

- Full Name
- Email
- Phone
- About
- Password
- Confirm Password
- Profile Photo

Flow:

```text
Register Form
     |
     v
POST /api/auth/register
     |
     v
Account created
     |
     v
Login / JWT session
     |
     v
Profile photo upload
```

---

## Login

```http
POST /api/auth/login
```

The backend returns a JWT token.

```text
Login
  |
  v
Spring Boot
  |
  v
JWT
  |
  v
localStorage
  |
  v
Axios interceptor
  |
  v
Authorization: Bearer <token>
```

---

## Axios Configuration

The frontend uses a centralized Axios instance.

```javascript
const api = axios.create({
    baseURL: "http://localhost:8080/api"
});
```

The JWT is automatically attached to requests:

```javascript
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});
```

This avoids manually adding the token to every protected request.

---

## Navigation

Desktop navbar includes:

```text
Wanderlust
Explore
Stays
Become a Host
My Properties
Host Bookings
My Bookings
Login / Sign Up
Logout
```

The active page is highlighted using React Router `NavLink`.

On mobile, the desktop navigation changes into a menu button.

```text
Desktop:
Wanderlust | Explore | Stays | Become a Host | ...

Mobile:
Wanderlust                         ☰
```

---

## Responsive Design

The frontend is designed for:

- Desktop
- Laptop
- Tablet
- Mobile

Responsive features include:

- Mobile navbar
- Mobile menu
- Responsive property cards
- Responsive image gallery
- Responsive forms
- Responsive booking sections
- Responsive host profile
- Mobile-friendly buttons
- Flexible grids

---

## Home / Explore

The home page provides:

- Wanderlust branding
- Hero section
- Property discovery
- Navigation
- Responsive layout

Users can start exploring available stays from the home page.

---

## Properties

The properties page displays available stays.

Users can:

- Browse properties
- Search by location
- Filter by minimum price
- Filter by maximum price
- Filter by guests
- Sort by price
- Open property details

Examples:

```http
GET /api/properties
```

```http
GET /api/properties?location=Pune
```

```http
GET /api/properties?minPrice=2000&maxPrice=5000
```

```http
GET /api/properties?guests=4
```

```http
GET /api/properties?sort=priceAsc
```

Combined:

```http
GET /api/properties?location=Pune&minPrice=2000&maxPrice=5000&guests=4&sort=priceAsc
```

---

## Property Details

The property details page displays:

- Property title
- Location
- Price per night
- Maximum guests
- Full description
- Property image gallery
- Host information
- Reviews
- Ratings
- Booking section

### Image Gallery

Properties support multiple images.

```text
Main Image
     |
     v
Thumbnail 1 | Thumbnail 2 | Thumbnail 3 | ...
```

Clicking a thumbnail changes the main image.

The frontend uses the image URLs returned by the backend.

---

## About This Place

Long property descriptions use a **Show more / Show less** interaction.

```text
About this place

A beautiful property located near...
...
Show more
```

After expansion:

```text
About this place

Full property description...

Show less
```

---

## Create Property

Only authenticated users can create properties.

Route:

```text
/create-property
```

The form supports:

- Title
- Description
- Location
- Price per night
- Maximum guests
- Property images

Flow:

```text
Create Property Form
       |
       v
POST /api/properties
       |
       v
Property created
       |
       v
POST /api/properties/{id}/images
       |
       v
Images uploaded
       |
       v
Property details
```

Image validation includes:

```text
Image file only
Maximum 5 MB per image
```

The backend also independently enforces authentication and authorization.

---

## My Properties

Authenticated users can view their own listings.

```http
GET /api/properties/my
```

Users can:

- View properties
- Edit properties
- Delete properties
- Manage property images

---

## Booking

Users can select:

- Check-in date
- Check-out date
- Number of guests

Example:

```http
POST /api/bookings
```

```json
{
  "propertyId": 1,
  "checkIn": "2026-10-15",
  "checkOut": "2026-10-18",
  "guests": 2
}
```

The backend handles:

- Date validation
- Guest capacity
- Availability
- Overlapping bookings
- Price calculation
- Booking creation

---

## My Bookings

Users can view:

- Property
- Check-in
- Check-out
- Guests
- Total price
- Status
- Cancellation option

API:

```http
GET /api/bookings/my
```

Cancel:

```http
PATCH /api/bookings/{id}/cancel
```

---

## Host Bookings

Hosts can view bookings for their properties.

```http
GET /api/bookings/host
```

Information includes:

- Guest name
- Guest email
- Property
- Property image
- Check-in
- Check-out
- Guests
- Total price
- Status

Host cancellation:

```http
PATCH /api/bookings/{id}/host-cancel
```

---

## Reviews and Ratings

Property details display:

- Rating
- Comment
- Guest name
- Review date
- Average rating
- Review count

Create:

```http
POST /api/properties/{propertyId}/reviews
```

Example:

```json
{
  "rating": 5,
  "comment": "Excellent stay and beautiful property."
}
```

The backend verifies that the user has a confirmed booking before allowing a review.

---

## Host Profile

Host profile displays:

- Name
- Profile photo
- Email
- Phone
- About
- Hosting since
- Total properties
- Total reviews
- Average rating
- Host reviews
- Host properties

API:

```http
GET /api/hosts/{hostId}
```

Authenticated profile update:

```http
PUT /api/hosts/profile
```

Profile photo:

```http
POST /api/hosts/profile/photo
```

---

## Image Upload Flow

### Property images

```text
User selects images
       |
       v
React validation
       |
       v
FormData
       |
       v
Spring Boot
       |
       v
Cloudinary
       |
       v
Image URLs
       |
       v
MySQL PropertyImage
       |
       v
React Gallery
```

### Profile photo

```text
User selects photo
       |
       v
React validation
       |
       v
FormData
       |
       v
Spring Boot
       |
       v
Cloudinary
       |
       v
User profileImageUrl
       |
       v
Host Profile UI
```

---

## Route Structure

Main frontend routes:

```text
/
├── Home / Explore
├── /properties
├── /properties/:id
├── /create-property
├── /my-properties
├── /bookings
├── /host-bookings
├── /hosts/:hostId
├── /login
└── /register
```

---

## Project Structure

```text
src/
├── components/
│   ├── Navbar.jsx
│   └── Footer.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── Properties.jsx
│   ├── PropertyDetails.jsx
│   ├── CreateProperty.jsx
│   ├── MyProperties.jsx
│   ├── Bookings.jsx
│   ├── HostBookings.jsx
│   ├── HostProfile.jsx
│   ├── Login.jsx
│   └── Register.jsx
│
├── services/
│   └── api.js
│
├── App.jsx
├── main.jsx
└── index.css
```

---

## Authentication-Based UI

### Guest

```text
Explore
Stays
Login
Sign Up
```

### Logged-in user

```text
Explore
Stays
Become a Host
My Properties
Host Bookings
My Bookings
Hi, User
Logout
```

The navbar listens for authentication changes so it updates immediately after login/logout.

---

## Footer

A global footer is available across the application.

It contains sections for:

- Support
- Hosting
- Wanderlust
- Privacy
- Terms
- Contact email
- Language / region
- Social media

---

## API Data Flow

### Browse properties

```text
Properties.jsx
      |
      | GET /properties
      v
Axios
      |
      v
Spring Boot
      |
      v
MySQL
      |
      v
PropertyResponse[]
      |
      v
React Property Cards
```

### Create property

```text
CreateProperty.jsx
      |
      | POST /properties
      v
Spring Boot
      |
      v
Property created
      |
      | POST /properties/{id}/images
      v
Cloudinary
      |
      v
Property Details
```

### Booking

```text
PropertyDetails.jsx
      |
      | POST /bookings
      v
Spring Boot
      |
      v
Booking validation
      |
      v
MySQL
      |
      v
Booking response
      |
      v
React
```

### Review

```text
PropertyDetails.jsx
      |
      | POST /properties/{id}/reviews
      v
Spring Boot
      |
      v
Confirmed booking check
      |
      v
MySQL
      |
      v
Review response
      |
      v
React
```

---

## Error and Loading Handling

The frontend handles API errors and displays user-friendly feedback.

Examples:

```text
Unable to load properties
Invalid login credentials
Passwords do not match
Unable to create account
Booking failed
Image upload failed
Unauthorized action
```

Loading states include:

```text
Creating account...
Uploading...
Saving...
Loading...
```

---

## Mobile / Local Network Testing

To test the React application from a phone connected to the same Wi-Fi or mobile hotspot:

```bash
npm run dev -- --host 0.0.0.0
```

Then open:

```text
http://<PC-IP>:5173
```

The Spring Boot backend must also be reachable:

```text
http://<PC-IP>:8080
```

When testing from a phone, the frontend API URL must point to the computer's network IP instead of `localhost`.

Example:

```javascript
const api = axios.create({
    baseURL: "http://192.168.x.x:8080/api"
});
```

The exact IP depends on the current network.

---

## Environment Variables

For production, use a Vite environment variable for the backend URL.

`.env`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Axios:

```javascript
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
});
```

Production example:

```env
VITE_API_BASE_URL=https://your-backend-domain/api
```

Do not store private secrets in frontend environment variables because Vite variables are exposed to the browser.

---

## Installation

### Prerequisites

- Node.js
- npm
- Git

### Clone repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd frontend
```

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## Production Build

```bash
npm run build
```

Preview:

```bash
npm run preview
```

Build output:

```text
dist/
```

---

## Frontend ↔ Backend

The frontend is designed to work with the Wanderlust Spring Boot backend.

```text
Wanderlust Frontend
        |
        | REST / JSON / Multipart
        v
Wanderlust Spring Boot Backend
        |
        +---- MySQL
        |
        +---- Cloudinary
```

Backend APIs include:

```text
/api/auth
/api/properties
/api/bookings
/api/properties/{id}/reviews
/api/hosts
```

---

## Security Principle

Frontend UI restrictions improve user experience, but they are not the security boundary.

For example, the frontend can hide:

```text
Become a Host
```

for guests, but the backend must still reject:

```http
POST /api/properties
```

without a valid JWT.

Therefore:

```text
Frontend UI protection
        +
Backend authorization
        =
Proper application security
```

---

## Interview Concepts Demonstrated

This project demonstrates practical knowledge of:

### React

- Functional components
- `useState`
- `useEffect`
- `useRef`
- Conditional rendering
- Form handling
- File uploads
- `FormData`
- Component-based architecture

### React Router

- Routes
- Dynamic routes
- `Link`
- `NavLink`
- Active navigation
- Client-side navigation

### Axios

- Axios instances
- API services
- Request interceptors
- JWT headers
- Error handling

### JavaScript

- Async/await
- Promises
- Array methods
- Object handling
- LocalStorage
- Event listeners

### Responsive UI

- CSS media queries
- Mobile navigation
- Responsive grids
- Flexible layouts
- Mobile-friendly forms

---

## Future Improvements

Possible frontend enhancements:

- React Context for centralized authentication
- Global toast notifications
- Skeleton loaders
- Pagination
- Infinite scrolling
- Advanced date picker
- Calendar-based availability
- Wishlist/favorites
- Map integration
- Payment UI
- Image lightbox
- Accessibility improvements
- Dark mode
- Better form validation
- Lazy-loaded routes
- Production deployment
- Performance optimization

---

## Full-Stack Project

### Frontend

```text
React
Vite
JavaScript
React Router
Axios
CSS
```

### Backend

```text
Java
Spring Boot
Spring Security
JWT
JPA
Hibernate
MySQL
Cloudinary
```

### Testing

```text
JUnit
Mockito
Postman
```

---

## Author

**Shyam Lade**

Bachelor of Engineering – Artificial Intelligence & Data Science

Key technologies:

```text
React
Vite
JavaScript
Java
Spring Boot
Spring Security
JWT
Hibernate
JPA
MySQL
REST APIs
Cloudinary
Git
GitHub
```

---

## Project Summary

Wanderlust is a full-stack property booking platform with a responsive React frontend and secure Spring Boot backend.

The main user journey is:

```text
Discover Stays
      ↓
Search / Filter
      ↓
View Property
      ↓
View Images & Reviews
      ↓
Book Property
      ↓
Manage Bookings
      ↓
Become a Host
      ↓
Create & Manage Properties
      ↓
Manage Host Profile
```

The application combines a responsive React UI with JWT authentication, REST API integration, MySQL persistence, Cloudinary image storage, booking validation, reviews, host management, and mobile support.

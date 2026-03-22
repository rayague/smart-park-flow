export const en = {
  // Common
  common: {
    loading: "Loading...",
    error: "Error",
    success: "Success",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    search: "Search",
    filter: "Filter",
    close: "Close",
    back: "Back",
    next: "Next",
    previous: "Previous",
    submit: "Submit",
    confirm: "Confirm",
    viewAll: "View All",
    learnMore: "Learn More",
    getStarted: "Get Started",
    signIn: "Sign In",
    signUp: "Sign Up",
    signOut: "Sign Out",
    dashboard: "Dashboard",
    settings: "Settings",
    profile: "Profile",
    notifications: "Notifications",
    help: "Help",
    perHour: "/hour",
    spots: "spots",
    available: "available",
  },

  // Navigation
  nav: {
    features: "Features",
    parkings: "Parkings",
    pricing: "Pricing",
    about: "About",
    discover: "Discover",
    reservations: "Reservations",
    favorites: "Favorites",
    analytics: "Analytics",
    users: "Users",
    managers: "Managers",
    support: "Support",
    signIn: "Sign In",
    getStarted: "Create Account",
  },

  // Landing Page
  landing: {
    badge: "Now available in 50+ cities",
    heroTitle: "Parking Made",
    typingTexts: {
      smartParking: "Smarter",
      evCharging: "Faster",
      urbanMobility: "Simpler",
      easyBooking: "Effortless",
    },
    heroDescription: "Find, book, and pay for your spot in seconds. Join thousands of drivers who choose a smarter way to park.",
    startFree: "Start for Free",
    watchDemo: "Watch Demo",
    scrollToExplore: "Scroll to explore",
    heroSearchPlaceholder: "Find a city, an address or a parking name...",
    findParking: "Find Parking",

    // Features
    features: {
      realtime: "Real-time availability",
      evCharging: "EV charging stations",
      security: "24/7 Security",
      instant: "Instant booking",
    },

    // Stats
    stats: {
      activeUsers: "Active Users",
      parkings: "Parkings",
      uptime: "Uptime",
      rating: "Rating",
    },

    // Features Section
    featuresSection: {
      title: "Everything You Need",
      subtitle: "Powerful features to make your parking experience seamless and stress-free.",
      smartSearch: {
        title: "Smart Search",
        description: "Find available parking spots near your destination with AI-powered recommendations.",
      },
      evIntegration: {
        title: "EV Integration",
        description: "Access 500+ EV charging stations while you park. Charge smart, park smart.",
      },
      realTimeUpdates: {
        title: "Real-time Updates",
        description: "Get live availability updates and never circle the block again.",
      },
      securePayments: {
        title: "Secure Payments",
        description: "Pay seamlessly with multiple payment options. Your security is our priority.",
      },
      smartReservations: {
        title: "Smart Reservations",
        description: "Book in advance or on-the-go. Flexible cancellation and modification.",
      },
      analytics: {
        title: "Analytics & Insights",
        description: "Track your parking history, expenses, and environmental impact.",
      },
    },

    // Parkings Section
    parkingsSection: {
      title: "Featured Parkings",
      subtitle: "Discover premium parking locations with top-rated amenities.",
      evAvailable: "EV Available",
    },

    // Pricing Section
    pricingSection: {
      title: "Simple, Transparent Pricing",
      subtitle: "Choose the plan that fits your needs. No hidden fees.",
      monthly: "Monthly",
      yearly: "Yearly",
      popular: "Most Popular",
      free: {
        name: "Free",
        price: "$0",
        description: "Perfect for occasional parking",
        features: [
          "5 reservations/month",
          "Basic search",
          "Email support",
          "Standard parking spots",
        ],
      },
      pro: {
        name: "Pro",
        price: "$9.99",
        description: "For regular commuters",
        features: [
          "Unlimited reservations",
          "Priority EV stations",
          "24/7 support",
          "Premium spots access",
          "Parking history",
          "CO2 savings tracker",
        ],
      },
      business: {
        name: "Business",
        price: "$29.99",
        description: "For teams and fleets",
        features: [
          "Everything in Pro",
          "Team management",
          "Fleet analytics",
          "Dedicated account manager",
          "API access",
          "Custom integrations",
        ],
      },
      choosePlan: "Choose Plan",
      currentPlan: "Current Plan",
    },

    // Footer
    footer: {
      description: "The future of urban parking. Smart, sustainable, seamless.",
      quickLinks: "Quick Links",
      support: "Support",
      legal: "Legal",
      contact: "Contact",
      helpCenter: "Help Center",
      faq: "FAQ",
      terms: "Terms of Service",
      privacy: "Privacy Policy",
      cookies: "Cookie Policy",
      copyright: "All rights reserved.",
      madeWith: "Made with 💚 for sustainable mobility",
    },
  },

  // Auth
  auth: {
    login: {
      title: "Welcome Back",
      subtitle: "Sign in to your SmartPark account",
      email: "Email",
      password: "Password",
      rememberMe: "Remember me",
      forgotPassword: "Forgot password?",
      button: "Sign In",
      noAccount: "Don't have an account?",
      signUpLink: "Sign up",
    },
    register: {
      title: "Join the Network",
      subtitle: "Choose how you want to use SmartPark to begin.",
      name: "Full Name",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email Address",
      password: "Password",
      choosePassword: "Choose Password",
      passwordMinLength: "Minimum 8 characters with at least one number.",
      confirmPassword: "Confirm Password",
      role: "Account Type",
      roles: {
        user: "Driver",
        manager: "Owner",
      },
      personalDetails: "Personal Details",
      vehicleInfo: "Vehicle Info",
      licensePlate: "License Plate",
      professionalInfo: "Professional Info",
      companyName: "Company Name",
      phone: "Contact Phone",
      security: "Security",
      termsTitle: "Terms & Privacy",
      terms: "I agree to the Terms of Service and Privacy Policy.",
      button: "Create Account",
      hasAccount: "Already have an account?",
      signInLink: "Sign In",
      requiredFields: "All fields in this step are required",
      successTitle: "Welcome to SmartPark!",
      successSubtitle: "Your account has been created successfully. Redirecting you to your dashboard...",
      encrypted: "Protected by AES-256 encryption.",
    },
    errors: {
      invalidEmail: "Please enter a valid email",
      passwordLength: "Password must be at least 8 characters",
      passwordMismatch: "Passwords do not match",
      required: "This field is required",
    },
  },

  // Dashboard - User
  userDashboard: {
    welcome: "Welcome back",
    subtitle: "Here's what's happening with your parking today.",
    findParking: "Find Parking",

    stats: {
      totalReservations: "Total Reservations",
      hoursParked: "Hours Parked",
      co2Saved: "CO2 Saved",
      timeSaved: "Time Saved",
      totalSpent: "Total Spent",
      thisMonth: "This month",
    },

    sections: {
      parkingsNearYou: "Parkings Near You",
      viewMap: "View Map",
      activeReservations: "Active Reservations",
      recommendedParkings: "Recommended Parkings",
    },

    emptyReservations: {
      title: "No Active Reservations",
      description: "Find a parking spot near your destination and book instantly.",
    },

    vehicle: {
      title: "Add Your Vehicle",
      description: "Register your vehicle to enable automatic license plate recognition and faster entry.",
      button: "Register Vehicle",
    },

    evPromo: {
      badge: "EV Charging",
      title: "Charge While You Park",
      description: "Access over 500 EV charging stations across our network. Get 20% off your first charge with code SMARTEV.",
      button: "Find EV Stations",
    },

    navigation: {
      overview: "Overview",
      reservations: "My Reservations",
      findParking: "Find Parking",
      favorites: "Favorites",
      settings: "Settings",
    },
  },

  // Dashboard - Manager
  managerDashboard: {
    title: "Manager Dashboard",
    subtitle: "Overview of your parking facilities",

    stats: {
      totalRevenue: "Total Revenue",
      occupancyRate: "Occupancy Rate",
      activeBookings: "Active Bookings",
      evSessions: "EV Sessions",
      thisMonth: "This month",
      vsLastMonth: "vs last month",
    },

    sections: {
      revenueOverview: "Revenue Overview",
      occupancyHeatmap: "Occupancy Heatmap",
      recentBookings: "Recent Bookings",
      spotManagement: "Spot Management",
    },

    navigation: {
      overview: "Overview",
      parkings: "My Parkings",
      spots: "Manage Spots",
      analytics: "Analytics",
      settings: "Settings",
    },
  },

  // Dashboard - Admin
  adminDashboard: {
    title: "Admin Dashboard",
    subtitle: "Platform overview and management",

    stats: {
      totalUsers: "Total Users",
      totalManagers: "Total Managers",
      totalParkings: "Total Parkings",
      platformRevenue: "Platform Revenue",
      activeToday: "Active today",
      newThisWeek: "New this week",
    },

    sections: {
      platformOverview: "Platform Overview",
      userActivity: "User Activity",
      recentSignups: "Recent Signups",
      systemHealth: "System Health",
    },

    navigation: {
      overview: "Overview",
      users: "Users",
      managers: "Managers",
      parkings: "All Parkings",
      analytics: "Analytics",
      settings: "Settings",
    },

    actions: {
      addUser: "Add User",
      exportData: "Export Data",
      viewDetails: "View Details",
      suspend: "Suspend",
      activate: "Activate",
    },
  },

  // Booking
  booking: {
    title: "Book Your Spot",
    steps: {
      selectSpot: "Select Spot",
      dateTime: "Date & Time",
      details: "Details",
      confirm: "Confirm",
    },

    spotSelector: {
      title: "Select a Parking Spot",
      available: "Available",
      occupied: "Occupied",
      selected: "Selected",
      evCharging: "EV Charging",
      handicap: "Handicap",
      floor: "Floor",
    },

    dateTime: {
      title: "Select Date & Time",
      date: "Date",
      startTime: "Start Time",
      endTime: "End Time",
      duration: "Duration",
      hours: "hours",
    },

    details: {
      title: "Booking Details",
      vehiclePlate: "Vehicle Plate",
      vehicleType: "Vehicle Type",
      evCharging: "Need EV Charging?",
      notes: "Additional Notes",
    },

    summary: {
      title: "Booking Summary",
      parking: "Parking",
      spot: "Spot",
      date: "Date",
      time: "Time",
      duration: "Duration",
      subtotal: "Subtotal",
      serviceFee: "Service Fee",
      total: "Total",
      confirmBooking: "Confirm Booking",
    },

    confirmation: {
      title: "Booking Confirmed!",
      subtitle: "Your parking spot has been reserved",
      bookingId: "Booking ID",
      viewReservation: "View Reservation",
      backToHome: "Back to Home",
    },
  },

  // Discover
  discover: {
    title: "Discover Parkings",
    subtitle: "Find the perfect parking spot near you",
    searchPlaceholder: "Search by location, name...",

    filters: {
      title: "Filters",
      priceRange: "Price Range",
      evCharging: "EV Charging",
      availability: "Available Now",
      rating: "Minimum Rating",
      amenities: "Amenities",
      applyFilters: "Apply Filters",
      clearFilters: "Clear Filters",
    },

    results: {
      found: "parkings found",
      sortBy: "Sort by",
      distance: "Distance",
      price: "Price",
      rating: "Rating",
      availability: "Availability",
    },

    card: {
      from: "From",
      perHour: "/hr",
      spotsLeft: "spots left",
      book: "Book Now",
      viewDetails: "View Details",
    },
  },

  // Reservations
  reservations: {
    title: "My Reservations",
    subtitle: "Manage your parking reservations",

    tabs: {
      active: "Active",
      upcoming: "Upcoming",
      past: "Past",
      cancelled: "Cancelled",
    },

    status: {
      active: "Active",
      pending: "Pending",
      completed: "Completed",
      cancelled: "Cancelled",
    },

    actions: {
      extend: "Extend",
      cancel: "Cancel",
      viewDetails: "View Details",
      getDirections: "Get Directions",
    },

    empty: {
      title: "No reservations found",
      description: "Start by finding a parking spot",
      action: "Find Parking",
    },
  },

  // Settings
  settings: {
    title: "Settings",

    sections: {
      profile: "Profile",
      preferences: "Preferences",
      notifications: "Notifications",
      security: "Security",
      billing: "Billing",
    },

    profile: {
      title: "Profile Settings",
      name: "Full Name",
      email: "Email",
      phone: "Phone Number",
      avatar: "Profile Picture",
      updateProfile: "Update Profile",
    },

    preferences: {
      title: "Preferences",
      language: "Language",
      theme: "Theme",
      themes: {
        light: "Light",
        dark: "Dark",
        system: "System",
      },
      defaultView: "Default Map View",
      units: "Distance Units",
      unitOptions: {
        km: "Kilometers",
        miles: "Miles",
      },
    },

    notifications: {
      title: "Notification Settings",
      email: "Email Notifications",
      push: "Push Notifications",
      sms: "SMS Notifications",
      types: {
        bookingConfirmation: "Booking Confirmations",
        bookingReminders: "Booking Reminders",
        promotions: "Promotions & Offers",
        updates: "Platform Updates",
      },
    },

    security: {
      title: "Security Settings",
      changePassword: "Change Password",
      twoFactor: "Two-Factor Authentication",
      sessions: "Active Sessions",
      deleteAccount: "Delete Account",
    },
  },

  // Errors
  errors: {
    notFound: "Page Not Found",
    notFoundDescription: "The page you're looking for doesn't exist.",
    serverError: "Server Error",
    serverErrorDescription: "Something went wrong. Please try again later.",
    unauthorized: "Unauthorized",
    unauthorizedDescription: "You don't have permission to access this page.",
    goHome: "Go Home",
  },
}

export type Translations = typeof en

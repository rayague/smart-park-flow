import type { Translations } from './en'

export const fr: Translations = {
    // Common
    common: {
        loading: "Chargement...",
        error: "Erreur",
        success: "Succès",
        cancel: "Annuler",
        save: "Sauvegarder",
        delete: "Supprimer",
        edit: "Modifier",
        add: "Ajouter",
        search: "Rechercher",
        filter: "Filtrer",
        close: "Fermer",
        back: "Retour",
        next: "Suivant",
        previous: "Précédent",
        submit: "Soumettre",
        confirm: "Confirmer",
        viewAll: "Voir Tout",
        learnMore: "En Savoir Plus",
        getStarted: "Commencer",
        signIn: "Connexion",
        signUp: "Inscription",
        signOut: "Déconnexion",
        dashboard: "Tableau de Bord",
        settings: "Paramètres",
        profile: "Profil",
        notifications: "Notifications",
        help: "Aide",
        perHour: "/heure",
        spots: "places",
        available: "disponible",
    },

    // Navigation
    nav: {
        features: "Fonctionnalités",
        parkings: "Parkings",
        pricing: "Tarifs",
        about: "À Propos",
        discover: "Découvrir",
        reservations: "Réservations",
        favorites: "Favoris",
        analytics: "Statistiques",
        users: "Utilisateurs",
        managers: "Gestionnaires",
        support: "Support",
        signIn: "Se connecter",
        getStarted: "Démarrer",
    },

    // Landing Page
    landing: {
        badge: "Maintenant disponible dans 50+ villes",
        heroTitle: "L'Avenir du",
        typingTexts: {
            smartParking: "Parking Intelligent",
            evCharging: "Charge Électrique",
            urbanMobility: "Mobilité Urbaine",
            easyBooking: "Réservation Facile",
        },
        heroDescription: "Trouvez, réservez et payez des places de parking en quelques secondes. Rejoignez des milliers de conducteurs qui gagnent du temps avec notre plateforme intelligente.",
        startFree: "Commencer Gratuitement",
        watchDemo: "Voir la Démo",
        scrollToExplore: "Défiler pour explorer",

        // Features
        features: {
            realtime: "Disponibilité en temps réel",
            evCharging: "Bornes de recharge EV",
            security: "Sécurité 24/7",
            instant: "Réservation instantanée",
        },

        // Stats
        stats: {
            activeUsers: "Utilisateurs Actifs",
            parkings: "Parkings",
            uptime: "Disponibilité",
            rating: "Note",
        },

        // Features Section
        featuresSection: {
            title: "Tout Ce Dont Vous Avez Besoin",
            subtitle: "Des fonctionnalités puissantes pour une expérience de stationnement fluide et sans stress.",
            smartSearch: {
                title: "Recherche Intelligente",
                description: "Trouvez des places disponibles près de votre destination grâce à nos recommandations IA.",
            },
            evIntegration: {
                title: "Intégration VE",
                description: "Accédez à plus de 500 bornes de recharge pendant votre stationnement.",
            },
            realTimeUpdates: {
                title: "Mises à Jour en Temps Réel",
                description: "Recevez des mises à jour en direct et ne tournez plus jamais en rond.",
            },
            securePayments: {
                title: "Paiements Sécurisés",
                description: "Payez en toute simplicité avec plusieurs options. Votre sécurité est notre priorité.",
            },
            smartReservations: {
                title: "Réservations Intelligentes",
                description: "Réservez à l'avance ou en déplacement. Annulation et modification flexibles.",
            },
            analytics: {
                title: "Analyses & Insights",
                description: "Suivez votre historique, vos dépenses et votre impact environnemental.",
            },
        },

        // Parkings Section
        parkingsSection: {
            title: "Parkings à la Une",
            subtitle: "Découvrez des emplacements premium avec des équipements de qualité.",
            evAvailable: "VE Disponible",
        },

        // Pricing Section
        pricingSection: {
            title: "Tarification Simple et Transparente",
            subtitle: "Choisissez le forfait adapté à vos besoins. Sans frais cachés.",
            monthly: "Mensuel",
            yearly: "Annuel",
            popular: "Le Plus Populaire",
            free: {
                name: "Gratuit",
                price: "0€",
                description: "Parfait pour un usage occasionnel",
                features: [
                    "5 réservations/mois",
                    "Recherche basique",
                    "Support par email",
                    "Places standard",
                ],
            },
            pro: {
                name: "Pro",
                price: "9,99€",
                description: "Pour les trajets réguliers",
                features: [
                    "Réservations illimitées",
                    "Bornes VE prioritaires",
                    "Support 24/7",
                    "Accès places premium",
                    "Historique de stationnement",
                    "Suivi économies CO2",
                ],
            },
            business: {
                name: "Business",
                price: "29,99€",
                description: "Pour les équipes et flottes",
                features: [
                    "Tout du forfait Pro",
                    "Gestion d'équipe",
                    "Analytics de flotte",
                    "Gestionnaire de compte dédié",
                    "Accès API",
                    "Intégrations personnalisées",
                ],
            },
            choosePlan: "Choisir le Forfait",
            currentPlan: "Forfait Actuel",
        },

        // Footer
        footer: {
            description: "L'avenir du stationnement urbain. Intelligent, durable, fluide.",
            quickLinks: "Liens Rapides",
            support: "Support",
            legal: "Mentions Légales",
            contact: "Contact",
            helpCenter: "Centre d'Aide",
            faq: "FAQ",
            terms: "Conditions d'Utilisation",
            privacy: "Politique de Confidentialité",
            cookies: "Politique de Cookies",
            copyright: "Tous droits réservés.",
        },
    },

    // Auth
    auth: {
        login: {
            title: "Bienvenue",
            subtitle: "Connectez-vous à votre compte SmartPark",
            email: "Email",
            password: "Mot de passe",
            rememberMe: "Se souvenir de moi",
            forgotPassword: "Mot de passe oublié ?",
            button: "Se Connecter",
            noAccount: "Pas encore de compte ?",
            signUpLink: "S'inscrire",
        },
        register: {
            title: "Créer un Compte",
            subtitle: "Rejoignez SmartPark et stationnez plus intelligemment",
            name: "Nom Complet",
            email: "Email",
            password: "Mot de passe",
            confirmPassword: "Confirmer le mot de passe",
            role: "Type de Compte",
            roles: {
                user: "Conducteur",
                manager: "Gestionnaire de Parking",
            },
            terms: "J'accepte les Conditions d'Utilisation et la Politique de Confidentialité",
            button: "Créer le Compte",
            hasAccount: "Déjà un compte ?",
            signInLink: "Se connecter",
        },
        errors: {
            invalidEmail: "Veuillez entrer un email valide",
            passwordLength: "Le mot de passe doit contenir au moins 8 caractères",
            passwordMismatch: "Les mots de passe ne correspondent pas",
            required: "Ce champ est obligatoire",
        },
    },

    // Dashboard - User
    userDashboard: {
        welcome: "Bienvenue",
        subtitle: "Voici l'état de vos stationnements aujourd'hui.",
        findParking: "Trouver un Parking",

        stats: {
            totalReservations: "Total Réservations",
            co2Saved: "CO2 Économisé",
            timeSaved: "Temps Gagné",
            totalSpent: "Total Dépensé",
            thisMonth: "Ce mois",
        },

        sections: {
            parkingsNearYou: "Parkings Près de Vous",
            viewMap: "Voir la Carte",
            activeReservations: "Réservations Actives",
            recommendedParkings: "Parkings Recommandés",
        },

        emptyReservations: {
            title: "Aucune Réservation Active",
            description: "Trouvez une place près de votre destination et réservez instantanément.",
        },

        evPromo: {
            badge: "Recharge VE",
            title: "Rechargez Pendant Votre Stationnement",
            description: "Accédez à plus de 500 bornes de recharge sur notre réseau. -20% sur votre première recharge avec le code SMARTEV.",
            button: "Trouver des Bornes VE",
        },

        navigation: {
            overview: "Aperçu",
            reservations: "Mes Réservations",
            findParking: "Trouver un Parking",
            favorites: "Favoris",
            settings: "Paramètres",
        },
    },

    // Dashboard - Manager
    managerDashboard: {
        title: "Tableau de Bord Gestionnaire",
        subtitle: "Aperçu de vos installations de stationnement",

        stats: {
            totalRevenue: "Revenu Total",
            occupancyRate: "Taux d'Occupation",
            activeBookings: "Réservations Actives",
            evSessions: "Sessions VE",
            thisMonth: "Ce mois",
            vsLastMonth: "vs mois dernier",
        },

        sections: {
            revenueOverview: "Aperçu des Revenus",
            occupancyHeatmap: "Carte de Chaleur Occupation",
            recentBookings: "Réservations Récentes",
            spotManagement: "Gestion des Places",
        },

        navigation: {
            overview: "Aperçu",
            parkings: "Mes Parkings",
            spots: "Gérer les Places",
            analytics: "Statistiques",
            settings: "Paramètres",
        },
    },

    // Dashboard - Admin
    adminDashboard: {
        title: "Tableau de Bord Admin",
        subtitle: "Aperçu et gestion de la plateforme",

        stats: {
            totalUsers: "Total Utilisateurs",
            totalManagers: "Total Gestionnaires",
            totalParkings: "Total Parkings",
            platformRevenue: "Revenus Plateforme",
            activeToday: "Actifs aujourd'hui",
            newThisWeek: "Nouveaux cette semaine",
        },

        sections: {
            platformOverview: "Aperçu Plateforme",
            userActivity: "Activité Utilisateurs",
            recentSignups: "Inscriptions Récentes",
            systemHealth: "État du Système",
        },

        navigation: {
            overview: "Aperçu",
            users: "Utilisateurs",
            managers: "Gestionnaires",
            parkings: "Tous les Parkings",
            analytics: "Statistiques",
            settings: "Paramètres",
        },

        actions: {
            addUser: "Ajouter Utilisateur",
            exportData: "Exporter les Données",
            viewDetails: "Voir les Détails",
            suspend: "Suspendre",
            activate: "Activer",
        },
    },

    // Booking
    booking: {
        title: "Réserver Votre Place",
        steps: {
            selectSpot: "Choisir la Place",
            dateTime: "Date et Heure",
            details: "Détails",
            payment: "Paiement",
            confirm: "Confirmer",
        },

        spotSelector: {
            title: "Sélectionner une Place",
            available: "Disponible",
            occupied: "Occupé",
            selected: "Sélectionné",
            evCharging: "Recharge VE",
            handicap: "Handicapé",
            floor: "Étage",
        },

        dateTime: {
            title: "Sélectionner Date et Heure",
            date: "Date",
            startTime: "Heure de Début",
            endTime: "Heure de Fin",
            duration: "Durée",
            hours: "heures",
        },

        details: {
            title: "Détails de la Réservation",
            vehiclePlate: "Plaque d'Immatriculation",
            vehicleType: "Type de Véhicule",
            evCharging: "Besoin de Recharge VE ?",
            notes: "Notes Additionnelles",
        },

        summary: {
            title: "Récapitulatif",
            parking: "Parking",
            spot: "Place",
            date: "Date",
            time: "Heure",
            duration: "Durée",
            subtotal: "Sous-total",
            serviceFee: "Frais de Service",
            total: "Total",
            confirmBooking: "Confirmer la Réservation",
        },

        confirmation: {
            title: "Réservation Confirmée !",
            subtitle: "Votre place de parking a été réservée",
            bookingId: "ID de Réservation",
            viewReservation: "Voir la Réservation",
            backToHome: "Retour à l'Accueil",
        },
    },

    // Discover
    discover: {
        title: "Découvrir les Parkings",
        subtitle: "Trouvez la place parfaite près de vous",
        searchPlaceholder: "Rechercher par lieu, nom...",

        filters: {
            title: "Filtres",
            priceRange: "Fourchette de Prix",
            evCharging: "Recharge VE",
            availability: "Disponible Maintenant",
            rating: "Note Minimum",
            amenities: "Équipements",
            applyFilters: "Appliquer les Filtres",
            clearFilters: "Effacer les Filtres",
        },

        results: {
            found: "parkings trouvés",
            sortBy: "Trier par",
            distance: "Distance",
            price: "Prix",
            rating: "Note",
            availability: "Disponibilité",
        },

        card: {
            from: "À partir de",
            perHour: "/h",
            spotsLeft: "places restantes",
            book: "Réserver",
            viewDetails: "Voir les Détails",
        },
    },

    // Reservations
    reservations: {
        title: "Mes Réservations",
        subtitle: "Gérez vos réservations de parking",

        tabs: {
            active: "Actives",
            upcoming: "À Venir",
            past: "Passées",
            cancelled: "Annulées",
        },

        status: {
            active: "Active",
            pending: "En Attente",
            completed: "Terminée",
            cancelled: "Annulée",
        },

        actions: {
            extend: "Prolonger",
            cancel: "Annuler",
            viewDetails: "Voir les Détails",
            getDirections: "Itinéraire",
        },

        empty: {
            title: "Aucune réservation trouvée",
            description: "Commencez par trouver une place de parking",
            action: "Trouver un Parking",
        },
    },

    // Settings
    settings: {
        title: "Paramètres",

        sections: {
            profile: "Profil",
            preferences: "Préférences",
            notifications: "Notifications",
            security: "Sécurité",
            billing: "Facturation",
        },

        profile: {
            title: "Paramètres du Profil",
            name: "Nom Complet",
            email: "Email",
            phone: "Numéro de Téléphone",
            avatar: "Photo de Profil",
            updateProfile: "Mettre à Jour le Profil",
        },

        preferences: {
            title: "Préférences",
            language: "Langue",
            theme: "Thème",
            themes: {
                light: "Clair",
                dark: "Sombre",
                system: "Système",
            },
            defaultView: "Vue Carte par Défaut",
            units: "Unités de Distance",
            unitOptions: {
                km: "Kilomètres",
                miles: "Miles",
            },
        },

        notifications: {
            title: "Paramètres de Notifications",
            email: "Notifications par Email",
            push: "Notifications Push",
            sms: "Notifications SMS",
            types: {
                bookingConfirmation: "Confirmations de Réservation",
                bookingReminders: "Rappels de Réservation",
                promotions: "Promotions et Offres",
                updates: "Mises à Jour de la Plateforme",
            },
        },

        security: {
            title: "Paramètres de Sécurité",
            changePassword: "Changer le Mot de Passe",
            twoFactor: "Authentification à Deux Facteurs",
            sessions: "Sessions Actives",
            deleteAccount: "Supprimer le Compte",
        },
    },

    // Errors
    errors: {
        notFound: "Page Non Trouvée",
        notFoundDescription: "La page que vous recherchez n'existe pas.",
        serverError: "Erreur Serveur",
        serverErrorDescription: "Une erreur s'est produite. Veuillez réessayer plus tard.",
        unauthorized: "Non Autorisé",
        unauthorizedDescription: "Vous n'avez pas la permission d'accéder à cette page.",
        goHome: "Retour à l'Accueil",
    },
}

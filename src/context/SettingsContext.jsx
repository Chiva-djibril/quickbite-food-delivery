import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

// Translation dictionary
const translations = {
  en: {
    // Navigation & Common
    home: "Home", menu: "Menu", myOrders: "My Orders", dashboard: "Dashboard",
    login: "Login", signup: "Sign Up", logout: "Logout",
    backToHome: "Back to Home", backToSite: "Back to Site",
    
    // Landing
    heroTitle: "Hungry? We've got you covered!",
    heroDesc: "Order delicious meals from QuickBite and get them delivered hot and fresh to your doorstep in minutes.",
    getStarted: "Get Started Free", signIn: "Sign In",
    happyCustomers: "Happy Customers", menuItems: "Menu Items", deliveryTime: "Delivery Time",
    whyChoose: "Why Choose QuickBite?",
    fastDelivery: "Fast Delivery", fastDeliveryDesc: "Hot food delivered in 30 minutes or less",
    safeHygienic: "Safe & Hygienic", safeHygienicDesc: "Prepared in clean, certified kitchens",
    topChefs: "Top Chefs", topChefsDesc: "Made by experienced professional chefs",
    whatWeOffer: "What We Offer", exploreCategories: "Explore our delicious categories",
    mainCourse: "Main Course", soups: "Soups", snacks: "Snacks", drinks: "Drinks",
    readyToStart: "Ready to Get Started?",
    joinThousands: "Join thousands of food lovers who order with QuickBite every day!",
    createAccount: "Create Free Account", alreadyMember: "Already a Member?",
    signUpToOrder: "Sign Up to Order Now",
    
    // Auth
    welcomeBack: "Welcome Back!", signInContinue: "Sign in to continue ordering",
    email: "Email", password: "Password", enterPassword: "Enter password",
    signingIn: "Signing in...", noAccount: "Don't have an account?", signUpFree: "Sign Up Free",
    createYourAccount: "Create Account", joinQuickBite: "Join QuickBite and start ordering!",
    fullName: "Full Name", phone: "Phone", address: "Address",
    deliveryAddress: "Your delivery address", confirmPassword: "Confirm Password",
    repeatPassword: "Repeat password", creatingAccount: "Creating Account...",
    createMyAccount: "Create My Account", alreadyHaveAccount: "Already have an account?",
    
    // Dashboard
    welcomeUser: "Hi", whatToOrder: "What would you like to order today?",
    browseMenu: "Browse Menu", cart: "Cart",
    totalOrders: "Total Orders", activeOrders: "Active Orders", totalSpent: "Total Spent",
    recentOrders: "Recent Orders", viewAll: "View All",
    noOrdersYet: "No orders yet", startBrowsing: "Start by browsing our menu",
    popularItems: "Popular Items", viewFullMenu: "View Full Menu",
    
    // Menu
    ourMenu: "Our Menu", chooseSelection: "Choose from our delicious selection",
    searchFood: "Search for food...", itemsFound: "items found",
    noItemsFound: "No items found", add: "Add", addedToCart: "added to cart!",
    
    // Cart
    yourCart: "Your Cart", cartEmpty: "Your cart is empty",
    addDeliciousFood: "Add some delicious food!",
    total: "Total", enterAddress: "Enter delivery address...",
    placeOrder: "Place Order", placingOrder: "Placing Order...",
    
    // Orders
    orderHistory: "Track all your orders here", orderItems: "ORDER ITEMS",
    totalAmount: "Total Amount",
    pending: "Pending", preparing: "Preparing", delivered: "Delivered", cancelled: "Cancelled",
    
    // Settings
    settings: "Settings", translate: "Translate", accessibility: "Accessibility", feedback: "Feedback",
    changeLanguage: "Change Language", theme: "Theme",
    lightTheme: "Light", darkTheme: "Dark", textSize: "Text Size",
    small: "Small", normal: "Normal", large: "Large", extraLarge: "X-Large",
    sendFeedback: "Send Feedback", whatToImprove: "What can we improve?",
    whatToRemove: "What should we remove?", yourSuggestions: "Your suggestions...",
    submit: "Submit", thankYou: "Thank you for your feedback!", close: "Close"
  },
  
  fr: {
    home: "Accueil", menu: "Menu", myOrders: "Mes Commandes", dashboard: "Tableau de Bord",
    login: "Connexion", signup: "S'inscrire", logout: "Déconnexion",
    backToHome: "Retour à l'Accueil", backToSite: "Retour au Site",
    heroTitle: "Faim? Nous nous occupons de vous!",
    heroDesc: "Commandez de délicieux repas chez QuickBite et faites-les livrer chauds et frais à votre porte en quelques minutes.",
    getStarted: "Commencer Gratuitement", signIn: "Se Connecter",
    happyCustomers: "Clients Satisfaits", menuItems: "Articles au Menu", deliveryTime: "Temps de Livraison",
    whyChoose: "Pourquoi Choisir QuickBite?",
    fastDelivery: "Livraison Rapide", fastDeliveryDesc: "Nourriture chaude livrée en 30 minutes ou moins",
    safeHygienic: "Sûr et Hygiénique", safeHygienicDesc: "Préparé dans des cuisines propres et certifiées",
    topChefs: "Meilleurs Chefs", topChefsDesc: "Préparé par des chefs professionnels expérimentés",
    whatWeOffer: "Ce Que Nous Offrons", exploreCategories: "Explorez nos délicieuses catégories",
    mainCourse: "Plat Principal", soups: "Soupes", snacks: "Collations", drinks: "Boissons",
    readyToStart: "Prêt à Commencer?",
    joinThousands: "Rejoignez des milliers d'amateurs de cuisine qui commandent avec QuickBite chaque jour!",
    createAccount: "Créer un Compte Gratuit", alreadyMember: "Déjà Membre?",
    signUpToOrder: "Inscrivez-vous pour Commander",
    welcomeBack: "Bon Retour!", signInContinue: "Connectez-vous pour continuer",
    email: "Email", password: "Mot de Passe", enterPassword: "Entrez le mot de passe",
    signingIn: "Connexion...", noAccount: "Pas de compte?", signUpFree: "Inscription Gratuite",
    createYourAccount: "Créer un Compte", joinQuickBite: "Rejoignez QuickBite!",
    fullName: "Nom Complet", phone: "Téléphone", address: "Adresse",
    deliveryAddress: "Votre adresse de livraison", confirmPassword: "Confirmer le Mot de Passe",
    repeatPassword: "Répéter le mot de passe", creatingAccount: "Création...",
    createMyAccount: "Créer Mon Compte", alreadyHaveAccount: "Déjà un compte?",
    welcomeUser: "Salut", whatToOrder: "Que souhaitez-vous commander aujourd'hui?",
    browseMenu: "Parcourir le Menu", cart: "Panier",
    totalOrders: "Commandes Totales", activeOrders: "Commandes Actives", totalSpent: "Total Dépensé",
    recentOrders: "Commandes Récentes", viewAll: "Voir Tout",
    noOrdersYet: "Pas de commandes", startBrowsing: "Parcourez notre menu",
    popularItems: "Articles Populaires", viewFullMenu: "Voir le Menu Complet",
    ourMenu: "Notre Menu", chooseSelection: "Choisissez de notre sélection",
    searchFood: "Rechercher...", itemsFound: "articles trouvés",
    noItemsFound: "Aucun article", add: "Ajouter", addedToCart: "ajouté!",
    yourCart: "Votre Panier", cartEmpty: "Votre panier est vide",
    addDeliciousFood: "Ajoutez de la nourriture!",
    total: "Total", enterAddress: "Entrez l'adresse...",
    placeOrder: "Commander", placingOrder: "En cours...",
    orderHistory: "Suivez vos commandes", orderItems: "ARTICLES",
    totalAmount: "Montant Total",
    pending: "En Attente", preparing: "En Préparation", delivered: "Livré", cancelled: "Annulé",
    settings: "Paramètres", translate: "Traduire", accessibility: "Accessibilité", feedback: "Retour",
    changeLanguage: "Changer de Langue", theme: "Thème",
    lightTheme: "Clair", darkTheme: "Sombre", textSize: "Taille du Texte",
    small: "Petit", normal: "Normal", large: "Grand", extraLarge: "Très Grand",
    sendFeedback: "Envoyer un Commentaire", whatToImprove: "Que pouvons-nous améliorer?",
    whatToRemove: "Que devrions-nous supprimer?", yourSuggestions: "Vos suggestions...",
    submit: "Envoyer", thankYou: "Merci!", close: "Fermer"
  },
  
  es: {
    home: "Inicio", menu: "Menú", myOrders: "Mis Pedidos", dashboard: "Panel",
    login: "Iniciar Sesión", signup: "Registrarse", logout: "Cerrar Sesión",
    backToHome: "Volver al Inicio", backToSite: "Volver al Sitio",
    heroTitle: "¿Hambriento? ¡Te tenemos cubierto!",
    heroDesc: "Ordena deliciosas comidas de QuickBite y recíbelas calientes en tu puerta en minutos.",
    getStarted: "Comenzar Gratis", signIn: "Iniciar Sesión",
    happyCustomers: "Clientes Felices", menuItems: "Artículos del Menú", deliveryTime: "Tiempo de Entrega",
    whyChoose: "¿Por Qué Elegir QuickBite?",
    fastDelivery: "Entrega Rápida", fastDeliveryDesc: "Comida caliente en 30 minutos o menos",
    safeHygienic: "Seguro e Higiénico", safeHygienicDesc: "Preparado en cocinas certificadas",
    topChefs: "Mejores Chefs", topChefsDesc: "Hecho por chefs profesionales",
    whatWeOffer: "Lo Que Ofrecemos", exploreCategories: "Explora nuestras categorías",
    mainCourse: "Plato Principal", soups: "Sopas", snacks: "Aperitivos", drinks: "Bebidas",
    readyToStart: "¿Listo para Empezar?",
    joinThousands: "¡Únete a miles de amantes de la comida!",
    createAccount: "Crear Cuenta Gratis", alreadyMember: "¿Ya eres miembro?",
    signUpToOrder: "Regístrate para Ordenar",
    welcomeBack: "¡Bienvenido!", signInContinue: "Inicia sesión para continuar",
    email: "Correo", password: "Contraseña", enterPassword: "Ingresa la contraseña",
    signingIn: "Iniciando...", noAccount: "¿Sin cuenta?", signUpFree: "Regístrate Gratis",
    createYourAccount: "Crear Cuenta", joinQuickBite: "¡Únete a QuickBite!",
    fullName: "Nombre Completo", phone: "Teléfono", address: "Dirección",
    deliveryAddress: "Tu dirección de entrega", confirmPassword: "Confirmar Contraseña",
    repeatPassword: "Repite la contraseña", creatingAccount: "Creando...",
    createMyAccount: "Crear Mi Cuenta", alreadyHaveAccount: "¿Ya tienes cuenta?",
    welcomeUser: "Hola", whatToOrder: "¿Qué te gustaría ordenar hoy?",
    browseMenu: "Ver Menú", cart: "Carrito",
    totalOrders: "Pedidos Totales", activeOrders: "Pedidos Activos", totalSpent: "Total Gastado",
    recentOrders: "Pedidos Recientes", viewAll: "Ver Todo",
    noOrdersYet: "Sin pedidos", startBrowsing: "Explora nuestro menú",
    popularItems: "Artículos Populares", viewFullMenu: "Ver Menú Completo",
    ourMenu: "Nuestro Menú", chooseSelection: "Elige de nuestra selección",
    searchFood: "Buscar comida...", itemsFound: "artículos encontrados",
    noItemsFound: "No hay artículos", add: "Agregar", addedToCart: "agregado!",
    yourCart: "Tu Carrito", cartEmpty: "Tu carrito está vacío",
    addDeliciousFood: "¡Agrega comida deliciosa!",
    total: "Total", enterAddress: "Ingresa la dirección...",
    placeOrder: "Ordenar", placingOrder: "Ordenando...",
    orderHistory: "Rastrea tus pedidos", orderItems: "ARTÍCULOS",
    totalAmount: "Monto Total",
    pending: "Pendiente", preparing: "Preparando", delivered: "Entregado", cancelled: "Cancelado",
    settings: "Configuración", translate: "Traducir", accessibility: "Accesibilidad", feedback: "Comentarios",
    changeLanguage: "Cambiar Idioma", theme: "Tema",
    lightTheme: "Claro", darkTheme: "Oscuro", textSize: "Tamaño del Texto",
    small: "Pequeño", normal: "Normal", large: "Grande", extraLarge: "Extra Grande",
    sendFeedback: "Enviar Comentarios", whatToImprove: "¿Qué podemos mejorar?",
    whatToRemove: "¿Qué eliminar?", yourSuggestions: "Tus sugerencias...",
    submit: "Enviar", thankYou: "¡Gracias!", close: "Cerrar"
  },
  
  rw: {
    home: "Ahabanza", menu: "Menu", myOrders: "Ibyo Nasabye", dashboard: "Ikibaho",
    login: "Injira", signup: "Iyandikishe", logout: "Sohoka",
    backToHome: "Subira Ahabanza", backToSite: "Subira ku Rubuga",
    heroTitle: "Ushonje? Turabikorera!",
    heroDesc: "Tegeka ibiryo biryoshye kuri QuickBite ubigerwe ku muryango byashyushye.",
    getStarted: "Tangira Ubuntu", signIn: "Injira",
    happyCustomers: "Abakiriya", menuItems: "Ibiryo bya Menu", deliveryTime: "Igihe",
    whyChoose: "Kuki Uhitamo QuickBite?",
    fastDelivery: "Gutwara Vuba", fastDeliveryDesc: "Ibiryo byashyushye mu minota 30",
    safeHygienic: "Birashobora", safeHygienicDesc: "Bitegurwa mu gikoni gisukuye",
    topChefs: "Abategura Beza", topChefsDesc: "Bitegurwa n'abategura b'umwuga",
    whatWeOffer: "Icyo Dutanga", exploreCategories: "Reba ibyiciro byacu",
    mainCourse: "Ibiryo Byibanze", soups: "Isupu", snacks: "Ibyokurya Bito", drinks: "Ibinyobwa",
    readyToStart: "Witeguye?",
    joinThousands: "Ifatanye n'ibihumbi bisaba kuri QuickBite!",
    createAccount: "Fungura Konti", alreadyMember: "Wari uri Umunyamuryango?",
    signUpToOrder: "Iyandikishe Usabe",
    welcomeBack: "Murakaza Neza!", signInContinue: "Injira ukomeze",
    email: "Imeyili", password: "Ijambobanga", enterPassword: "Andika ijambobanga",
    signingIn: "Kwinjira...", noAccount: "Ntufite konti?", signUpFree: "Iyandikishe Ubuntu",
    createYourAccount: "Fungura Konti", joinQuickBite: "Ifatanye na QuickBite!",
    fullName: "Amazina", phone: "Telefoni", address: "Aderesi",
    deliveryAddress: "Aderesi yawe", confirmPassword: "Emeza Ijambobanga",
    repeatPassword: "Subiramo", creatingAccount: "Gufungura...",
    createMyAccount: "Fungura Konti Yanjye", alreadyHaveAccount: "Ufite konti?",
    welcomeUser: "Muraho", whatToOrder: "Ushaka iki uyu munsi?",
    browseMenu: "Reba Menu", cart: "Igare",
    totalOrders: "Ibyasabwe", activeOrders: "Birimo Gukorwa", totalSpent: "Wakoresheje",
    recentOrders: "Ibyasabwe Vuba", viewAll: "Reba Byose",
    noOrdersYet: "Nta byasabwe", startBrowsing: "Tangira reba menu",
    popularItems: "Ibikundwa", viewFullMenu: "Reba Menu Yose",
    ourMenu: "Menu Yacu", chooseSelection: "Hitamo",
    searchFood: "Shakisha...", itemsFound: "byabonetse",
    noItemsFound: "Nta biryo", add: "Ongera", addedToCart: "byongewe!",
    yourCart: "Igare Ryawe", cartEmpty: "Igare ririmo ubusa",
    addDeliciousFood: "Ongeraho ibiryo!",
    total: "Igiteranyo", enterAddress: "Andika aderesi...",
    placeOrder: "Saba", placingOrder: "Birasabwa...",
    orderHistory: "Reba ibyo wasabye", orderItems: "IBYASABWE",
    totalAmount: "Igiteranyo",
    pending: "Bitegereje", preparing: "Birateguwa", delivered: "Byatanzwe", cancelled: "Byahagaritswe",
    settings: "Igenamiterere", translate: "Hindura", accessibility: "Ubushobozi", feedback: "Ibitekerezo",
    changeLanguage: "Hindura Ururimi", theme: "Insanganyamatsiko",
    lightTheme: "Umucyo", darkTheme: "Umwijima", textSize: "Ingano",
    small: "Bito", normal: "Bisanzwe", large: "Binini", extraLarge: "Binini Cyane",
    sendFeedback: "Tanga Ibitekerezo", whatToImprove: "Twakwongera iki?",
    whatToRemove: "Iki twakwikuraho?", yourSuggestions: "Ibitekerezo byawe...",
    submit: "Ohereza", thankYou: "Murakoze!", close: "Funga"
  }
};

export const SettingsProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [textSize, setTextSize] = useState(() => localStorage.getItem('textSize') || 'normal');
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    document.body.className = theme === 'dark' ? 'dark' : '';
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Apply text size
  useEffect(() => {
    const sizes = { small: '14px', normal: '16px', large: '18px', xlarge: '20px' };
    document.documentElement.style.fontSize = sizes[textSize];
    localStorage.setItem('textSize', textSize);
  }, [textSize]);

  // Save language
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function
  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <SettingsContext.Provider value={{ 
      theme, setTheme, 
      textSize, setTextSize, 
      language, setLanguage,
      t 
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
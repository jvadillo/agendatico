import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Search, Music, Utensils, Palette, PartyPopper, Home, PlusCircle, User, Heart } from 'lucide-react';

const AgendaticoApp = () => {
  const [loading, setLoading] = useState(true);

  // Simular tiempo de carga de la splash screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3500); // 3.5 segundos de splash screen
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center font-sans overflow-hidden">
      <div className="w-full max-w-md bg-white h-screen shadow-2xl overflow-hidden relative">
        <AnimatePresence>
          {loading ? (
            <SplashScreen key="splash" />
          ) : (
            <MainApp key="main" />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- Componente Splash Screen ---
const SplashScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white"
    >
      {/* Contenedor del Logo Animado */}
      <div className="relative flex items-center justify-center mb-6">
        {/* Fondo decorativo difuminado */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-48 h-48 bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-500 rounded-full blur-3xl opacity-40"
        />

        {/* Icono del Pin (Recreación vectorial del logo) */}
        <motion.div
          initial={{ scale: 0, y: -50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
          className="relative z-10 w-24 h-24 bg-gradient-to-br from-blue-700 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-lg transform -rotate-6"
        >
          <MapPin className="text-white w-12 h-12" strokeWidth={2.5} />
        </motion.div>
      </div>

      {/* Texto de la marca */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="text-center z-10"
      >
        <h1 className="text-5xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-purple-600 to-pink-600">
          agendatico
        </h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-gray-500 text-sm tracking-widest uppercase font-semibold"
        >
          Descubre Costa Rica
        </motion.p>
      </motion.div>

      {/* Indicador de carga inferior */}
      <motion.div 
        className="absolute bottom-10 w-32 h-1 bg-gray-100 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div 
          className="h-full bg-gradient-to-r from-blue-600 to-pink-600"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        />
      </motion.div>
    </motion.div>
  );
};

// --- Componente Principal de la App ---
const MainApp = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="h-full flex flex-col bg-gray-50"
    >
      {/* Header */}
      <header className="px-6 pt-12 pb-4 bg-white sticky top-0 z-20 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-500 font-medium">¡Pura Vida!</p>
            <h2 className="text-2xl font-bold text-gray-800">
              Explora <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600">Eventos</span>
            </h2>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
             <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Buscador */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="¿Qué quieres hacer hoy?" 
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 border-none focus:ring-2 focus:ring-purple-500 text-gray-700 outline-none transition-all"
          />
        </div>
      </header>

      {/* Contenido Scrollable */}
      <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
        
        {/* Categorías */}
        <section className="mt-6 px-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Categorías</h3>
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            <CategoryPill icon={<Music />} label="Música" active />
            <CategoryPill icon={<Utensils />} label="Comida" />
            <CategoryPill icon={<Palette />} label="Arte" />
            <CategoryPill icon={<PartyPopper />} label="Fiesta" />
          </div>
        </section>

        {/* Eventos Destacados */}
        <section className="mt-4 px-6">
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-lg font-bold text-gray-800">Tendencia en CR</h3>
            <span className="text-purple-600 text-sm font-semibold cursor-pointer">Ver todo</span>
          </div>
          
          <div className="space-y-6">
            <EventCard 
              image="https://images.unsplash.com/photo-1459749411177-0473ef7161a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              title="Festival de Jazz & Café"
              date="Sáb, 12 Oct • 4:00 PM"
              location="Escazú, San José"
              price="₡5.000"
            />
            <EventCard 
              image="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              title="Concierto Rock en la U"
              date="Vie, 18 Oct • 7:00 PM"
              location="San Pedro, San José"
              price="Gratis"
            />
            <EventCard 
              image="https://images.unsplash.com/photo-1551632436-cbf8dd354ca8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              title="Taller de Arte y Vino"
              date="Dom, 20 Oct • 2:00 PM"
              location="Barrio Escalante"
              price="₡12.000"
            />
          </div>
        </section>
      </div>

      {/* Menú de Navegación Inferior */}
      <nav className="absolute bottom-0 w-full bg-white border-t border-gray-100 py-3 px-6 pb-6 flex justify-between items-center z-30">
        <NavIcon icon={<Home />} label="Inicio" active />
        <NavIcon icon={<Heart />} label="Guardados" />
        
        {/* Botón Central Publicar */}
        <div className="relative -top-5">
          <button className="bg-gradient-to-r from-blue-600 to-pink-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
            <PlusCircle className="w-8 h-8" />
          </button>
        </div>

        <NavIcon icon={<Calendar />} label="Agenda" />
        <NavIcon icon={<User />} label="Perfil" />
      </nav>
    </motion.div>
  );
};

// --- Componentes Auxiliares ---

const CategoryPill = ({ icon, label, active }) => (
  <div className={`flex flex-col items-center min-w-[70px] space-y-2 cursor-pointer transition-all`}>
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${active ? 'bg-gradient-to-br from-blue-600 to-pink-500 text-white shadow-purple-200' : 'bg-white text-gray-400 border border-gray-100'}`}>
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <span className={`text-xs font-medium ${active ? 'text-gray-800' : 'text-gray-400'}`}>{label}</span>
  </div>
);

const EventCard = ({ image, title, date, location, price }) => (
  <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group">
    <div className="relative h-40 overflow-hidden">
      <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm">
        {price}
      </div>
    </div>
    <div className="p-4">
      <h4 className="font-bold text-gray-800 text-lg leading-tight mb-1">{title}</h4>
      <div className="flex items-center text-purple-600 text-sm font-medium mb-2">
        <Calendar className="w-3 h-3 mr-1" />
        {date}
      </div>
      <div className="flex items-center text-gray-400 text-sm">
        <MapPin className="w-3 h-3 mr-1" />
        {location}
      </div>
    </div>
  </div>
);

const NavIcon = ({ icon, label, active }) => (
  <button className={`flex flex-col items-center space-y-1 ${active ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}>
    {React.cloneElement(icon, { size: 24, strokeWidth: active ? 2.5 : 2 })}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default AgendaticoApp;
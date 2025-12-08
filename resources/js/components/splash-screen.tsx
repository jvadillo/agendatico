import { motion, AnimatePresence } from 'framer-motion';
import { MapPin } from 'lucide-react';

interface SplashScreenProps {
    isVisible: boolean;
    onComplete: () => void;
}

export function SplashScreen({ isVisible, onComplete }: SplashScreenProps) {
    return (
        <AnimatePresence onExitComplete={onComplete}>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white"
                >
                    {/* Logo animado */}
                    <div className="relative flex items-center justify-center mb-6">
                        {/* Fondo decorativo difuminado */}
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute w-48 h-48 bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-500 rounded-full blur-3xl opacity-40"
                        />

                        {/* Icono del Pin */}
                        <motion.div
                            initial={{ scale: 0, y: -50 }}
                            animate={{ scale: 1, y: 0 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
                            className="relative z-10 w-24 h-24 bg-gradient-to-br from-blue-700 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-lg"
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
                        <h1 className="text-5xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-purple-600 to-pink-600 leading-tight pb-2">
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

                    {/* Indicador de carga */}
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
            )}
        </AnimatePresence>
    );
}

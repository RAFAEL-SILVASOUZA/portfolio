import React from 'react';
import { motion, useInView } from 'framer-motion';
import { TrendingUp, Rocket, Users, Globe, Award, BookOpen } from 'lucide-react';
import { useRef } from 'react';
import avatarRafael from '../../assets/avatar.png';
import AnimatedCounter from '../../utils/AnimatedCounter';

const impactMetrics = [
  { label: 'Anos de Experiência', value: 12, suffix: '+', icon: TrendingUp },
  { label: 'Projetos Entregues', value: 50, suffix: '+', icon: Rocket },
  { label: 'Desenvolvedores Mentorados', value: 30, suffix: '+', icon: Users },
  { label: 'Empresas Atendidas', value: 15, suffix: '+', icon: Globe },
  { label: 'Certificações', value: 5, suffix: '', icon: Award },
  { label: 'Artigos Técnicos', value: 20, suffix: '+', icon: BookOpen }
];

const MetricsSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Animação orbital simples para ícones métricos
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const metricVariants = {
    hidden: { opacity: 0, y: 50, rotate: -180 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        delay: i * 0.1,
        rotate: {
          duration: 1,
          ease: 'easeInOut'
        }
      }
    })
  };

  // Avatar interativo com expansão
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <section ref={ref} className="relative z-10 px-6 py-4 md:py-6 max-w-7xl mx-auto">
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start"
      >
        {/* Coluna esquerda - Métricas com animação orbital */}
        <div className="space-y-4 lg:space-y-6">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
            variants={containerVariants}
          >
            {impactMetrics.map((metric, idx) => (
              <motion.div
                key={metric.label}
                variants={metricVariants}
                custom={idx}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)'
                }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 hover:border-white/30 rounded-2xl p-4 md:p-6 text-center transition-all duration-300 cursor-pointer group"
              >
                <motion.div 
                  className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-3 group-hover:scale-110 transition-transform"
                  animate={{ rotate: isInView ? [0, 360] : 0 }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                >
                  <metric.icon className="w-full h-full text-cyan-400" />
                </motion.div>
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
                  <AnimatedCounter value={metric.value} suffix={metric.suffix} />
                </div>
                <div className="text-xs md:text-sm text-gray-300 group-hover:text-cyan-300 transition-colors">
                  {metric.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Coluna direita - Avatar interativo com expansão */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center justify-center lg:justify-end relative"
          onHoverStart={() => setIsExpanded(true)}
          onHoverEnd={() => setIsExpanded(false)}
        >
          <motion.div 
            className="relative group"
            animate={{ scale: isExpanded ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Anéis orbitais animados */}
            <motion.div 
              className="absolute inset-0 rounded-2xl border-2 border-cyan-500/20 opacity-0 group-hover:opacity-100"
              initial={false}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0, 0.5, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: 'easeInOut' 
              }}
            />
            
            {/* Avatar principal */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-2xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 group-hover:border-white/30 transition-all duration-500">
              <img 
                src={avatarRafael} 
                alt="Avatar de Rafael Souza"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
              />
              {/* Overlay com glow */}
              <div className="absolute inset-0 bg-gradient-radial from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            {/* Tooltip expandido no hover */}
            {isExpanded && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md rounded-lg p-3 text-center min-w-[200px] shadow-2xl border border-cyan-500/30"
              >
                <p className="text-xs text-cyan-300 font-medium">Rafael Souza</p>
                <p className="text-xs text-gray-400">Arquiteto de Soluções</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default MetricsSection;

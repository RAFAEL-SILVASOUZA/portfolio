import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import fotoRafael from '../../assets/foto.jpeg';

const techHighlights = [
  'GenAI & LLMs',
  'RAG Systems',
  'Agentes Autônomos',
  '.NET Architecture',
  'Cloud Native',
  'LLMOps'
];

const Hero: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.9]);
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Função para animar letras individualmente
  const animateLetters = (text: string) => {
    return text.split('').map((char, index) => (
      <motion.span
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 + index * 0.05, duration: 0.6 }}
        className="inline-block"
      >
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    ));
  };

  return (
    <header className="relative z-10 px-6 py-20 md:py-32 max-w-7xl mx-auto">
      <motion.div
        style={{ opacity: headerOpacity }}
        className="flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-6 lg:gap-12"
      >
        {/* Foto com parallax e glow aprimorado */}
        <motion.div
          style={{ y: parallaxY }}
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative group w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden ring-4 ring-blue-500/50"
        >
          {/* Glow dinâmico com animação */}
          <motion.div 
            className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl blur-xl"
            animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Container da foto */}
          <div className="relative w-full h-full rounded-full overflow-hidden ring-2 ring-blue-500/30 group-hover:ring-cyan-400/50 transition-all duration-500 shadow-2xl">
            <img 
              src={fotoRafael} 
              alt="Rafael Silva Souza"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 rounded-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
          
          {/* Status online com pulso */}
          <motion.div 
            className="absolute bottom-3 right-3 w-5 h-5 bg-green-400 rounded-full ring-2 ring-black/50"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
        
        <div className="max-w-3xl">
          {/* Nome com kinetic typography */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center gap-2 mb-6 text-center lg:text-left lg:items-start"
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-white drop-shadow-2xl tracking-tight"
              style={{ overflow: 'hidden' }}
            >
              {animateLetters('Rafael Silva')}
            </motion.h1>
            <motion.p className="text-xl md:text-3xl font-semibold text-blue-300">
              {animateLetters('Arquiteto de Soluções')}
            </motion.p>
          </motion.div>
          
          {/* Descrição com fade staggered */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-300 mb-6 text-balance leading-relaxed"
          >
            <span className="text-cyan-400 font-semibold">+12 anos</span> transformando negócios através de arquiteturas escaláveis, 
            IA Generativa e inovação tecnológica. 
          </motion.p>
          
          {/* Tech highlights com stagger e glow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            {techHighlights.map((tech, idx) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.05, type: 'spring', stiffness: 300 }}
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)' }}
                className="px-4 py-2 text-sm font-medium bg-blue-500/15 text-blue-300 rounded-full border border-cyan-500/30 backdrop-blur-sm"
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>

          {/* CTAs com animação de flutuação */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap gap-3 justify-center lg:justify-start"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-6 py-3 shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all duration-300"
                aria-label="Enviar e-mail para rafael.silva.xp@hotmail.com"
              >
                <Mail className="mr-2 h-5 w-5" />
                Contato
              </Button>
            </motion.div>
            <Button 
              size="lg" 
              variant="outline" 
              asChild
              className="px-6 py-3 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400"
              aria-label="Abrir perfil do LinkedIn em nova aba"
            >
              <a 
                href="https://www.linkedin.com/in/rafael-silva-souza" 
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="mr-2 h-5 w-5" /> LinkedIn
              </a>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              asChild
              className="px-6 py-3 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400"
              aria-label="Baixar currículo em formato PDF"
            >
              <a 
                href="/curriculo.pdf" 
                download="Rafael_Silva_Souza_Curriculo.pdf"
              >
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Currículo
              </a>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </header>
  );
};

export default Hero;

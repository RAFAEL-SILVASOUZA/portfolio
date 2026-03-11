import { useState, useEffect, useRef } from 'react';
import { ThemeProvider } from 'next-themes';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Brain, Cloud, Database, Shield, Code2, LinkedinIcon, Mail, ChevronRight, Star, Award, BookOpen, Sparkles, GitBranch, CheckCircle, Zap, Users, Rocket, TrendingUp, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import fotoRafael from '../foto.jpeg';
import avatarRafael from '../avatar.png';

const experiences = [
  {
    company: 'V8.TECH',
    role: 'Arquiteto de Soluções',
    period: 'Junho 2025 - Presente',
    duration: '1 ano 7 meses',
    location: 'São Paulo, Brasil',
    highlights: [
      'Liderança técnica em iniciativas estratégicas',
      'Definição de arquiteturas e padrões',
      'Foco em eficiência operacional e automação',
      'Governança e geração de valor para o negócio'
    ]
  },
  {
    company: 'V8.TECH',
    role: 'Tech Lead .NET Sênior',
    period: 'Julho 2024 - Junho 2025',
    duration: '1 ano',
    location: 'São Paulo, Brasil',
    highlights: [
      'Liderança técnica de squads',
      'Arquitetura de soluções escaláveis',
      'Mentoria de desenvolvedores júnior',
      'Decisões técnicas de alto impacto'
    ]
  },
  {
    company: 'Vertem',
    role: 'Tech Lead | .NET',
    period: 'Novembro 2023 - Agosto 2024',
    duration: '10 meses',
    location: 'São Paulo, Brasil',
    highlights: [
      'Trabalho com .NET Core (DDD/Solid)',
      'REST APIs e RESTful',
      'Microservices e Sistemas Distribuídos',
      'SQL Server, MongoDB, Service Bus',
      'CI/CD com Azure DevOps',
      'Azure Cloud, GrayLog, Datadog',
      'Metodologia Scrum'
    ]
  },
  {
    company: 'Capitani Group',
    role: 'Senior Software Engineer | Specialist | .NET',
    period: 'Junho 2023 - Novembro 2023',
    duration: '6 meses',
    location: 'São Paulo, Brasil',
    highlights: [
      'Atuação como especialista .NET',
      'Desenvolvimento de soluções empresariais',
      'Arquitetura de sistemas complexos',
      'Integração com múltiplas plataformas'
    ]
  },
  {
    company: 'V8.TECH',
    role: 'Senior Software Engineer .NET',
    period: 'Março 2023 - Junho 2023',
    duration: '4 meses',
    location: 'Remoto',
    highlights: [
      'Projeto temporário (POC)',
      'Experiência com Oracle Cloud',
      'Desenvolvimento de soluções empresariais',
      'Arquitetura de sistemas complexos'
    ]
  },
  {
    company: 'Avenue Code',
    role: 'Senior Software Engineer .NET',
    period: 'Dezembro 2021 - Março 2023',
    duration: '1 ano 4 meses',
    location: 'Remoto',
    highlights: [
      'Projetos internacionais',
      'Arquitetura de software moderna',
      'Boas práticas de engenharia',
      'Colaboração em times distribuídos'
    ]
  },
  {
    company: 'Ambev Tech',
    role: 'Analista Desenvolvedor .NET',
    period: 'Junho 2021 - Novembro 2021',
    duration: '6 meses',
    location: 'Maringá, Paraná, Brasil',
    highlights: [
      'Desenvolvimento de aplicações empresariais',
      'Integração de sistemas complexos',
      'Boas práticas de desenvolvimento'
    ]
  },
  {
    company: 'Theòs Sistemas Eclesiais',
    role: 'Backend Developer | Tech Lead',
    period: ' Abril 2019 - Maio 2021',
    duration: '2 anos 2 meses',
    location: 'Maringá, Brasil',
    highlights: [
      'Liderança técnica de projetos',
      'Desenvolvimento backend robusto',
      'Arquitetura de sistemas'
    ]
  },
  {
    company: 'Naymar',
    role: 'Analista Desenvolvedor .NET',
    period: 'Julho 2016 - Março 2019',
    duration: '2 anos 9 meses',
    location: 'São Paulo, Brasil',
    highlights: [
      'Desenvolvimento de soluções .NET',
      'Manutenção e evolução de sistemas'
    ]
  },
  {
    company: 'Confitec',
    role: 'Analista Desenvolvedor',
    period: 'Outubro 2015 - Abril 2016',
    duration: '7 meses',
    location: 'Rio de Janeiro, Brasil',
    highlights: [
      'Desenvolvimento de aplicações empresariais',
      'Trabalho com tecnologias Microsoft'
    ]
  },
  {
    company: 'ASSIST - Associação dos Servidores',
    role: 'Analista Desenvolvedor .NET',
    period: 'Agosto 2013 - Setembro 2015',
    duration: '2 anos 2 meses',
    location: 'Rio de Janeiro, Brasil',
    highlights: [
      'Desenvolvimento de sistemas de gestão',
      'Soluções para o setor público'
    ]
  },
  {
    company: 'ASC Solutions',
    role: 'Programador Delphi / .NET',
    period: 'Dezembro 2012 - Julho 2013',
    duration: '8 meses',
    location: 'Rio de Janeiro, Brasil',
    highlights: [
      'Desenvolvimento full-stack',
      'Trabalho com Delphi e .NET'
    ]
  }
];

const skills = {
  'IA & GenAI': [
    'RAG end-to-end',
    'LangChain / LangGraph',
    'Agentes autônomos e multiagentes',
    'Modelos de Linguagem (LLM)',
    'Prompt Engineering avançado',
    'MCP (Model Context Protocol)',
    'Embeddings e bases vetoriais',
    'Governança de IA e guardrails',
    'Observabilidade de LLM'
  ],
  'Backend & .NET': [
    'C# e .NET moderno',
    '.NET Core / .NET Framework',
    'Microservices',
    'APIs REST e RESTful',
    'Clean Architecture',
    'DDD (Domain-Driven Design)',
    'CQRS e Saga Pattern',
    'Event-Driven Architecture',
    'Arquitetura Hexagonal'
  ],
  'Cloud & DevOps': [
    'Microsoft Azure',
    'AWS (Amazon Web Services)',
    'Google Cloud Platform (GCP)',
    'Oracle Cloud Infrastructure (OCI)',
    'AKS (Azure Kubernetes Service)',
    'Azure Functions / App Services',
    'CI/CD (Azure DevOps, GitHub Actions)',
    'Infraestrutura como Código',
    'Monitoramento (Azure Monitor, Application Insights)'
  ],
  'Dados & Mensageria': [
    'SQL Server',
    'MongoDB',
    'Azure Service Bus',
    'Bases vetoriais (Pinecone, Weaviate)',
    'Pipelines de ingestão',
    'Processamento de streams',
    'Arquitetura orientada a mensagens',
    'Orquestração e coreografia'
  ],
  'Segurança': [
    'IAM e RBAC',
    'Segurança de APIs',
    'Gestão de segredos (Key Vault)',
    'Compliance (LGPD)',
    'Autenticação e autorização',
    'Criptografia de dados',
    'SecDevOps'
  ],
  'Ferramentas & Metodologias': [
    'Git / GitFlow',
    'Docker & Containers',
    'OpenTelemetry',
    'Scrum / Agile',
    'Testes automatizados',
    'Code Reviews',
    'Pair Programming',
    'Documentação técnica',
    'Mentoria de times'
  ]
};

const education = [
  {
    institution: 'Formação Autodidata',
    degree: 'Desenvolvimento de Software e Arquitetura de Sistemas',
    period: 'Aprendizado contínuo através de estudo prático e experiência de mercado'
  }
];

const certifications = [
  'Docker: Ferramenta essencial para Desenvolvedores',
  'Modelagem de domínios ricos',
  'Fundamentos de arquitetura de software',
  'Desenvolvimento Ágil de Software',
  'Modelando Domínios Ricos'
];

const projects = [
  {
    title: 'Sistema RAG Enterprise',
    description: 'Pipeline completo de Retrieval-Augmented Generation para consulta inteligente de documentos corporativos com índice vetorial e LLM.',
    tech: ['LangChain', 'Pinecone', 'Azure OpenAI', 'FastAPI', 'React'],
    impact: 'Redução de 70% no tempo de busca por informações',
    category: 'GenAI',
    featured: true,
    github: '#',
    demo: '#'
  },
  {
    title: 'Plataforma de Agentes Autônomos',
    description: 'Sistema multi-agente para automação de processos de negócio com LangGraph, orquestração de LLMs e integração com APIs corporativas.',
    tech: ['LangGraph', 'GPT-4', 'Azure Functions', 'Service Bus', 'TypeScript'],
    impact: 'Automação de 85% das tarefas repetitivas',
    category: 'GenAI',
    featured: true,
    github: '#',
    demo: '#'
  },
  {
    title: 'Arquitetura de Microserviços .NET',
    description: 'Design e implementação de arquitetura distribuída com DDD, CQRS, Event Sourcing para sistema de alta escala.',
    tech: ['.NET 8', 'Azure AKS', 'RabbitMQ', 'Redis', 'SQL Server'],
    impact: 'Sistema suporta 1M+ requisições/dia',
    category: 'Backend',
    featured: true,
    github: '#',
    demo: '#'
  },
  {
    title: 'Observabilidade LLMOps',
    description: 'Plataforma completa de monitoramento de LLMs com tracing, custos, qualidade de resposta e alertas inteligentes.',
    tech: ['OpenTelemetry', 'Datadog', 'Grafana', 'Python', 'Azure'],
    impact: 'Visibilidade 100% sobre chamadas de IA',
    category: 'GenAI',
    featured: false,
    github: '#',
    demo: '#'
  },
  {
    title: 'API Gateway Inteligente',
    description: 'Gateway de APIs com rate limiting, caching, autenticação e roteamento dinâmico para arquitetura de microserviços.',
    tech: ['Azure APIM', 'Redis', 'OAuth2', 'Terraform'],
    impact: 'Latência reduzida em 40%',
    category: 'Cloud',
    featured: false,
    github: '#',
    demo: '#'
  },
  {
    title: 'Pipeline CI/CD Multi-Cloud',
    description: 'Infraestrutura como código com deployment automatizado em múltiplas clouds (Azure, AWS, GCP).',
    tech: ['Terraform', 'GitHub Actions', 'Azure DevOps', 'Docker'],
    impact: 'Deploy em 15 minutos (era 4h)',
    category: 'DevOps',
    featured: false,
    github: '#',
    demo: '#'
  }
];

const impactMetrics = [
  { label: 'Anos de Experiência', value: 12, suffix: '+', icon: TrendingUp },
  { label: 'Projetos Entregues', value: 50, suffix: '+', icon: Rocket },
  { label: 'Desenvolvedores Mentorados', value: 30, suffix: '+', icon: Users },
  { label: 'Empresas Atendidas', value: 15, suffix: '+', icon: Globe },
  { label: 'Certificações', value: 5, suffix: '', icon: Award },
  { label: 'Artigos Técnicos', value: 20, suffix: '+', icon: BookOpen }
];

const techHighlights = [
  'GenAI &LLLMs',
  'RAG Systems',
  'Agentes Autônomos',
  '.NET Architecture',
  'Cloud Native',
  'LLMOps'
];

function AnimatedBackground() {
  const particles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
    twinkle: Math.random() > 0.6
  }));

  return (
    <div className="fixed inset-0 animated-gradient overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-black/50" />
      {particles.map(p => (
        <div
          key={p.id}
          className={`particle ${p.twinkle ? 'twinkle' : ''}`}
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`
          }}
        />
      ))}
    </div>
  );
}

function FloatingCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`glass-dark rounded-2xl p-6 shadow-lg backdrop-blur-xl ${className}`}
    >
      {children}
    </motion.div>
  );
}

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function SkillCard({ category, items }: { category: string; items: string[] }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-full"
    >
      <FloatingCard className={`h-full transition-all duration-300 ${isHovered ? 'scale-[1.02] border-blue-400/50' : ''}`}>
        <div className="flex items-center gap-3 mb-4">
          <motion.div 
            className="p-2 bg-blue-500/20 rounded-lg"
            animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            {category === 'IA & GenAI' && <Brain className="w-6 h-6 text-blue-400" />}
            {category === 'Backend & .NET' && <Code2 className="w-6 h-6 text-blue-400" />}
            {category === 'Cloud & DevOps' && <Cloud className="w-6 h-6 text-blue-400" />}
            {category === 'Dados & Mensageria' && <Database className="w-6 h-6 text-blue-400" />}
            {category === 'Segurança' && <Shield className="w-6 h-6 text-blue-400" />}
            {category === 'Ferramentas & Metodologias' && <GitBranch className="w-6 h-6 text-blue-400" />}
          </motion.div>
          <h3 className="text-xl font-bold text-white">{category}</h3>
        </div>
        <ul className="space-y-2">
          {items.map((item, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={isHovered ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-start gap-2 text-gray-300"
            >
              <CheckCircle className="w-4 h-4 mt-1 text-blue-400 flex-shrink-0" />
              <span className="text-sm">{item}</span>
            </motion.li>
          ))}
        </ul>
      </FloatingCard>
    </motion.div>
  );
}

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative flex flex-col"
    >
      <div className="flex flex-col h-full glass-dark rounded-2xl p-6 border border-blue-500/20 hover:border-blue-400/50 transition-all duration-500 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />
        
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 rounded-full">
            {project.category}
          </span>
          {project.featured && (
            <span className="px-3 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-300 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3" /> Destaque
            </span>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.map((tech) => (
            <span key={tech} className="px-2 py-1 text-xs bg-white/5 text-gray-300 rounded">
              {tech}
            </span>
          ))}
        </div>
        
        <div className="flex items-center gap-2 mb-4 text-green-400">
          <Zap className="w-4 h-4" />
          <span className="text-sm font-medium">{project.impact}</span>
        </div>
      </div>
    </motion.div>
  );
}

function ExperienceCard({ exp }: { exp: typeof experiences[0] }) {
  return (
    <FloatingCard className="border-l-4 border-blue-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{exp.role}</h3>
          <p className="text-blue-400 font-medium">{exp.company}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-2 mb-1">
            <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-300 rounded-full">
              {exp.duration}
            </span>
          </div>
          <p className="text-sm text-gray-400">{exp.period}</p>
          <p className="text-sm text-gray-400">{exp.location}</p>
        </div>
      </div>
      <ul className="space-y-2">
        {exp.highlights.map((highlight, idx) => (
          <li key={idx} className="flex items-start gap-2 text-gray-300">
            <ChevronRight className="w-4 h-4 mt-1 text-blue-400 flex-shrink-0" />
            <span className="text-sm">{highlight}</span>
          </li>
        ))}
      </ul>
    </FloatingCard>
  );
}

function App() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.9]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen text-white relative">
        <AnimatedBackground />
        
        {/* Hero Section */}
        <header className="relative z-10 px-6 py-20 md:py-32 max-w-7xl mx-auto">
          <motion.div
            style={{ opacity: headerOpacity }}
            className="flex flex-col md:flex-row items-center md:items-end gap-8 md:gap-12"
          >
            {/* Foto do rosto principal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative group"
            >
              {/* Efeito de glow atrás da foto */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              
              {/* Container da foto com glassmorphism */}
              <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden ring-2 ring-blue-500/30 group-hover:ring-blue-400/50 transition-all duration-500 shadow-2xl">
                <img 
                  src={fotoRafael} 
                  alt="Rafael Silva Souza"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Overlay gradient sutil */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
              
              {/* Indicador de status online */}
              <div className="absolute bottom-3 right-3 w-4 h-4 bg-green-400 rounded-full ring-2 ring-black/50 animate-pulse" />
            </motion.div>
            
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col md:flex-row items-center md:items-end gap-3 md:gap-4 mb-4"
              >
                <h1 className="text-2xl md:text-3xl font-bold">
                  <span className="text-white">Rafael Silva</span>
                  <span className="ml-2 md:ml-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-400 to-purple-400">
                    | Arquiteto de Soluções
                  </span>
                </h1>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg md:text-xl text-gray-300 mb-6 text-balance"
              >
                <span className="text-blue-400 font-semibold">+12 anos</span> transformando negócios através de arquiteturas escaláveis, 
                IA Generativa e inovação tecnológica. 
              </motion.p>
              
              {/* Animated tech highlights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-wrap gap-2 mb-6"
              >
                {techHighlights.map((tech, idx) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + idx * 0.05 }}
                    className="px-3 py-1 text-sm font-medium bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30"
                  >
                    {tech}
                  </motion.span>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-wrap gap-2"
              >
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 px-3 py-1 h-8" aria-label="Enviar e-mail para rafael.silva.xp@hotmail.com">
                  <Mail className="mr-1.5 h-3 w-3" />
                  rafael.silva.xp@hotmail.com
                </Button>
                <Button size="sm" variant="outline" className="px-3 py-1 h-8 border-blue-500 text-blue-400 hover:bg-blue-500/10" asChild aria-label="Abrar perfil do LinkedIn em nova aba">
                  <a 
                    href="https://www.linkedin.com/in/rafael-silva-souza" 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkedinIcon className="mr-1.5 h-3 w-3" /> LinkedIn
                  </a>
                </Button>
                <Button size="sm" variant="outline" className="px-3 py-1 h-8 border-blue-500 text-blue-400 hover:bg-blue-500/10" asChild aria-label="Baixar currículo em formato PDF">
                  <a 
                    href="/curriculo.pdf" 
                    download="Rafael_Silva_Souza_Curriculo.pdf"
                  >
                    <svg className="mr-1.5 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Baixar CV
                  </a>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </header>

        {/* Avatar & Metrics Section - Layout em duas colunas */}
        <section className="relative z-10 px-6 py-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            
            {/* Coluna esquerda - 6 cards em grid 3x2 */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {impactMetrics.map((metric, idx) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass-dark rounded-xl p-4 text-center border border-blue-500/10 hover:border-blue-500/30 transition-colors"
                  >
                    <metric.icon className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                      <AnimatedCounter value={metric.value} suffix={metric.suffix} />
                    </div>
                    <div className="text-xs text-gray-400">{metric.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            
            {/* Coluna direita - Avatar maior */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center justify-center lg:justify-end"
            >
              <div className="relative">
                {/* Avatar boneco - maior e com fundo transparente */}
                <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-2xl overflow-hidden bg-transparent">
                  <img 
                    src={avatarRafael} 
                    alt="Avatar de Rafael"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Competências <span className="text-blue-400">Técnicas</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Expertise em arquitetura de software, inteligência artificial generativa, 
                cloud computing e desenvolvimento de soluções escaláveis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(skills).map(([category, items]) => (
                <SkillCard key={category} category={category} items={items} />
              ))}
            </div>
          </motion.div>
        </section>

        {/* Projects Section */}
        <section className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full text-blue-300 text-sm mb-6"
              >
                <Rocket className="w-4 h-4" />
                Projetos em Destaque
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Soluções que{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  Geram Valor
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Projetos reais com impacto mensurável em produção, desde arquiteturas de IA até sistemas distribuídos de alta escala.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, idx) => (
                <ProjectCard key={project.title} project={project} index={idx} />
              ))}
            </div>
          </motion.div>
        </section>

        {/* Experience Section */}
        <section className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-blue-400">Experiência</span> Profissional
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Trajetória sólida em projetos desafiadores e posições de liderança técnica.
              </p>
            </div>

            <div className="space-y-6">
              {experiences.map((exp) => (
                <ExperienceCard key={`${exp.company}-${exp.role}-${exp.period}`} exp={exp} />
              ))}
            </div>
          </motion.div>
        </section>

        {/* Certifications & Education */}
        <section className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Formação & <span className="text-blue-400">Certificações</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <FloatingCard>
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-8 h-8 text-blue-400" />
                  <h3 className="text-2xl font-bold text-white">Certificações</h3>
                </div>
                <ul className="space-y-3">
                  {certifications.map((cert) => (
                    <li key={cert} className="flex items-start gap-3">
                      <Star className="w-5 h-5 mt-1 text-yellow-400" />
                      <span className="text-gray-300">{cert}</span>
                    </li>
                  ))}
                </ul>
              </FloatingCard>

              <FloatingCard>
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="w-8 h-8 text-blue-400" />
                  <h3 className="text-2xl font-bold text-white">Educação</h3>
                </div>
                <ul className="space-y-4">
                  {education.map((edu, idx) => (
                    <li key={idx} className="flex flex-col gap-1">
                      <p className="font-semibold text-white">{edu.institution}</p>
                      <p className="text-blue-300">{edu.degree}</p>
                      <p className="text-sm text-gray-400">{edu.period}</p>
                    </li>
                  ))}
                </ul>
              </FloatingCard>
            </div>
          </motion.div>
        </section>

        {/* Contact Section */}
        <section className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card className="bg-gradient-to-br from-blue-900/40 to-blue-950/40 border-blue-500/30 overflow-hidden">
              <CardContent className="p-12 text-center">
                <Sparkles className="w-16 h-16 text-blue-400 mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-6">
                  Vamos Construir o Futuro Juntos?
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Estou aberto a novos desafios e oportunidades em arquitetura de 
                  software, inteligência artificial e inovação tecnológica.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Mail className="mr-2 h-5 w-5" />
                    Enviar E-mail
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a 
                      href="https://www.linkedin.com/in/rafael-silva-souza" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
                    >
                      <LinkedinIcon className="mr-2 h-5 w-5" /> Conectar no LinkedIn
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 px-6 py-12 border-t border-blue-500/20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-gray-400">
                © {new Date().getFullYear()} Rafael Silva Souza. Todos os direitos reservados.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Arquiteto de Soluções | Tech Lead | GenAI & LLMOps
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="https://www.linkedin.com/in/rafael-silva-souza" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                <LinkedinIcon className="w-6 h-6" />
              </a>
              <a 
                href="mailto:rafael.silva.xp@hotmail.com"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;

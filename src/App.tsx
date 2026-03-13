import { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { motion } from 'framer-motion';
import { LinkedinIcon, Mail, ChevronRight, Star, Award, BookOpen, Sparkles, Zap, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Hero from './components/sections/Hero';
import MetricsSection from './components/sections/Metrics';
import SkillsSection from './components/sections/Skills';
import FloatingCard from './utils/FloatingCard';
import FluidBackground from './components/FluidBackground';

const experiences = [
  {
    company: 'V8.TECH',
    role: 'Arquiteto de Soluções',
    period: 'Junho 2025 - Presente',
    duration: '8 meses',
    location: 'Remoto',
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
    location: 'Remoto',
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
    location: 'Remoto',
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
    location: 'Remoto',
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
    location: 'Remoto',
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
    location: 'Rio de Janeiro, Brasil',
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

// FloatingCard movido para utils/FloatingCard.tsx

// AnimatedCounter movido para utils/AnimatedCounter.tsx

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative flex flex-col"
    >
      <Card className="flex flex-col h-full" withGlow>
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />
        
        <CardContent className="relative z-10 flex flex-col flex-grow">
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
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ExperienceCard({ exp }: { exp: typeof experiences[0] }) {
  return (
    <FloatingCard>
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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen text-white relative arterer-bg">
        <FluidBackground />
        
        <Hero />

        <MetricsSection />

        <SkillsSection />

        {/* Projects Section */}
        <section className="relative z-10 px-6 py-6 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full text-blue-300 text-sm mb-4"
              >
                <Rocket className="w-4 h-4" />
                Projetos em Destaque
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
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
        <section className="relative z-10 px-6 py-6 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
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
        <section className="relative z-10 px-6 py-6 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
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
        <section className="relative z-10 px-6 py-6 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 overflow-hidden" withGlow>
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
                  <Button size="lg" variant="outline" asChild>
                    <a 
                      href="https://www.linkedin.com/in/rafael-souza" 
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
                © {new Date().getFullYear()} Rafael Souza. Todos os direitos reservados.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Arquiteto de Soluções | Tech Lead | GenAI & LLMOps
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="https://www.linkedin.com/in/rafael-souza" 
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

import { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Brain,
  Cloud,
  Database,
  Shield,
  Code2,
  Linkedin,
  Mail,
  ChevronRight,
  Star,
  Award,
  BookOpen,
  Sparkles,
  GitBranch,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import fotoRafael from '../foto.jpeg';

const experiences = [
  {
    company: 'V8.TECH',
    role: 'Arquiteto de Soluções',
    period: 'Junho 2025 - Presente',
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
    location: 'São Paulo, Brasil',
    highlights: [
      'Atuação como especialista .NET',
      'Desenvolvimento de soluções empresariais',
      'Arquitetura de sistemas complexos',
      'Integração com múltiplas plataformas'
    ]
  },
  {
    company: 'Avenue Code',
    role: 'Senior Software Engineer .NET',
    period: 'Dezembro 2021 - Março 2023',
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

function AnimatedBackground() {
  const particles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5
  }));

  return (
    <div className="fixed inset-0 animated-gradient overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-black/50" />
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
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

function SkillCard({ category, items }: { category: string; items: string[] }) {
  return (
    <FloatingCard className="h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          {category === 'IA & GenAI' && <Brain className="w-6 h-6 text-blue-400" />}
          {category === 'Backend & .NET' && <Code2 className="w-6 h-6 text-blue-400" />}
          {category === 'Cloud & DevOps' && <Cloud className="w-6 h-6 text-blue-400" />}
          {category === 'Dados & Mensageria' && <Database className="w-6 h-6 text-blue-400" />}
          {category === 'Segurança' && <Shield className="w-6 h-6 text-blue-400" />}
          {category === 'Ferramentas & Metodologias' && <GitBranch className="w-6 h-6 text-blue-400" />}
        </div>
        <h3 className="text-xl font-bold text-white">{category}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-gray-300">
            <CheckCircle className="w-4 h-4 mt-1 text-blue-400 flex-shrink-0" />
            <span className="text-sm">{item}</span>
          </li>
        ))}
      </ul>
    </FloatingCard>
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
            className="flex flex-col md:flex-row items-center gap-12"
          >
            <div className="flex-shrink-0">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-2xl glass-dark flex items-center justify-center overflow-hidden">
                <img 
                  src={fotoRafael} 
                  alt="Rafael Silva Souza"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="text-center md:text-left">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-500"
              >
                Arquiteto de Soluções
                <br />
                <span className="text-3xl md:text-4xl text-blue-300">e Software</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg md:text-xl text-gray-300 mb-8 text-balance max-w-2xl"
              >
                Especialista em Inteligência Artificial Generativa, LLMOps, RAG e 
                Arquiteturas de Agentes com sólida experiência em arquitetura de software 
                escalável, governança e automação.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-wrap gap-3 justify-center md:justify-start"
              >
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Mail className="mr-2 h-5 w-5" />
                  rafael.silva.xp@hotmail.com
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a 
                    href="https://www.linkedin.com/in/rafael-silva-souza" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
                  >
                    <Linkedin className="mr-2 h-5 w-5" />
                    LinkedIn
                  </a>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </header>

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(skills).map(([category, items]) => (
                <SkillCard key={category} category={category} items={items} />
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
                      <Linkedin className="mr-2 h-5 w-5" />
                      Conectar no LinkedIn
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
                <Linkedin className="w-6 h-6" />
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
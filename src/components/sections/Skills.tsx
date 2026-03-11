import React, { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Brain, Code2, Cloud, Database, Shield, GitBranch, CheckCircle } from 'lucide-react';


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
  ],
  'Soluções que Geram Valor': [
    'Otimização de performance e escalabilidade',
    'Redução de custos operacionais',
    'Inovação através de IA generativa',
    'Soluções cloud nativas e eficientes',
    'Integrações seguras e de alto impacto'
  ]
};

const iconMap = {
  'IA & GenAI': Brain,
  'Backend & .NET': Code2,
  'Cloud & DevOps': Cloud,
  'Dados & Mensageria': Database,
  'Segurança': Shield,
  'Ferramentas & Metodologias': GitBranch,
  'Soluções que Geram Valor': CheckCircle
};

const SkillsSection: React.FC = () => {
  
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  

  const SkillCard = ({ category, items }: { category: string; items: string[] }) => {
    
    const Icon = iconMap[category as keyof typeof iconMap];

    

    return (
      <motion.div
        variants={cardVariants}
        className="h-full relative"
        
        
      >
        <div className="h-full w-full glass-dark rounded-2xl p-6 shadow-2xl border border-blue-500/20 backdrop-blur-xl flex flex-col">
          
            <div className="flex items-center gap-4 mb-4">
              <motion.div 
                className="p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex-shrink-0"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.4, type: 'spring' }}
              >
                <Icon className="w-8 h-8 text-cyan-400" />
              </motion.div>
              <h3 className="text-2xl md:text-3xl font-bold text-white">{category}</h3>
            </div>
            <ul className="space-y-1 flex-1">
              {items.map((item, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-3 text-gray-300"
                  
                >
                  <CheckCircle className="w-4 h-4 mt-1 text-cyan-400 flex-shrink-0" />
                  <span className="text-xs">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
      </motion.div>
    );
  };

  return (
    <section ref={ref} className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2 
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          Competências <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">Técnicas</span>
        </motion.h2>
        <motion.p 
          className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Experiência em arquitetura de software, inteligência artificial, cloud e desenvolvimento de soluções escaláveis e inovadoras.
        </motion.p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12 items-stretch"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {Object.entries(skills).map(([category, items]) => (
          <SkillCard key={category} category={category} items={items} />
        ))}
      </motion.div>
    </section>
  );
};

export default SkillsSection;

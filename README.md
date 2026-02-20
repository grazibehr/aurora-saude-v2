# Aurora Saúde

Aplicação web para monitoramento de saúde pessoal. Permite registrar sintomas, acompanhar bem-estar, gerenciar ficha médica e obter insights personalizados sobre a saúde do usuário.

## Funcionalidades

- **Autenticação** — Cadastro e login com JWT
- **Onboarding** — Configuração inicial do perfil de saúde
- **Dashboard** — Visão geral com sintomas recentes e atalhos rápidos
- **Registro de Sintomas** — Adicione e acompanhe sintomas com tipo e intensidade
- **Histórico** — Linha do tempo completa dos registros
- **Ficha Médica** — Condições, medicamentos, alergias, tipo sanguíneo e contato de emergência
- **Bem-estar** — Check-in diário, hidratação, exercícios de respiração e alongamento
- **Insights** — Análise de tendências, score de saúde, alertas de interação medicamentosa e dicas personalizadas

## Tecnologias

- [Vue 3](https://vuejs.org/) com Composition API
- [Vite](https://vitejs.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Vue Router 4](https://router.vuejs.org/)
- [VueUse](https://vueuse.org/)
- [Lucide Vue](https://lucide.dev/)
- [jsPDF](https://github.com/parallax/jsPDF) — exportação de relatórios

## Backend

> Repositório do backend: [aurora-saude-backend](https://github.com/grazibehr/aurorasaude-backend)

### Principais endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/login` | Login |
| POST | `/auth/cadastro` | Cadastro |
| PUT | `/auth/profile` | Atualizar perfil |
| GET | `/medical-record` | Ficha médica |
| POST | `/medical-record/diseases` | Adicionar condição |
| POST | `/medical-record/medications` | Adicionar medicamento |
| POST | `/medical-record/allergies` | Adicionar alergia |
| GET/POST | `/usuario/sintoma/*` | Sintomas |
| GET/POST | `/checkins` | Check-ins de bem-estar |
| GET | `/analysis/trends` | Análise de tendências |
| GET | `/analysis/score` | Score de saúde |
| GET | `/analysis/tips` | Dicas personalizadas |

## Instalação e uso

```bash
# Instalar dependências
npm install

# Servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## Estrutura do projeto

```
src/
├── components/
│   ├── insights/     # Componentes de análise e insights
│   ├── medical/      # Componentes da ficha médica
│   ├── wellness/     # Componentes de bem-estar
│   ├── layout/       # Header, Sidebar, AppLayout
│   └── ui/           # Componentes base reutilizáveis
├── composables/      # Lógica reutilizável (useAuth, useSymptoms, etc.)
├── views/            # Páginas da aplicação
├── router/           # Configuração de rotas com guards de autenticação
├── services/         # Camada de comunicação com a API
├── utils/            # Utilitários (segurança, validação)
└── data/             # Dados estáticos (doenças, medicamentos)
```

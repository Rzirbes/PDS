# Team ZQ

Aplicativo mobile desenvolvido com **React Native** para **personal trainers e equipes técnicas**, com foco em **agendamento de treinos**, **monitoramento de carga**, **bem-estar**, **lesões** e **gestão de atletas e colaboradores**.

---

## Tecnologias Utilizadas

- **React Native (Expo)**
- **TypeScript**
- **NativeWind** (Tailwind para React Native)
- **react-native-svg-charts** (Gráficos)
- **react-native-tab-view** (Abas de navegação)
- **react-navigation**
- **Zod + react-hook-form** (validações e formulários)
- **SWR** (fetch e cache de dados mockados ou da API)
- **Mock API / DTOs customizados**
- Integração futura com **backend em Next.js** e banco **PostgreSQL (via Prisma)**

---

## Funcionalidades

### Atuais (MVP)
- [x] Lista de **atletas** com pesquisa
- [x] Cadastro completo de atleta (foto, posição, histórico de lesões, objetivos etc.)
- [x] Lista de **colaboradores** com busca
- [x] Cadastro de colaboradores e seleção de cor
- [x] Tela de **agenda** com treinos diários por colaborador
- [x] **Filtros por data e colaborador**
- [x] **Gráfico de carga semanal** do atleta
- [x] Sistema de **planejamento de treino** com opção de agendamento automático
- [x] Tela de **relatórios** por atleta e por colaborador

### Em desenvolvimento
- [ ] Login e autenticação com JWT
- [ ] Integração com banco de dados real (PostgreSQL via Prisma)
- [ ] Envio de e-mails automatizados
- [ ] Sincronização em tempo real com agenda web

---

## Como Rodar Localmente

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/fitplanner-mobile.git
cd fitplanner-mobile
```

2. Instale as dependências:

```bash
pnpm install
```


3. Rode o app com Expo:

```bash
npx expo start
```

4. Escaneie o QR code com o app do Expo Go ou emulador Android/iOS:


## Estrutura Principal

```text
/src
├── components → Componentes reutilizáveis (inputs, botões, cards, etc.)
├── screens    → Telas principais da aplicação (Agenda, Atletas, Relatórios, etc.)
├── mocks      → Dados simulados para desenvolvimento e testes locais
├── hooks      → Custom Hooks (como validações, integração com contextos, SWR, etc.)
├── utils      → Funções utilitárias reutilizáveis
├── types      → Tipagens globais e Data Transfer Objects (DTOs)
└── services   → Lógica de acesso à API e integração com backend

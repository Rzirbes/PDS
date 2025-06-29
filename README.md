
# Team ZQ Mobile

Aplicativo mobile desenvolvido com **React Native** para **personal trainers** e **equipes técnicas**, com foco em:

✅ **Agendamento de treinos**  
✅ **Monitoramento de carga de treino**  
✅ **Bem-estar e lesões**  
✅ **Gestão de atletas e colaboradores**  
✅ **Autenticação segura com JWT + Refresh Token**

---

## 🚀 Tecnologias Utilizadas

- **React Native (Expo)**
- **TypeScript**
- **React Navigation**
- **react-native-svg-charts** (Gráficos)
- **react-native-tab-view** (Navegação por abas)
- **Zod + React Hook Form** (Validação de formulários)
- **SWR** (Cache de dados e fetcher)
- **AsyncStorage** (Persistência de tokens)
- **API personalizada com `apiFetch`** (Controle central de autenticação + refresh token)
- Integração futura com **Nest.js (backend)** e **PostgreSQL (via Prisma)**

---

## ✅ Funcionalidades Concluídas (MVP)

- ✅ **Login com JWT**
- ✅ **Persistência de sessão com Keep Connected**
- ✅ **Refresh Token automático**
- ✅ **Logout com limpeza de sessão**
- ✅ **Proteção de rotas privadas**
- ✅ Lista de **atletas** com pesquisa
- ✅ Cadastro completo de atleta (foto, posição, lesões, objetivos, etc)
- ✅ Lista de **colaboradores** com busca
- ✅ Cadastro de colaboradores com seleção de cor
- ✅ **Agenda diária** de treinos por colaborador
- ✅ **Filtros por data e colaborador**
- ✅ **Gráfico de carga semanal**
- ✅ **Planejamento de treino com agendamento automático**
- ✅ **Relatórios por atleta e por colaborador**

---

## 🔨 Em desenvolvimento

- 🔄 **Integração com banco de dados real (PostgreSQL via Prisma)**
- ✉️ **Envio de e-mails automatizados**
- 🔗 **Sincronização em tempo real com a agenda web**
- 📊 **Tratamento global de erros de API (toasts/modals)**

---

## ⚙️ Como Rodar Localmente

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/team-zq-mobile.git
cd team-zq-mobile
```

2. Instale as dependências:

```bash
pnpm install
```

3. Configure o `.env` com a URL da sua API:

```env
API_URL=https://seu-backend-url/api/
```

4. Rode o app com Expo:

```bash
npx expo start
```

5. Escaneie o QR code com o app do Expo Go ou rode em um emulador.

---

## 📂 Estrutura Principal

```text
src/
├── components    → Componentes reutilizáveis (Inputs, Cards, Menus, etc)
├── screens       → Telas principais da aplicação (Login, Home, Agenda, Atletas, etc)
├── hooks         → Custom Hooks (useAuth, useTheme, useFetch etc)
├── services      → Lógica de API (apiFetch, session-service, auth-service etc)
├── context       → Contextos globais (Auth, Theme etc)
├── mocks         → Dados simulados
├── utils         → Helpers e funções auxiliares
└── types         → Tipagens globais e DTOs
```

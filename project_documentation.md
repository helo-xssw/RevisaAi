# Documentação do Projeto RevisaAI

## Visão Geral do Projeto

Este é um aplicativo móvel desenvolvido com React Native e Expo. O projeto utiliza Expo Router para a navegação e gerenciamento de rotas, e implementa um sistema de autenticação para proteger certas partes do aplicativo. O estado de autenticação é gerenciado através de um Contexto React e persistido no dispositivo usando `AsyncStorage`.

## Estrutura de Arquivos

```
/home/verissimo/eng-Software2/RevisaAI
|-- app.json
|-- expo-env.d.ts
|-- package.json
|-- tsconfig.json
|-- metro.config.js
|-- assets/
|   |-- images/
|-- src/
|   |-- app/
|   |   |-- _layout.tsx
|   |   |-- signIn.tsx
|   |   |-- (protected)/
|   |       |-- _layout.tsx
|   |       |-- index.tsx
|   |-- contexts/
|   |   |-- authContext.tsx
|   |-- hooks/
|       |-- useAuth.tsx
```

## Documentação do Código

### `src/contexts/authContext.tsx`

Este arquivo define o `AuthContext` e o `AuthProvider`, que são responsáveis por gerenciar o estado de autenticação do usuário.

- **`AuthState`**: Uma interface TypeScript que define a forma do estado de autenticação, incluindo `isLoggedIn`, `isReady`, e as funções `signIn` e `signOut`.
- **`AuthContext`**: Um Contexto React criado para prover o estado de autenticação para os componentes filhos.
- **`AuthProvider`**: O componente provedor que envolve a aplicação. Ele gerencia o estado de `isLoggedIn` e `isReady`.
    - **`storageState`**: Função assíncrona que salva o estado de autenticação no `AsyncStorage`.
    - **`signIn`**: Função que atualiza o estado para `isLoggedIn = true`, persiste o estado e redireciona o usuário para a rota principal (`/`).
    - **`signOut`**: Função que atualiza o estado para `isLoggedIn = false`, persiste o estado e redireciona o usuário para a tela de login (`/signIn`).
    - **`useEffect`**: Carrega o estado de autenticação do `AsyncStorage` quando o componente é montado, garantindo que o estado do usuário seja restaurado entre as sessões.

### `src/hooks/useAuth.tsx`

Este é um hook customizado que simplifica o acesso ao `AuthContext`.

- **`useAuth`**: Retorna o contexto de autenticação, permitindo que qualquer componente funcional acesse `isLoggedIn`, `isReady`, `signIn`, e `signOut` sem precisar usar `useContext(AuthContext)` diretamente.

### `src/app/_layout.tsx`

Este é o layout principal da aplicação, usando o Expo Router.

- Ele envolve toda a aplicação com o `AuthProvider` para que o contexto de autenticação esteja disponível em todos os lugares.
- Define a estrutura de navegação principal usando `Stack` do Expo Router.
- Configura as telas para o grupo de rotas `(protected)` e a tela `signIn`. A tela `(protected)` tem o cabeçalho oculto.

### `src/app/(protected)/_layout.tsx`

Este é o layout para as rotas protegidas.

- Utiliza o hook `useAuth` para verificar se o usuário está logado (`isLoggedIn`).
- Se o usuário não estiver logado, ele é redirecionado para a tela de `/signIn`.
- Se o usuário estiver logado, ele renderiza as telas dentro do grupo `(protected)`, como a `index`.

### `src/app/(protected)/index.tsx`

Esta é a tela principal (home) da área protegida do aplicativo.

- Mostra um botão "Sair" que, quando pressionado, chama a função `signOut` do contexto de autenticação.

### `src/app/signIn.tsx`

Esta é a tela de login.

- Mostra um botão "Entrar" que, quando pressionado, chama a função `signIn` do contexto de autenticação.

## Dependências (`package.json`)

O projeto utiliza as seguintes dependências principais:

- **`expo`**: Framework principal para construir a aplicação.
- **`expo-router`**: Para navegação baseada em arquivos.
- **`react`** e **`react-native`**: Para construir a interface do usuário.
- **`@react-native-async-storage/async-storage`**: Para persistir dados localmente no dispositivo.
- **`typescript`**: Para tipagem estática do código.

## Arquivos de Configuração

### `tsconfig.json`

Arquivo de configuração do TypeScript.

- **`extends`**: Herda a configuração base do `expo/tsconfig.base`.
- **`compilerOptions.paths`**: Configura aliases de caminho, permitindo importar módulos de `src/` usando `@/*`. Isso ajuda a evitar caminhos de importação relativos longos (ex: `import { useAuth } from '@/hooks/useAuth'`).

### `metro.config.js`

Arquivo de configuração para o Metro Bundler, o bundler de JavaScript para React Native.

- **`getDefaultConfig`**: Obtém a configuração padrão do Metro fornecida pelo Expo.
- **`resolver.extraNodeModules`**: Adiciona suporte para os aliases de caminho definidos no `tsconfig.json`, garantindo que o Metro possa resolver os módulos importados com o alias `@`. Sem essa configuração, o Metro falharia ao tentar encontrar os módulos.

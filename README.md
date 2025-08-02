# 🏋️ GymPass Style App

Aplicação para gerenciamento de academias e check-ins de usuários, inspirada no modelo GymPass. 


O objetivo é facilitar o gerenciamento de academias, usuários e check-ins, garantindo regras de negócio como validação de distância, controle de duplicidade, permissões administrativas, cadastro, autenticação, busca de academias, realização e validação de check-ins.

Este projeto é uma API RESTful desenvolvida em Node.js com TypeScript, utilizando Fastify e Prisma ORM para integração com banco de dados PostgreSQL. 


## ✅ Pré-requisitos

* Node.js (>= 18)
* npm ou yarn
* Docker (opcional, para facilitar setup do banco)

Claro, aqui está o trecho ajustado com os blocos de código separados por etapa:

---

## 🚀 Como iniciar o projeto

1. **Clone o repositório**

    ```sh
    git clone <url-do-repo>
    ```

2. **Instale as dependências**

    ```sh
    npm install
    ```

3. **Configure o banco de dados**
    
    Copie o arquivo `.env.example` para `.env` e ajuste os valores conforme necessário.

4. **Criação do Database (Postgres) com Docker**

    ```sh
    docker compose up -d
    ```

5. **Execute as migrations do Prisma**

    ```sh
    npx prisma migrate dev
    ```

6. **Inicie o servidor em modo desenvolvimento**

    ```sh
    npm run dev
    ```

7. **(Opcional) Execute os testes**

    ```sh
    npm run test
    ```

8. **Execute os endpoints da aplicação**

   Utilize o arquivo `api-requests/api-tests-node-api-solid-aula.postman.json` no Postman para testar os endpoints.
  
    > Nem todos os endpoints constam no arquivo acima, pois foram validados com scripts automatizados de testes end-to-end.
## 📮 Tabela de Endpoints

### 👤 Usuário

| Método | Rota        | Descrição                |
| ------ | ----------- | ------------------------ |
| POST   | `/users`    | Cadastro de usuário      |
| POST   | `/sessions` | Autenticação (login)     |
| GET    | `/me`       | Perfil do usuário logado |

### 🏋️ Academias

| Método | Rota           | Descrição                    |
| ------ | -------------- | ---------------------------- |
| POST   | `/gyms`        | Cadastro de academia (admin) |
| GET    | `/gyms/search` | Buscar academias por nome    |
| GET    | `/gyms/nearby` | Buscar academias próximas    |

### 📍 Check-ins

| Método | Rota                             | Descrição                         |
| ------ | -------------------------------- | --------------------------------- |
| POST   | `/gyms/:gymId/check-ins`         | Realizar check-in em academia     |
| GET    | `/check-ins/history`             | Histórico de check-ins do usuário |
| GET    | `/check-ins/metrics`             | Número de check-ins do usuário    |
| PATCH  | `/check-ins/:checkInId/validate` | Validar check-in (admin)          |

## 📌 Observações Técnicas

### 🔐 Autenticação

* Utiliza JWT (JSON Web Token) para autenticação de usuários.
* Middleware para verificação de token e permissões (admin).

### 🧪 Testes

* Testes criados com Vitest.
* Banco de testes isolado com SQLite em memória.

### 📏 Regras de negócio (RNs)

* O usuário não deve poder se cadastrar com um e-mail duplicado.
* O usuário não pode fazer 2 check-ins no mesmo dia.
* O usuário não pode fazer check-in se não estiver perto (100m) da academia.
* O check-in só pode ser validado até 20 minutos após ser criado.
* O check-in só pode ser validado por administradores.
* A academia só pode ser cadastrada por administradores.

### ✅ Requisitos funcionais (RFs)

* [x] Deve ser possível se cadastrar;
* [x] Deve ser possível se autenticar;
* [x] Deve ser possível obter o perfil de um usuário logado;
* [x] Deve ser possível obter o número de check-ins realizados pelo usuário logado;
* [x] Deve ser possível o usuário obter o seu histórico de check-ins;
* [x] Deve ser possível o usuário buscar academias próximas (até 10km);
* [x] Deve ser possível o usuário buscar academias pelo nome;
* [x] Deve ser possível o usuário realizar check-in em uma academia;
* [x] Deve ser possível validar o check-in de um usuário;
* [x] Deve ser possível cadastrar uma academia;

### ⚙️ Requisitos não-funcionais (RNFs)

* [x] A senha do usuário precisa estar criptografada;
* [x] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
* [x] Todas listas de dados precisam estar paginadas com 20 itens por página;
* [x] O usuário deve ser identificado por um JWT (JSON Web Token);
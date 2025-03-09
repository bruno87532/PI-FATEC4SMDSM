**Guia de Uso das APIs - Backend**

---

## 1. Criação de Usuário

- **Tipo de Requisição:** `POST`
- **Endpoint:** `/users`
- **Parâmetros Obrigatórios:** `name`, `email`

### Validações:

**Email:**
- Deve ser um endereço de email válido e não pode estar vazio.
- **Mensagens de erro:**
  - `"The email is required"`
  - `"The email must be a valid email"`

**Nome:**
- Deve ser uma string contendo entre 3 e 200 caracteres.
- **Mensagens de erro:**
  - `"The name must be between 3 and 200 characters long"`
  - `"The name must be a string"`
  - `"The name is required"`

### Resposta de Sucesso:
```json
{
    "id": "1e126185-119a-4f6b-bd02-5878de1c040f",
    "name": "Bruno Henrique Guinerio",
    "email": "pifatecdsm4sm@gmail.com",
    "phone": null
}
```

### Validações Internas:
- Caso o email já esteja cadastrado:
```json
{
    "message": "Email already registered",
    "error": "Bad Request",
    "statusCode": 400
}
```

**Próximo Passo:**
Após a criação bem-sucedida, um código de verificação (`randomCode`) será enviado para o email do usuário.

---

## 2. Verificação de Conta

- **Tipo de Requisição:** `POST`
- **Endpoint:** `/auth/verify-code`
- **Parâmetros Obrigatórios:** `idUser`, `randomCode`

### Validações:

**ID do Usuário (`idUser`):**
- Deve ser uma string válida e não pode estar vazia.
- **Mensagens de erro:**
  - `"The idUser is required"`
  - `"The idUser must be a string"`

**Código de Verificação (`randomCode`):**
- Deve ser uma string contendo exatamente 6 caracteres.
- **Mensagens de erro:**
  - `"The randomCode must be 6 characters long"`
  - `"The randomCode is required"`
  - `"The random code must be a string"`

### Resposta de Sucesso:
```json
{
    "message": "Code verified successfully",
    "statusCode": 200
}
```

### Validações Internas:
- **Código expirado (expira em 5 minutos):**
```json
{
    "message": "Expired code",
    "error": "Bad Request",
    "statusCode": 400
}
```
- **Código inválido:**
```json
{
    "message": "Invalid code",
    "error": "Bad Request",
    "statusCode": 400
}
```
- **Conta já verificada:**
```json
{
    "message": "User already verified",
    "error": "Bad Request",
    "statusCode": 400
}
```

---

## 3. Criação de Nova Senha

- **Tipo de Requisição:** `POST`
- **Endpoint:** `/auth/new-password`
- **Parâmetros Obrigatórios:** `idUser`, `randomCode`, `password`

### Validações:

**ID do Usuário (`idUser`):**
- Deve ser uma string válida e não pode estar vazia.
- **Mensagens de erro:**
  - `"The idUser must be a string"`
  - `"The idUser is required"`

**Senha (`password`):**
- Deve conter:
  - Pelo menos 8 caracteres.
  - Pelo menos 5 números.
  - Pelo menos 1 letra maiúscula.
  - Pelo menos 1 letra minúscula.
  - Pelo menos 1 caractere especial.
- **Mensagens de erro:**
  - `"The password must be at least 8 characters long"`
  - `"The password must have at least 1 uppercase character"`
  - `"The password must have at least 1 lowercase character"`
  - `"Password must have at least 1 special character"`
  - `"Password must have at least 5 numeric characters"`

### Resposta de Sucesso:
```json
{
    "message": "User updated successfully",
    "statusCode": 200
}
```

### Validações Internas:
- **Código inválido:**
```json
{
    "message": "Invalid randomCode",
    "error": "Bad Request",
    "statusCode": 400
}
```
- **Usuário não ativado:**
```json
{
    "message": "User is not activated",
    "error": "Bad Request",
    "statusCode": 400
}
```

---

## 4. Recuperação de Senha ou Email

- **Tipo de Requisição:** `POST`
- **Endpoint:** `/auth/recover`
- **Parâmetros Obrigatórios:** `email`, `type`

### Validações:

**Email (`email`):**
- Deve ser um endereço de email válido.
- **Mensagens de erro:**
  - `"The email must be a valid email"`
  - `"The email is required"`

**Tipo (`type`):**
- Deve ser `PASSWORD` ou `EMAIL`.
- **Mensagens de erro:**
  - `"The type must be PASSWORD or EMAIL"`
  - `"The type is required"`

### Resposta de Sucesso:
```json
{
    "message": "An email was sent",
    "statusCode": 200
}
```

---

# Entrega e publicação do site

Guia para colocar o site no ar no domínio do cliente. O código já está pronto; o que falta é
**hospedar** e **apontar o domínio**. Leva cerca de 20 minutos.

---

## O que o cliente precisa ter

| Item | Para quê | Custo aproximado |
|---|---|---|
| **Conta no GitHub** | guardar o código do site | gratuita |
| **Conta na Vercel** | hospedar o site e gerar o endereço | gratuita para projetos pessoais; plano pago para uso comercial |
| **Domínio** (ex.: `suamarca.com.br`) | o endereço definitivo | R$ 40 a R$ 60 por ano no Registro.br |

**O que você precisa me enviar antes:**
1. **Nome de usuário do GitHub** (ex.: `minhaempresa`) — é para lá que transfiro o repositório.
2. **E-mail da conta da Vercel** — para eu confirmar que a publicação aparece na conta certa.
3. **Domínio escolhido**, já comprado ou o nome desejado.

---

## Passo a passo depois que eu enviar o repositório

### 1. Aceitar o repositório
Chega um convite por e-mail do GitHub. Basta aceitar: o código passa a ser da conta do cliente, com
todo o histórico.

### 2. Criar a conta na Vercel
Em <https://vercel.com>, clicar em **Sign Up** e escolher **Continue with GitHub**. Isso já liga as
duas contas.

### 3. Publicar
1. **Add New → Project**.
2. Achar o repositório na lista e clicar em **Import**.
   *Se ele não aparecer:* clicar em **Adjust GitHub App Permissions** e liberar o repositório.
3. Clicar em **Deploy**. Não é preciso configurar nada: a Vercel reconhece o Next.js sozinha.
4. Em 1 a 2 minutos o site está no ar num endereço provisório, tipo `nome-do-site.vercel.app`.

### 4. Apontar o domínio
1. No projeto: **Settings → Domains → Add**, digitar o domínio.
2. A Vercel mostra os registros de DNS.
3. Copiar esses registros para o painel onde o domínio foi comprado (Registro.br, Hostinger, GoDaddy…).
4. A propagação leva de alguns minutos a algumas horas. O certificado HTTPS é emitido sozinho.

### 5. Pronto
A partir daí, toda alteração enviada ao repositório publica sozinha, sem ninguém subir arquivo.

---

## Manutenção

Se eu ficar responsável por ajustes, o cliente me adiciona em **Settings → Collaborators** no GitHub.
Assim eu altero o código e o site atualiza sozinho, sem que eu precise entrar na conta dele.

## Perguntas frequentes

**O site sai do ar se eu parar de pagar alguém?**
Não. Domínio, hospedagem e código ficam em contas do cliente. Ninguém tem como desligar o site por fora.

**Dá para mudar textos e preços depois?**
Sim. Os textos ficam concentrados em um arquivo de configuração. Alterações simples são rápidas.

**Preciso de servidor próprio?**
Não. A Vercel cuida da infraestrutura. Para uso comercial, verifique o plano adequado no site dela.

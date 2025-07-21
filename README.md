
# Wordpress Viewer & Visualizador de Posts

Este projeto contém duas aplicações integradas:

- **wordpress-viewer**: Um site Next.js que busca e exibe todas as matérias do site WordPress (portalbarcarena.com.br), permitindo baixar todos os posts em um arquivo JSON para migração.
- **ver-posts**: Um visualizador React (Vite) para abrir, buscar, filtrar e visualizar os posts baixados em JSON, facilitando a conferência e migração dos conteúdos.

- O site para baixar os posts [https://baixar-post-do-wordpress-fu6b.vercel.app/](https://baixar-post-do-wordpress-fu6b.vercel.app/)
- O visualizador estará em [https://baixar-post-do-wordpress-qvto.vercel.app/](https://baixar-post-do-wordpress-qvto.vercel.app/)

---

## Funcionalidades

### wordpress-viewer
- Busca automática de todos os posts do WordPress, incluindo título, data, conteúdo, imagem destacada e link.
- Exibe os posts de forma organizada e responsiva.
- Botão para baixar todos os posts completos em um arquivo `posts-migracao.json`.
- Botão para acessar o visualizador de posts baixados.

### ver-posts
- Upload do arquivo JSON gerado pelo wordpress-viewer.
- Busca por título ou conteúdo dos posts.
- Filtro por data de publicação.
- Visualização detalhada de cada post (imagem, título, conteúdo, link, copiar link, baixar JSON individual).
- Interface responsiva e fácil de usar.

---

## Instalação

1. **Clone o repositório:**
   ```bash
   git clone <seu-repositorio>
   cd wordpress-viewer
   ```

2. **Instale as dependências das duas aplicações:**
   ```bash
   npm install
   cd ver-posts
   npm install
   cd ..
   ```

3. **Instale o pacote auxiliar para rodar as duas aplicações juntas:**
   ```bash
   npm install npm-run-all --save-dev
   ```

---

## Como iniciar o projeto

Execute o comando abaixo na raiz do projeto para iniciar o Next.js (wordpress-viewer) e o visualizador (ver-posts) ao mesmo tempo:

```bash
npm run dev
```

- O site principal estará em [http://localhost:3000](http://localhost:3000)
- O visualizador estará em [http://localhost:5173](http://localhost:5173)

---

## Como usar

### 1. Acessar o site principal
- Entre em [http://localhost:3000](http://localhost:3000)
- Veja todos os posts do WordPress listados.
- Clique em "Baixar posts completos" para gerar o arquivo JSON com todos os posts.
- Clique em "Ir para página de upload" para acessar o visualizador.

### 2. Visualizar e conferir os posts baixados
- Entre em [http://localhost:5173](http://localhost:5173)
- Clique em "Adicionar arquivo" e selecione o JSON baixado.
- Busque, filtre e visualize os posts conforme necessário.
- Baixe cada post individualmente se quiser.

---

## Estrutura do projeto

- `src/app/page.tsx` - Página principal Next.js que busca e exibe os posts do WordPress.
- `ver-posts/` - Aplicação React para visualizar os posts baixados.

---

## Observações

- O arquivo JSON gerado pode ser usado para migrar os posts para qualquer outro sistema.
- O visualizador facilita a conferência, busca e exportação dos conteúdos.
- Para personalizar, basta editar os arquivos em `src/app/page.tsx` ou `ver-posts/src/App.jsx`.

---

## Requisitos

- Node.js 18+
- npm

---

## Suporte

Em caso de dúvidas ou sugestões, abra uma issue ou entre em contato com o desenvolvedor.

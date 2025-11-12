# Bingo Associação - Master 1ª Linha

Sistema de sorteio de números para bingo da associação Master 1ª Linha, desenvolvido com Next.js 14, TypeScript e Tailwind CSS.

## 🎯 Funcionalidades

- ✅ **Input numérico** para digitar números manualmente
- ✅ **Bola grande animada** no centro da tela com animação "pop" e oscilação contínua
- ✅ **Lista de bolas sorteadas** mostrando os últimos 5 números
- ✅ **Modal completo** para visualizar todos os números sorteados
- ✅ **Botão "Limpar lista"** com confirmação
- ✅ **Checkbox "Permitir repetição"** para controlar números duplicados
- ✅ **Persistência no localStorage** - histórico salvo automaticamente
- ✅ **Estatísticas** - total de números sorteados e último número
- ✅ **Design responsivo** - funciona perfeitamente em desktop e mobile
- ✅ **Acessibilidade** - aria-live, foco automático e leitores de tela
- ✅ **Tema escuro** com logo de fundo sutil e bola dourada/amarela
- ✅ **Sem scroll** - interface otimizada para caber na tela

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária e responsiva
- **React Hooks** - Gerenciamento de estado (useState, useEffect, useRef)

## 📦 Instalação

1. **Clone o repositório:**
```bash
git clone <url-do-repositorio>
cd bingo-firstline
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Execute o servidor de desenvolvimento:**
```bash
npm run dev
```

4. **Abra no navegador:**
   - Acesse [http://localhost:3000](http://localhost:3000)

## 🏗️ Build para Produção

```bash
npm run build
npm start
```

## 📱 Deploy no Vercel

### Opção 1: Deploy via GitHub (Recomendado)

1. **Crie um repositório no GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Bingo Associação Master 1ª Linha"
   git branch -M main
   git remote add origin https://github.com/seu-usuario/bingo-firstline.git
   git push -u origin main
   ```

2. **Conecte ao Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Faça login com sua conta GitHub
   - Clique em **"Add New Project"**
   - Selecione o repositório `bingo-firstline`
   - O Vercel detectará automaticamente as configurações do Next.js
   - Clique em **"Deploy"**

3. **Configurações automáticas do Vercel:**
   - **Framework Preset:** Next.js
   - **Build Command:** `next build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

4. **Deploy automático:**
   - Toda vez que você fizer push para a branch `main`, o Vercel fará deploy automaticamente

### Opção 2: Deploy via Vercel CLI

1. **Instale o Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Faça login:**
   ```bash
   vercel login
   ```

3. **Deploy (preview):**
   ```bash
   vercel
   ```

4. **Deploy para produção:**
   ```bash
   vercel --prod
   ```

5. **Configurações durante o deploy:**
   - Project name: `bingo-firstline` (ou o nome que preferir)
   - Directory: `./` (raiz do projeto)
   - Override settings: `No` (deixe as configurações padrão do Next.js)

## 📝 Estrutura do Projeto

```
bingo-firstline/
├── app/
│   ├── layout.tsx              # Layout principal e metadados
│   ├── page.tsx                 # Página principal com toda a lógica
│   ├── globals.css              # Estilos globais e utilitários
│   ├── icon.svg                 # Favicon SVG
│   └── imgs/
│       ├── logo_firstline.svg   # Logo original
│       └── logo_master.png      # Logo PNG (opcional)
├── public/
│   └── imgs/
│       └── logo_firstline_white.svg  # Logo branca para fundo
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
├── .gitignore
└── README.md
```

## 🎨 Personalização

### Cores do Tema

As cores podem ser personalizadas no arquivo `tailwind.config.js`:

```javascript
colors: {
  'soccer-blue': '#1e40af',    // Azul do escudo
  'soccer-gold': '#fbbf24',    // Dourado da bola
  'soccer-dark': '#0f172a',    // Fundo escuro
}
```

### Animações

As animações estão configuradas no `tailwind.config.js`:
- **`pop`**: Animação inicial quando a bola aparece (0.5s)
- **`oscillate`**: Oscilação contínua da bola (2s, infinito)

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento na porta 3000
- `npm run build` - Cria build de produção otimizado
- `npm start` - Inicia servidor de produção
- `npm run lint` - Executa o linter do Next.js

## ✨ Funcionalidades Detalhadas

### Sistema de Sorteio
- Digite um número no campo de input
- Clique em "Mostrar" ou pressione Enter
- A bola aparece com animação "pop" e depois oscila suavemente
- O número é adicionado automaticamente à lista de sorteados

### Gerenciamento de Números
- **Permitir repetição**: Marque a checkbox para permitir números já sorteados
- **Limpar lista**: Remove todos os números com confirmação
- **Visualizar todos**: Botão que abre modal com todos os números em grid

### Persistência
- Todos os números são salvos automaticamente no `localStorage`
- Ao recarregar a página, o histórico é restaurado
- A preferência de "Permitir repetição" também é salva

### Acessibilidade
- **Aria-live regions** para feedback de leitores de tela
- **Foco automático** no input após sortear um número
- **Navegação por teclado** (Enter para sortear)
- **Labels descritivos** em todos os elementos interativos

## 🐛 Troubleshooting

### Problemas comuns:

1. **Erro ao instalar dependências:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Erro no build:**
   ```bash
   npm run build
   ```
   Verifique se não há erros de TypeScript ou imports faltando.

3. **Logo não aparece:**
   - Verifique se os arquivos SVG estão em `public/imgs/`
   - Confirme que o caminho no código está correto: `/imgs/logo_firstline_white.svg`

## 📄 Licença

Este projeto foi desenvolvido exclusivamente para a Associação Master 1ª Linha - 1988.

## 👥 Contribuição

Para contribuir com o projeto:
1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ para Master 1ª Linha - 1988**

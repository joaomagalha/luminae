# Luminae

Website oficial da Luminae.

## Stack

- HTML5
- CSS3
- JavaScript (vanilla)

## Estrutura do projeto

```
.
├── assets/             # Recursos estáticos (CSS, JS, Imagens)
│   ├── css/            # Folha de estilo unificada
│   ├── js/             # Scripts interativos
│   └── images/         # Imagens da aplicação
├── index.html          # Página inicial
├── blog.html           # Página do blog
├── logo.svg            # Logo oficial do site
├── README.md           # Documentação
└── .gitignore          # Arquivo de ignore do Git
```

## Como rodar localmente

Não há build step. Basta abrir o `index.html` em um navegador, ou rodar um servidor estático local:

```bash
# Python 3
python3 -m http.server 8000

# Node (npx)
npx serve .
```

Depois acesse `http://localhost:8000`.

## Fluxo de trabalho

1. Crie uma branch a partir da `main` para cada feature/ajuste:
   ```bash
   git checkout -b feat/nome-da-feature
   ```
2. Faça commits pequenos e descritivos.
3. Abra um Pull Request na `main` quando estiver pronto para revisão.

## Design

Design de referência no Figma (link a adicionar).

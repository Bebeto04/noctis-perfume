# NOCTIS — campanha digital

Site-portfólio de uma casa de perfumes fictícia. Uma única narrativa controlada pelo scroll em que o
frasco NOCTIS I, montado a partir de seis renders independentes, atravessa a página inteira: abre as
notas, recebe o mergulho da câmera no líquido, se desmonta em vista explodida, se remonta e pousa no
produto. Sem Three.js, WebGL ou modelos 3D: tudo é camada 2D, transform, máscara e luz falsa.

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · GSAP 3.15 (ScrollTrigger, CustomEase, SplitText, EasePack)

---

## ▶ Como baixar e rodar o site em outro computador (sem terminal, Windows)

> Este repositório é o **código do site**. Para ver o site funcionando, é preciso **baixar** a pasta
> e **rodar** no computador. São 3 passos, só com cliques:

**1. Baixar o projeto**
- **GitHub Desktop** (recomendado): *File → Clone repository* → escolha `noctis-perfume` → **Clone**.
  Para receber atualizações depois, clique em **Fetch origin / Pull origin**.
- **Ou pelo site do GitHub:** botão verde **Code → Download ZIP** e extraia a pasta.

**2. Instalar o Node.js (só uma vez por computador)**
- Baixe a versão **LTS** em <https://nodejs.org/pt-br/download> e instale clicando em *Avançar*.

**3. Rodar**
- Abra a pasta do projeto e dê **dois cliques em `iniciar-site.bat`**.
- Na primeira vez ele instala o que precisa (alguns minutos); depois o navegador abre sozinho em
  **http://localhost:3000**.
- **Deixe a janela preta aberta** enquanto usa o site. Para desligar, é só fechá-la.

Se o Node.js não estiver instalado, o próprio `iniciar-site.bat` avisa e abre a página de download.

---

## Rodar pelo terminal (desenvolvimento)

```bash
npm install
npm run dev            # http://localhost:3000, recarrega ao editar
npm run build && npm start
```

Requer Node.js 20.9 ou mais novo.

## Estrutura

```
src/
  app/                    layout (fontes, preload), page, globals.css (tokens + frasco), scene.css (cena)
  config/
    perfumeAssets.generated.ts   dimensões naturais das peças (gerado)
    perfumeAssemblyConfig.ts     CALIBRAÇÃO do frasco: x, y, scale, rotation, zIndex, origem, opacidade
                                 + deslocamentos da vista explodida (desktop e compacto)
    storyConfig.ts               ROTEIRO: intervalos da timeline (em vh de scroll) e poses por layout
    siteConfig.ts                textos, produto, notas, peças
  components/
    noctis/      PerfumeAssembly, PerfumeLayer, PerfumeHighlight, PerfumeDebug
    motion/      NoctisStory (cena + interações), buildTimeline (timeline mestre)
    sections/    Hero, OpeningNotes, InsideNoctis, CraftSection, PersonalitySection, FeelReveal, ProductSection, Footer
    cart/        CartProvider (estado + localStorage), CartDrawer (<dialog> nativo)
    ui/          Navbar (com menu de telas estreitas), Preloader
    Experience.tsx   orquestra preloader → história, voo do ADD TO BAG
    ReducedStory.tsx versão estática para prefers-reduced-motion
  hooks/usePrefersReducedMotion.ts
scripts/
  process-assets.mjs     recorta os PNGs-fonte pelo alfa e gera WebP + manifesto
  compose-assembly.mts   renderiza o frasco a partir do config (gabarito e noctis-full.webp)
  make-textures.mjs      grão e seda âmbar (sintéticos)
  qa-shoot.mjs / qa-sheet.mjs / qa-interactions.mjs / qa-perf.mjs   QA em Edge headless
assets/source/           renders originais anexados (raw) e recortados (trimmed) — fora de /public
```

## Os assets

Os anexos foram classificados visualmente (duplicatas eliminadas por hash) e organizados em
`public/images/noctis/`: `noctis-cap`, `-atomizer`, `-collar`, `-body`, `-liquid`, `-label`,
`-exploded-reference` (só no debug) e `noctis-full` (composto a partir do config).
O corpo de vidro tem uma janela transparente: o líquido fica **atrás** dele e aparece por ela.

Não havia render do perfume montado. A escala relativa das peças foi medida na vista explodida de
referência (largura do gargalo, flange, gola, tampa) e os encaixes calculados pelos perfis de alfa de
cada PNG — ver comentários em `perfumeAssemblyConfig.ts`.

## Calibrar o frasco

1. `npm run dev` e abra `/?debugPerfume=true` (não existe em produção).
2. O painel mostra caixas, centros, z-index, posição e escala de cada camada, com sobreposição do
   render de referência (opacidade ajustável) e alternância montado / explodido / compacto.
3. Edite `src/config/perfumeAssemblyConfig.ts`. Para regenerar o gabarito:
   `node scripts/compose-assembly.mts --out ref.png` (ou `--exploded --debug`) e `--full` para `noctis-full.webp`.

## Ajustar a narrativa

Tudo é **uma** timeline com scrub (`buildTimeline.ts`); a unidade é "vh de scroll". Mover um momento
é mudar um intervalo em `STORY`; mudar enquadramento é editar `POSES[desktop|tablet|mobile]`.
Layouts: desktop ≥ 1024px, tablet 700–1023px, mobile < 700px (mesmos limites no CSS).

Profundidade sem 3D: a cena é um único contexto de empilhamento — halo (1), dobra (1), superfície (2),
palavras atrás (10), glifos (11), **frasco (20)**, texto na frente (30), anotações (32), fólio (33),
interior âmbar (40), reveal (41). Palavras "divididas" existem em duas cópias; a da frente é recortada
no eixo do frasco.

## Acessibilidade e movimento

- `prefers-reduced-motion`: renderiza `ReducedStory` (sem timeline, sem preloader, todo o conteúdo e a sacola funcionando).
- Nenhuma interação depende só de hover: notas e peças respondem a foco e toque; no toque a peça em foco segue o scroll; o reveal segue o dedo.
- Skip link, foco visível, gaveta e menu em `<dialog>` nativo (foco preso, Esc, retorno do foco).

## QA

```bash
node scripts/qa-shoot.mjs out/1440 1440x900 http://localhost:3221/
node scripts/qa-sheet.mjs out/1440 out/1440-sheet.png
node scripts/qa-interactions.mjs out/int http://localhost:3221/   # 23 verificações
node scripts/qa-perf.mjs http://localhost:3221/ 1440x900
```

## Pendências do dono da marca

A marca é fictícia. Links de Instagram/Journal/Stores/Contact são `#`, o checkout é demonstrativo e a
textura do reveal é sintética — substitua por fotografia real quando existir.

<div align="center">

# NOCTIS

**Campanha digital de um perfume, controlada pelo scroll.**
Um único frasco atravessa a página inteira: abre as notas, mergulha no líquido,
se desmonta em vista explodida, se remonta e pousa no produto — **sem 3D**.

### 🔗 [Ver o site ao vivo](https://noctis-perfume.vercel.app)

[![Ver o site ao vivo](https://img.shields.io/badge/Ver_o_site_ao_vivo-noctis--perfume.vercel.app-A96418?style=for-the-badge)](https://noctis-perfume.vercel.app)

![Narrativa do NOCTIS em scroll](docs/noctis-scroll.gif)

</div>

---

## O desafio

O material de partida eram **seis imagens soltas** do frasco — tampa, atomizador, gola, corpo de vidro,
líquido e placa — geradas separadamente, com enquadramentos, escalas e áreas transparentes diferentes.
Não existia nenhuma imagem do **frasco montado** para servir de referência.

O pedido era um site que parecesse campanha de marca de luxo, com o perfume como personagem principal,
e uma restrição dura: **nada de Three.js, WebGL ou modelos 3D**. Toda a profundidade teria que vir de
camadas 2D, transform, máscara e luz falsa.

## A solução

**1. Montar o frasco por medição, não por tentativa.**
Como não havia render do conjunto, as proporções foram extraídas da vista explodida de referência
(largura do gargalo, do flange, da gola e da tampa) e os encaixes calculados a partir do perfil de
transparência de cada PNG. Duas descobertas definiram o resultado: o corpo tem uma **janela
transparente** (o líquido precisa ficar atrás do vidro) e a tampa foi renderizada **vista de baixo**,
o que a fazia flutuar — corrigido com um deslocamento medido de 45 unidades.

A calibração final vive em **um único arquivo** (`src/config/perfumeAssemblyConfig.ts`): posição,
escala, rotação, z-index e origem de cada peça. O mesmo arquivo alimenta o site e um script que
recompõe o frasco com `sharp`, o que permitiu validar o alinhamento **por diferença de pixels**
entre o CSS e o render de referência.

**2. Uma timeline só.**
A história inteira é uma linha do tempo GSAP com `scrub`, medida em "vh de scroll". O frasco nunca é
duplicado: é o mesmo objeto que se move, escala, passa atrás e na frente da tipografia, se desmonta e
se remonta. Clone existe só no voo do "Adicionar à sacola".

**3. Profundidade sem 3D.**
A cena é um único contexto de empilhamento com ordem fixa: halo, superfície, palavras atrás, glifos,
**frasco**, texto na frente, anotações, interior âmbar, reveal. Palavras gigantes existem em duas
cópias — a da frente recortada no eixo do frasco —, então a palavra some atrás do vidro de um lado e
passa por cima dele do outro.

## Resultado

| | |
|---|---|
| **Desempenho** | mediana de 13 ms por quadro; pior quadro de 13,7 ms na maior parte da narrativa |
| **Qualidade** | 28 verificações automatizadas em navegador headless, sem erros de console |
| **Acessibilidade** | versão estática completa para `prefers-reduced-motion`, navegação por teclado, foco visível, nada dependente de hover |
| **Peso** | 231 KB de JS (gzip) e 1 MB de imagens para a experiência inteira |

---

## A narrativa

| | |
|---|---|
| ![Hero](docs/hero.webp) | ![A Abertura](docs/abertura.webp) |
| **Hero** — o nome atrás do frasco, com o "C" escondido pelo vidro | **A Abertura** — notas de saída; os glifos saem de trás do frasco |
| ![O Coração](docs/coracao.webp) | ![Vista explodida](docs/explodido.webp) |
| **O Coração** — a câmera entra no líquido e o mundo vira âmbar | **Anatomia** — seis peças separadas, com anotações editoriais |
| ![Palavras](docs/palavras.webp) | ![Produto](docs/produto.webp) |
| **Quem é NOCTIS** — a palavra atravessa o frasco | **O Frasco** — pouso, preço e sacola funcionando |

<div align="center">

<img src="docs/mobile-hero.webp" width="240" alt="Hero no celular"> <img src="docs/mobile-explodido.webp" width="240" alt="Vista explodida no celular"> <img src="docs/mobile-produto.webp" width="240" alt="Produto no celular">

*No celular a composição é própria, não uma versão encolhida do desktop.*

</div>

---





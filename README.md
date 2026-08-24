# 🛒 MinhaLoja - E-commerce Web Pro

Uma aplicação web completa e responsiva de e-commerce construída com **HTML5, CSS3 e JavaScript puro (Vanilla JS)**. O projeto conta com catálogo dinâmico de produtos, modal de detalhes, carrinho de compras interativo, cálculo de frete via API externa, sistema de cupons e integração de checkout direto pelo WhatsApp.

---

## 🚀 Funcionalidades

* **Filtros e Busca em Tempo Real:** Pesquisa por palavras-chave e filtragem dinâmica por categorias (Eletrônicos, Acessórios, Calçados).
* **Ordenação Personalizada:** Ordenação de produtos por menor/maior preço e ordem alfabética (A-Z / Z-A).
* **Modal de Detalhes:** Visualização expandida das especificações técnicas de cada item com opção de inclusão direta ao carrinho.
* **Carrinho de Compras Interativo (Drawer):** Gerenciamento dinâmico de quantidade, adição/remoção de itens e cálculo instantâneo do subtotal e total.
* **Cálculo de Frete (API ViaCEP):** Integração assíncrona para consulta de endereço e cálculo dinâmico de taxa de entrega com base no CEP do usuário.
* **Sistema de Cupons:** Aplicação e remoção de cupons de desconto com recalculo em tempo real.
* **Checkout via WhatsApp:** Geração automática de mensagem formatada contendo o resumo do pedido e endereço de entrega para envio via WhatsApp.
* **Banner de Oferta Relâmpago:** Contador regressivo funcional para promoções por tempo limitado.
* **Interface Responsiva:** Design adaptável para dispositivos móveis e desktops.

---

## 🛠️ Tecnologias Utilizadas

* **HTML5:** Estruturação semântica e acessível.
* **CSS3:** Estilização moderna utilizando Flexbox, CSS Grid, variáveis e animações.
* **JavaScript (ES6+):** Manipulação de DOM, Fetch API (ViaCEP), LocalStorage/SessionStorage e gestão de estado.
* **Unsplash API (Imagens):** Links diretos para imagens de alta resolução.

---

## 📂 Estrutura do Projeto

```text
├── index.html      # Estrutura principal da página
├── style.css       # Estilos globais e regras de responsividade
└── script.js       # Lógica do e-commerce, consumo de API e manipulação do DOM
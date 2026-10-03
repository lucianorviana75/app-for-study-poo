# app-for-study-poo
Aqui está um passo a passo detalhado e ilustrativo para o uso da sua aplicação interativa de Programação Orientada a Objetos (POO):

---

# 🚀 Passo a Passo: Como Usar a Aplicação de Modelagem POO

Esta ferramenta foi desenvolvida para ajudar na visualização e na construção interativa de **Classes**, **Atributos**, **Métodos** e na geração/execução automática de código **Python**.

---

## 🛠️ Visão Geral da Interface

A interface do aplicativo é dividida em quatro seções principais:

1. **Painel Lateral Esquerdo (Controles)**: Onde você define e edita os componentes da classe (nome, atributos e métodos).
2. **Visualizador de Nós (Centro)**: Representação gráfica e interativa da estrutura da classe e suas conexões.
3. **Código Python Gerado (Canto Superior Direito)**: Mostra em tempo real o código Python correspondente ao que você modelou.
4. **Terminal / Python Runtime (Canto Inferior Direito)**: Exibe a saída da execução do código (`print`), a instanciação de objetos e a chamada de métodos.

---

## 📋 Guia de Uso Passo a Passo

### **Passo 1: Criar uma Nova Classe**

1. No painel esquerdo, localize o bloco **➕ Nova Classe**.
2. Digite o nome da classe no campo de texto (ex: `Carro`).
> *Dica: Por convenção de código, utilize a primeira letra maiúscula (CamelCase).*


3. Clique em **Criar Classe**.
4. Uma aba com o nome da classe aparecerá no topo do diagrama e um nó central (`Classe: Carro`) será exibido no visualizador.

---

### **Passo 2: Adicionar Atributos (Características)**

Os atributos representam os dados ou estados da sua classe.

1. Na seção **📌 Atributos**:
* No campo **Nome**, digite o nome do atributo (ex: `cor` ou `idade`).
* No campo **Valor**, digite o valor inicial ou padrão (ex: `'vermelho'` ou `25`).


2. Clique no botão **+ Adicionar / Salvar Atributo**.
3. **O que acontece:**
* O atributo aparecerá na lista de gerenciamento abaixo do botão (com opções para editar ✏️ ou excluir ❌).
* Um novo nó em verde/azul claro surgirá conectado à caixa da classe no centro da tela (ex: `attr: cor = 'vermelho'`).
* O método construtor `__init__` no quadro **Código Python Gerado** será atualizado automaticamente com esses atributos.



---

### **Passo 3: Adicionar Métodos (Comportamentos/Funções)**

Os métodos definem as ações que a sua classe pode executar.

1. Na seção **⚡ Métodos (Funções)**:
* **Nome da função**: Digite a ação (ex: `acelerar`).
* **Parâmetros**: Insira os parâmetros necessários separados por vírgula (ex: `velocidade`).
* **Código**: Escreva a instrução ou comando a ser executado no corpo da função, como:
```python
print(f"O carro {self.cor} esta correndo acima de {velocidade} esta correndo muito")

```




2. Clique no botão de confirmação para salvar o método.
3. **O que acontece:**
* Um nó roxo (ex: `def acelerar()`) se conectará ao nó central da classe.
* A definição da função será adicionada à classe no painel de código.



---

### **Passo 4: Visualizar o Código Gerado e a Execução**

1. **Código Python Gerado**:
* Observe a estrutura completa criada:
```python
# --- CÓDIGO PYTHON GERADO ---
class Carro:
    def __init__(self, cor, idade):
        self.cor = cor
        self.idade = idade

    def acelerar(self, velocidade):
        print(f"O carro {self.cor} esta correndo acima de {velocidade} esta correndo muito")

```




2. **Execução Automática / Instanciação**:
* O sistema cria automaticamente uma instância de teste da classe (ex: `carro1 = Carro('vermelho', 25)`) e invoca o método cadastrado (ex: `carro1.acelerar(60)`).


3. **Saída do Terminal (Python Runtime)**:
* Confira os resultados impressos no console interativo:
```text
>_ SAÍDA DA EXECUÇÃO DO CÓDIGO (PRINT)
$ python main.py
[Objeto Criado]: carro1 = Carro('vermelho', 25)

> carro1.acelerar(60):
=> "O carro vermelho esta correndo acima de 60 esta correndo muito"

```





---

## 💡 Recursos Adicionais e Dicas

* **Edição em Tempo Real**: Altere valores de atributos clicando no ícone de lápis ✏️ para ver o código e o resultado no terminal mudarem instantaneamente.
* **Remoção de Elementos**: Clique no ícone de xis ❌ ao lado de qualquer atributo ou método para removê-lo da classe.
* **Arrastar Nós**: Você pode clicar e arrastar os nós no painel central para organizar visualmente o diagrama da forma que preferir.

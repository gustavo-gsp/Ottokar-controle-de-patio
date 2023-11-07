# Ottokar-controle-de-patio

# Software desenvolvimento com Javascript/NodeJS/MongoDB/EJS/HTML/CSS.

Software web com aplicativo android que é baseado em uma WebView que reinderiza a pagina web no App.
Um sistema de controle de patio de oficina mecanica, no qual os funcionarios conseguem ter controle sob toda a agenda de carros para manutenção. 

Essas sao algumas das funcionadidades:

* *Sistema de login, cadastro e edição de usuários;*
O perfil de gerente consegue adicionar, exluir, e edidar dados de usuários.

* *Página home com veículos listados e ordenados por ordem de prioridade definidas pelo gerente;*

* *Cadastro de novo veículo com api que ao digitar a placa, o sistema trás o modelo e o ano do veículo, facilitando o cadastro;*

* *Filtro na tela de veículos para encontrar veículos com determinados funcionarios;*

* *Veículos com data de previsão atrasada recebem destaque em vermelho na lista.*

* *Controle de etapas de manutenção por meio de status do veículo*
São 8 etapas as quais os funcionarios competentes devem concluir até o fim do periodo de manutenção:
    1. Agendado;
    2. Analisando;
    3. Aprovando;
    4. Comprando;
    5. Reparando;
    6. Vistoriando;
    7. Entregando;
    8. Entregue.

No sistema possuem os seguintes cargos: Gerente, Compradror, Vendedor e Mecanico/Funileiro.
De acordo com sua função, cada funcionario só pode ver os veículos que estão nas fases correspondentes a sua função, por exemplo: o mecanico, só ve os veículos que estão com status de: Agendado, Analisando e Reparando.

* *Pedir peças*

Os funcionarios conseguem pedir peças atraves de um botão que fica ao lado das informações do veículo, ele pode adiconar n peças conferir a lista de pedido e enviar, assim que o pedido é enviado, o veículo passa para o status de aprovação, sendo assim direcionado para o perfil de vendedores e compradores.

* *Página com detalhes do Veìculo*

Ao clicar em qualquer veículo da lista abre uma seção com detalhes do veículo, a qual possui diversos detalhes e contem algumas funções disponiveis:
Editar dados do veículo;
Ver lista de peças e serviços pedidos;
Marcar conclusão em um checkList de troca de peças e ou serviços;
Ver historico do veículo o qual carrega todas as alterações feitas no veículo pelo app dês de seu cadastro;
Pedir peças pu serviços;
Concluir etapas;
*Por meio de uma api externa Conseguem consultar dados documentais do veículo, como chassi e renavan para tratamento com seguradoras e encontrar peças.* 

* Acessar historico de veículos que ja foram entregues e acessar detalhes de todas as etapas e funcionarios responsaveis.

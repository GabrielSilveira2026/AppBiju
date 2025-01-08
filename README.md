📝 Aplicativo SCPP - Sistema Controlador de Produções e Pagamentos 📝

Sistema voltado para o controle de produções e pagamentos, especialmente projetado para uma empresa de bijuterias. Este projeto teve como foco principal:

📍 O registro das produções realizadas pelos funcionários.

📍 A consulta do valor a receber pelas produções realizadas.

📍 A gestão das produções da empresa e dos pagamentos aos funcionários.


https://github.com/user-attachments/assets/e2810951-307d-413d-abc4-15ae84864097


<div style="display: flex; justify-content: space-between;">
</div>


Funcionalidades do Sistema

Cada funcionário possui um usuário exclusivo, onde pode:

🔹 Registrar seus "Dias de Produção" com detalhes como os produtos produzidos, quantidades e observações opcionais.

🔹 Consultar o tempo estimado e o valor de produção antes mesmo de iniciar a atividade.

🔹 Visualizar o valor total das produções realizadas em um dia específico, calculado automaticamente.

<img src="assets/images/screenshots/Frame 42.png" alt="Screenshot" width="300"/>

No perfil de cada funcionário, o sistema exibe:

🔸 O valor a receber (produções pendentes de pagamento com base no mês do último pagamento).

🔸 A data do último pagamento realizado.

<img src="assets/images/screenshots/Frame 43.png" alt="Screenshot" width="300"/>


No perfil de administrador, o sistema exibe:

🔸 A lista de funcionários, com valor a pagar e data do ultimo pagamento, podendo também acessar o perfil dos funcionários para consultar as produções dos mesmos.

<img src="assets/images/screenshots/Frame 44.png" alt="Screenshot" width="300"/>


Além disso, o sistema oferece abas específicas para:

📍Produtos: Cadastro detalhado com código de referência, descrição, tempo de produção, valor da mão de obra e cálculo automático do valor total (baseado no Valor da Hora).

📍Pagamentos: Histórico de pagamentos e funcionalidade para que administradores insiram novos pagamentos.

<img src="assets/images/screenshots/Frame 45.png" alt="Screenshot" width="300"/>


Principais Funcionalidades:

✅ CRUD Completo:

◾Dias de Produção

◾Produções

◾Produtos

◾Pagamentos

✅ Offline First: Todas as operações (exceto lançamentos de pagamentos, devido a regras de negócio) podem ser realizadas offline. Os dados são sincronizados automaticamente com o banco de dados quando a conexão com a internet é restabelecida.

<img src="assets/images/screenshots/Frame 46.png" alt="Screenshot" width="300"/>


Tecnologias Utilizadas:

🔹 React Native

🔹 SQLite

🔹 Oracle Cloud Infrastructure (OCI)

🔹 Oracle Autonomous Database

🔹 Oracle REST Data Services (ORDS)


Aprendizados e Conquistas:

📘 Prática avançada dos conceitos de Offline First.

📘 Desenvolvimento aprofundado em React Native, com foco em componentização, renderização eficiente e otimização de performance.

📘 Uso extensivo de TypeScript, garantindo maior segurança e clareza no código.

Impacto e Resultados:

Esse projeto foi uma experiência incrível, desde o planejamento até a entrega final. A maior recompensa foi ver a satisfação dos usuários ao utilizar o sistema, agora mais ágil e eficiente. Com o SCPP, eles podem economizar tempo valioso ao calcular produções e pagamentos, além de ter uma visão clara das atividades diárias e do tempo de trabalho. Receber feedbacks positivos, como “Agora temos visibilidade total das produções e pagamentos”, é a verdadeira sensação de dever cumprido.

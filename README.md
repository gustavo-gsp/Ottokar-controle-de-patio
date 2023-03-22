# Ottokar-controle-de-patio

<% if(conclude) {%>
        <section style="width: 20rem; height: 10rem; border: 2px solid;">
            <div><a href="/carPage">X</a></div>
            <p>Deseja realmente concluir essa tarefa?</p>
            <a href="/carPage">Não</a>
            <a href="/conclude/<%=car._id%>/<%= status %>">Sim</a>
        </section>
    <% } %>

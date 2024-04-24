console.log("hola")

//Ejercicio 1.1

fetch('https://jsonplaceholder.typicode.com/users')
    .then(resp => resp.json())
    .then(usuarios => {
        const tabla = document.getElementById('meteDatos')
        usuarios.slice(0, 5).forEach(usuario => {
            const row = document.createElement('tr')
            row.innerHTML = `
            <td class="userId">${usuario.id}</td>
            <td>${usuario.name.split(' ')[0]}</td>
            <td>${usuario.name.split(' ')[1]}</td>
            <td>${usuario.email}</td>`;
            tabla.appendChild(row);
        });

        // Ejercicio 1.2
        tabla.addEventListener('click', function(event) {
            const target = event.target;
            if (target.tagName === 'TD') {
                const userId = target.parentElement.querySelector('.userId').innerText;
                const usuario = usuarios.find(user => user.id == userId);
                if (usuario) {
                    // Mostrar los datos del usuario en una ficha
                    mostrarFicha(usuario);
                }
            }
        });
    })
    .catch(error => console.error('Error'));

//ejercicio 1.2
document.getElementById('meteDatos').addEventListener('click',(e)=>{
    console.log('has hecho click')
    console.log(e.target)
})
//Ejercicio 1.2
function mostrarFicha(usuario) {
    const ficha = document.getElementById('fichaUsuario');
    ficha.innerHTML = `
        <h2>Información del Usuario</h2>
        <p><strong>Nombre:</strong> ${usuario.name}</p>
        <p><strong>Email:</strong> ${usuario.email}</p>
        <p><strong>Teléfono:</strong> ${usuario.phone}</p>
        <p><strong>Empresa:</strong> ${usuario.company.name}</p>
        <p><strong>Dirección:</strong> ${usuario.address.street}, ${usuario.address.suite}, ${usuario.address.city}</p>
        <p><strong>Código Postal:</strong> ${usuario.address.zipcode}</p>
        <a><strong>Website:</strong> ${usuario.website}</a>
    `;

    fetch(`https://jsonplaceholder.typicode.com/posts?userId=${usuario.id}`)
        .then(resp => resp.json())
        .then(posts => {
            const ultimos5Posts = posts.slice(-5);
            const postList = document.getElementById('postList');
            postList.innerHTML = '';

            if (ultimos5Posts.length > 0) {
                ultimos5Posts.forEach(post => {
                    postList.innerHTML += `
                        <div style="border: 1px solid black; padding: 10px; margin-bottom: 10px;">
                            <p><strong>ID:</strong> ${post.id}</p>
                            <p><strong>Título:</strong> ${post.title}</p>
                            <p><strong>Cuerpo:</strong> ${post.body}</p>
                        </div>
                    `;

                    // Obtener los comentarios asociados a este post
                    fetch(`https://jsonplaceholder.typicode.com/comments?postId=${post.id}`)
                        .then(resp => resp.json())
                        .then(comments => {
                            const comentariosPost = document.getElementById('comentariosPost');
                            comentariosPost.innerHTML = '';

                            if (comments.length > 0) {
                                
                                comments.forEach(comment => {
                                    comentariosPost.innerHTML += `
                                        <div style="border: 1px solid black; padding: 10px; margin-bottom: 10px;">
                                            <p><strong>Nombre:</strong> ${comment.name}</p>
                                            <p><strong>Email:</strong> ${comment.email}</p>
                                            <p><strong>Cuerpo:</strong> ${comment.body}</p>
                                        </div>
                                    `;
                                });
                            } else {
                                comentariosPost.innerHTML += `<p>No hay comentarios para el Post "${post.title}".</p>`;
                            }
                        })
                        .catch(error => console.error('Error al obtener los comentarios del post:', error));
                });
            } else {
                postList.innerHTML = `<p>No hay posts disponibles para este usuario.</p>`;
            }
        })
        .catch(error => console.error('Error al obtener los posts del usuario:', error));
}
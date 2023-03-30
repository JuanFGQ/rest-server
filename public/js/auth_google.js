
const miFormulario = document.querySelector('form');


//*240
//iniciar sesion con credenciales de la base de datos 
miFormulario.addEventListener('submit',ev => {
    ev.preventDefault();
    const formData = {};


    for(let el of miFormulario.elements){
        if(el.name.length > 0 )
            formData[el.name] = el.value;
    }

fetch('http://localhost:3000/api/auth/login',{
    method: 'POST',
    body: JSON.stringify(formData),
    headers:{'Content-Type':'application/json'}
})
.then(resp => resp.json())
.then(({msg,token})=>{
    if(msg){
        return console.error(msg);
    }
    localStorage.setItem('token',token);
    window.location = 'chat.html'
   
})
.catch(err =>{
    console.log(err)
})
})



function handleCredentialResponse(response) {

    const data = { id_token: response.credential }
    fetch('http://localhost:3000/api/auth/google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then( r=> r.json() )
    .then( ({token})=> {
        localStorage.setItem('token',token);
         //*243
    window.location = 'chat.html'
    })
    .catch( console.warn )
}


const button = document.getElementById('g_id_signout');
button.onclick = async() => {

    console.log(google.accounts.id)
    google.accounts.id.disableAutoSelect()
    google.accounts.id.revoke(localStorage.getItem('email'), done => {
        console.log('consent revoked');
        localStorage.clear()
        location.reload()
    });
}


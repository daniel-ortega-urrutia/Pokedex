//referencia al boton
const btnIngresar = document.querySelector('#btn-ingresa');


//variables constantes para  trabajar elementos del dom
const bienvenida = document.querySelector('#bienvenida');
const textoBienvenida = document.createElement('h3');
const textoElegir = document.createElement('label');
const selected = document.createElement('select');
const contenedorImagen = document.createElement('img');
const imagenContenedor = document.querySelector('#imagenPokemon')



//asigno los id a los elemntos creados a traves del dom
selected.id = 'pokemones';
contenedorImagen.className = 'contImg';
contenedorImagen.id = 'contImg';


function validar() {

    var nombre
    nombre = document.getElementById("nombre").value.trim();//metodo trim elimina los espcios 
    // en blanco de los costados, no modifica la cadena
    var expNombre = /^[aA-zZ]{0,40}$/ //acepta solo letras, mayusculas o minusculas

    if (!expNombre.test(nombre)) {
        alert("Debe ingresar su nombre, no puede ingresar numeros")
        return false;
    }
    if (nombre == "") {
        alert("el campo nombre no debe estar vacio");
    }

    edad = document.getElementById("edad").value.trim();
    expEdad = /^[0-9]{0,2}$/;//solo numeros, solo se aceptan numeros hasta el 99
    if (!expEdad.test(edad)) {
        alert("Solo se aceptan valores numericos, tienes 100 o más años, lo sentimos, no puedes jugar pokemon :(");
        return false;
    }
    if (edad == "") {
        alert("el campo edad no puede estar vacio");
    }

    btnIngresar.addEventListener('click', () => {





        //mensaje de bienvenida
        textoBienvenida.append(`Bienvenido ${nombre} con tus ${edad} años nos agrada que te guste pokemon, ahora atrapa el tuyo!!!`)

        //aca inserto el mensaje de bienvenida
        bienvenida.append(textoBienvenida);
        textoElegir.classList.add('mt-4');//agrego clase bootstrap
        textoElegir.append('¿Cual es tu pokemon?');
        bienvenida.append(textoElegir);
        bienvenida.append(selected);
        bienvenida.append(contenedorImagen);

        //para lllenar el select
        iniciarBusqueda();

        //para mostrar la imagen
        mostrarImagen();

    });


    function iniciarBusqueda() {
        $.ajax({
            type: 'GET',
            url: 'https://pokeapi.co/api/v2/pokemon?limit=20000/',
            dataType: "json",
            async: true,
            success: function (data) {
                var pokemones = $('#pokemones').empty();
                $(pokemones).append('<option></option>');
                for (var i = 0; i < data.count; i++) {
                    $(pokemones).append('<option value=' + data.results[i].name + '>' + data.results[i].name + '</option>');
                }
            }

        });
    }

    function mostrarImagen() {
        $('#pokemones').on('change', function () {


            var selectedPokemon = $("option:selected").text();
            $.ajax({
                type: 'GET',
                url: 'https://pokeapi.co/api/v2/pokemon/' + selectedPokemon,
                dataType: "json",
                async: true,
                success: function (data) {
                    $(imagenContenedor).empty().append('<img class="contImg" id="contImg" src='
                        + data.sprites.front_default + ' alt=' + selectedPokemon + '><button type="button" class="chart">Estadísticas ' + selectedPokemon + '</button>');
                }
            })
        });

        $(document).on('click', '.chart', function () {
            var selectedPokemon = $("option:selected").text();
            $.ajax({
                type: 'GET',
                url: 'https://pokeapi.co/api/v2/pokemon/' + selectedPokemon,
                dataType: "json",
                async: true,
                success: function (data) {
                    var min = Math.min(data.stats[0].base_stat, data.stats[1].base_stat, data.stats[2].base_stat, data.stats[5].base_stat);
                    var options = {
                        animationEnabled: true,
                        title: {
                            text: selectedPokemon,
                            fontFamily: "Architects Daughter"
                        },
                        axisY: {
                            minimum: min / 2
                        },
                        toolTip: {
                            enabled: false
                        },
                        height: 300,
                        data: [
                            {
                                type: "column",
                                indexLabel: "{y}",
                                dataPoints: [
                                    { label: "HP", y: data.stats[0].base_stat },
                                    { label: "Ataque", y: data.stats[1].base_stat },
                                    { label: "Defensa", y: data.stats[2].base_stat },
                                    { label: "Velocidad", y: data.stats[5].base_stat }
                                ]
                            }
                        ]
                    };


                    $('.image').empty().CanvasJSChart(options);
                    $('.image').append('<button type="button" class="switch-img">Imagen ' + selectedPokemon + '</button>');
                }
            })
        });

    }


}


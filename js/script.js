(function($, doc) {
  'use strict';

  /*
  Vamos estruturar um pequeno app utilizando módulos.
  Nosso APP vai ser um cadastro de carros. Vamos fazê-lo por partes.
  A primeira etapa vai ser o cadastro de veículos, de deverá funcionar da
  seguinte forma:
  - No início do arquivo, deverá ter as informações da sua empresa - nome e
  telefone (já vamos ver como isso vai ser feito)
  - Ao abrir a tela, ainda não teremos carros cadastrados. Então deverá ter
  um formulário para cadastro do carro, com os seguintes campos:
    - Imagem do carro (deverá aceitar uma URL)
    - Marca / Modelo
    - Ano
    - Placa
    - Cor
    - e um botão "Cadastrar"

  Logo abaixo do formulário, deverá ter uma tabela que irá mostrar todos os
  carros cadastrados. Ao clicar no botão de cadastrar, o novo carro deverá
  aparecer no final da tabela.

  Agora você precisa dar um nome para o seu app. Imagine que ele seja uma
  empresa que vende carros. Esse nosso app será só um catálogo, por enquanto.
  Dê um nome para a empresa e um telefone fictício, preechendo essas informações
  no arquivo company.json que já está criado.

  Essas informações devem ser adicionadas no HTML via Ajax.

  Parte técnica:
  Separe o nosso módulo de DOM criado nas últimas aulas em
  um arquivo DOM.js.

  E aqui nesse arquivo, faça a lógica para cadastrar os carros, em um módulo
  que será nomeado de "app".
  */

  var app = (function (){
    var $image =  $('[data-js="image"]').get();
    var $brand =  $('[data-js="brand"]').get();
    var $year =  $('[data-js="year"]').get();
    var $color =  $('[data-js="color"]').get();
    var $plate =  $('[data-js="plate"]').get();
    var $listErrors = $('[data-js="list-errors"]').get();
    var errors = [];

    return{
      init: function init(){
        this.companyInfo();
        this.initEvents();
      },

      initEvents: function initEvents(){
        $('[data-js="form-car"]').on('submit', this.handleRegister);
      },

      initRemove: function initRemove(){
        $('[data-js="remove-car"]').on('click', this.removeCar);
      },

      handleRegister: function handleRegister(event){
        event.preventDefault();

        app.clearErrors();
        if(app.validationForm()){
          var $tableCar = $('[data-js="table-car"]').get();
          $tableCar.appendChild(app.createNewCar());
          app.clearForm();
          app.initRemove();
        }else{
          app.viewErrors();
        }
      },

      createNewCar: function createNewCar(){
        var $fragament = doc.createDocumentFragment();
        var $tr = doc.createElement('tr');
        var $tdImage = doc.createElement('td');
        var $tdBrand = doc.createElement('td');
        var $tdYear = doc.createElement('td');
        var $tdPlate = doc.createElement('td');
        var $tdColor = doc.createElement('td');
        var $tdRemover = doc.createElement('td');

        var id = 'carNumber-' + this.generateID();

        $tr.setAttribute('data-js', id);

        var $img = doc.createElement('img');
        $img.src = $image.value;
        $tdImage.appendChild($img);

        var $btnRemover = doc.createElement('button');
        $btnRemover.textContent = 'Remover';
        $btnRemover.setAttribute('data-js', 'remove-car');
        $btnRemover.setAttribute('class', 'btn-remove');
        $btnRemover.setAttribute('id', id);
        $tdRemover.appendChild($btnRemover);

        $tdBrand.textContent = $brand.value;
        $tdYear.textContent = $year.value;
        $tdPlate.textContent = $plate.value;
        $tdColor.textContent = $color.value;

        $tr.appendChild($tdImage);
        $tr.appendChild($tdBrand);
        $tr.appendChild($tdYear);
        $tr.appendChild($tdPlate);
        $tr.appendChild($tdColor);
        $tr.appendChild($tdRemover);

        return $fragament.appendChild($tr);

      },

      validationForm: function validationForm(){

        if($image.value === '')
          this.messageError('Precisa adicionar um imagem');
        
        if($brand.value === '')
          this.messageError('Precisa preencher a marca');
        
        if($year.value === '')
          this.messageError('Precisa preencher um ano');
        
        if($color.value === '')
          this.messageError('Precisa preencher a cor');
        
        if($plate.value === '')
          this.messageError('Precisa preencher a placa');

        if(errors.length > 0)
          return false;

        return true;
      },

      generateID: function generateID(){
        return Math.floor(Date.now() * (Math.random() * 10));;
      },

      removeCar: function removeCar(){
        
         var dataJS = '[data-js="id"]'.replace('id', this.id)
         var $car = $(dataJS).get();
         $car.remove();
      },

      clearForm: function clearForm(){
        $image.value = '';
        $brand.value = '';
        $year.value = '';
        $plate.value = '';
        $color.value = '';

      },

      messageError: function messageError(msg){
        errors.push(msg);
      },

      viewErrors: function viewErrors(){
        errors.map(function(element){
          var $li = doc.createElement('li');
          $li.textContent = element;
          $listErrors.appendChild($li);
        });
      },

      clearErrors: function clearErrors(){
        errors = [];
        $listErrors.innerHTML = '';
      },

      companyInfo: function companyInfo(){
        var ajax = new XMLHttpRequest();
        ajax.open('GET', 'data/company.json', true);
        ajax.send();
        ajax.addEventListener('readystatechange', this.getCompanyInfo, false);
      },

      getCompanyInfo: function getCompanyInfo(){
        if(!(app.isRequestOK.call(this)))
          return;

        var data = JSON.parse(this.responseText);
        var $companyName =  $('[data-js="company-name"]').get();
        var $companyPhone =  $('[data-js="company-phone"]').get();
        $companyName.textContent = data.name;
        $companyPhone.textContent = data.phone;
      },

      isRequestOK: function isRequestOK(){
        return this.readyState === 4 && this.status === 200;
      }
    }

  })();

  app.init();

})(window.DOM, document);

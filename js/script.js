(function($, doc) {
  'use strict';

  var app = (function (){
    var $image =  $('[data-js="image"]').get();
    var $brand =  $('[data-js="brand"]').get();
    var $year =  $('[data-js="year"]').get();
    var $color =  $('[data-js="color"]').get();
    var $plate =  $('[data-js="plate"]').get();
    var $listErrors = $('[data-js="list-errors"]').get();
    var $tableCar = $('[data-js="table-car"]').get();
    var errors = [];

    return{
      init: function init(){
        this.onloadCars();
        this.companyInfo();
        this.initEvents();
      },

      initEvents: function initEvents(){
        $('[data-js="form-car"]').on('submit', this.handleRegister);
      },

      initRemove: function initRemove(){
        $('[data-js="remove-car"]').on('click', this.removeCar);
      },

      onloadCars: function onloadCars(){
        var ajax = new XMLHttpRequest();
        ajax.open('GET', 'http://localhost:4200/car');
        ajax.send();
        ajax.onreadystatechange = function(e){
          if(ajax.readyState === 4 && ajax.status === 200)
            var cars = JSON.parse(ajax.responseText);
            console.log(cars);
            cars.forEach(function(car){
              $tableCar.appendChild(app.createNewCar(car.image, car.plate, car.year, car.color, car.brandModel));
              app.initRemove();
            });
          }
          
      },

      handleRegister: function handleRegister(event){
        event.preventDefault();

        app.clearErrors();
        if(app.validationForm()){
          app.submitNewCar();
          app.clearTable();
          app.onloadCars();
          app.clearForm();
        }else{
          app.viewErrors();
        }
      },

      createNewCar: function createNewCar(image, plate, year, color, brand){
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


        var $btnRemover = doc.createElement('button');
        $btnRemover.textContent = 'Remover';
        $btnRemover.setAttribute('data-js', 'remove-car');
        $btnRemover.setAttribute('class', 'btn-remove');
        $btnRemover.setAttribute('id', id);
        $tdRemover.appendChild($btnRemover);

        var $img = doc.createElement('img');
        $img.src = image;
        $tdImage.appendChild($img);
          

        $tdBrand.textContent = brand;
        $tdYear.textContent = year;
        $tdPlate.textContent = plate;
        $tdColor.textContent = color;

        $tr.appendChild($tdImage);
        $tr.appendChild($tdBrand);
        $tr.appendChild($tdYear);
        $tr.appendChild($tdPlate);
        $tr.appendChild($tdColor);
        $tr.appendChild($tdRemover);

        
       
        return $fragament.appendChild($tr);

      },

      submitNewCar: function submitNewCar(){
        var ajax = new XMLHttpRequest();
        var car = '';
        ajax.open('POST','http://localhost:4200/car');
        ajax.setRequestHeader(
          'Content-Type',
          'application/x-www-form-urlencoded'
        );
        ajax.send('image=' + $image.value 
                  +'&brandModel=' + $brand.value 
                  +'&year=' + $year.value
                  +'&plate=' + $plate.value
                  +'&color=' + $color.value);
        ajax.onreadystatechange = function(e){

          if(ajax.readyState === 4 && ajax.status === 200){
            console.log('Carro Cadastrado')
            console.log(JSON.parse(ajax.responseText), ajax.status);
            var newCar = JSON.parse(ajax.responseText);
            car = app.createNewCar(newCar.image, newCar.plate, newCar.year, newCar.color, newCar.brandModel);
          }

        };
        return car;
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

      clearTable : function clearTable(){
        $tableCar.innerHTML = '';
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

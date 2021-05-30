
// budget controller set///////////////////////////////////////////
var budgetCtrl = (function(){
    // for expense
    var Expense = function(id, description , value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.persentage = -1 ;

    }
    // prototype
     Expense.prototype.calcPersentage = function(totalIncome){

    if(totalIncome > 0){
        this.persentage = Math.round((this.value / totalIncome) *100);
    }else{
        this.persentage = -1;
    }
    };

    Expense.prototype.getPersentage = function(){
        return this.persentage;
    }

    // for income
    var Income = function(id, description , value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var calculateTotal = function(type){
        var sum = 0;
        Data.allitems[type].forEach(function(cur){
            sum += cur.value;
        });
        Data.totals[type]  =sum;

    }


    // data structure 
    var Data={
        allitems : {
            inc : [],
            exp: []
        },
        totals : {
            inc :0,
            exp :0
        },
        budget : 0,
        persantage : -1
    }


    return {
        addItem: function(type , des , val){
            var newItem , ID;

            // crearte ID
            if(Data.allitems[type].length > 0){
                ID = Data.allitems[type][Data.allitems[type].length - 1].id + 1;
            }else{
                ID = 0;
            }

            //using the type tpo calculate the 'inc' an 'exp'
            if(type === 'exp'){
                newItem = new Expense(ID , des , val);
            }else if(type === 'inc'){
                newItem = new Income(ID , des , val);
            }
            Data.allitems[type].push(newItem);
            return newItem;
        },
        deleteItem : function(type , id){
        var ids ,  index;


        ids =  Data.allitems[type].map(function(current){
            return current.id;
        });

        index =  ids.indexOf(id);

        if( index !== -1){
            Data.allitems[type].splice(index ,  1);
        }
        },
        calculatePersentage : function(){
            // for each element persentage
            Data.allitems.exp.forEach(function(cur){
                cur.calcPersentage(Data.totals.inc);
            });

        },
        getPersentage:function(){

            var allPerc = Data.allitems.exp.map(function(cur){
                return cur.getPersentage();
            });
            return allPerc;
        },
        calculateBudget:function(){
            // calculate total income and expenses
            calculateTotal('inc');
            calculateTotal('exp');

            // calclae the budget
            Data.budget =  Data.totals.inc - Data.totals.exp;

            if(Data.totals.inc > 0){
                // calculate the persantage
                Data.persantage = Math.floor((Data.totals.exp / Data.totals.inc) *100)

            }else{
                Data.persantage = -1
            }
        },

        getBudget:function(){
// return the value
return{
    budget:Data.budget,
    totalInc  :Data.totals.inc,
    totalExp :Data.totals.exp,
    persantage : Data.persantage

}
        },

        testing:function(){
            console.log(Data);
        }
    }
})();



// USER INTERFACE ///////////////////////////////////////////////////////////////////////////////////////////

var UICtrl = (function(){

    var DOMstring ={
        addtype: '.add__type',
        addDescription :'.add__description',
        addValue:'.add__value',
        inputBtn:'.add__btn',
        incomeContainer : '.income__list',
        expenseContainer : '.expenses__list',
        budgetLabel :'.budget__value',
        incomeLabal:'.budget__income--value',
        expenseLabal:'.budget__expenses--value',
        persantageLabel :'.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel:'.item__percentage',
        dateLabel:'.budget__title--month'
    };

    var FormateNumber = function(num , type) {
          var numSplit , int  , dec , type;


        num =  Math.abs(num);
        num = num.toFixed(2);


        numSplit = num.split('.');

        int = numSplit[0];
        if(int.length > 3){
            int  =  int.substr(0 , int.length -3 ) + ','+ int.substr( int.length -3 , 3);
        }

        dec = numSplit[1];
        return (type === 'exp' ? '-' : '+')+ '' + int  +'.'+ dec ;


    };
    var nodeListForEach =function(list ,  callback){
        for (var i = 0 ; i< list.length ; i++){
            callback(list[i] ,i);
        }
       };
    
    // get input value.
    return {
        getInput: function(){
            return{
                type: document.querySelector(DOMstring.addtype).value,
                description: document.querySelector(DOMstring.addDescription).value,
                value: parseFloat(document.querySelector(DOMstring.addValue).value)
            }
        },
        addListItem :function(obj , type){
            var html , newHtml, element;
            
            if(type === 'inc'){
                element = DOMstring.incomeContainer; 

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if(type === 'exp'){
                element = DOMstring.expenseContainer;
                
                 html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            newHtml = html.replace('%id%' , obj.id);
            newHtml= newHtml.replace('%description%' , obj.description);
            newHtml= newHtml.replace('%value%' , FormateNumber(obj.value , type));

            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
            
        },
        deleteListItem : function(selectorID){
         var el = document.getElementById(selectorID);
         el.parentNode.removeChild(el);
        },
        clearField: function(){
           var fields , fieldArr;

          fields =  document.querySelectorAll(DOMstring.addDescription + ' , ' + DOMstring.addValue);

        fieldArr = Array.prototype.slice.call(fields);

        fieldArr.forEach(function(current , index , array){
            current.value = '';


        });
        fieldArr[0].focus();
        
        },
        displayPersentage:function(persentage){

            var fields =document.querySelectorAll(DOMstring.expensesPercLabel);

            

                 nodeListForEach(fields, function(current , index){
                     if(persentage[index]> 0){
                         current.textContent = persentage[index] + '%';
                     }else{
                         current.textContent = '---';
                     }
                 });
             

        },
        displayMonth :function(){
            var now ,year , month;

            now = new Date();

            months = ['january', 'february' , 'march' , 'april' ,'may' ,'june' , 'july'  ,'august' , 'september' , 'october', 'november' , 'december'];
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMstring.dateLabel).textContent = months[month] + ' ' +year;
;

        },
        displayBudget : function(obj){

            var type ;
            obj.budget > 0 ?  type = 'inc' : type = 'exp';
        document.querySelector(DOMstring.budgetLabel).textContent = FormateNumber( obj.budget ,type);
        document.querySelector(DOMstring.incomeLabal).textContent =FormateNumber(obj.totalInc ,'inc');
        document.querySelector(DOMstring.expenseLabal).textContent = FormateNumber(obj.totalExp, 'exp');
        
        
        if(obj.persantage > 0){
            document.querySelector(DOMstring.persantageLabel).textContent = obj.persantage  + '%';    
        }else{
            document.querySelector(DOMstring.persantageLabel).textContent = '---';    

        }
        },
        changeType:function(){
            var fields =document.querySelectorAll(DOMstring.addtype + ',' + DOMstring.addDescription + ',' + DOMstring.addValue);
             nodeListForEach(fields , function(cur){
                 cur.classList.toggle('red-focus');
             });

             document.querySelector(DOMstring.inputBtn).classList.toggle('red');    
        },

         getDOMstrings:function(){
         return DOMstring;
          }
    }
})();


// app controller/////////////////////////////////////////////////////////
var app = (function(budgetCtrl, UICtrl){
  

    var setupEventListners = function(){

        // get domstrng in app controller to here publically
        var DOM = UICtrl.getDOMstrings();
        // add event listener ..
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddEvent);
        // global addevent listener..
    document.addEventListener('keypress' , function(e){
        if ( e.keyCode === 13 || e.which === 13){
            ctrlAddEvent();
        }
        });

        document.querySelector(DOM.container).addEventListener('click' , ctrlDeleteItem);
        document.querySelector(DOM.addtype),addEventListener('change' , UICtrl.changeType);
};

// update budget on screen
    var updateBudget = function(){
        
        // calculate budget
        budgetCtrl.calculateBudget();

        // return the budget 
        var budget = budgetCtrl.getBudget();

      UICtrl.displayBudget(budget);


    }

    // updatePersentage///////////////////////////////////

    var updatePersentage = function(){
        // calculate persenatage 
        budgetCtrl.calculatePersentage();
// read persebtage from the budget conatainer
        var persentage = budgetCtrl.getPersentage();

        // update the UI with the new persentage
    UICtrl.displayPersentage(persentage);


    }
    

    // get element from outer function
    var ctrlAddEvent = function(){
// get the field input data
      var input = UICtrl.getInput();

    
      if(input.description !== "" && !isNaN(input.value) && input.value > 0){

        //add the item to budget controller 
          var newItem = budgetCtrl.addItem(input.type , input.description , input.value);
        //   add the item to ui
          UICtrl.addListItem(newItem , input.type);
        //   clear all the flieds
          UICtrl.clearField();
        //   calculate and update data
        updateBudget();

        //update persentage
        updatePersentage();
    }
  
    };
    var ctrlDeleteItem = function(e){
        var itemID ,splitID , type , ID ;

        itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID){

            splitID =  itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            // delete then item from the data structure
            budgetCtrl.deleteItem(type  ,ID);
            // delete the item from the UI
            UICtrl.deleteListItem(itemID);
            // update and show the new budget
            updateBudget();
            
        //update persentage
        updatePersentage();
        }
    }


    // return function 
    return{
        init: function(){
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc  :0,
                totalExp :0,
                persantage : -1
            
            });
            setupEventListners();
        }
    }

})(budgetCtrl , UICtrl);


app.init();
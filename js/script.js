// get elements 
const select_from = document.getElementById('from-country')
const select_to = document.getElementById('to-country')
const input_from = document.getElementById('from')
const input_to = document.getElementById('to')
const tbody = document.getElementById('tbody')
const cal_btn = document.getElementById('cal-btn');
const dark_mode_btn = document.getElementById('dark-mode-btn')
const day_icon = document.getElementById('day-mode')
const night_icon = document.getElementById('night-mode')

// variable
const rates = data.rates;
var tr_id = 1;
var local_id = 0;
let mobile_view = false;

// event control
cal_btn.addEventListener('click',cal_with_btn);
input_from.addEventListener('keyup',function(e) { cal_with_from(e)} );
input_to.addEventListener('keyup',function(e) { cal_with_to(e)} )
dark_mode_btn.addEventListener('click',dark_mode_toggle)

// onload function
function onload() {
    if(window.innerWidth < 550) {
        mobile_view = true;
    }
    for (const rate in rates) {
        select_from.appendChild(create_option(rates[rate],rate));
        select_to.appendChild(create_option(rates[rate],rate));
    }
    select_from.appendChild(create_option(1,'MMK'));
    

    if(localStorage.getItem('exchange_data')) {
        local_id = localStorage.getItem('exchange_data')
        if(local_id > 0) {
             let i = 1;
             while( i <= local_id){
                 let data = localStorage.getItem('exchange_id-'+i)
                 create_tr(data.split(','))
                 i++;
             }
        }
        const tr = document.querySelectorAll('tr');
        table_for_mobile(tr);
    }else{
        const tr = document.querySelectorAll('tr');
        table_for_mobile(tr);
        create_tr(["there is no record yet !!"],false,true)
    }

}

// funtions path ........
function create_option(value,rate) {
    const option = document.createElement('option')
    option.value = value;
    option.innerText = rate;
    return option;
}

function table_for_mobile(tr) {
    if(mobile_view){
        tr.forEach(td => {
            td.children[0].remove();
            td.children[0].remove();
        })
    }
}

function calculation_currency(where = "from") {
    let date = new Date().toLocaleString().replace(',','-');
    
    let from = Number(select_from.value.replace(",",""))
    let to = Number(select_to.value.replace(",",""))
    
    let from_currency = select_from.options[select_from.selectedIndex].innerText;
    let to_currency = select_to.options[select_to.selectedIndex].innerText;
    
    value_from = input_from.value;
    value_to = input_to.value;
    
    local_id ++;
    
    if(local_id == 1){
        tbody.firstElementChild.remove();
    }

    if(where == "from"){
        let result = (value_from * ( from/to )).toFixed(2);
        let arr_data = [local_id,date,from_currency,value_from,to_currency,result]
        create_tr(arr_data,true)
        addTo_localStroage(arr_data)
        return result
    }else {
        let result = (value_to * ( to/from )).toFixed(2);
        let arr_data = [local_id,date,to_currency,value_to,from_currency,result]
        create_tr(arr_data,true)
        addTo_localStroage(arr_data)
        return result
    }
}

function cal_with_btn() {
    if(input_from.value != ""){
        let result = calculation_currency();
        input_to.value = result;
    }
}

function cal_with_from(e) {
    if(input_from.value != ""){
        if(e.keyCode == "13"){
            let result = calculation_currency();
            input_to.value = result;
        }
    }
}

function cal_with_to(e) {
    if(input_to.value != ""){
        if(e.keyCode == "13"){
            let result = calculation_currency("to");
            input_from.value = result;
        }
    }
}

function create_tr(data,not_onload = false,no_data = false) {
    const tr = document.createElement('tr');
    if(data[0]%2 == 0){
        tr.style.backgroundColor = '#668DCC';
    }else {
        tr.style.backgroundColor = '#0082fc80';
    }
    data.map(element => {
        let td = document.createElement('td')
        td.innerText = element;
        if(no_data == true){
            td.colSpan = 6;
            td.height = 200;
            td.style.fontSize = "3.5rem";
        }
        tr.appendChild(td);
    })
    if(mobile_view && not_onload){
        tr.children[0].remove();
        tr.children[0].remove();
    }
    tbody.appendChild(tr)
}

function addTo_localStroage(arr) {
    localStorage.setItem("exchange_id-"+arr[0],arr)
    localStorage.setItem('exchange_data',arr[0])
}

function dark_mode_toggle() {
    document.body.classList.toggle('dark-mode')
    day_icon.classList.toggle('hide-icon')
    night_icon.classList.toggle('hide-icon')
}
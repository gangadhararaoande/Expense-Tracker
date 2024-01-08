const balance=document.getElementById('balance');
const money_plus=document.getElementById('money-plus');
const money_minus=document.getElementById('money-minus');
const list=document.getElementById('list');
const form=document.getElementById('form');
const date=document.getElementById('date');
const text=document.getElementById('text');
const amount=document.getElementById('amount');

const localStorageTransactions=JSON.parse(
    localStorage.getItem('transactions')
);

let transactions=localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Add transaction
function addTransaction(e){
    e.preventDefault();
    if(date.value.trim() === '' || text.value.trim() === '' || amount.value.trim() === ''){
        alert('Please add a date, text and amount');
    }else{
        const transaction={
            id:generateID(),
            date: date.value,
            text:text.value,
            amount: +amount.value
        };
        transactions.push(transaction);
        addTransactionDOM(transaction);
        updateValues();
        alert('Added sucessfully!!')
        updateLocalStorage();
        date.value='';
        text.value='';
        amount.value='';
    }
}

//Generate random ID
function generateID(){
    return Math.floor(Math.random()*100000000);
}

//Add transactions to DOM list
function addTransactionDOM(transaction){
    //get sign
    const sign=transaction.amount < 0 ? '-' : '+';
    const item=document.createElement('li');
    //add class based on value
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
    item.innerHTML=`
    ${transaction.date} ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span> <button class='delete-btn' onclick='removeTransaction(${transaction.id})'>x</button>`;
    list.appendChild(item);
}

// update the balance, income and expense
function updateValues(){
    const amounts=transactions.map(transaction => transaction.amount);
    const total= amounts.reduce((acc,item)=>(acc+=item),0).toFixed(2);
    const income=amounts
    .filter(item=>item>0)
    .reduce((acc,item)=>(acc+=item),0)
    .toFixed(2);
    const expense=(
        amounts.filter(item=>item<0).reduce((acc,item)=>(acc+=item),0)* -1
    ).toFixed(2);
    balance.innerText=`Rs ${total}`;
    money_plus.innerText=`Rs ${income}`;
    money_minus.innerText=`Rs ${expense}`;
}

//Remove transaction by ID
function removeTransaction(id){
    transactions=transactions.filter(transaction=>transaction.id !== id);
    updateLocalStorage();
    alert('Deleted Sucessfully!')
    init();
}

//update local storage transactions
function updateLocalStorage(){
    localStorage.setItem('transactions',JSON.stringify(transactions));
}

// init
function init(){
    list.innerHTML='';
    transactions.forEach(addTransactionDOM);
    updateValues();
}
init();
form.addEventListener('submit',addTransaction);
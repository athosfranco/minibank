'use strict';

/* ----------------------------CHECKLIST------------------------------------------------
-> Corrigir bug que permite criar um usuário com o nome vazio
-> Implementar todas as UI's (sem mensagens via alert)
-> Editar/Deletar contas no gerenciador
*/

// Contas pré-definidas
const account1 = {
  owner: 'Athos Franco Feitosa',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Letícia Souza Ferreira',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const accounts = [account1, account2];

// Elementos DOM
const labelWelcome = document.querySelector('.welcome');
const labelbigWelcome = document.querySelector('.bigwelcome__label');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const labelCreateAcc = document.querySelector('.createAcc');
const labelManager = document.querySelector('.manager');
const errorMsgCreateAcc = document.querySelector('.error_create_acc');
const errorMsgCreatePin = document.querySelector('.error_create_pin');
const loginForm = document.querySelector('.login');
const navContainer = document.getElementById('nav');
const linhaContainer = document.getElementById('linhaContainer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const overlay = document.getElementById('overlay');

const btnLogin = document.querySelector('.login__btn');
const btnLogout = document.querySelector('.btnLogout');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const btnShowCreateAccForm = document.querySelector('.create_account');
const btnCreateAcc = document.getElementById('btnCreateAcc');
const btnCancelCreate = document.getElementById('btnCancelCreate');
const btnInfo = document.querySelector('.show-help');
const btnCreateAcc_manager = document.querySelector('.managerBtnCreateAcc');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const inputNomeCompleto = document.getElementById('nome_completo');
const inputCreatePin = document.getElementById('PIN');

//Switches
let managerOpen = false;

//Função IIFE que verifica o localStorage atrás de contas criadas previamente
(function checkStorage() {
  if (localStorage.length > 0) {
    for (let i = 0; i < localStorage.length; i++) {
      let conta = JSON.parse(localStorage.getItem(localStorage.key(i)));
      accounts.push(conta);
    }
    console.log(accounts);
  } else console.log('nenhuma conta encontrada no localStorage');
})();

//Função Construtora que cria uma nova conta
function CreateNewAccount(nomeCompleto, pinEscolhido) {
  this.owner = nomeCompleto.value;
  this.movements = randomMovementsArray();
  this.interestRate = Number((Math.random() * 0.5 + 1.7).toFixed(2));
  this.pin = Number(pinEscolhido.value);
  this.index = accounts.length;
  this.username = nomeCompleto.value
    .toLowerCase()
    .split(' ')
    .map(userArray => userArray[0])
    .join('');

  alert(
    `ATENÇÃO: ${this.owner}, a sua conta foi criada com sucesso! O seu usuário é: '${this.username}'`
  );
}

//Função que fecha a tela de criação de conta
function closeCreateAccForm() {
  managerOpen
    ? console.log('manter overlay')
    : overlay.classList.toggle('hidden');
  labelCreateAcc.classList.toggle('hidden');
}

//Função que gera movements aleatórios
function randomMovementsArray() {
  let randomArray = [];
  let numberOfMovs = Math.floor(Math.random() * (10 - 3)) + 3;

  for (let movementValue = 0; movementValue < numberOfMovs; movementValue++) {
    let movement = Math.floor(Math.random() * 1000) + 25;
    randomArray.push(movement);
  }

  return randomArray.map((value, index, array) => {
    if (index > 0) {
      if (value < array[index - 1]) {
        let chance = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
        if (chance > 50) return Math.abs(value) * -1;
        else return value;
      } else return value;
    } else return value;
  });
}

//Função que abre/fecha o formulário de criação de contas
const toggleCreateAccForm = () => {
  if (overlay.classList.contains('hidden')) {
    overlay.classList.toggle('hidden');
  } else {
  }
  labelCreateAcc.classList.toggle('hidden');
};

//Event handlers que abrem e fecham o form
btnShowCreateAccForm.addEventListener('click', toggleCreateAccForm);
btnCancelCreate.addEventListener('click', closeCreateAccForm);

//Função que cria uma nova conta e a armazena no localStorage
btnCreateAcc.addEventListener('click', function (e) {
  console.clear();
  e.preventDefault();

  let testOwner;

  const checkOwner = accounts.find(
    account => account.owner === inputNomeCompleto.value
  );

  //Teste de validação - Já possui uma conta
  if (checkOwner) {
    errorMsgCreateAcc.style.opacity = 100;
    errorMsgCreateAcc.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${inputNomeCompleto.value} já possui uma conta.`;
    testOwner = false;
  } else if (
    inputNomeCompleto.value === '' ||
    inputNomeCompleto.value.length < 10
  ) {
    errorMsgCreateAcc.style.opacity = 100;
    errorMsgCreateAcc.innerHTML = `<i class="fas fa-exclamation-circle"></i> Insira um nome e sobrenome válido.`;
    testOwner = false;
  } else {
    errorMsgCreateAcc.style.color = 'green';
    errorMsgCreateAcc.classList.add('success');
    errorMsgCreateAcc.style.opacity = 100;
    errorMsgCreateAcc.innerHTML = `<i class="fas fa-check-circle"></i> Nome válido.`;
    testOwner = true;
  }

  let testPin;

  if (Number(inputCreatePin.value)) {
    errorMsgCreatePin.style.color = 'green';
    errorMsgCreatePin.style.opacity = 100;
    errorMsgCreatePin.innerHTML = `<i class="fas fa-check-circle"></i> PIN válido.`;
    testPin = true;
  } else {
    errorMsgCreatePin.style.opacity = 100;
    errorMsgCreatePin.innerHTML = `<i class="fas fa-exclamation-circle"></i> Insira um PIN válido. (apenas números)`;
    testPin = false;
  }

  //Verifica se ambos os testes de validação passaram e foram aprovados
  if (testPin && testOwner) {
    errorMsgCreateAcc.style.opacity = 0;
    errorMsgCreatePin.style.opacity = 0;
    const newAccount = new CreateNewAccount(inputNomeCompleto, inputCreatePin);
    accounts.push(newAccount);
    localStorage.setItem(`conta${accounts.length}`, JSON.stringify(newAccount));
    console.log(accounts);
    toggleCreateAccForm();
  }
});

//Função que cria os usuários pra login
const createUsernames = accs => {
  accs.forEach(account => {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(userArray => userArray[0])
      .join('');
  });
};

createUsernames(accounts);

//Função que atualiza as movimentações bancárias na interface do usuário
const updateMovements = function (account) {
  containerMovements.innerHTML = '';

  account.movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'depósito' : 'saque';

    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">
          ${i + 1} ${type}
          </div>          
          <div class="movements__value">R$ ${Math.abs(mov)} </div>
        </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//Função que atualiza o balanço
const updateBalance = account => {
  const balance = account.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.innerHTML = `${balance.toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL',
  })}`;
};

//Função que atualiza o summary
const updateSummary = account => {
  const entradaSummary = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);

  labelSumIn.innerHTML = `${entradaSummary.toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL',
  })}`;

  const saidaSummary = Math.abs(
    account.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov)
  );

  labelSumOut.innerHTML = `${saidaSummary.toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL',
  })}`;

  const interestSummary = account.movements
    .filter(mov => mov > 0)
    .map(int => (int * account.interestRate) / 100)
    .reduce((acc, int) => acc + int);

  labelSumInterest.innerHTML = `${interestSummary.toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL',
  })}`;
};

//Função que efetua o Login
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount === undefined) {
    alert('Atenção: conta inexistente!');
  } else {
    if (currentAccount?.pin === Number(inputLoginPin.value))
      //MOSTRA UI E MENSAGEM DE BOAS-VINDAS
      window.scrollTo(0, 0);
    containerApp.style.opacity = 100;
    btnLogout.classList.toggle('hidden');
    loginForm.classList.toggle('hidden');
    navContainer.classList.toggle('hidden');
    labelWelcome.innerHTML = `<i class="fas fa-user"></i> Usuário: ${currentAccount.owner}`;
    labelbigWelcome.innerHTML = `Olá, ${currentAccount.owner.split(' ')[0]}!`;

    //MOSTRAR MOVIMENTOS
    updateMovements(currentAccount);

    //MOSTRAR BALANÇO DA CONTA
    updateBalance(currentAccount);

    //MOSTRAR SUMÁRIO
    updateSummary(currentAccount);
  }
});

//Mostra a tela de informação/ajuda
btnInfo.addEventListener('click', function (e) {
  e.preventDefault();

  openManager();
});

//[GERENCIADOR DE CONTAS]

//Função que cria uma conta pelo gerenciador
btnCreateAcc_manager.addEventListener('click', () => {
  toggleCreateAccForm();
});

//Função que abre/fecha a tela de gerenciamento de contas
const openManager = () => {
  managerOpen = true;
  overlay.classList.toggle('hidden');
  labelManager.classList.toggle('hidden');
};

/*

      <div class="linha">

          <span class="titular">
          <i class="fas fa-user-lock"></i> TITULAR: Athos Franco de Sá Feitosa
          </span>

          <span class="usuario">
          USUÁRIO: aff
          </span>

          <button class="btn-editAcc">
          Editar
          </button>

          <button class="btn-deleteAcc">
          Deletar
          </button>

        </div>




*/
const updateManager = () => {
  if (linhaContainer.childElementCount === accounts.length) {
  } else {
    for (let i = 2; i < accounts.length; i++) {
      let linha = document.createElement('div');
      linha.classList.add('linha');
      linha.innerHTML = `
            <span class="titular">
          TITULAR: ${accounts[i]['owner']}
          </span>

          <span class="usuario">
          USUÁRIO: ${accounts[i]['username']}
          </span>

          <button class="btn-editAcc">
          Editar
          </button>

          <button class="btn-deleteAcc">
          Deletar
          </button>`;
      linhaContainer.appendChild(linha);
    }
  }
};

/////////////////////////////////////////////////

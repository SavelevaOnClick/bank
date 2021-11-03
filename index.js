const clients = [
  {
    id: 1,
    name: "Александр",
    surname: "Александров",
    patronymic: "Александрович",
    status: true,
    registration: "Wed Oct 20 2019 15:13:50 GMT+0300",
    accounts: [
      {
        account: "debit",
        balance: 2300,
        curency: "eur",
        activity: "Sat Apr 13 2025",
      },
      {
        account: "credit",
        balance: 0,
        creditLimits: 3000,
        currency: "eur",
        activity: "Sat Apr 03 2021",
      },
    ],
  },
  {
    id: 2,
    name: "Виталий",
    surname: "Витальев",
    patronymic: "Витальевич",
    status: false,
    registration: "Wed Oct 20 2020 15:13:50 GMT+0300",
    accounts: [
      {
        account: "credit",
        balance: 2000,
        creditLimits: 3000,
        currency: "usd",
        activity: "Sat Apr 03 2020",
      },
    ],
  },
  {
    id: 3,
    name: "Виктор",
    surname: "Викторов",
    patronymic: "Викторович",
    status: false,
    registration: "Wed Oct 02 2018 15:13:50 GMT+0300",
    accounts: [
      {
        account: "debit",
        balance: 1300,
        currency: "eur",
        activity: "Sat Apr 03 2023",
      },
      {
        account: "credit",
        balance: 4000,
        creditLimits: 3000,
        currency: "usd",
        activity: "Sat Apr 03 2022",
      },
    ],
  },
  {
    id: 4,
    name: "Марфа",
    surname: "Александров",
    patronymic: "Митрофановна",
    status: true,
    registration: "Wed Oct 20 2015 15:13:50 GMT+0300",
    accounts: [
      {
        account: "debit",
        balance: 1300,
        currency: "eur",
        activity: "Sat Apr 13 2022",
      },
    ],
  },
];

class Bank {
  static id = 4;
  constructor(clients) {
    this.clients = clients;
    this.root = document.getElementById("root");
    this.render();
    this.toStorage();
  }

  createSelect(options, values) {
    const select = document.createElement("select");
    options.forEach((option, index) => {
      select.options[index] = new Option(option, values[index]);
    });
    return select;
  }

  createButton(type, className, titleButton) {
    const button = document.createElement("button");
    Object.assign(button, {
      type: type,
      classList: className,
      innerText: titleButton,
    });
    return button;
  }

  createTitle(type, textContant, className) {
    const title = document.createElement(type);
    Object.assign(title, { innerText: textContant, classList: className });
    return title;
  }

  createInput(type, name, placeholder, value) {
    let input = document.createElement("input");
    Object.assign(input, {
      type,
      name,
      value,
      placeholder,
    });
    return input;
  }

  createClientForm(dataClient) {
    dataClient = dataClient || 0;
    const form = document.createElement("form");
    form.innerHTML = `
      <input type='text' placeholder = 'имя' name = 'name' value=${
        dataClient.name || " "
      } >
      <input type='text' placeholder ='фамилия' name = 'surname' value=${
        dataClient.surname || " "
      } >
      <input type='text' placeholder = 'отчество' name ='patronymic' value=${
        dataClient.patronymic || " "
      } >
    `;
    const buttonAddAccount = this.createButton("button", "btn", "Аккаунт");
    form.appendChild(buttonAddAccount);
    buttonAddAccount.onclick = this.renderAccount.bind(this, form);
    return form;
  }

  renderAccount(container, event) {
    if (!container.querySelector(".accountBlock")) {
      container.appendChild(this.createRadioInputsBlock(["credit", "debit"]));
    } else {
      container.querySelector(".accountBlock").remove();
    }
  }

  createRadioInputsBlock(values) {
    const accountBlock = document.createElement("div");
    values.forEach((radioElem, index) => {
      let wrapper = accountBlock.appendChild(document.createElement("div"));
      let label = wrapper.appendChild(document.createElement("label"));
      let radioInput = wrapper.appendChild(document.createElement("input"));
      let temp = Date.now() + index;
      Object.assign(radioInput, {
        type: "radio",
        name: "account",
        id: `radio${temp}`,
        value: radioElem,
      });

      Object.assign(label, { for: `radio${temp}`, innerText: radioElem });
    });
    accountBlock.classList.add("accountBlock");
    accountBlock.onchange = this.renderAccountContent.bind(this, accountBlock);
    return accountBlock;
  }

  renderAccountContent(container, event) {
    if (event.target.name === "account") {
      event.preventDefault();
      let accountInfoBlock = event.target
        .closest("div.accountBlock")
        .querySelector(".cardInfo");
      if (accountInfoBlock) {
        accountInfoBlock.remove();
      }
      let infoCard = container.appendChild(document.createElement("div"));
      infoCard.classList.add("cardInfo");

      if (event.target.value === "credit") {
        infoCard.appendChild(
          this.createInput("number", "creditLimit", "Кредитный лимит")
        );
      }
      infoCard.appendChild(this.createInput("number", "balance", "баланс"));
      let currencySelect = infoCard.appendChild(
        this.createSelect(this.createCurrencyList(), this.createCurrencyList())
      );
      currencySelect.setAttribute("name", "currency");
    }
  }

  render() {
    const wrapperClientBlock = this.root.appendChild(
      document.createElement("div")
    );
    const wrapperAddClient = wrapperClientBlock.appendChild(
      document.createElement("div")
    );
    wrapperAddClient.appendChild(
      this.createTitle("h2", "Добавить нвоого клиента", "title")
    );
    wrapperAddClient.appendChild(this.createClientForm());

    const buttonSubmitForm = this.createButton("submit", "btn", "отправить");
    wrapperAddClient.appendChild(buttonSubmitForm);
    buttonSubmitForm.onclick = this.addClient.bind(
      this,
      wrapperAddClient.querySelector("form")
    );
    const wrapperClientList = wrapperClientBlock.appendChild(
      document.createElement("div")
    );
    wrapperClientList.appendChild(
      this.createTitle("h2", "Работа с клиентами", "title")
    );
    const searchClient = wrapperClientList.appendChild(
      document.createElement("div")
    );
    searchClient.appendChild(this.createSearchClients(searchClient));
    const wrapperFundBank = this.root.appendChild(
      document.createElement("div")
    );
    const wrapperActivesBank = wrapperFundBank.appendChild(
      document.createElement("div")
    );
    wrapperActivesBank.appendChild(
      this.createTitle("h2", "Активы банка", "title")
    );
    const buttonActivesBank = wrapperActivesBank.appendChild(
      this.createButton("button", "btn", "посчитать")
    );

    const selectCurrencyActives = wrapperActivesBank.appendChild(
      this.createSelect(this.createCurrencyList(), this.createCurrencyList())
    );
    const activesBank = wrapperActivesBank.appendChild(
      document.createElement("p")
    );
    activesBank.classList.add("output");
    buttonActivesBank.onclick = this.getAllAssets.bind(
      this,
      activesBank,
      selectCurrencyActives
    );
    const wrapperCreditsBlock = wrapperFundBank.appendChild(
      document.createElement("div")
    );
    wrapperCreditsBlock.appendChild(this.createTitle("h2", "Кредиты", "title"));
    const buttonCredits = wrapperCreditsBlock.appendChild(
      this.createButton("button", "btn", "посчитать")
    );
    const selectCurrencyCredits = wrapperCreditsBlock.appendChild(
      this.createSelect(this.createCurrencyList(), this.createCurrencyList())
    );
    const selectStatusClients = wrapperCreditsBlock.appendChild(
      this.createSelect(["активные", "неактивные", "все"], [1, 0, 2])
    );
    const creditsBank = wrapperCreditsBlock.appendChild(
      document.createElement("p")
    );
    creditsBank.classList.add("output");
    buttonCredits.onclick = this.getSumCredit.bind(
      this,
      creditsBank,
      selectStatusClients,
      selectCurrencyCredits
    );
  }

  getSumCredit(container, selectStatus, selectCurrency, event) {
    const status = +this.getSelectValue(selectStatus);
    const currency = this.getSelectValue(selectCurrency);
    let sum = 0;
    if (status === 2) {
      sum = this.clients.reduce((acum, client) => {
        acum +=
          this.isCreditAccount(client) &&
          this.getClientCredits(client, currency);
        return acum;
      }, 0);
    } else {
      sum = this.clients.reduce((acum, client) => {
        acum +=
          client.status === Boolean(status) &&
          this.isCreditAccount(client) &&
          this.getClientCredits(client, currency);
        return acum;
      }, 0);
    }
    container.innerText = sum.toFixed(2);
  }

  isCreditAccount(client) {
    for (let account of client.accounts) {
      if (account.account === "credit") {
        return true;
      }
    }
    return false;
  }

  getClientCredits(client, currency) {
    let credit = 0;
    for (let account of client.accounts) {
      if (
        account.account === "credit" &&
        account.creditLimits > account.balance
      ) {
        if (account.type !== currency) {
          credit +=
            (localStorage.getItem(account.currency) *
              (account.creditLimits - account.balance)) /
            localStorage.getItem(currency);
        } else {
          credit += account.creditLimits - account.balance;
        }
      }
    }
    return credit;
  }

  getAllAssets(container, select, event) {
    event.preventDefault();
    let currency = this.getSelectValue(select);
    container.innerText = this.clients
      .reduce((acum, client) => {
        acum += this.getClientAssets(client, currency);
        return acum;
      }, 0)
      .toFixed(2);
  }

  getClientAssets(client, currency) {
    let sum = 0;
    for (let account of client.accounts) {
      if (account.currency !== currency) {
        sum +=
          (localStorage.getItem(account.currency) * account.balance) /
          localStorage.getItem(currency);
      } else {
        sum += account.balance;
      }
    }
    return sum;
  }

  createSearchClients(parentContainer) {
    const form = document.createElement("form");
    form.appendChild(this.createInput("text", "surname", "фамилия", ""));
    form.appendChild(this.createButton("submit", "btn", "найти"));
    form.onclick = this.searchClients.bind(this, form, parentContainer);
    return form;
  }

  searchClients(form, parentContainer, event) {
    if (event.target.tagName.toLowerCase() === "button") {
      event.preventDefault();
      let { surname } = this.getDataClient(form);
      const dataClientsInfo = this.clients.reduce((acum, client) => {
        if (client.surname === surname) {
          acum[client.id] = `${client.name}  ${client.surname}`;
        }
        return acum;
      }, {});
      let searchList = parentContainer.querySelector(".list");
      searchList && searchList.remove();
      parentContainer.appendChild(this.createSearchList(dataClientsInfo));
    }
  }

  createSearchList(data) {
    const dataListClients = document.createElement("ul");
    dataListClients.classList.add("list");

    Object.keys(data).forEach((id) => {
      const dataClient = document.createElement("li");
      dataListClients.appendChild(dataClient);
      dataClient.setAttribute("data-id", id);
      dataClient.appendChild(document.createElement("p")).innerText = data[id];
      const deleteClient = dataClient.appendChild(
        this.createButton("button", "buttonOption", "Х")
      );
      deleteClient.setAttribute("data-info", "deleteClient");
      const updateClient = dataClient.appendChild(
        this.createButton("button", "buttonOption", "up")
      );
      updateClient.setAttribute("data-info", "updateClient");
    });

    dataListClients.onclick = this.handleClick.bind(this);
    return dataListClients;
  }

  handleClick(event) {
    let targetLi = event.target.closest("li");
    if (event.target.className === "buttonOption") {
      let targetAttribute = event.target.getAttribute("data-info");
      if (typeof this[targetAttribute] === "function") {
        this[targetAttribute](+targetLi.getAttribute("data-id"), targetLi);
      }
    }
  }

  getDataAccount(form) {
    let account = {};
    const data = new FormData(form);
    data.forEach((value, name) => {
      if (
        name === "account" ||
        name === "balance" ||
        name === "creditLimit" ||
        name === "currency"
      ) {
        if (name === "account" || name === "currency") {
          Object.assign(account, { [name]: value });
        } else {
          Object.assign(account, { [name]: Number(value) });
        }
      }
    });
    account.activity = this.getActivitiCard(account.accounts);
    return account;
  }

  getActivitiCard(typeAccount) {
    let currentDate = new Date();
    return currentDate.setFullYear(
      currentDate.getFullYear() + (typeAccount === "credit" ? 3 : 5)
    );
  }

  addAccount(form, id) {
    let indexClient = this.clients.findIndex((client) => client.id === id);
    this.clients[indexClient].accounts.push(this.getDataAccount(form));
  }

  createCurrencyList() {
    return Object.keys(localStorage).map((curency) => curency);
  }

  updateClient(id, container) {
    const form = container.querySelector("form");
    if (form) {
      this.addAccount(form, id);
      form.remove();
    } else {
      let clientIndex = this.clients.findIndex((client) => client.id === id);
      container.appendChild(this.createClientForm(this.clients[clientIndex]));
    }
  }

  deleteClient(id, container) {
    this.clients.splice(
      this.clients.findIndex((client) => client.id === id),
      1
    );
    container.remove();
  }

  addClient(form) {
    const newClient = this.getDataClient(form);
    newClient.registration = Date.now();
    newClient.id = ++Bank.id;
    const accounts = [];
    accounts.push(this.getDataAccount(form));
    newClient.accounts = accounts;
    this.clients.push(newClient);
    form.reset();
  }

  getDataClient(form) {
    const dataClient = {};
    const dataForm = new FormData(form);
    dataForm.forEach((value, name) => {
      if (
        name !== "account" &&
        name !== "balance" &&
        name !== "creditLimit" &&
        name !== "currency"
      ) {
        Object.assign(dataClient, { [name]: value });
      }
    });

    return dataClient;
  }

  getSelectValue(select) {
    let indexSelect = select.options.selectedIndex;
    let valueSelect = select.options[indexSelect].value;
    return valueSelect;
  }

  async toStorage() {
    (await this.getCurses()).forEach(
      (item) =>
        item.base_ccy === "UAH" &&
        localStorage.setItem(item.ccy.toLowerCase(), item.sale)
    );
    localStorage.setItem("uah", "1");
  }

  async getCurses() {
    return await (
      await fetch(
        "https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11"
      )
    ).json();
  }
}
let databaseOfClients = new Bank(clients);

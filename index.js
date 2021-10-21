const clients = [
  {
    name: "Александр",
    surname: "Александров",
    patronymic: "Александрович",
    status: true,
    registration: "Wed Oct 20 2019 15:13:50 GMT+0300",
    accounts: [
      {
        debit: {
          balance: 2300,
          type: "eur",
          activity: "Sat Apr 13 2025",
        },
      },
      {
        credit: {
          balance: {
            personal: 0,
            creditLimits: 3000,
          },
          type: "eur",
          activity: "Sat Apr 03 2021",
        },
      },
    ],
  },
  {
    name: "Виталий",
    surname: "Витальев",
    patronymic: "Витальевич",
    status: true,
    registration: "Wed Oct 20 2020 15:13:50 GMT+0300",
    accounts: [
      {
        credit: {
          balance: {
            personal: 2000,
            creditLimits: 3000,
          },

          type: "usd",
          activity: "Sat Apr 03 2020",
        },
      },
    ],
  },
  {
    name: "Виктор",
    surname: "Викторов",
    patronymic: "Викторович",
    status: true,
    registration: "Wed Oct 02 2018 15:13:50 GMT+0300",
    accounts: [
      {
        debit: {
          balance: 1300,
          type: "eur",
          activity: "Sat Apr 03 2023",
        },
      },
      {
        credit: {
          balance: {
            personal: 4000,
            creditLimits: 3000,
          },
          type: "usd",
          activity: "Sat Apr 03 2022",
        },
      },
    ],
  },
  {
    name: "Марфа",
    surname: "Макарова",
    patronymic: "Митрофановна",
    status: true,
    registration: "Wed Oct 20 2015 15:13:50 GMT+0300",
    accounts: [
      {
        debit: {
          balance: 1300,
          type: "eur",
          activity: "Sat Apr 13 2022",
        },
      },
    ],
  },
];

class Bank {
  constructor(arrayOfClients) {
    this.clients = arrayOfClients;
  }

  add(data) {
    this.clients.push(data);
  }

  get getClients() {
    return this.clients;
  }

  async getCurses(currencyIn, currencyOut) {
    let { data } = await (
      await fetch(
        `https://evgeniychvertkov.com/api/exchange/?currency[]=${currencyIn}${currencyOut}`,
        {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "X-Authorization-Token": "ce46960e-3005-11ec-a1b1-8a04c6a70bd3",
          },
        }
      )
    ).json();

    return data[Object.keys(data)[0]];
  }

  async getAllAssets(currency) {
    let sum = null;

    for (let client of this.clients) {
      sum += await this.getClientAssetsInBank(client, currency);
    }
    return sum;
  }

  async getClientAssetsInBank(client, currency) {
    let sum = null;
    for (let account of client.accounts) {
      if (account.debit) {
        if (account.debit.type !== currency) {
          sum +=
            (await this.getCurses(account.debit.type, currency)) *
            account.debit.balance;
        } else {
          sum += account.debit.balance;
        }
      }
      if (account.credit) {
        if (account.credit.type !== currency) {
          let temp = await this.getCurses(account.credit.type, currency);
          sum += account.credit.balance.personal * temp;
        } else {
          sum += account.credit.balance.personal;
        }
      }
    }
    return sum;
  }

  async getTotalSumCredit(currency) {
    let allcredit = null;

    for (let client of this.clients) {
      if (this.isCreditAccount(client)) {
        allcredit += await this.getCreditClient(client, currency);
      }
    }

    return allcredit;
  }

  isCreditAccount(client) {
    return !!client.accounts.reduce((acum, acc) => {
      acc.credit && acum++;
      return acum;
    }, 0);
  }

  async getCreditClient(client, currency) {
    let credit = null;
    for (let account of client.accounts) {
      if (account.credit) {
        if (account.credit.type !== currency) {
          let temp = await this.getCurses(account.credit.type, currency);
          credit +=
            temp *
            (account.credit.balance.personal <
            account.credit.balance.creditLimits
              ? account.credit.balance.creditLimits -
                account.credit.balance.personal
              : null);
        } else {
          credit +=
            account.credit.balance.personal <
            account.credit.balance.creditLimits
              ? account.credit.balance.creditLimits -
                account.credit.balance.personal
              : null;
        }
      }
    }
    return credit;
  }

  isActivesCard(client, account) {
    let active = false;
    for (let account of client.accounts) {
      for (let property in account) {
        if (property === account && account[property].activity) {
          active = new Date(account[property].activity) > new Date();
        }
      }
    }
    return active;
  }

  async getSumCredit(boolean, currency) {
    let counter = null;
    let sumCredit = null;
    for (let client of this.clients) {
      if (
        this.isCreditAccount(client) &&
        boolean === this.isActivesCard(client, "credit")
      ) {
        let temp = await this.getCreditClient(client, currency);
        if (temp) {
          counter++;
          sumCredit += temp;
        }
      }
    }
    return Object.assign({}, { [counter]: sumCredit });
  }
}

let databaseOfClients = new Bank(clients);
console.log(databaseOfClients.getClients);

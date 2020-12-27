import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transaction = this.find();

    const { income, outcome } = (await transaction).reduce(
      (accumulator: Balance, transactionBalance: Transaction) => {
        switch (transactionBalance.type) {
          case 'income':
            accumulator.income += Number(transactionBalance.value);
            break;

          case 'outcome':
            accumulator.outcome += Number(transactionBalance.value);
            break;

          default:
            break;
        }
        return accumulator;
      },
      { income: 0, outcome: 0, total: 0 },
    );

    const total = income - outcome;

    return { income, outcome, total };
  }
}

export default TransactionsRepository;

import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'outcome' | 'income';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);

    let transactionCategory = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    if (!transactionCategory) {
      transactionCategory = categoryRepository.create({
        title: category,
      });
    }

    const { total } = await transactionRepository.getBalance();
    if (type === 'outcome' && value > total) {
      throw new AppError('you have not anough money');
    }

    await categoryRepository.save(transactionCategory);
    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: transactionCategory,
    });
    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
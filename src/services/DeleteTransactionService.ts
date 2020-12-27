import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';


class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const validId = await transactionRepository.findOne(id);

    if (!validId) {
      throw new AppError('this id does not exist');
    }

    await transactionRepository.remove(validId);
  }
}

export default DeleteTransactionService;

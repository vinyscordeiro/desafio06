import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface TransactionDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: TransactionDTO): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionRepository);
    const categoriesRepository = getRepository(Category);

    const { total } = await transactionsRepository.getBalance();

    if (total < value && type === 'outcome') {
      throw new AppError('Not enough income available', 400);
    }

    let categoryChoosed = await categoriesRepository.findOne({
      where: {
        title: category,
      },
    });

    if (!categoryChoosed) {
      categoryChoosed = await categoriesRepository.create({
        title: category,
      });
      await categoriesRepository.save(categoryChoosed);
    }
    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category: categoryChoosed,
    });

    await transactionsRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;

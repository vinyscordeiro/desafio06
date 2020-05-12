import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

interface Request {
  transaction_id: string;
}
class DeleteTransactionService {
  public async execute({ transaction_id }: Request): Promise<void> {
    const transactionsRepository = getRepository(Transaction);
    const locateTransactionByID = await transactionsRepository.findOne(
      transaction_id,
    );
    if (!locateTransactionByID) {
      throw new AppError('ID Not Found', 401);
    }
    transactionsRepository.remove(locateTransactionByID);
  }
}

export default DeleteTransactionService;

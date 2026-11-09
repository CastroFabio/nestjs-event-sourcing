import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { AccountService } from './accounts.service.js';
import z from 'zod';

const openSchema = z.object({ owner: z.string().min(1) });
const amountSchema = z.object({ amount: z.number().int().positive() });

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accounts: AccountService) {}

  @Post()
  open(
    @Body({ schema: openSchema }) dto: z.infer<typeof openSchema>,
    @Headers('x-actor-id') actor = 'anonymous',
  ) {
    return this.accounts.open(dto.owner, actor);
  }

  @Post(':id/deposit')
  deposit(
    @Param('id') id: string,
    @Body({ schema: amountSchema }) dto: z.infer<typeof amountSchema>,
    @Headers('x-actor-id') actor = 'anonymous',
  ) {
    return this.accounts.deposit(id, dto.amount, actor);
  }

  @Post(':id/withdraw')
  withdraw(
    @Param('id') id: string,
    @Body({ schema: amountSchema }) dto: z.infer<typeof amountSchema>,
    @Headers('x-actor-id') actor = 'anonymous',
  ) {
    return this.accounts.withdraw(id, dto.amount, actor);
  }

  @Get(':id')
  async get(@Param('id') id: string, @Query('revision') revision?: string) {
    const { state } = await this.accounts.load(
      id,
      revision !== undefined ? BigInt(revision) : undefined,
    );
    return state;
  }

  @Get(':id/history')
  history(@Param('id') id: string) {
    return this.accounts.history(id);
  }
}

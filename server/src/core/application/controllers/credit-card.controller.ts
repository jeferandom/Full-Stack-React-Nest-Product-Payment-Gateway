import { Controller, Post, Body } from '@nestjs/common';
import { CreditCardApplicationService } from '../../../infrastructure/secondary/credit-card/credit-card.service';
import { CreditCardValidationDto } from '../dtos/credit-card-validation.dto';

@Controller('credit-card')
export class CreditCardController {
  constructor(
    private readonly creditCardService: CreditCardApplicationService,
  ) {}

  @Post('tokenize')
  async tokenize(@Body() dto: CreditCardValidationDto) {
    return this.creditCardService.validateAndTokenize(dto);
  }
}

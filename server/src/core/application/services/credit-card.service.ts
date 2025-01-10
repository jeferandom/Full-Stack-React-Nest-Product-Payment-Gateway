import { Injectable } from '@nestjs/common';
import { CreditCardValidatorService } from '../../domain/services/credit-card-validator.service';
import { CreditCardValidationDto } from '../dtos/credit-card-validation.dto';

@Injectable()
export class CreditCardApplicationService {
  constructor(
    private readonly creditCardValidator: CreditCardValidatorService,
  ) {}

  validate(dto: CreditCardValidationDto) {
    return {
      isValid: this.creditCardValidator.validateCard(dto.cardNumber),
      cardType: this.creditCardValidator.identifyCardType(dto.cardNumber),
      hasValidLength: this.creditCardValidator.isValidLength(dto.cardNumber),
    };
  }
}

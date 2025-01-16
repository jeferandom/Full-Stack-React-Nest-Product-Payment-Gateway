import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CreditCardValidatorService } from '../../../core/domain/services/credit-card-validator.service';
import { CreditCardValidationDto } from '../../../core/application/dtos/credit-card-validation.dto';

@Injectable()
export class CreditCardApplicationService {
  private readonly apiUrl: string;
  private readonly authorizationToken: string;

  constructor(
    private readonly creditCardValidator: CreditCardValidatorService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get<string>('PAYMENT_GATEWAY_API_URL');
    this.authorizationToken = this.configService.get<string>(
      'PAYMENT_GATEWAY_AUTHORIZATION_TOKEN',
    );
  }

  async validateAndTokenize(dto: CreditCardValidationDto) {
    const validation = {
      isValid: this.creditCardValidator.validateCard(dto.number),
      cardType: this.creditCardValidator.identifyCardType(dto.number),
      hasValidLength: this.creditCardValidator.isValidLength(dto.number),
    };

    if (validation.isValid) {
      const token = await this.tokenizeCard(dto);
      return { ...validation, token };
    }

    return validation;
  }

  private async tokenizeCard(
    cardDetails: CreditCardValidationDto,
  ): Promise<any> {
    const headers = {
      Authorization: this.authorizationToken,
    };

    const payload = {
      number: cardDetails.number,
      cvc: cardDetails.cvc,
      exp_month: cardDetails.exp_month,
      exp_year: cardDetails.exp_year,
      card_holder: cardDetails.card_holder,
    };

    const response = await this.httpService
      .post(`${this.apiUrl}/tokens/cards`, payload, { headers })
      .toPromise();

    return response.data;
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CreditCardApplicationService } from './credit-card.service';
import { CreditCardValidatorService } from '../../../core/domain/services/credit-card-validator.service';
import { CreditCardValidationDto } from '../../../core/application/dtos/credit-card-validation.dto';
import { of } from 'rxjs';

describe('CreditCardApplicationService', () => {
  let service: CreditCardApplicationService;
  let httpService: HttpService;
  let configService: ConfigService;
  let validatorService: CreditCardValidatorService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config = {
        PAYMENT_GATEWAY_API_URL: 'http://api.test.com',
        PAYMENT_GATEWAY_AUTHORIZATION_TOKEN: 'test-token',
      };
      return config[key];
    }),
  };

  const mockHttpService = {
    post: jest.fn(),
  };

  const mockValidatorService = {
    validateCard: jest.fn(),
    identifyCardType: jest.fn(),
    isValidLength: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreditCardApplicationService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: CreditCardValidatorService,
          useValue: mockValidatorService,
        },
      ],
    }).compile();

    service = module.get<CreditCardApplicationService>(
      CreditCardApplicationService,
    );
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
    validatorService = module.get<CreditCardValidatorService>(
      CreditCardValidatorService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateAndTokenize', () => {
    const mockCardData: CreditCardValidationDto = {
      number: '4111111111111111',
      cvc: '123',
      exp_month: '12',
      exp_year: '2025',
      card_holder: 'John Doe',
    };

    const mockTokenResponse = {
      data: {
        token: 'tok_test_123',
        status: 'valid',
      },
    };

    it('should validate and tokenize a valid card', async () => {
      mockValidatorService.validateCard.mockReturnValue(true);
      mockValidatorService.identifyCardType.mockReturnValue('visa');
      mockValidatorService.isValidLength.mockReturnValue(true);
      mockHttpService.post.mockReturnValue(of(mockTokenResponse));

      const result = await service.validateAndTokenize(mockCardData);

      expect(result).toEqual({
        isValid: true,
        cardType: 'visa',
        hasValidLength: true,
        token: mockTokenResponse.data,
      });

      expect(mockHttpService.post).toHaveBeenCalledWith(
        'http://api.test.com/tokens/cards',
        mockCardData,
        {
          headers: { Authorization: 'test-token' },
        },
      );
    });
  });
});

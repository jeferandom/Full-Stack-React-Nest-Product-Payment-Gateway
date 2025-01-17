import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { PaymentTransactionDto } from '../../../core/application/dtos/payment-transaction.dto';
import {
  ResponseTransactionPaymentGateway,
  ErrorResponseTransactionPaymentGateway,
} from '../../../core/domain/interfaces/payment-transaction.interface';

interface MerchantInfoResponse {
  data: {
    presigned_acceptance: {
      acceptance_token: string;
    };
    presigned_personal_data_auth: {
      acceptance_token: string;
    };
  };
}

interface TransactionResponse {
  data: {
    id: string;
    created_at: string;
    amount_in_cents: number;
    reference: string;
    customer_email: string;
    currency: string;
    status: string;
    status_message: string;
    redirect_url?: string;
    payment_method: {
      type: string;
      extra: {
        last_four: string;
      };
    };
  };
}

@Injectable()
export class PaymentGatewayService {
  private readonly apiUrl: string;
  private readonly authorizationToken: string;
  private readonly pubKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get<string>('PAYMENT_GATEWAY_API_URL');
    this.pubKey = this.configService.get<string>('PAYMENT_GATEWAY_PUB_KEY');
    this.authorizationToken = this.configService.get<string>(
      'PAYMENT_GATEWAY_AUTHORIZATION_TOKEN',
    );
  }

  async createTransaction(
    transactionDto: PaymentTransactionDto,
  ): Promise<
    ResponseTransactionPaymentGateway | ErrorResponseTransactionPaymentGateway
  > {
    const headers = {
      Authorization: this.authorizationToken,
    };

    try {
      const response = await firstValueFrom(
        this.httpService
          .post(`${this.apiUrl}/transactions`, transactionDto, { headers })
          .pipe(
            catchError((error) => {
              throw error;
            }),
          ),
      );

      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data as ErrorResponseTransactionPaymentGateway;
      }
      throw error;
    }
  }

  async getTransaction(
    transactionId: string,
  ): Promise<TransactionResponse | ErrorResponseTransactionPaymentGateway> {
    const headers = {
      Authorization: this.authorizationToken,
    };

    try {
      const response = await firstValueFrom(
        this.httpService
          .get(`${this.apiUrl}/transactions/${transactionId}`, { headers })
          .pipe(
            catchError((error) => {
              throw error;
            }),
          ),
      );

      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data as ErrorResponseTransactionPaymentGateway;
      }
      throw error;
    }
  }

  async getMerchantInfo(): Promise<MerchantInfoResponse> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.apiUrl}merchants/${this.pubKey}`).pipe(
        catchError((error) => {
          throw error;
        }),
      ),
    );

    return response.data;
  }

  async getAcceptanceTokens(): Promise<{
    acceptance_token: string;
    accept_personal_auth: string;
  }> {
    const merchantInfo = await this.getMerchantInfo();
    return {
      acceptance_token: merchantInfo.data.presigned_acceptance.acceptance_token,
      accept_personal_auth:
        merchantInfo.data.presigned_personal_data_auth.acceptance_token,
    };
  }
}

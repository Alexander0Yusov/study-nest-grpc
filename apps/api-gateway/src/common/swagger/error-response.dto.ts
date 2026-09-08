import { ApiProperty } from '@nestjs/swagger';

export class GatewayErrorResponseDto {
  @ApiProperty({ example: 400 })
  statusCode!: number;

  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
    example: ['ids must be an array', 'ids must contain at least 1 elements'],
  })
  message!: string | string[];

  @ApiProperty({ example: 'BAD_REQUEST' })
  error!: string;
}

import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function MaxUtf8Bytes(
  maxBytes: number,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (target: object, propertyKey: string | symbol): void => {
    registerDecorator({
      name: 'maxUtf8Bytes',
      target: target.constructor,
      propertyName: propertyKey.toString(),
      constraints: [maxBytes],
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          return (
            typeof value === 'string' &&
            Buffer.byteLength(value, 'utf8') <= maxBytes
          );
        },
        defaultMessage(arguments_: ValidationArguments): string {
          return `${arguments_.property} must not exceed ${maxBytes} UTF-8 bytes`;
        },
      },
    });
  };
}

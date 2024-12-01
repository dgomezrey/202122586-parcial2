import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class BonoDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  readonly monto: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  readonly calificacion: number;

  @IsString()
  @IsNotEmpty()
  readonly palabraClave: string;
}

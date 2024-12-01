import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class UsuarioDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  readonly numeroCedula: number;

  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly grupoInvestigacion: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  readonly numeroExtension: number;

  @IsString()
  @IsNotEmpty()
  readonly rol: string;

  @IsOptional()
  readonly subordinados?: UsuarioDto[];
}

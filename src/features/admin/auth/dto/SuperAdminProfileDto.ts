import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Profile information captured when an admin signs up.
 * These fields map directly to the `AdminProfile` entity columns.
 */
export class SuperAdminProfileDto {
  @ApiProperty({
    description: "Admin's first name",
  })
  @IsString()
  @IsNotEmpty()
  first_name!: string;

  @ApiProperty({
    description: "Admin's last name",
  })
  @IsString()
  @IsNotEmpty()
  last_name!: string;
}
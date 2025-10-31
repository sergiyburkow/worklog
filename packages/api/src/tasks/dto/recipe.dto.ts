import { ApiProperty } from '@nestjs/swagger'
import { IsUUID, IsNumber, Min } from 'class-validator'

export class TaskRecipeOutputDto {
  @ApiProperty({
    description: 'ID деталі (Part), яка виробляється при виконанні задачі',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  partId!: string

  @ApiProperty({
    description: 'Кількість деталей, які виробляються на одну одиницю виконання задачі. При реєстрації задачі з quantity=10, додасться perUnit × 10 деталей до інвентарю',
    example: 2.5,
    minimum: 0.000001,
  })
  @IsNumber()
  @Min(0.000001)
  perUnit!: number
}

export class TaskRecipeConsumptionDto {
  @ApiProperty({
    description: 'ID деталі (Part), яка споживається при виконанні задачі',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  partId!: string

  @ApiProperty({
    description: 'Кількість деталей, які списуються з інвентарю на одну одиницю виконання задачі. При реєстрації задачі з quantity=5, спишеся quantityPerUnit × 5 деталей. Система перевіряє достатність інвентарю перед списанням.',
    example: 3,
    minimum: 0.000001,
  })
  @IsNumber()
  @Min(0.000001)
  quantityPerUnit!: number
}

export class TaskRecipeResponseDto {
  @ApiProperty({
    description: 'ID проекту, до якого належить задача',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  projectId!: string

  @ApiProperty({
    description: 'Список вихідних деталей (що виробляється). Кожна деталь містить partId та perUnit - кількість деталей на одиницю виконання задачі.',
    type: [TaskRecipeOutputDto],
    example: [
      {
        partId: '550e8400-e29b-41d4-a716-446655440000',
        perUnit: 2.5,
      },
    ],
  })
  outputs!: TaskRecipeOutputDto[]

  @ApiProperty({
    description: 'Список споживаних деталей (що витрачається). Кожна деталь містить partId та quantityPerUnit - кількість деталей, що списуються на одиницю виконання задачі.',
    type: [TaskRecipeConsumptionDto],
    example: [
      {
        partId: '550e8400-e29b-41d4-a716-446655440001',
        quantityPerUnit: 3,
      },
    ],
  })
  consumptions!: TaskRecipeConsumptionDto[]
}






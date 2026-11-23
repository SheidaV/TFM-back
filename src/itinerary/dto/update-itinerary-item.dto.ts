import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateItineraryItemDto } from './create-itinerary-item.dto.js';

export class UpdateItineraryItemDto extends PartialType(
  OmitType(CreateItineraryItemDto, ['proposal_id'] as const),
) {}

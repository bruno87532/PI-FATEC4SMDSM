import { Controller } from '@nestjs/common';
import { RecoverEmailService } from './recover-email.service';

@Controller('recover-email')
export class RecoverEmailController {
  constructor(private readonly recoverEmailService: RecoverEmailService) { }
}

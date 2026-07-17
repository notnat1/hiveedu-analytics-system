import { Controller, Post } from '@nestjs/common';
import { SeederService } from './seeder.service.js';

/**
 * SeederController
 * -------------------------------------------------
 * Exposes a temporary endpoint to easily trigger the
 * database seeder during development.
 *
 * NOTE: The term "user" refers to the USER role account throughout
 * the entire codebase â€” keep USER role wording consistent.
 */
@Controller('seeder')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  /**
   * POST /seeder/run
   * Clears existing data and populates fresh seed data.
   */
  @Post('run')
  async runSeeder() {
    return this.seederService.runSeed();
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { XaiService } from './xai.service';
import { ConfigService } from '@nestjs/config';

describe('XaiService', () => {
  let service: XaiService;
  let mockConfigService: Partial<ConfigService>;

  beforeEach(async () => {
    mockConfigService = {
      get: jest.fn().mockReturnValue(null), // No API key -> fallback to static rules
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        XaiService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<XaiService>(XaiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateExplanation', () => {
    it('should generate explanation for low scores', () => {
      const explanation = service.generateExplanation(50, 60, 65, 55);
      expect(explanation).toContain('low attendance rate of 50%');
      expect(explanation).toContain('low average tryout score of 60');
      expect(explanation).toContain('below-average teacher objective score of 65');
      expect(explanation).toContain('negatively influenced by');
    });

    it('should generate explanation for high scores', () => {
      const explanation = service.generateExplanation(90, 85, 90, 95);
      expect(explanation).toContain('solid attendance rate of 90%');
      expect(explanation).toContain('strong average tryout score of 85');
      expect(explanation).toContain('good teacher objective score of 90');
      expect(explanation).toContain('positively influenced by');
    });
  });

  describe('generateExamScoreExplanation', () => {
    it('should return motivational message if actual score is null', () => {
      const explanation = service.generateExamScoreExplanation(80, 70, 90, null);
      expect(explanation).toContain('Ujian akhir belum dilaksanakan');
      expect(explanation).toContain('Matematika: 80');
    });

    it('should explain components of the exam score', () => {
      const explanation = service.generateExamScoreExplanation(90, 60, 80, 85);
      expect(explanation).toContain('strong math score of 90');
      expect(explanation).toContain('weak logic score of 60');
      expect(explanation).toContain('strong english score of 80');
    });
  });

  describe('generateDynamicExplanationAsync (Fallback)', () => {
    it('should fallback to static generation if AI client is missing', async () => {
      const explanation = await service.generateDynamicExplanationAsync(50, 60, 65, 55);
      expect(explanation).toContain('low attendance rate of 50%');
      expect(explanation).toContain('negatively influenced by');
    });
  });

  describe('generateDynamicExamScoreExplanationAsync (Fallback)', () => {
    it('should fallback to static exam generation if AI client is missing', async () => {
      const explanation = await service.generateDynamicExamScoreExplanationAsync(90, 60, 80, 85);
      expect(explanation).toContain('strong math score of 90');
      expect(explanation).toContain('weak logic score of 60');
    });
  });
});

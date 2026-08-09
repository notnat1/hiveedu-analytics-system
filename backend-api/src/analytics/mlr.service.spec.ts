import { Test, TestingModule } from '@nestjs/testing';
import { MlrService } from './mlr.service';
import { AttendanceStatus } from '../attendance/attendance-status.enum';
import { Role } from '../users/role.enum';

describe('MlrService', () => {
  let service: MlrService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MlrService],
    }).compile();

    service = module.get<MlrService>(MlrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateAttendancePercentage', () => {
    it('should calculate 100% for all present', () => {
      const records = [
        { status: AttendanceStatus.PRESENT },
        { status: AttendanceStatus.PRESENT },
      ];
      expect(service.calculateAttendancePercentage(records as any)).toBe(100);
    });

    it('should calculate correctly for late and absent', () => {
      const records = [
        { status: AttendanceStatus.PRESENT }, // 1
        { status: AttendanceStatus.LATE }, // 0.5
        { status: AttendanceStatus.ABSENT }, // 0
        { status: AttendanceStatus.ABSENT }, // 0
      ];
      // total = 1.5 out of 4 = 37.5%
      expect(service.calculateAttendancePercentage(records as any)).toBe(37.5);
    });
  });

  describe('calculateAverageTryoutScore', () => {
    it('should calculate average for complete tryout records', () => {
      const records = [
        { mathematicsScore: 80, logicalReasoningScore: 70, englishScore: 90 }, // avg = 80
        { mathematicsScore: 90, logicalReasoningScore: 90, englishScore: 90 }, // avg = 90
      ];
      const result = service.calculateAverageTryoutScore(records);
      expect(result.averageTryoutScore).toBe(85);
      expect(result.completeTryoutCount).toBe(2);
      expect(result.hasNullScoreValues).toBe(false);
    });

    it('should detect null score values', () => {
      const records = [
        { mathematicsScore: 80, logicalReasoningScore: 70, englishScore: 90 },
        { mathematicsScore: 90, logicalReasoningScore: null, englishScore: 90 },
      ];
      const result = service.calculateAverageTryoutScore(records);
      expect(result.hasNullScoreValues).toBe(true);
      expect(result.completeTryoutCount).toBe(1); // Only one complete
    });
  });

  describe('isPredictionEligible', () => {
    it('should return true for eligible user', () => {
      const result = service.isPredictionEligible({
        role: Role.USER,
        isActive: true,
        completeTryoutCount: 5,
        hasNullScoreValues: false,
      });
      expect(result).toBe(true);
    });

    it('should return false if tryout count is less than 5', () => {
      const result = service.isPredictionEligible({
        role: Role.USER,
        isActive: true,
        completeTryoutCount: 4,
        hasNullScoreValues: false,
      });
      expect(result).toBe(false);
    });
  });

  describe('calculatePredictedScore', () => {
    it('should calculate raw score and clamp correctly', () => {
      const result = service.calculatePredictedScore({
        intercept: 10,
        b1: 0.5,
        b2: 0.2,
        b3: 0.3,
        x1: 100, // 50
        x2: 80, // 16
        x3: 90, // 27
      });
      // Raw: 10 + 50 + 16 + 27 = 103
      expect(result.rawScore).toBe(103);
      expect(result.predictedScore).toBe(100); // clamped to 100
    });
  });

  describe('fitCoefficients', () => {
    it('should solve a simple linear system accurately', () => {
      // Equation: Y = 10 + 2*X1 + 3*X2 + 4*X3
      const samples = [
        { x1: 1, x2: 1, x3: 1, y: 19 },
        { x1: 2, x2: 1, x3: 0, y: 17 },
        { x1: 0, x2: 2, x3: 1, y: 20 },
        { x1: 2, x2: 2, x3: 2, y: 28 },
      ];

      const coefficients = service.fitCoefficients(samples);

      expect(coefficients).toBeDefined();
      expect(coefficients!.intercept).toBeCloseTo(10, 5);
      expect(coefficients!.attendanceCoefficient).toBeCloseTo(2, 5);
      expect(coefficients!.tryoutCoefficient).toBeCloseTo(3, 5);
      expect(coefficients!.teacherObjectiveCoefficient).toBeCloseTo(4, 5);
    });

    it('should return null for less than 4 samples', () => {
      const samples = [
        { x1: 1, x2: 1, x3: 1, y: 19 },
        { x1: 2, x2: 1, x3: 0, y: 17 },
      ];
      const coefficients = service.fitCoefficients(samples);
      expect(coefficients).toBeNull();
    });
  });

  describe('calculateMse', () => {
    it('should calculate MSE correctly', () => {
      const records = [
        { predictedScore: 80, actualExamScore: 90 }, // error 10, squared 100
        { predictedScore: 70, actualExamScore: 75 }, // error 5, squared 25
      ];
      // total squared error = 125, mean = 62.5
      expect(service.calculateMse(records)).toBe(62.5);
    });
  });
});

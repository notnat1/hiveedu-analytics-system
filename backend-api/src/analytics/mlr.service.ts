import { Injectable } from '@nestjs/common';
import { AttendanceStatus } from '../attendance/attendance-status.enum.js';
import { Role } from '../users/role.enum.js';

type AttendanceLike = {
  status: AttendanceStatus;
};

type TryoutRecordLike = {
  mathScore?: number | string | null;
  logicScore?: number | string | null;
  mathematicsScore: number | string | null;
  logicalReasoningScore: number | string | null;
  englishScore: number | string | null;
  averageScore?: number | string | null;
};

type MseRecordLike = {
  predictedScore: number | string | null;
  actualExamScore: number | string | null;
};

type TrainingSample = {
  x1: number | string | null;
  x2: number | string | null;
  x3: number | string | null;
  y: number | string | null;
};

type CoefficientFitResult = {
  success: boolean;
  reason: string | null;
  validTrainingSampleCount: number;
  coefficients: {
    intercept: number;
    attendanceCoefficient: number;
    tryoutCoefficient: number;
    teacherObjectiveCoefficient: number;
  } | null;
};

@Injectable()
export class MlrService {
  readonly minimumTryoutHistoryCount = 5;

  calculateAttendancePercentage(attendanceRecords: AttendanceLike[]): number {
    if (attendanceRecords.length === 0) {
      return 0;
    }

    const totalAttendancePoints = attendanceRecords.reduce((sum, attendance) => {
      if (attendance.status === AttendanceStatus.PRESENT) {
        return sum + 1;
      }

      if (attendance.status === AttendanceStatus.LATE) {
        return sum + 0.5;
      }

      return sum;
    }, 0);

    return (totalAttendancePoints / attendanceRecords.length) * 100;
  }

  isCompleteTryoutRecord(record: TryoutRecordLike): boolean {
    const mathScore = record.mathScore ?? record.mathematicsScore;
    const logicScore = record.logicScore ?? record.logicalReasoningScore;

    return (
      this.isValidScore(mathScore) &&
      this.isValidScore(logicScore) &&
      this.isValidScore(record.englishScore)
    );
  }

  calculateAverageTryoutScore(records: TryoutRecordLike[]): {
    averageTryoutScore: number;
    completeTryoutCount: number;
    hasNullScoreValues: boolean;
  } {
    const hasNullScoreValues = records.some(
      (record) => !this.isCompleteTryoutRecord(record),
    );
    const completeRecords = records.filter((record) =>
      this.isCompleteTryoutRecord(record),
    );

    if (completeRecords.length === 0) {
      return {
        averageTryoutScore: 0,
        completeTryoutCount: 0,
        hasNullScoreValues,
      };
    }

    const totalTryoutScore = completeRecords.reduce((sum, record) => {
      const recordAverage = this.isValidScore(record.averageScore)
        ? Number(record.averageScore)
        : (Number(record.mathScore ?? record.mathematicsScore) +
            Number(record.logicScore ?? record.logicalReasoningScore) +
            Number(record.englishScore)) /
          3;

      return sum + recordAverage;
    }, 0);

    return {
      averageTryoutScore: totalTryoutScore / completeRecords.length,
      completeTryoutCount: completeRecords.length,
      hasNullScoreValues,
    };
  }

  isPredictionEligible(input: {
    role: Role | string;
    isActive: boolean;
    completeTryoutCount: number;
    hasNullScoreValues: boolean;
    hasMissingTeacherObjectiveScore?: boolean;
  }): boolean {
    return (
      input.role === Role.USER &&
      input.isActive &&
      input.completeTryoutCount >= this.minimumTryoutHistoryCount &&
      !input.hasNullScoreValues &&
      !input.hasMissingTeacherObjectiveScore
    );
  }

  calculatePredictedScore(input: {
    intercept: number;
    b1: number;
    b2: number;
    b3: number;
    x1: number;
    x2: number;
    x3: number;
  }): {
    rawScore: number;
    predictedScore: number;
  } {
    const rawScore =
      input.intercept +
      input.b1 * input.x1 +
      input.b2 * input.x2 +
      input.b3 * input.x3;

    return {
      rawScore,
      predictedScore: this.clampScore(rawScore),
    };
  }

  fitCoefficientsWithMetadata(samples: TrainingSample[]): CoefficientFitResult {
    const validSamples = samples.filter(
      (sample) =>
        this.isValidScore(sample.x1) &&
        this.isValidScore(sample.x2) &&
        this.isValidScore(sample.x3) &&
        this.isValidScore(sample.y),
    );

    if (validSamples.length < 4) {
      return {
        success: false,
        reason: 'At least 4 valid training samples are required for coefficient fitting.',
        validTrainingSampleCount: validSamples.length,
        coefficients: null,
      };
    }

    let sampleCount = 0;
    let sumX1 = 0;
    let sumX2 = 0;
    let sumX3 = 0;
    let sumY = 0;
    let sumX1Squared = 0;
    let sumX2Squared = 0;
    let sumX3Squared = 0;
    let sumX1X2 = 0;
    let sumX1X3 = 0;
    let sumX2X3 = 0;
    let sumX1Y = 0;
    let sumX2Y = 0;
    let sumX3Y = 0;

    for (const sample of validSamples) {
      const x1 = Number(sample.x1);
      const x2 = Number(sample.x2);
      const x3 = Number(sample.x3);
      const y = Number(sample.y);

      sampleCount += 1;
      sumX1 += x1;
      sumX2 += x2;
      sumX3 += x3;
      sumY += y;
      sumX1Squared += x1 * x1;
      sumX2Squared += x2 * x2;
      sumX3Squared += x3 * x3;
      sumX1X2 += x1 * x2;
      sumX1X3 += x1 * x3;
      sumX2X3 += x2 * x3;
      sumX1Y += x1 * y;
      sumX2Y += x2 * y;
      sumX3Y += x3 * y;
    }

    const solution = this.solveLinearSystem([
      [sampleCount, sumX1, sumX2, sumX3, sumY],
      [sumX1, sumX1Squared, sumX1X2, sumX1X3, sumX1Y],
      [sumX2, sumX1X2, sumX2Squared, sumX2X3, sumX2Y],
      [sumX3, sumX1X3, sumX2X3, sumX3Squared, sumX3Y],
    ]);

    if (!solution) {
      return {
        success: false,
        reason: 'Coefficient fitting failed because the training matrix is singular.',
        validTrainingSampleCount: validSamples.length,
        coefficients: null,
      };
    }

    return {
      success: true,
      reason: null,
      validTrainingSampleCount: validSamples.length,
      coefficients: {
        intercept: solution[0],
        attendanceCoefficient: solution[1],
        tryoutCoefficient: solution[2],
        teacherObjectiveCoefficient: solution[3],
      },
    };
  }

  fitCoefficients(samples: TrainingSample[]): {
    intercept: number;
    attendanceCoefficient: number;
    tryoutCoefficient: number;
    teacherObjectiveCoefficient: number;
  } | null {
    const fitResult = this.fitCoefficientsWithMetadata(samples);
    return fitResult.coefficients;
  }

  calculateMse(records: MseRecordLike[]): number | null {
    const validRecords = records.filter(
      (record) =>
        this.isValidScore(record.predictedScore) &&
        this.isValidScore(record.actualExamScore),
    );

    if (validRecords.length === 0) {
      return null;
    }

    const sumSquaredErrors = validRecords.reduce((sum, record) => {
      const error =
        Number(record.actualExamScore) - Number(record.predictedScore);
      return sum + error * error;
    }, 0);

    return sumSquaredErrors / validRecords.length;
  }

  private clampScore(score: number): number {
    return Math.min(100, Math.max(0, score));
  }

  private solveLinearSystem(matrix: number[][]): number[] | null {
    const augmentedMatrix = matrix.map((row) => [...row]);
    const size = matrix.length;
    const epsilon = 1e-10;

    for (let pivotIndex = 0; pivotIndex < size; pivotIndex += 1) {
      let maxRowIndex = pivotIndex;

      for (
        let candidateRowIndex = pivotIndex + 1;
        candidateRowIndex < size;
        candidateRowIndex += 1
      ) {
        if (
          Math.abs(augmentedMatrix[candidateRowIndex][pivotIndex]) >
          Math.abs(augmentedMatrix[maxRowIndex][pivotIndex])
        ) {
          maxRowIndex = candidateRowIndex;
        }
      }

      if (Math.abs(augmentedMatrix[maxRowIndex][pivotIndex]) < epsilon) {
        return null;
      }

      if (maxRowIndex !== pivotIndex) {
        [augmentedMatrix[pivotIndex], augmentedMatrix[maxRowIndex]] = [
          augmentedMatrix[maxRowIndex],
          augmentedMatrix[pivotIndex],
        ];
      }

      const pivotValue = augmentedMatrix[pivotIndex][pivotIndex];

      for (let columnIndex = pivotIndex; columnIndex <= size; columnIndex += 1) {
        augmentedMatrix[pivotIndex][columnIndex] /=
          pivotValue;
      }

      for (let rowIndex = 0; rowIndex < size; rowIndex += 1) {
        if (rowIndex === pivotIndex) {
          continue;
        }

        const eliminationFactor = augmentedMatrix[rowIndex][pivotIndex];

        for (
          let columnIndex = pivotIndex;
          columnIndex <= size;
          columnIndex += 1
        ) {
          augmentedMatrix[rowIndex][columnIndex] -=
            eliminationFactor * augmentedMatrix[pivotIndex][columnIndex];
        }
      }
    }

    return augmentedMatrix.map((row) => row[size]);
  }

  private isValidScore(value: number | string | null | undefined): boolean {
    if (value === null || typeof value === 'undefined' || value === '') {
      return false;
    }

    const score = Number(value);
    return Number.isFinite(score);
  }
}

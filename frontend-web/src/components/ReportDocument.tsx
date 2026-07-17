import React from 'react';
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

const colors = {
  ink: '#111827',
  muted: '#64748b',
  line: '#dbe3ee',
  softLine: '#edf2f7',
  blue: '#1d4ed8',
  paleBlue: '#eff6ff',
  zinc: '#f8fafc',
  cream: '#fffdf8',
};

const styles = StyleSheet.create({
  page: {
    padding: 34,
    backgroundColor: colors.cream,
    color: colors.ink,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: colors.blue,
    paddingBottom: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  brandName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.blue,
    letterSpacing: -0.4,
  },
  brandMeta: {
    marginTop: 4,
    fontSize: 8,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  titleBlock: {
    textAlign: 'right',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.ink,
    textTransform: 'uppercase',
  },
  date: {
    marginTop: 5,
    color: colors.muted,
    fontSize: 9,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    marginBottom: 5,
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.blue,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  identityGrid: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: '#ffffff',
  },
  identityRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.softLine,
  },
  identityLabel: {
    width: '30%',
    padding: 5,
    backgroundColor: colors.zinc,
    color: colors.muted,
    fontSize: 9,
    fontWeight: 'bold',
  },
  identityValue: {
    width: '70%',
    padding: 5,
    color: colors.ink,
    fontSize: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: '#ffffff',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.softLine,
  },
  tableHeader: {
    backgroundColor: colors.paleBlue,
  },
  tableCellHeader: {
    padding: 5,
    fontSize: 8,
    fontWeight: 'bold',
    color: colors.blue,
    textTransform: 'uppercase',
  },
  tableCell: {
    padding: 5,
    fontSize: 9.5,
    color: colors.ink,
  },
  colWide: {
    width: '46%',
  },
  colSmall: {
    width: '18%',
  },
  twoCol: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  twoColLeft: {
    width: '49%',
    marginRight: '2%',
  },
  twoColRight: {
    width: '49%',
  },
  noteBox: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: '#ffffff',
    padding: 8,
    minHeight: 42,
  },
  noteText: {
    color: colors.ink,
    lineHeight: 1.45,
    fontSize: 10,
  },
  predictionPanel: {
    borderWidth: 1,
    borderColor: '#bfdbfe',
    backgroundColor: colors.paleBlue,
    padding: 8,
    marginTop: 2,
  },
  predictionValue: {
    fontSize: 26,
    color: colors.blue,
    fontWeight: 'bold',
  },
  riskText: {
    marginTop: 5,
    fontSize: 10,
    color: colors.ink,
    fontWeight: 'bold',
  },
  signatureArea: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '42%',
    height: 46,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 8,
    textAlign: 'center',
    color: colors.muted,
    fontSize: 9,
  },
  analyticsCard: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: '#ffffff',
    padding: 14,
    marginBottom: 14,
  },
  analyticsValue: {
    marginTop: 6,
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.blue,
  },
  formulaBox: {
    borderWidth: 1,
    borderColor: '#c7d2fe',
    backgroundColor: '#f8fafc',
    padding: 14,
  },
  formulaText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.ink,
  },
  explanation: {
    marginTop: 10,
    color: colors.muted,
    fontSize: 10,
    lineHeight: 1.55,
  },
  footer: {
    position: 'absolute',
    bottom: 18,
    left: 34,
    right: 34,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 8,
    color: colors.muted,
  },
});

interface ReportData {
  userName: string;
  fullName?: string;
  username?: string;
  period?: string;
  x1: string;
  x2: string;
  x3?: string;
  mathScore?: string;
  logicScore?: string;
  englishScore?: string;
  averageScore?: string;
  actualExamScore?: string;
  teacherObjectiveScore?: string;
  presentCount?: string;
  lateCount?: string;
  absentCount?: string;
  predictedScore: string;
  riskLevel?: string;
  recommendation?: string;
  teacherNote?: string;
  coefficientMode?: string;
  date: string;
}

const valueOrNA = (value?: string) => value || 'N/A';

const ReportDocument = ({ data }: { data: ReportData }) => {
  const teacherObjectiveScore = valueOrNA(data.teacherObjectiveScore ?? data.x3);
  const displayName = valueOrNA(data.fullName ?? data.userName);

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brandName}>HiveEdu</Text>
            <Text style={styles.brandMeta}>Web-Based E-Raport System</Text>
          </View>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Formal E-Raport</Text>
            <Text style={styles.date}>Generated: {data.date}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Identity</Text>
          <View style={styles.identityGrid}>
            <View style={styles.identityRow}>
              <Text style={styles.identityLabel}>Full Name</Text>
              <Text style={styles.identityValue}>{displayName}</Text>
            </View>
            <View style={styles.identityRow}>
              <Text style={styles.identityLabel}>Username</Text>
              <Text style={styles.identityValue}>{valueOrNA(data.username ?? data.userName)}</Text>
            </View>
            <View style={styles.identityRow}>
              <Text style={styles.identityLabel}>Reporting Period</Text>
              <Text style={styles.identityValue}>{valueOrNA(data.period ?? data.date)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Academic Results</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCellHeader, styles.colWide]}>Component</Text>
              <Text style={[styles.tableCellHeader, styles.colSmall]}>Score</Text>
              <Text style={[styles.tableCellHeader, styles.colWide]}>Notes</Text>
            </View>
            {[
              ['Mathematics', valueOrNA(data.mathScore), 'Subject competency result'],
              ['Logical Reasoning', valueOrNA(data.logicScore), 'Subject competency result'],
              ['English', valueOrNA(data.englishScore), 'Subject competency result'],
              ['Average Score', valueOrNA(data.averageScore ?? data.x2), 'Calculated academic average'],
              ['Actual Exam Score', valueOrNA(data.actualExamScore), 'Ground truth when available'],
              ['Teacher Objective Score (X3)', teacherObjectiveScore, 'Teacher assessment input'],
            ].map(([label, score, note]) => (
              <View style={styles.tableRow} key={label}>
                <Text style={[styles.tableCell, styles.colWide]}>{label}</Text>
                <Text style={[styles.tableCell, styles.colSmall]}>{score}</Text>
                <Text style={[styles.tableCell, styles.colWide]}>{note}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.twoCol}>
          <View style={styles.twoColLeft}>
            <Text style={styles.sectionTitle}>Attendance Summary</Text>
            <View style={styles.table}>
              {[
                ['Present', valueOrNA(data.presentCount)],
                ['Late', valueOrNA(data.lateCount)],
                ['Absent', valueOrNA(data.absentCount)],
                ['Attendance Percentage (X1)', valueOrNA(data.x1)],
              ].map(([label, value]) => (
                <View style={styles.tableRow} key={label}>
                  <Text style={[styles.tableCell, { width: '62%' }]}>{label}</Text>
                  <Text style={[styles.tableCell, { width: '38%' }]}>{value}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.twoColRight}>
            <Text style={styles.sectionTitle}>Predictive Summary</Text>
            <View style={styles.predictionPanel}>
              <Text style={styles.sectionTitle}>Predicted Next Exam Score</Text>
              <Text style={styles.predictionValue}>{data.predictedScore}</Text>
              <Text style={styles.riskText}>Risk Level: {valueOrNA(data.riskLevel)}</Text>
              <Text style={styles.explanation}>{data.recommendation || 'Maintain current progress.'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Teacher Note / Recommendation</Text>
          <View style={styles.noteBox}>
            <Text style={styles.noteText}>
              {data.teacherNote || data.recommendation || 'Maintain current progress.'}
            </Text>
          </View>
        </View>

        <View style={styles.signatureArea}>
          <Text style={styles.signatureBox}>Homeroom / Teacher Validation</Text>
          <Text style={styles.signatureBox}>Parent / Guardian Acknowledgement</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>HiveEdu E-Raport</Text>
          <Text style={styles.footerText}>Page 1 - Formal Report</Text>
        </View>
      </Page>

      <Page size="A4" style={styles.page} wrap={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brandName}>HiveEdu</Text>
            <Text style={styles.brandMeta}>Learning Analytics Appendix</Text>
          </View>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Analytics Summary</Text>
            <Text style={styles.date}>{displayName}</Text>
          </View>
        </View>

        <View style={styles.twoCol}>
          <View style={styles.twoColLeft}>
            <View style={styles.analyticsCard}>
              <Text style={styles.sectionTitle}>X1 Attendance Percentage</Text>
              <Text style={styles.analyticsValue}>{valueOrNA(data.x1)}</Text>
            </View>
          </View>
          <View style={styles.twoColRight}>
            <View style={styles.analyticsCard}>
              <Text style={styles.sectionTitle}>X2 Average Tryout Score</Text>
              <Text style={styles.analyticsValue}>{valueOrNA(data.x2)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.analyticsCard}>
          <Text style={styles.sectionTitle}>X3 Teacher Objective Score</Text>
          <Text style={styles.analyticsValue}>{teacherObjectiveScore}</Text>
          <Text style={styles.explanation}>
            X3 is supplied from the teacher objective score in Academic Records.
          </Text>
        </View>

        <View style={styles.analyticsCard}>
          <Text style={styles.sectionTitle}>Coefficient Mode</Text>
          <Text style={styles.analyticsValue}>{valueOrNA(data.coefficientMode)}</Text>
          <Text style={styles.explanation}>
            AUTO_TRAINED uses current valid training samples. MANUAL_OVERRIDE uses stored coefficient values.
          </Text>
        </View>

        <View style={styles.formulaBox}>
          <Text style={styles.sectionTitle}>Prediction Formula</Text>
          <Text style={styles.formulaText}>Y = a + b1X1 + b2X2 + b3X3</Text>
          <Text style={styles.explanation}>
            Y is the predicted next exam score. X1 is attendance percentage, X2 is average tryout score,
            and X3 is teacher objective score. The formula is included as an appendix so the formal
            e-raport remains focused on academic reporting first.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>HiveEdu Learning Analytics</Text>
          <Text style={styles.footerText}>Page 2 - Analytics Appendix</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ReportDocument;
